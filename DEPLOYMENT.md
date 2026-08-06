# Deployment

_Last updated: 2026-08-07._ This is the authoritative reference for how ITGeek Productivity Suite is hosted, deployed, and (eventually) served on its production domains. See `DEVELOPMENT_LOG.md`'s 2026-08-07 entry for the narrative of how this setup was reached, and `ROADMAP.md`'s Next Session Plan for what's still outstanding.

## Current state (as of 2026-08-07)

| Aspect | Status |
|---|---|
| Source control | Git + GitHub — [`Ssuhan02/itgeek-productivity-suite`](https://github.com/Ssuhan02/itgeek-productivity-suite) |
| Hosting | Cloudflare Pages |
| Live URL | **https://itgeek-productivity-suite.pages.dev** |
| Auto-deploy | Enabled — Cloudflare Pages builds and deploys automatically on every push to `main` |
| Custom domains | **Not yet configured** — see "Domain plan" below |

## How deployment works today

Cloudflare Pages is connected directly to the GitHub repository:

1. Push to `main` on GitHub.
2. Cloudflare Pages detects the push and runs its own build (`npm run build` → serves `dist/`).
3. The new build goes live at `https://itgeek-productivity-suite.pages.dev` automatically — no manual deploy step, no GitHub Actions involvement.

This replaced an earlier GitHub Actions + GitHub Pages workflow — see "History" below. `.github/workflows/deploy.yml` (the GitHub Pages workflow) is still present in the repo but is no longer the active deployment path; it targets GitHub Pages, which this project is no longer using. It can be removed in a future session once Cloudflare Pages is fully confirmed as the permanent path (not removed today, since removing it is a code/config change outside this session's documentation-only scope).

## History: why Cloudflare Pages instead of GitHub Pages

1. **GitHub Pages was the original plan.** A GitHub Actions workflow (`.github/workflows/deploy.yml`) was configured to build the app and deploy it to GitHub Pages on every push to `main`.
2. **Deployment could not complete** because GitHub Actions experienced a global outage of its hosted runners at the time — builds could not run through no fault of the workflow configuration itself.
3. **Decision: abandon GitHub Pages, move to Cloudflare Pages.** Rather than wait out the outage, the project switched hosting providers. Cloudflare Pages connects directly to the GitHub repo and builds independently of GitHub Actions, so it isn't affected by GitHub-hosted-runner outages.
4. **Cloudflare Pages setup:**
   - Cloudflare account created.
   - GitHub repository connected to Cloudflare Pages.
   - First deployment completed successfully.
   - Automatic deployment from GitHub is now configured — every push to `main` triggers a new Cloudflare Pages build and deploy.
5. **Code change required:** `vite.config.ts` previously set `base: '/itgeek-productivity-suite/'`, needed only because GitHub Pages serves the project from a `/itgeek-productivity-suite/` sub-path. Cloudflare Pages serves from the domain root, so this line was removed. See `CHANGELOG.md`'s 2026-08-07 entry.

## Domain plan (not yet implemented)

**Registrar:** GoDaddy — the domain `itgeek.xyz` stays registered and its DNS managed there. DNS is **not** moving to Cloudflare's nameservers; GoDaddy remains the DNS authority.

**Cloudflare's role is scoped to:** hosting, CDN, SSL, and automatic deployments — not DNS management.

**Planned production architecture** — one Cloudflare Pages custom domain per subdomain, each pointed at a (future) dedicated section/module of the app:

| Subdomain | Purpose |
|---|---|
| `https://productivity.itgeek.xyz` | ITGeek Productivity Suite — platform landing / Home Dashboard |
| `https://todo.itgeek.xyz` | ITGeek ToDo module |
| `https://finance.itgeek.xyz` | Personal Finance module (Version 2.0 — not yet built, see `docs/SYSTEM_DESIGN_DOCUMENT.md`) |

None of these custom domains have been configured yet — the app is currently reachable only at the `.pages.dev` URL above. Configuring them is the **first task of the next development session** (see `ROADMAP.md`'s Next Session Plan). At a high level, this will require, per subdomain:

1. Add the custom domain in the Cloudflare Pages project settings.
2. Create the corresponding CNAME (or equivalent) record at GoDaddy DNS pointing to the Cloudflare Pages target Cloudflare provides.
3. Wait for DNS propagation and SSL certificate issuance, then verify the subdomain serves the deployed app.
4. Repeat per subdomain, since `finance.itgeek.xyz` won't have anything real to serve until the Personal Finance module (Version 2.0) exists — that subdomain may be configured ahead of time or deferred; decide next session.

## Build & environment

- **Build command:** `npm run build` (`tsc -b && vite build`)
- **Output directory:** `dist/`
- **Node version:** 22 (as previously pinned in the now-inactive GitHub Actions workflow; Cloudflare Pages' build environment should be checked/pinned to match if not already default)
- **Environment variables / secrets:** none required yet — the app is still fully client-side (`localStorage`-backed), so there is nothing to configure in Cloudflare Pages beyond the build command and output directory.

## Remaining work

- Configure all three custom domains (see table above) and verify DNS + SSL on each.
- Verify automatic deployment continues to work correctly once custom domains are attached (a push to `main` should update all three, since they'd all serve the same Pages project/build until modules are actually split apart).
- Decide whether/when to remove the now-inactive `.github/workflows/deploy.yml` GitHub Pages workflow.
- `package.json` still has leftover GitHub Pages artifacts from before the Cloudflare Pages switch: a `homepage` field pointing at the old `https://ssuhan02.github.io/itgeek-productivity-suite` URL, and a `"deploy": "gh-pages -d dist"` script (plus the `gh-pages` devDependency it uses) — neither is used by the current Cloudflare Pages pipeline. Not changed as part of this documentation pass (application/config code, not docs); worth cleaning up next time `package.json` is touched.
- Once the backend/platform work in `ROADMAP.md` (Priorities 1–9) progresses, revisit this document for backend hosting, database hosting, and API deployment — everything above currently covers only the static frontend.
