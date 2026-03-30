# Project Overview

**Speed Reader Web App** is a standalone web application for speed reading using the **RSVP** (Rapid Serial Visual Presentation) technique. Works entirely in the browser, no server required.

## Features
- Paste text reading
- URL article extraction (via Defuddle) with structured content display
- ORP (Optimal Recognition Point) highlighting
- Adjustable speed (100-1000 WPM)
- Smart punctuation delays
- Keyboard shortcuts
- Progress tracking
- Reading time estimate
- Light/Dark theme
- Extension integration via URL parameters
- "Get Extension" CTA in header

## Deployment

The app is a static site. No server-side logic required.

| Platform | Command/Action |
|----------|----------------|
| **Local** | `python3 -m http.server 8000` or `npx serve` |
| **GitHub Pages** | Push to `gh-pages` branch |
| **Vercel** | Connect repo, auto-deploy |
| **Netlify** | Connect repo, auto-deploy |
| **Cloudflare Pages** | Connect repo, auto-deploy |

All platforms above support custom domains for free.

## Limitations

- **CORS**: External URLs require a CORS proxy
- **Some sites block proxies**: May not work with all URLs
- **No offline support** (yet): Defuddle.js is bundled locally
- **Mobile**: Basic support, not optimized

---

[Back to SKILLS.md](../../SKILLS.md)
