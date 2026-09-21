# Verification — Dark Docs 1.2.0

## Live Chrome checks

The unpacked extension was exercised against the user's Google Docs document. The user confirmed reloading the extension manually.

- Editor, document title, title icons, toolbar, and transparent menu-bar background inspected in the actual editor.
- File, Edit, View, Insert, Format, Tools, Gemini, and Extensions menus opened and inspected.
- Document tabs, outline, and tab menu inspected.
- Comments filters, search, and a blank composer checked; the composer was discarded without posting.
- Page setup and More fonts dialogs checked and canceled. Zoom and font lists inspected.
- Find checked without using Replace.
- Citations empty state and add-source controls checked without saving a source.
- Gemini empty panel and the current version in version history inspected.
- Sharing card and avatars inspected after adding support for the embedded sharing frame; final backdrop verification remains pending below.
- Restoring the operating system's light appearance restored the editor's light theme.
- A PDF export rendered with white pages and dark text. This does not verify Chrome's native print dialog.

## Automated checks and package audit

- `npm test`: all 18 tests passed for appearance changes, saved preferences, startup races, popup write ordering/error feedback, and manifest/file references.
- All 27 checks in `tests/theme-fixture.html` passed against the current stylesheet in the in-app Chromium browser. Tooltip contrast measured 9.83:1; link-preview contrast measured 10.28:1. These representative fixtures supplement, but do not replace, live Google Docs checks.
- JavaScript syntax checks passed for the content script, popup, and fixture script.
- `dist/dark-docs-1.2.0.zip` passed its integrity check and matched every file in `extension/` at the time of this audit, with no missing or extra files. Rebuild after any further source changes.
- Manifest and package versions agree. Permissions remain limited to `storage`; content-script URLs remain on `docs.google.com`.

## Remaining checks and limits

- Final live checks pending: Styles previews, custom color-picker gradients, sharing-frame backdrop, Keep panel color transform, and disabled-button contrast.
- Browser URL policy blocked direct automation of the native extension popup and extension manager. Popup behavior is covered by unit tests; a final native-popup persistence check remains unverified.
- Chrome's native print dialog remains unverified. Theme styles are screen-only, and PDF export appearance was inspected separately.
- Companion apps use a presentation-only frame transform. Their images and colors can differ from the original; the extension does not request access to those origins.
- Google can change its UI markup, and third-party add-ons may retain their own appearance.

## Selector references

Comments and document-tab selectors were cross-checked against the author-maintained [DocsAfterDark source](https://github.com/waymondrang/docsafterdark/blob/main/src/scss/base/_base.scss) and inspected in the live editor. The styling rules and grayscale palette are authored in this project.
