# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-15

### Added
- URL parameters for browser extension integration (`tab`, `url`, `text`, `auto`)
- "Get Extension" call-to-action button in header

### Changed
- "Read Again" button no longer auto-starts playback
- Moved extension link from footer to header

### Removed
- Footer extension link

## [0.1.0] - 2026-02-14

### Added
- Initial MVP release
- Paste text reading with RSVP technique
- URL article extraction via Readability.js
- ORP (Optimal Recognition Point) highlighting
- Adjustable speed (100-1000 WPM)
- Smart punctuation delays
- Keyboard shortcuts (Space, R, arrows, Esc)
- Progress bar and reading time estimate
- Text following view with clickable words
- Finish screen with confetti animation
- Light/Dark theme with persistence
- WPM persistence in localStorage
