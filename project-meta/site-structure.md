# Site Structure

The current deployment entry stays at the repository root so GitHub Pages and Vercel keep working without extra configuration.

- `index.html`, `styles.css`, `script.js`: public single-page website shell, styling, language switching, lead form, scroll navigation, and motion interactions.
- `api/`: Vercel serverless functions.
- `assets/`: public assets that are allowed to ship with the site.
- `404.html`: static noindex fallback page for GitHub Pages and other static hosts.
- `project-meta/`: git-tracked project notes, style preferences, structure notes, and follow-up tasks.
- `workspace-local/`: ignored local-only workspace for reference PDFs, discarded assets, captured source HTML, and preview screenshots.

If the site later moves into a dedicated `site/` folder, update Vercel Root Directory and GitHub Pages settings in the same change.

Current public navigation is a single-page scroll experience: Home, Services, Work, Why Louder, and Contact. About Us is no longer a standalone tab; non-repeating team/background proof points are condensed into the Why Louder section.
