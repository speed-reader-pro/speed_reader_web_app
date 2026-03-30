# UI Screens & DOM Elements

## Input Screen (`#inputScreen`)

Two tabs:
- **Paste Text** — textarea for manual input
- **From URL** — URL input + Defuddle extraction with structured display (headings, paragraphs, quotes, code, lists)

### Elements
- `#textInput` — textarea for pasting text
- `#urlInput` — URL input field
- `#startBtn` — start reading button
- `.tab` — tab buttons (text/url)

## Reader Screen (`#readerScreen`)

- Word display with ORP
- Playback controls (play/pause, rewind, forward, restart)
- Speed slider
- Progress bar
- Reading time estimate

### Elements
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

## Finish Screen (`#finishScreen`)

- Confetti animation
- "Read Again" button

### Elements
- `#loadingOverlay` — shown while fetching URL
- `#errorToast` — error messages
- `#finishScreen` — completion screen
- `#confetti` — confetti container

## URL Parameters (Extension Integration)

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

[Back to SKILLS.md](../../SKILLS.md)
