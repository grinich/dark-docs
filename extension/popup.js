'use strict';
const media = matchMedia('(prefers-color-scheme: dark)');
const status = document.querySelector('#status');
const paper = document.querySelector('#dark-paper');
const radios = [...document.querySelectorAll('[name="mode"]')];
const touched = new Set();
const saveErrors = new Set();
let readFailed = false;
let writeQueue = Promise.resolve();
function renderStatus() {
  if (saveErrors.size) {
    status.textContent = 'Could not save. Close and reopen to try again.';
    return;
  }
  if (readFailed) {
    status.textContent = 'Settings unavailable. Close and reopen to reload.';
    return;
  }
  const mode = radios.find(input => input.checked)?.value || 'system';
  status.textContent = mode === 'system'
    ? `Following your computer · ${media.matches ? 'Dark' : 'Light'} right now`
    : `${mode === 'dark' ? 'Dark' : 'Light'} appearance is always on.`;
}
function save(values) {
  const keys = Object.keys(values);
  keys.forEach(key => touched.add(key));
  // Keep rapid keyboard or pointer changes in order, even after a failed save.
  writeQueue = writeQueue.then(async () => {
    try {
      await chrome.storage.local.set(values);
      keys.forEach(key => saveErrors.delete(key));
    } catch {
      keys.forEach(key => saveErrors.add(key));
    }
    renderStatus();
  });
  return writeQueue;
}
chrome.storage.local.get({ mode: 'system', darkPaper: true }).then(values => {
  const mode = ['system', 'dark', 'light'].includes(values.mode) ? values.mode : 'system';
  // A slow initial read must not undo a choice already made in this popup.
  if (!touched.has('mode')) radios.forEach(input => { input.checked = input.value === mode; });
  if (!touched.has('darkPaper')) paper.checked = values.darkPaper !== false;
  renderStatus();
}).catch(() => { readFailed = true; renderStatus(); });
radios.forEach(input => input.addEventListener('change', () => save({ mode: input.value })));
paper.addEventListener('change', () => save({ darkPaper: paper.checked }));
media.addEventListener('change', renderStatus);
