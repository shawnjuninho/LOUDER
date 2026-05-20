import nodemailer from "nodemailer";

const allowedMethods = "POST, OPTIONS";
const requiredEnvKeys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_TO",
  "MAIL_FROM",
];

const clean = (value, maxLength = 2000) => {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, maxLength);
};

const escapeHtml = (value) =>
  clean(value, 6000)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const parseBoolean = (value) => {
  const normalized = clean(value).toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return null;
};

const parseAllowedOrigins = () =>
  clean(process.env.ALLOWED_ORIGINS, 4000)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const getCors = (request) => {
  const origin = request.headers.get("origin");
  const allowedOrigins = parseAllowedOrigins();
  const allowsAnyOrigin = allowedOrigins.includes("*");
  const isAllowed = !origin || allowsAnyOrigin || allowedOrigins.includes(origin);
  const headers = {
    "Access-Control-Allow-Methods": allowedMethods,
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Vary: "Origin",
  };

  if (origin && (allowsAnyOrigin || isAllowed)) {
    headers["Access-Control-Allow-Origin"] = allowsAnyOrigin ? "*" : origin;
  }

  return { headers, isAllowed };
};

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });

const methodNotAllowed = (request) => {
  const { headers } = getCors(request);
  return json(
    { ok: false, error: "Method not allowed. Use POST." },
    405,
    { ...headers, Allow: allowedMethods },
  );
};

const getEnvConfig = () => {
  const missing = requiredEnvKeys.filter((key) => !clean(process.env[key]));
  if (missing.length) {
    throw new Error(`Missing SMTP environment variables: ${missing.join(", ")}`);
  }

  const port = Number.parseInt(process.env.SMTP_PORT, 10);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const secure = parseBoolean(process.env.SMTP_SECURE);
  if (secure === null) {
    throw new Error("SMTP_SECURE must be true or false.");
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
  };
};

const isEmailLike = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const createEmail = (lead, request) => {
  const serverReceivedAt = new Date().toISOString();
  const subject = `LOUDER consultation request - ${lead.service}`;
  const rows = [
    ["Desired service", lead.service],
    ["Target market", lead.market || "-"],
    ["Contact", lead.contact],
    ["Project note", lead.message || "-"],
    ["Source", lead.source || "-"],
    ["Client submitted at", lead.submittedAt || "-"],
    ["Server received at", serverReceivedAt],
    ["User agent", request.headers.get("user-agent") || "-"],
    ["Forwarded for", request.headers.get("x-forwarded-for") || "-"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(
          label,
        )}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return {
    subject,
    text,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#071113;"><h2>New LOUDER consultation request</h2><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table></div>`,
    replyTo: isEmailLike(lead.contact) ? lead.contact : undefined,
  };
};

export function OPTIONS(request) {
  const { headers, isAllowed } = getCors(request);
  if (!isAllowed) {
    return json({ ok: false, error: "Origin not allowed." }, 403, headers);
  }

  return new Response(null, {
    status: 204,
    headers,
  });
}

export async function POST(request) {
  const { headers, isAllowed } = getCors(request);
  if (!isAllowed) {
    return json({ ok: false, error: "Origin not allowed." }, 403, headers);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ ok: false, error: "Invalid JSON body." }, 400, headers);
  }

  const lead = {
    service: clean(body.service, 160),
    market: clean(body.market, 240),
    message: clean(body.message, 4000),
    contact: clean(body.contact, 240),
    source: clean(body.source, 120) || "louder-website",
    submittedAt: clean(body.submittedAt, 80),
  };

  if (!lead.service) {
    return json({ ok: false, error: "service is required." }, 400, headers);
  }

  if (!lead.contact) {
    return json({ ok: false, error: "contact is required." }, 400, headers);
  }

  try {
    const config = getEnvConfig();
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const email = createEmail(lead, request);
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    return json({ ok: true }, 200, headers);
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to send lead email.",
      },
      500,
      headers,
    );
  }
}

export const GET = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
