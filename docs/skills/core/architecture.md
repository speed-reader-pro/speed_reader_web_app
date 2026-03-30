# Architecture

## File Structure

```
speed_reader_web_app/
├── index.html          # Main HTML page
├── styles.css          # All styles
├── app.js              # RSVP engine + app logic
├── Defuddle.js         # Defuddle content extractor (built from npm)
├── package.json        # npm dependencies (defuddle, esbuild)
├── .github/
│   └── dependabot.yml  # Dependabot config (weekly npm updates)
├── docs/               # Modular documentation
├── README.md           # Project readme
├── CHANGELOG.md        # Version history
├── VERSION             # Current version number
└── node_modules/       # (gitignored)
```

## Storage (localStorage)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `speedReaderWpm` | `number` | `300` | Reading speed (words/minute) |
| `speedReaderTheme` | `'light' \| 'dark'` | `'light'` | UI theme |

## CORS Proxy

For fetching external URLs, the app uses a public CORS proxy:

```javascript
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
```

**Alternatives for production:**
- Cloudflare Workers (free, fast)
- Own proxy server
- cors-anywhere (self-hosted)

---

[Back to SKILLS.md](../../SKILLS.md)
