# Source Code

This folder contains the application source code.

## Files

- `app.js` - Main application logic, RSVP engine, and UI controls
- `Defuddle.js` - Article extraction library (auto-generated from npm package)
- `styles.css` - Application styles and themes

## Development

The `Defuddle.js` file is automatically generated from the `defuddle` npm package during `npm install`.

To rebuild it manually:
```bash
npm run build:defuddle
```

## Architecture

The app is built with vanilla JavaScript (no framework) for maximum simplicity and performance.

Key components:
- RSVP reader with ORP (Optimal Recognition Point) highlighting
- URL article extraction using Defuddle
- Keyboard shortcuts and playback controls
- Dark/light theme support
- Progress tracking and reading time estimation
