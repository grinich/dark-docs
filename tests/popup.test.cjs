const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../extension/popup.js'), 'utf8');

function boot({ values = {}, delayed = false, readError = false, save = async () => {} } = {}) {
  const control = properties => ({ ...properties, addEventListener(event, listener) { this[event] = listener; } });
  const status = { textContent: '' };
  const paper = control({ checked: true });
  const radios = ['system', 'dark', 'light'].map(value => control({ value, checked: value === 'system' }));
  const media = control({ matches: true });
  const writes = [];
  let resolveRead;
  const read = readError ? Promise.reject(new Error('read unavailable'))
    : delayed ? new Promise(resolve => { resolveRead = resolve; })
      : Promise.resolve({ mode: 'system', darkPaper: true, ...values });
  vm.runInNewContext(source, {
    document: {
      querySelector: selector => selector === '#status' ? status : paper,
      querySelectorAll: () => radios
    },
    matchMedia: () => media,
    chrome: { storage: { local: {
      get: () => read,
      set: async values => { writes.push({ ...values }); await save(values); }
    } } }
  });
  return {
    status, paper, writes, resolveRead,
    mode: () => radios.find(radio => radio.checked).value,
    chooseMode: value => {
      radios.forEach(radio => { radio.checked = radio.value === value; });
      radios.find(radio => radio.checked).change();
    },
    choosePaper: value => { paper.checked = value; paper.change(); },
    setSystem: dark => { media.matches = dark; media.change(); },
    settle: async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); }
  };
}

test('popup loads saved controls and follows system status only in System mode', async () => {
  const app = boot({ values: { mode: 'light', darkPaper: false } }); await app.settle();
  assert.equal(app.mode(), 'light');
  assert.equal(app.paper.checked, false);
  app.setSystem(false);
  assert.equal(app.status.textContent, 'Light appearance is always on.');
  app.chooseMode('system'); await app.settle();
  assert.match(app.status.textContent, /Light right now/);
  app.setSystem(true);
  assert.match(app.status.textContent, /Dark right now/);
});

test('late popup loading preserves a new appearance choice and loads untouched paper', async () => {
  const app = boot({ delayed: true });
  app.chooseMode('light'); await app.settle();
  app.resolveRead({ mode: 'dark', darkPaper: false }); await app.settle();
  assert.equal(app.mode(), 'light');
  assert.equal(app.paper.checked, false);
  assert.equal(app.status.textContent, 'Light appearance is always on.');
});

test('late popup loading preserves a new paper choice and loads untouched appearance', async () => {
  const app = boot({ delayed: true });
  app.choosePaper(false); await app.settle();
  app.resolveRead({ mode: 'light', darkPaper: true }); await app.settle();
  assert.equal(app.mode(), 'light');
  assert.equal(app.paper.checked, false);
});

test('save failure stays visible through OS changes and unrelated successful saves', async () => {
  let failMode = true;
  const app = boot({ save: async values => {
    if ('mode' in values && failMode) throw new Error('write unavailable');
  } }); await app.settle();
  app.chooseMode('light'); await app.settle();
  assert.match(app.status.textContent, /Could not save/);
  app.setSystem(false);
  assert.match(app.status.textContent, /Could not save/);
  app.choosePaper(false); await app.settle();
  assert.match(app.status.textContent, /Could not save/);
  failMode = false;
  app.chooseMode('dark'); await app.settle();
  assert.equal(app.status.textContent, 'Dark appearance is always on.');
});

test('rapid choices write in order and the save queue recovers from failure', async () => {
  let rejectFirst;
  let calls = 0;
  const app = boot({ save: () => {
    if (++calls === 1) return new Promise((resolve, reject) => { rejectFirst = reject; });
    return Promise.resolve();
  } }); await app.settle();
  app.chooseMode('light');
  app.chooseMode('dark'); await app.settle();
  assert.deepEqual(app.writes, [{ mode: 'light' }]);
  rejectFirst(new Error('write unavailable')); await app.settle();
  assert.deepEqual(app.writes, [{ mode: 'light' }, { mode: 'dark' }]);
  assert.equal(app.mode(), 'dark');
  assert.equal(app.status.textContent, 'Dark appearance is always on.');
});

test('unavailable saved settings remain explicit after the system appearance changes', async () => {
  const app = boot({ readError: true }); await app.settle();
  assert.match(app.status.textContent, /Settings unavailable/);
  app.setSystem(false);
  assert.match(app.status.textContent, /Settings unavailable/);
});
