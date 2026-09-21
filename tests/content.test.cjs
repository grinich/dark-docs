const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../extension/content.js'), 'utf8');

function boot({ dark = true, values = {}, delayed = false, root = true, storageError = false } = {}) {
  const document = { documentElement: root ? { dataset: {} } : null };
  let onMedia, onStorage, onRoot, resolve;
  let disconnected = false;
  const media = { matches: dark, addEventListener: (name, fn) => { onMedia = fn; } };
  const get = storageError ? Promise.reject(new Error('unavailable')) : delayed ? new Promise(r => { resolve = r; }) : Promise.resolve(values);
  vm.runInNewContext(source, {
    document, matchMedia: () => media,
    MutationObserver: class {
      constructor(fn) { onRoot = fn; }
      observe() {}
      disconnect() { disconnected = true; }
    },
    chrome: { storage: { local: { get: () => get }, onChanged: { addListener: fn => { onStorage = fn; } } } }
  });
  return {
    document,
    settle: async () => { await get.catch(() => {}); await Promise.resolve(); },
    resolve,
    setSystem: dark => { media.matches = dark; onMedia(); },
    change: (values, area = 'local') => onStorage(Object.fromEntries(Object.entries(values).map(([key, newValue]) => [key, { newValue }])), area),
    addRoot: () => { document.documentElement = { dataset: {} }; onRoot(); return disconnected; }
  };
}

test('default follows the OS and responds without a reload', async () => {
  const app = boot(); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
  app.setSystem(false);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
  app.setSystem(true);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
});
test('manual overrides survive OS changes and restore system mode', async () => {
  const app = boot({ values: { mode: 'light' } }); await app.settle();
  app.setSystem(true);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
  app.change({ mode: 'dark' }); app.setSystem(false);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
  app.change({ mode: 'system' });
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
});
test('original page colors can be restored independently of UI theme', async () => {
  const app = boot(); await app.settle(); app.change({ darkPaper: false });
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'original');
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
});
test('invalid or removed settings fall back to system defaults', async () => {
  const app = boot({ values: { mode: 'unknown', darkPaper: 'invalid' } }); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'dark');
  app.change({ mode: undefined, darkPaper: undefined });
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
});
test('a late initial read cannot overwrite a newer user selection', async () => {
  const app = boot({ delayed: true }); app.change({ mode: 'light' });
  app.resolve({ mode: 'dark', darkPaper: false }); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'original');
});
test('changing paper during startup preserves the saved appearance mode', async () => {
  const app = boot({ delayed: true }); app.change({ darkPaper: false });
  app.resolve({ mode: 'light', darkPaper: true }); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'original');
});
test('unrelated local changes cannot discard the saved startup settings', async () => {
  const app = boot({ delayed: true }); app.change({ unrelated: true });
  app.resolve({ mode: 'light', darkPaper: false }); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'original');
});
test('the latest changes and removals win over a stale startup read', async () => {
  const app = boot({ delayed: true });
  app.change({ mode: 'light', darkPaper: false });
  app.change({ mode: undefined, darkPaper: undefined });
  app.resolve({ mode: 'light', darkPaper: false }); await app.settle();
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
  assert.equal(app.document.documentElement.dataset.darkDocsPaper, 'dark');
});
test('ignores settings from unrelated storage areas', async () => {
  const app = boot(); await app.settle(); app.change({ mode: 'light' }, 'sync');
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
});
test('document-start works before the root exists and disconnects its observer', async () => {
  const app = boot({ root: false }); await app.settle();
  assert.equal(app.addRoot(), true);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'dark');
});
test('system theme still works if storage is unavailable', async () => {
  const app = boot({ storageError: true }); await app.settle(); app.setSystem(false);
  assert.equal(app.document.documentElement.dataset.darkDocs, 'light');
});
test('extension package has valid references and only requests local settings storage', () => {
  const base = path.join(__dirname, '../extension');
  const m = JSON.parse(fs.readFileSync(path.join(base, 'manifest.json')));
  assert.equal(m.manifest_version, 3);
  assert.deepEqual(m.permissions, ['storage']);
  assert.equal(m.background, undefined);
  assert.deepEqual(m.content_scripts[0].matches, ['https://docs.google.com/document/*']);
  assert.equal(m.content_scripts.length, 2);
  const sharing = m.content_scripts[1];
  assert.deepEqual(sharing.matches, ['https://docs.google.com/drivesharing/*']);
  assert.equal(sharing.all_frames, true);
  assert.deepEqual(sharing.js, ['content.js']);
  assert.deepEqual(sharing.css, ['embedded.css']);
  assert.equal(m.host_permissions, undefined);
  for (const file of [...Object.values(m.icons), m.action.default_popup, ...m.content_scripts.flatMap(script => [...script.js, ...script.css])]) {
    assert.equal(fs.existsSync(path.join(base, file)), true, file);
  }
});
