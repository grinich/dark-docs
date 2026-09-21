# Chrome Web Store submission — Dark Docs 1.2.1

Prepared September 21, 2026. The upload package is `dist/dark-docs-1.2.1.zip`. Upload the ZIP directly; no CRX or private signing key is needed for this submission flow. An existing draft store item has ID `lddfoalljgifdgnoomiokmpgdnmejoml`; continue that item in the dashboard rather than creating another. It is not a published listing. [Upload guide](https://developer.chrome.com/docs/webstore/publish)

The ZIP is packaged and validated. The [repository](https://github.com/grinich/dark-docs) is public, and the [privacy policy](https://github.com/grinich/dark-docs/blob/main/PRIVACY.md) was confirmed readable while signed out. A genuine light-appearance comparison screenshot is supplied; the primary dark screenshot is pending verification of 1.2.1 after a native extension reload. Final live QA remains as noted in `TESTING.md`. Preparing this kit does not submit or publish the extension.

## Listing fields

| Field | Value |
| --- | --- |
| Name | Dark Docs |
| Short description (from manifest) | A quiet charcoal theme for Google Docs. Follows your computer’s appearance automatically. |
| Version | 1.2.1 |
| Existing draft item ID | `lddfoalljgifdgnoomiokmpgdnmejoml` — not yet published |
| Item type | Extension |
| Category | Accessibility — Google's category guidance explicitly includes dark-mode extensions |
| Language | English |
| Price | Free |
| Mature content | No |
| Homepage | `https://github.com/grinich/dark-docs` |
| Support | `https://github.com/grinich/dark-docs/issues` |
| Privacy policy | `https://github.com/grinich/dark-docs/blob/main/PRIVACY.md` — verified accessible without signing in |

Use **Extension**, even though it applies a theme to Docs. It is not a Chrome browser-theme package. [Category guidance](https://developer.chrome.com/docs/webstore/best-practices)

### Detailed description — paste into the listing

Dark Docs gives Google Docs a quiet charcoal appearance, with soft gray surfaces instead of pure black.

Follow your computer's appearance automatically, or choose Dark or Light whenever you like. The theme adapts the editor, toolbar, menus, and supported dialogs and sidebars for a more consistent workspace.

• System, Dark, and Light appearance choices.
• Optional dark document pages, with a switch to keep the original page colors.
• Settings apply to open Docs tabs and are saved locally in your Chrome profile.
• No account for the extension, advertising, analytics, or data sent to the developer.

Dark Docs changes only what you see on screen. Your document's formatting, exports, and collaborators' views stay unchanged.

Google Docs renders pages on a canvas, so dark pages also transform the appearance of images and document colors. Turn off “Dark document pages” for color-sensitive work. Embedded sharing and companion panels also use a visual color transform; choose Light when checking exact colors in those panels. Some third-party add-ons may keep their own appearance.

After installing, reload any Google Docs tabs that were already open. Requires Chrome 120 or later.

Dark Docs is an independent extension and is not affiliated with or endorsed by Google.

## Privacy tab — copy-ready answers

These answers describe the current source; re-check them if features change. The dashboard asks for purpose, permissions, remote code, data-use declarations, and a privacy-policy URL. [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)

### Single purpose

Apply an optional charcoal appearance to Google Docs, automatically following the computer's light/dark appearance or the user's manual choice, without changing document content or formatting.

### storage justification

Stores two preferences locally in the user's Chrome profile: appearance mode (System, Dark, or Light) and whether document pages should appear dark. This keeps the user's selection across sessions and updates open Docs tabs when a preference changes. The extension does not use synchronized storage or send these settings anywhere.

### Site access / host justification, if shown

Content scripts run only on Google Docs document pages and Google's embedded sharing interface on docs.google.com. Access is necessary to apply the requested visual theme and follow appearance preferences. Published document views are excluded. The scripts set appearance attributes and styles; they do not read document text, comments, account identities, cookies, or credentials. No access to other website origins is requested.

### Remote code

Select **No, I am not using remote code**. All extension JavaScript, CSS, and icons are included in the uploaded package. There are no remote script imports, dynamic code evaluation, or external service calls in the extension.

### Data collection

For the current code, leave the listed personal/sensitive data collection categories unchecked: it does not collect identifying information, health or financial information, authentication information, personal communications, location, web history, user activity, or website content. Its only saved data is the two local appearance preferences described in the privacy policy; the OS appearance is read locally.

Confirm the certifications that data is not sold or transferred for unrelated purposes and is not used for creditworthiness or lending. These match the current implementation. Review the supplied privacy policy before certifying it in your publisher account. Local-only processing still needs to be described accurately. [User-data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)

## Reviewer test instructions — paste into Test instructions

The extension has no separate sign-in, payment, API key, or private test account. Use a standard Google account and create an ordinary Google Docs document with sample text.

1. Install the extension and open or reload the document.
2. Open Dark Docs from Chrome's Extensions menu. Select Dark; the editor should become charcoal immediately.
3. Switch “Dark document pages” off and on. The page should return to its original colors when off, while the editor UI stays dark.
4. Select Light; original Docs appearance should return. Select System and switch the computer's light/dark appearance; the editor should follow.
5. Close and reopen the popup and reload the document. Saved choices should persist.
6. Open File, the font/style menus, comments, and Page setup to inspect the themed interface. Cancel without changing the document.
7. Export or print the sample document; its original content and formatting should remain unchanged.

No reviewer access to a private document is required. Do not provide the work document used during development as the test URL.

## Images

Google requires a 128×128 PNG icon, a 440×280 promotional tile, and at least one actual screenshot (up to five). Prefer 1280×800 screenshots; 640×400 is also supported. Screenshots should be full-bleed with square corners and show the real experience. A 1400×560 marquee and video are optional. [Image requirements](https://developer.chrome.com/docs/webstore/images)

| Asset | File / next action |
| --- | --- |
| 128×128 icon | `extension/icons/128.png` (also included in the upload ZIP) |
| 440×280 promotional tile | `store/assets/promo-small.png` |
| 1400×560 optional marquee | `store/assets/promo-marquee.png` |
| Actual light comparison screenshot | `store/assets/screenshot-light-1280x800.jpg` — clean sample document, no account header |
| Primary dark screenshot | Capture the same demo after reloading 1.2.1 with Dark selected |

Suggested screenshots: (1) full editor with title and outline, (2) comments or a menu open, (3) popup showing the appearance controls. Capture after the final live QA. Avoid visible account names, emails, collaborator lists, private document titles, or document IDs. The promotional artwork is not a substitute for the required actual screenshot.

## Submission steps

1. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) in the owner's publisher account and select existing draft item `lddfoalljgifdgnoomiokmpgdnmejoml`. Do not create a duplicate item.
2. Set the publisher name and verified contact email. Enable Google account 2-Step Verification and complete any identity or trader-status questions the dashboard presents using your actual circumstances. [Account setup](https://developer.chrome.com/docs/webstore/set-up-account), [account protection requirement](https://developer.chrome.com/docs/webstore/program-policies/policies)
3. Upload `dark-docs-1.2.1.zip` to the existing draft item as the new package. This replaces 1.2.0 and fixes unreadable text in pageless documents; do not submit the older 1.2.0 build. For future code changes, increase the version before uploading another package to this same item.
4. Complete Store listing using the fields and description above. Upload the icon, tile, and clean screenshot.
5. Complete Privacy using the matching disclosures above and `https://github.com/grinich/dark-docs/blob/main/PRIVACY.md`. This URL has been verified while signed out; recheck it if repository visibility or the policy location changes.
6. Add the reviewer instructions. Choose distribution: Public for a searchable listing, Unlisted for anyone with its link, or Private for designated testers. All choices still require review. For an initial personal rollout, Unlisted is a reasonable choice. Select the intended regions. [Distribution options](https://developer.chrome.com/docs/webstore/cws-dashboard-distribution)
7. Finish the remaining live QA before submitting. Choose deferred publishing if you want to approve the launch after review; staged approval currently expires after 30 days. [Submission and deferred publishing](https://developer.chrome.com/docs/webstore/publish)

## Decisions still needed from the owner

- Publisher display name and public support email; enter them directly in the dashboard.
- Store visibility and regions; truthful account/trader declarations, if requested.
- Keep Dark selected in the popup for the remaining browser-controlled visual checks. The clean demo screenshot is being prepared separately from the private work document.
- An open-source license only if you want to grant reuse rights. None has been assumed.

For ongoing development, use `DEVELOPMENT.md`; no application secrets are needed.
