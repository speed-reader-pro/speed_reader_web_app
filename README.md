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

# Install dependencies (generates Defuddle.js)
npm install

# Start local server (any of these):
npm run dev
# or
npm run serve
# or
python3 -m http.server 8000
# or
php -S localhost:8000
```

Open http://localhost:8000/public/

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

## Project Structure

```
speed_reader_web_app/
├── public/              # Static files (deploy this folder)
│   ├── index.html      # Main page
│   ├── src/            # Source code
│   │   ├── app.js      # RSVP engine + app logic
│   │   ├── Defuddle.js # Article extraction library
│   │   └── styles.css  # Styles
│   └── favicons/       # App icons
├── docs/               # Documentation
│   ├── README.md       # Docs overview
│   └── SKILLS.md       # Technical documentation
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── README.md           # This file
```

## How URL Reading Works

1. You enter an article URL
2. App fetches the page through a CORS proxy
3. Readability.js extracts the main content
4. You read at your chosen speed

**Note:** Some sites may block the CORS proxy. If a URL doesn't work, try copying the text directly.

## Deployment

This is a static site deployed on **Vercel**.

The `vercel.json` config specifies `public/` as the output directory.

## Roadmap

- [x] MVP: paste text + URL reading
- [x] Dark theme
- [ ] File upload (TXT, PDF, EPUB, DOCX)
- [ ] Reading history
- [ ] PWA (offline support)

## Related

- [Speed Reader Chrome Extension](https://chromewebstore.google.com/detail/speed-reader/iifbkjcdekfokhpjbiabfgjlloabpdlp) — the original browser extension
- [docs/SKILLS.md](./docs/SKILLS.md) — technical documentation

## License

MIT
