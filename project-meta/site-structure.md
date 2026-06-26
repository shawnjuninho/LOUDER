# Site Structure

The current deployment entry stays at the repository root so GitHub Pages and Vercel keep working without extra configuration.

- `index.html`, `styles.css`, `script.js`: public single-page website shell, black/yellow visual system, language switching, lead form, scroll navigation, product cube interaction, and copy-to-clipboard contact actions.
- `api/`: Vercel serverless functions.
- `assets/`: public assets that are allowed to ship with the site. `assets/louder/` contains locally stored Pexels replacement imagery and `image-sources.md` source notes.
- `404.html`: static noindex fallback page for GitHub Pages and other static hosts.
- `project-meta/`: git-tracked project notes, style preferences, structure notes, and follow-up tasks.
- `workspace-local/`: ignored local-only workspace for reference PDFs, discarded assets, captured source HTML, and preview screenshots.

If the site later moves into a dedicated `site/` folder, update Vercel Root Directory and GitHub Pages settings in the same change.

Current public navigation is a single-page scroll experience: Home, Services, Work, Why Louder, and Contact. About Us is no longer a standalone tab; non-repeating team/background proof points are condensed into the Why Louder section.

Current page structure:

- Home: left-side brand introduction and CTA, with the free consultation form placed directly in the right hero rail. The form still submits through `/api/submit-lead`.
- Intro / Platforms: the partner platform strip is nested inside the `6+ partner platforms` stat card, using recognizable TikTok Shop, Shopee, Lazada, Meta, YouTube, and LINE marks.
- Services: dark service rows and creator package cards for market entry, KOC/KOL, content, e-commerce, and live commerce.
- Work: desktop uses a sticky scroll-driven six-face 3D product cube with a synchronized vertical wheel detail panel. Mobile uses lightweight stacked product cards. Current categories are Beauty & Personal Care, Womenwear, Lifestyle, Fashion Accessories & Jewelry, Pet Supplies, and Maternity & Baby.
- Why Louder: proof points for direct local execution, data-driven matching, and cross-market operators.
- Contact: Youpik-style dark cards for Creator Cooperation, Brand Partnership, and Business Cooperation, with direct `mailto:` links and copy buttons. `postmaster@louder-creative.com` remains as the general inbox.
