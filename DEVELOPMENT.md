# Continuing Dark Docs

## What is needed

- The [public repository](https://github.com/grinich/dark-docs), Chrome 120 or later, Node.js 22 or later, and Python 3.
- Load `extension/` as an unpacked extension. No dependency install, API key, backend, signing key, or service account is needed.
- A Chrome profile signed into Google Docs and a disposable test document. Use ordinary sample text for screenshots; never publish a work document, collaborator list, or account details as store artwork.
- For the current browser-controlled QA session, manually select **Dark** in the extension popup and reload the unpacked extension after source changes. Automatic security review blocked extension-manager and popup URLs; those actions require the user's clicks. Normal Docs interfaces remain available to the browser controls.
- For publishing: the owner's Chrome Web Store developer account, verified publisher contact, distribution choices, and any account verification the dashboard requests. Credentials should stay in the browser; do not commit or send passwords, session cookies, signing keys, or OAuth secrets.

The existing Chrome Web Store draft item ID is `lddfoalljgifdgnoomiokmpgdnmejoml`. Continue that item for submission and future updates; it is not yet published. The [public privacy-policy URL](https://github.com/grinich/dark-docs/blob/main/PRIVACY.md) has been verified while signed out. Keep it reachable and update its content when data handling changes.

## Layout

| File | Responsibility |
| --- | --- |
| `extension/theme.css` | Docs editor, toolbar, menus, dialogs, sidebars, and optional page transform |
| `extension/embedded.css` | Embedded Google sharing interface |
| `extension/content.js` | OS appearance, saved preferences, and root appearance attributes |
| `extension/popup.*` | Appearance controls and settings persistence |
| `tests/*.test.cjs` | Settings behavior, races, popup saving, and manifest checks |
| `tests/theme-fixture.*` | Browser checks for representative component styles |
| `scripts/package.py` | Extension-only upload ZIP |
| `store/SUBMISSION.md` | Store listing, disclosures, reviewer instructions, and submission checklist |

## Development loop

1. Make focused changes to `extension/`. Preserve document formatting and natural colors in color-selection controls.
2. Run `npm test`.
3. Reload Dark Docs in Chrome's Extensions page, then reload the test Docs tab.
4. Exercise the affected actual Google Docs controls. Screenshots and fixtures supplement this; they do not prove all live interfaces work.
5. To run the fixture, start `python3 -m http.server 8766 --bind 127.0.0.1` from the repository and open `http://127.0.0.1:8766/tests/theme-fixture.html`. The page reports the checks. Stop the server when finished.
6. Update `TESTING.md` with observed results and remaining limits.

## Open QA work for 1.2.0

The editor and many live dialogs have been exercised, and 18 behavior tests plus 27 browser fixture checks pass. The final dark-mode visual checks still include Styles previews, custom color-picker endpoints, the sharing backdrop, Keep, and disabled buttons. Check popup preference persistence and the paper toggle in native Chrome. Native print preview remains unverified; exported PDF appearance was checked separately. `TESTING.md` is the detailed evidence record.

Also check companion apps when the operating system itself is dark. Their whole-frame transform assumes a light embedded interface; an app introducing its own dark theme may need different treatment. Other companion apps and third-party add-ons have not received comprehensive visual testing.

## Release loop

1. Finish the remaining live checks. Capture clean screenshots at the dimensions in the submission guide.
2. If extension files change after a version has been uploaded, increase `version` in both `extension/manifest.json` and `package.json` before the next upload. Keep README release filenames current.
3. Run `npm test` and `npm run package`.
4. Review the ZIP contents. `manifest.json` must be at its root, alongside the extension's runtime files.
5. Attach the ZIP to a GitHub release and upload that same ZIP to existing Chrome Web Store item `lddfoalljgifdgnoomiokmpgdnmejoml`. Do not create a new store item for normal updates.
6. After the store item is published, add its verified public listing URL to the README. Record the approved version and any reviewer feedback; do not describe the current draft as published.

The current code has no open-source license grant. Choose a license before describing the repository as open source or accepting outside contributions under specific terms.
