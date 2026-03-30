# Dependencies

## Defuddle

[Defuddle](https://github.com/kepano/defuddle) is used for article content extraction from URLs. Installed via npm, built into a browser-compatible IIFE bundle with esbuild.

**Setup:**
```bash
npm install          # installs defuddle + esbuild, runs postinstall build
```

**Update Defuddle:**
```bash
npm update defuddle && npm run build:defuddle
```

**How it works:**
- `npm run build:defuddle` bundles `node_modules/defuddle/dist/index.js` into `Defuddle.js` (IIFE format, exposes global `Defuddle` class)
- `Defuddle.js` is loaded via `<script src="Defuddle.js"></script>` in `index.html`
- Called as `new Defuddle(doc).parse()` — returns `{ content, title, author, wordCount, ... }`

**Dependabot** (`.github/dependabot.yml`) checks for new versions weekly and creates a PR automatically.

**Dependabot update workflow:**
1. Dependabot creates a PR with updated `package.json` / `package-lock.json`
2. Merge the PR on GitHub
3. Locally run `npm install && npm run build:defuddle`
4. Commit the updated `Defuddle.js`

---

[Back to SKILLS.md](../../SKILLS.md)
