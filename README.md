# Speed Reader Web App

Standalone web application for speed reading using RSVP (Rapid Serial Visual Presentation) technique.

**100% client-side** — all processing happens in your browser. No server required.

## Features

- **Paste text** — read any text you paste
- **Read from URL** — extract and read articles from any website
- **ORP highlighting** — optimal recognition point for faster reading
- **Adjustable speed** — 100-1000 WPM
- **Smart pauses** — longer delays on punctuation
- **Keyboard shortcuts** — full control without mouse
- **Progress tracking** — see how much is left
- **Dark theme** — easy on the eyes

## Quick Start

```bash
# Clone or download the project
cd speed_reader_web_app

# Start local server (any of these):
python3 -m http.server 8000
# or
npx serve
# or
php -S localhost:8000
```

Open http://localhost:8000

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Previous word |
| `→` | Next word |
| `↑` | Speed up (+50 WPM) |
| `↓` | Slow down (-50 WPM) |
| `R` | Restart |
| `Esc` | Back to input |

## Files

```
speed_reader_web_app/
├── index.html      # Main page
├── styles.css      # Styles
├── app.js          # RSVP engine + app logic
├── Readability.js  # Mozilla Readability (article extraction)
├── SKILLS.md       # Technical documentation
└── README.md       # This file
```

## How URL Reading Works

1. You enter an article URL
2. App fetches the page through a CORS proxy
3. Readability.js extracts the main content
4. You read at your chosen speed

**Note:** Some sites may block the CORS proxy. If a URL doesn't work, try copying the text directly.

## Deployment

This is a static site. Deploy anywhere:

- **GitHub Pages** — push to `gh-pages` branch
- **Vercel** — connect repo, auto-deploy
- **Netlify** — connect repo, auto-deploy
- **Cloudflare Pages** — connect repo, auto-deploy

All free, all work perfectly.

## Roadmap

- [x] MVP: paste text + URL reading
- [x] Dark theme
- [ ] File upload (TXT, PDF, EPUB, DOCX)
- [ ] Reading history
- [ ] PWA (offline support)

## Related

- [Speed Reader Chrome Extension](https://chromewebstore.google.com/detail/speed-reader/iifbkjcdekfokhpjbiabfgjlloabpdlp) — the original browser extension
- [SKILLS.md](./SKILLS.md) — technical documentation

## License

MIT
