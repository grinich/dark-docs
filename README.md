# Dark Docs

A small Chrome extension that gives Google Docs a neutral charcoal theme and follows your computer's appearance automatically. No build step, dependencies, account, analytics, or network requests.

## Install

1. Open `chrome://extensions` in Chrome and turn on **Developer mode**.
2. Choose **Load unpacked** and select the `extension` folder in this project.
3. Reload any Google Docs tabs that were already open.
4. Open Chrome's Extensions menu and pin **Dark Docs** if you'd like quick access to its controls.

Keep the extension folder in place. Chrome loads the extension directly from it.

## Appearance

- **System** (default): follows the computer's light/dark appearance and changes immediately when it changes.
- **Dark / Light**: override the automatic appearance across Google Docs tabs.
- **Dark document pages** (default on): turns white paper into soft charcoal and black text into soft white. Turn this off when working with photographs or checking exact document colors. Google Docs draws the document onto a canvas, so its on-screen colors are transformed together.

Changes apply to open tabs immediately. Settings are saved locally on this Chrome profile. The extension never changes the actual document, formatting, exports, or collaborators' view. Its theme rules apply only to screen media, not printing.

## Scope and privacy

Runs on `https://docs.google.com/document/*` (excluding published documents) and Google’s embedded sharing interface at `https://docs.google.com/drivesharing/*`. Only the `storage` extension permission is requested. It does not access the Google Drive API, read document text, send requests, or run a background worker. The sharing dialog and embedded companion apps use a display color transform. Companion images and colors may look different; choose Light for color-critical work in those panels. The extension does not request access to companion-app origins. Third-party add-ons may retain their own appearance.

Google may change its editor markup over time; `extension/theme.css` contains the appearance rules. Avoid enabling another Docs theme extension at the same time.

## Development

Edit the files in `extension/`. Click the reload icon on Dark Docs in `chrome://extensions`, then refresh Google Docs to test an updated build.

Run `npm test` for settings, system appearance, startup race, and package validation. Run `npm run package` to create `dist/dark-docs-1.2.0.zip`; unzip it before using Load unpacked on another computer.

The extension uses modern CSS nesting and targets Chrome 120 or later.

## Submission and maintenance

- [Public source repository](https://github.com/grinich/dark-docs).
- [Download packaged builds](https://github.com/grinich/dark-docs/releases).
- [Chrome Web Store submission guide](store/SUBMISSION.md): ready-to-paste listing copy, privacy declarations, reviewer instructions, and image requirements.
- [Public privacy policy](https://github.com/grinich/dark-docs/blob/main/PRIVACY.md), readable without signing in.
- [Development handoff](DEVELOPMENT.md): local setup, remaining QA, and release steps.
- [Verification record](TESTING.md): checks completed and their limits.

Version 1.2.0 is a submission candidate, not a published Chrome Web Store release. The existing draft store item is `lddfoalljgifdgnoomiokmpgdnmejoml`. The package, public privacy-policy URL, and a clean light-appearance comparison screenshot are ready; the primary dark screenshot and remaining live checks are still pending.

Run `npm run submission` to build both the extension ZIP and a separate submission-kit ZIP containing the guide, privacy policy, and promotional artwork. Upload only the extension ZIP to the store.
