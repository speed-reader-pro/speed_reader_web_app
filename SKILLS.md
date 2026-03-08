# Speed Reader Web App — Skills & Knowledge Base

> **Note**: This is a living document that will be updated as the project evolves.

---

## Project Overview

**Speed Reader Web App** is a standalone web application for speed reading using the **RSVP** (Rapid Serial Visual Presentation) technique. Works entirely in the browser, no server required.

### Current Version: v0.2

**Features:**
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

---

## Architecture

### File Structure

```
speed_reader_web_app/
├── index.html          # Main HTML page
├── styles.css          # All styles
├── app.js              # RSVP engine + app logic
├── Defuddle.js         # Defuddle (kepano/defuddle) content extractor
├── README.md           # Project readme
├── SKILLS.md           # This file
├── CHANGELOG.md        # Version history
└── VERSION             # Current version number
```

### Dependencies

| Library | Source | Purpose |
|---------|--------|---------|
| Defuddle.js | Local ([kepano/defuddle](https://github.com/kepano/defuddle)) | Article content extraction with structured HTML |

### CORS Proxy

For fetching external URLs, the app uses a public CORS proxy:

```javascript
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
```

**Alternatives for production:**
- Cloudflare Workers (free, fast)
- Own proxy server
- cors-anywhere (self-hosted)

---

## URL Parameters (Extension Integration)

The app supports URL parameters for integration with browser extensions:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `tab` | `?tab=url` | Switch to tab (`text` or `url`) |
| `url` | `?url=https://...` | Pre-fill URL input |
| `text` | `?text=Hello%20world` | Pre-fill text input |
| `auto` | `?url=...&auto=1` | Auto-start reading |

**Extension button examples:**
- Open text tab: `https://site.vercel.app/?tab=text`
- Open URL tab: `https://site.vercel.app/?tab=url`
- Read current page: `https://site.vercel.app/?url=${encodeURIComponent(pageUrl)}&auto=1`

---

## Storage (localStorage)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `speedReaderWpm` | `number` | `300` | Reading speed (words/minute) |
| `speedReaderTheme` | `'light' \| 'dark'` | `'light'` | UI theme |

---

## ORP (Optimal Recognition Point)

Algorithm for selecting the "pivot" letter for eye focus:

| Word Length | Pivot (index) | Highlighted Letter |
|-------------|---------------|-------------------|
| 1 | 0 | 1st |
| 2-5 | 1 | 2nd |
| 6-8 | 2 | 3rd |
| 9-12 | 3 | 4th |
| 13-17 | 4 | 5th |
| 18-25 | ~50% | middle |
| 26+ | ~60% | slightly right of middle |

---

## Word Delay Algorithm

Base delay: `60000 / WPM` ms

Multipliers:
- Long words (>8 characters): `+4%` per character over 8
- End of sentence (`.`, `!`, `?`): `+100%`
- Commas, semicolons, colons: `+40%`
- Dashes (`—`, `–`): `+40%`
- Ellipsis (`...`, `…`): `+50%`

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `R` | Restart (from beginning) |
| `←` | Previous word |
| `→` | Next word |
| `↑` | Increase speed (+50 WPM) |
| `↓` | Decrease speed (-50 WPM) |
| `Esc` | Back to input screen |

---

## UI Screens

### Input Screen (`#inputScreen`)

Two tabs:
- **Paste Text** — textarea for manual input
- **From URL** — URL input + Defuddle extraction with structured display (headings, paragraphs, quotes, code, lists)

### Reader Screen (`#readerScreen`)

- Word display with ORP
- Playback controls (play/pause, rewind, forward, restart)
- Speed slider
- Progress bar
- Reading time estimate

### Finish Screen (`#finishScreen`)

- Confetti animation
- "Read Again" button

---

## DOM Elements

### Input Screen
- `#textInput` — textarea for pasting text
- `#urlInput` — URL input field
- `#startBtn` — start reading button
- `.tab` — tab buttons (text/url)

### Reader Screen
- `#currentWord` — word display
- `#playPauseBtn` — play/pause toggle
- `#restartBtn` — restart button
- `#rewindBtn` — previous word
- `#forwardBtn` — next word
- `#speedSlider` — WPM slider
- `#wpmValue` — current WPM display
- `#readingTime` — time remaining
- `#progressFill` — progress bar fill
- `#backBtn` — back to input

### Overlays
- `#loadingOverlay` — shown while fetching URL
- `#errorToast` — error messages
- `#finishScreen` — completion screen
- `#confetti` — confetti container

---

## Roadmap

### v0.1 (MVP)
- [x] Paste text reading
- [x] URL article extraction
- [x] ORP highlighting
- [x] Speed control
- [x] Keyboard shortcuts
- [x] Progress bar
- [x] Finish screen with confetti
- [x] Light/Dark theme
- [x] Link to Chrome extension

### v0.2 — Current
- [x] URL parameters for extension integration
- [x] "Get Extension" CTA button in header
- [x] "Read Again" no longer auto-starts
- [ ] Drag & drop text files (TXT)
- [ ] Save reading progress
- [ ] Recent articles history

### v1.0
- [ ] PDF support (pdf.js)
- [ ] EPUB support (epub.js)
- [ ] DOCX support (mammoth.js)
- [ ] Font selection
- [ ] Multiple themes

### v2.0
- [ ] OCR for scanned PDFs (Tesseract.js)
- [ ] Reading statistics
- [ ] Export/import settings
- [ ] PWA (offline support)

---

## Deployment

The app is a static site. No server-side logic required.

### Options

| Platform | Command/Action |
|----------|----------------|
| **Local** | `python3 -m http.server 8000` or `npx serve` |
| **GitHub Pages** | Push to `gh-pages` branch |
| **Vercel** | Connect repo, auto-deploy |
| **Netlify** | Connect repo, auto-deploy |
| **Cloudflare Pages** | Connect repo, auto-deploy |

### Custom Domain

All platforms above support custom domains for free.

---

## Limitations

- **CORS**: External URLs require a CORS proxy
- **Some sites block proxies**: May not work with all URLs
- **No offline support** (yet): Defuddle.js is bundled locally
- **Mobile**: Basic support, not optimized

---

## Related Files

- Main extension: `/Users/glebshalimov/Code/speed_reader/`
- App documentation: `/Users/glebshalimov/Code/speed_reader/APP.md`
- Extension skills: `/Users/glebshalimov/Code/speed_reader/SKILLS.md`

---

*Last updated: March 8, 2026*
