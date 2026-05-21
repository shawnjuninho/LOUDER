# Site Structure

The current deployment entry stays at the repository root so GitHub Pages and Vercel keep working without extra configuration.

- `index.html`, `styles.css`, `script.js`: public website shell, styling, and interactions.
- `api/`: Vercel serverless functions.
- `assets/`: public assets that are allowed to ship with the site.
- `520/`, `air-air-dumb/`, `air-air-dumb~/`: standalone hidden pages from earlier experiments.
- `project-meta/`: git-tracked project notes, style preferences, structure notes, and follow-up tasks.
- `workspace-local/`: ignored local-only workspace for reference PDFs, discarded assets, captured source HTML, and preview screenshots.

If the site later moves into a dedicated `site/` folder, update Vercel Root Directory and GitHub Pages settings in the same change.
