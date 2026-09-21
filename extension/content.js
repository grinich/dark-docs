(() => {
  'use strict';
  const media = matchMedia('(prefers-color-scheme: dark)');
  let settings = { mode: 'system', darkPaper: true };
  let startupChanges = {};
  const apply = () => {
    const root = document.documentElement;
    if (!root) return;
    const dark = settings.mode === 'dark' || (settings.mode === 'system' && media.matches);
    root.dataset.darkDocs = dark ? 'dark' : 'light';
    root.dataset.darkDocsPaper = settings.darkPaper ? 'dark' : 'original';
  };
  const normalize = values => ({
    mode: ['system', 'dark', 'light'].includes(values.mode) ? values.mode : 'system',
    darkPaper: typeof values.darkPaper === 'boolean' ? values.darkPaper : true
  });
  // One root attribute update; no polling or document-content observers.
  apply();
  if (!document.documentElement) {
    const observer = new MutationObserver(() => {
      if (document.documentElement) { apply(); observer.disconnect(); }
    });
    observer.observe(document, { childList: true });
  }
  media.addEventListener('change', apply);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    let changed = false;
    for (const key of ['mode', 'darkPaper']) {
      if (!changes[key]) continue;
      settings[key] = changes[key].newValue;
      if (startupChanges) startupChanges[key] = changes[key].newValue;
      changed = true;
    }
    if (!changed) return;
    settings = normalize(settings);
    apply();
  });
  chrome.storage.local.get(['mode', 'darkPaper']).then(values => {
    // Preserve newer changes per setting while still loading untouched values.
    settings = normalize({ ...values, ...startupChanges });
    startupChanges = null;
    apply();
  }).catch(() => {
    startupChanges = null;
    // System appearance remains usable if storage is unavailable.
  });
})();
