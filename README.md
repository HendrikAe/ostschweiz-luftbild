# Ostschweiz Luftbild — Static Site

Production-ready static site for **ostschweizluftbild.ch** (home + blog).

**Brand:** Ostschweiz Luftbild · `hendrik@ostschweizluftbild.ch`  
**Site root:** this directory (`/workspace/engine/site/`)

## Preview

```bash
cd /workspace/engine/site
python3 -m http.server 8765
# → http://127.0.0.1:8765/
```

## Deploy — GitHub Pages + custom domain

1. Publish contents of this folder to repo root (or `/docs`) of private repo e.g. `ostschweiz-luftbild`.
2. GitHub → **Settings → Pages** → Deploy from branch `main` → folder `/` (or `/docs`).
3. Custom domain: `ostschweizluftbild.ch` · enable **Enforce HTTPS** after DNS check.
4. Keep the `CNAME` file (content: `ostschweizluftbild.ch`) in the published root.

Full step notes: `/workspace/engine/web/deploy-github-pages.md`  
**Do not push from overnight Web agents** — Builder owns `gh` auth.

## GoDaddy DNS (domain at GoDaddy)

Apex **A** records for `@`:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `185.199.108.153` | 600 / 1 h |
| A | `@` | `185.199.109.153` | 600 / 1 h |
| A | `@` | `185.199.110.153` | 600 / 1 h |
| A | `@` | `185.199.111.153` | 600 / 1 h |

**www** CNAME → `<USER_OR_ORG>.github.io.`  
Remove conflicting forwarding / old A / ALIAS on `@` and `www`. Verify with `dig` + GitHub Pages DNS check, then Enforce HTTPS.

## Structure

| Path | Role |
|------|------|
| `index.html` | Home — mockup layout + SEO |
| `blog/index.html` | Blog listing |
| `blog/drohnenfotografie-st-gallen.html` | Local SEO: Makler / St. Gallen |
| `blog/baudokumentation-drohne-ostschweiz.html` | Local SEO: Bauträger / Baudoku |
| `styles.css` | Design system (shared) |
| `js/main.js` | Nav toggle + Baudoku carousel |
| `assets/` | Images + logo |
| `robots.txt` / `sitemap.xml` / `CNAME` | Crawlers + Pages domain |

## Claims hygiene

- Soft trust only: **BAZL-konform** · **Voll versichert** · **Ostschweiz**
- Banned: «100+ Projekte», «BAZL-lizenziert»
- Free-First → CHF 190 only on conversion / soft footer — not in hero

## Security headers (static hosting limits)

GitHub Pages (and most pure static hosts) **cannot set custom HTTP security headers** from this repo alone. Prefer adding them at the CDN / DNS edge if available:

| Header | Suggested value |
|--------|-----------------|
| `Content-Security-Policy` | Restrict to self + Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`); allow `mailto:` form UX |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disable unused sensors (`camera=()`, `microphone=()`, `geolocation=()`) |
| `X-Frame-Options` | `SAMEORIGIN` (or CSP `frame-ancestors`) |

Options: Cloudflare Transform Rules / Pages `_headers`, Netlify `_headers`, or another reverse proxy. Until then, HTTPS is enforced via GitHub Pages **Enforce HTTPS** after custom-domain DNS is green.

