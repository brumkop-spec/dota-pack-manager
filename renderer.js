const CATS = ['heroes', 'skins', 'terrain', 'cursors', 'loading', 'hud', 'sounds'];
const I18N = {
  ru: {
    packs: 'Паки', builder: 'Конструктор пака', settings: 'Настройки', game_on: 'Dota 2 запущена', game_off: 'Dota 2 не запущена',
    search: 'Поиск паков…', import: '+ Загрузить свой пак', details: 'Подробнее', apply: 'Применить', active: 'Активен', temp: 'Временный', saved: 'Сохранён',
    empty: 'Паков пока нет. Загрузи ZIP/VPK или собери свой в конструкторе.', items: 'Состав пака', no_items: 'Состав не указан', close: 'Закрыть',
    save: '★ Сохранить', unsave: '☆ Сделать временным', del: 'Удалить', cancel: 'Отмена', yes: 'Да, продолжить', ok: 'Ок',
    confirm_apply: 'Применить пак «{n}»? Лаунчер изменит файлы игры (папка game/dota_mods и gameinfo.gi). Резервная копия gameinfo.gi создаётся автоматически.',
    confirm_del: 'Удалить «{n}»?', applying: 'Установка…', done_title: 'Пак применён',
    done_text: 'Запусти Dota 2. Если что-то пошло не так, в Настройках нажми «Восстановить оригинал» или проверь целостность файлов в Steam.',
    err_NO_PATH: 'Не указана папка Dota 2. Открой Настройки и выбери её.', err_GAME_RUNNING: 'Dota 2 запущена. Закрой игру и повтори.',
    err_EMPTY: 'В паке нет .vpk файлов.', err_FAIL: 'Ошибка', err_BAD: 'Файл повреждён или не является корректным паком.', err_BAD_PATH: 'Это не папка Dota 2 (нет game\\dota).',
    p_backup: 'Подготовка и резервная копия…', p_copy: 'Копирование файлов…', p_patch: 'Настройка gameinfo.gi…', p_done: 'Готово', p_update: 'Загрузка обновления…',
    imported: 'Пак импортирован (временный, пока не сохранишь ★)',
    online: 'Онлайн', download: 'Скачать', update: 'Обновить', downloaded: 'Пак скачан. Теперь его можно применить', offline: 'Каталог недоступен (нет интернета?)',
    p_download: 'Скачивание…', err_HASH: 'Файл повреждён: не совпала контрольная сумма',
    cat_heroes: 'Герои', cat_skins: 'Скины и косметика', cat_terrain: 'Ландшафты', cat_cursors: 'Курсоры', cat_loading: 'Экраны загрузки', cat_hud: 'Интерфейс и HUD', cat_sounds: 'Звуки и озвучка',
    mods_empty: 'В этой категории пусто. Добавь свой .vpk.', add_mod: '+ Добавить мод (.vpk)', add: 'Добавить', remove: 'Убрать', my_build: 'Моя сборка', build_empty: 'Добавь хотя бы один мод',
    build_apply: 'Собрать и применить', pack_name: 'Название сборки', my_pack: 'Моя сборка', conflicts: 'Найдены несовместимые моды:', build_anyway: 'Всё равно собрать',
    mod_name: 'Название мода', mod_cat: 'Категория', choose_file: 'Выбрать .vpk',
    s_path: 'Папка Dota 2', s_path_ok: 'Путь корректен', s_path_bad: 'Путь неверный', choose: 'Выбрать…', s_lang: 'Язык', s_snow: 'Снегопад', s_anim: 'Анимации', s_fx: 'Доп. визуальные эффекты',
    s_discord: 'Discord Rich Presence', s_temp: 'Временные импорты', s_temp_d: 'Удаляются при закрытии приложения, если не сохранены', s_clear: 'Очистить',
    s_restore: 'Восстановить оригинал', s_restore_d: 'Убирает моды и возвращает gameinfo.gi', s_verify: 'Проверить файлы в Steam', s_update: 'Проверить обновления', s_open: 'Открыть папку паков',
    upd_dev: 'В режиме разработки обновления отключены', upd_none: 'У вас последняя версия', upd_new: 'Доступна версия {v}. Скачать и установить?', restored: 'Оригинал восстановлен'
  },
  en: {
    packs: 'Packs', builder: 'Pack Builder', settings: 'Settings', game_on: 'Dota 2 is running', game_off: 'Dota 2 is not running',
    search: 'Search packs…', import: '+ Import your pack', details: 'Details', apply: 'Apply', active: 'Active', temp: 'Temporary', saved: 'Saved',
    empty: 'No packs yet. Import a ZIP/VPK or build your own in the builder.', items: 'Pack contents', no_items: 'No contents listed', close: 'Close',
    save: '★ Save', unsave: '☆ Make temporary', del: 'Delete', cancel: 'Cancel', yes: 'Yes, continue', ok: 'OK',
    confirm_apply: 'Apply pack "{n}"? The launcher will modify game files (game/dota_mods and gameinfo.gi). A gameinfo.gi backup is created automatically.',
    confirm_del: 'Delete "{n}"?', applying: 'Installing…', done_title: 'Pack applied',
    done_text: 'Launch Dota 2. If something went wrong, press "Restore original" in Settings or verify game files in Steam.',
    err_NO_PATH: 'Dota 2 folder is not set. Open Settings and choose it.', err_GAME_RUNNING: 'Dota 2 is running. Close the game and try again.',
    err_EMPTY: 'The pack has no .vpk files.', err_FAIL: 'Error', err_BAD: 'The file is corrupted or not a valid pack.', err_BAD_PATH: 'Not a Dota 2 folder (no game\\dota).',
    p_backup: 'Preparing and backing up…', p_copy: 'Copying files…', p_patch: 'Updating gameinfo.gi…', p_done: 'Done', p_update: 'Downloading update…',
    imported: 'Pack imported (temporary until you save it ★)',
    online: 'Online', download: 'Download', update: 'Update', downloaded: 'Pack downloaded. You can apply it now', offline: 'Catalog unavailable (no internet?)',
    p_download: 'Downloading…', err_HASH: 'File corrupted: checksum mismatch',
    cat_heroes: 'Heroes', cat_skins: 'Skins & cosmetics', cat_terrain: 'Terrain', cat_cursors: 'Cursors', cat_loading: 'Loading screens', cat_hud: 'Interface & HUD', cat_sounds: 'Sounds & voice',
    mods_empty: 'Nothing here yet. Add your own .vpk.', add_mod: '+ Add mod (.vpk)', add: 'Add', remove: 'Remove', my_build: 'My build', build_empty: 'Add at least one mod',
    build_apply: 'Build & apply', pack_name: 'Build name', my_pack: 'My build', conflicts: 'Incompatible mods found:', build_anyway: 'Build anyway',
    mod_name: 'Mod name', mod_cat: 'Category', choose_file: 'Choose .vpk',
    s_path: 'Dota 2 folder', s_path_ok: 'Path is valid', s_path_bad: 'Invalid path', choose: 'Browse…', s_lang: 'Language', s_snow: 'Snowfall', s_anim: 'Animations', s_fx: 'Extra visual effects',
    s_discord: 'Discord Rich Presence', s_temp: 'Temporary imports', s_temp_d: 'Removed on exit unless saved', s_clear: 'Clear',
    s_restore: 'Restore original', s_restore_d: 'Removes mods and restores gameinfo.gi', s_verify: 'Verify files in Steam', s_update: 'Check for updates', s_open: 'Open packs folder',
    upd_dev: 'Updates are disabled in dev mode', upd_none: 'You are up to date', upd_new: 'Version {v} is available. Download and install?', restored: 'Original restored'
  }
};
const S = { cfg: { lang: 'ru' }, catalog: [], packs: [], mods: [], tab: 'packs', cat: 'heroes', build: [], game: false, q: '' };
const t = (k, v) => { let s = (I18N[S.cfg.lang] || I18N.ru)[k] || k; for (const x in v || {}) s = s.replace(`{${x}}`, v[x]); return s; };
const $ = (id) => document.getElementById(id);
const h = (tag, a = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(a)) { if (k === 'class') e.className = v; else if (k.startsWith('on')) e[k] = v; else if (k === 'style') e.style.cssText = v; else e.setAttribute(k, v); }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};
const grad = (s) => { let n = 0; for (const c of s) n = (n * 31 + c.charCodeAt(0)) % 40; return `linear-gradient(135deg,hsl(${255 + n},75%,22%),hsl(${280 + n},85%,38%))`; };
const bg = (u, name) => u ? `background-image:url("${u}")` : `background-image:${grad(name)}`;
const errText = (r) => t('err_' + r.error) + (r.detail ? ` (${r.detail})` : '');

// ---------- уведомления и окна ----------
function toast(msg) { const e = h('div', { class: 'toast' }, msg); $('toasts').append(e); setTimeout(() => e.remove(), 4500); }
function modal(content, small) {
  const ov = h('div', { class: 'ov', onclick: (e) => e.target === ov && ov.remove() }, h('div', { class: 'modal' + (small ? ' sm' : '') }, content));
  $('modals').append(ov); return ov;
}
function confirmBox(text, onYes, yesLabel) {
  const ov = modal([h('div', { class: 'pre' }, text), h('div', { class: 'row' },
    h('button', { class: 'btn', onclick: () => ov.remove() }, t('cancel')),
    h('button', { class: 'btn pri', onclick: () => { ov.remove(); onYes(); } }, yesLabel || t('yes')))], true);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const o = $('modals').lastChild; o && !o.dataset.lock && o.remove(); } });

// ---------- данные ----------
async function loadPacks() { S.packs = await api.invoke('packs'); }
async function loadMods() { S.mods = await api.invoke('mods'); }
function applyFx() {
  const c = S.cfg, b = document.body.classList;
  b.toggle('no-anim', !c.anim); b.toggle('no-fx', !c.fx); document.documentElement.lang = c.lang;
  snowOn = c.snow && c.anim; if (snowOn) snowLoop();
  $('stext').textContent = t(S.game ? 'game_on' : 'game_off'); $('dot').classList.toggle('on', S.game);
}
async function setCfg(patch) { S.cfg = await api.invoke('set-cfg', patch); applyFx(); }

// ---------- установка ----------
async function applyPack(p) {
  if (S.game) return toast(t('err_GAME_RUNNING'));
  confirmBox(t('confirm_apply', { n: p.name }), async () => {
    const bar = h('div', { class: 'bar-i' }), txt = h('div', { class: 'pre' }, t('applying'));
    const ov = modal([h('h3', {}, t('applying')), h('div', { class: 'bar-o' }, bar), txt], true);
    ov.onclick = null; ov.dataset.lock = '1'; progress = (d) => { bar.style.width = d.pct + '%'; txt.textContent = t(d.key) + (d.file ? ' ' + d.file : ''); };
    const r = await api.invoke('apply', p.id);
    ov.remove(); progress = null;
    if (!r.ok) return toast(errText(r));
    S.cfg.active = p.id; render();
    modal([h('h3', {}, t('done_title')), h('div', { class: 'pre' }, t('done_text')), h('button', { class: 'btn pri', onclick: (e) => e.target.closest('.ov').remove() }, t('ok'))], true);
  });
}
let progress = null;
api.on('progress', (d) => progress && progress(d));
api.on('game-status', (g) => { S.game = g; applyFx(); });

// ---------- вкладка «Паки» ----------
function openPack(p) {
  let i = 0; const imgs = p.shots.length ? p.shots : (p.preview ? [p.preview] : []);
  const gal = h('div', { class: 'gal', style: bg(imgs[0], p.name) });
  const go = (d) => { if (!imgs.length) return; i = (i + d + imgs.length) % imgs.length; gal.style.cssText = bg(imgs[i], p.name); };
  if (imgs.length > 1) gal.append(h('button', { class: 'l', onclick: () => go(-1) }, '‹'), h('button', { class: 'r', onclick: () => go(1) }, '›'));
  const ov = modal([gal, h('h3', {}, p.name), h('div', { class: 'pre' }, p.description),
    h('div', { class: 'tags' }, p.tags.map(x => h('span', { class: 'tag' }, x))),
    h('b', {}, t('items')),
    h('div', { class: 'items' }, p.items.length ? p.items.map(x => h('div', {}, h('i', {}, t('cat_' + x.category)), x.name)) : h('div', {}, t('no_items'))),
    h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: () => ov.remove() }, t('close')),
      !p.remote && h('button', { class: 'btn', onclick: async () => { await api.invoke('toggle-save', p.id); await loadPacks(); ov.remove(); render(); } }, p.temp ? t('save') : t('unsave')),
      (p.remote || p.update) && h('button', { class: 'btn pri', onclick: () => { ov.remove(); downloadPack(p); } }, (p.update ? t('update') : t('download')) + (p.size ? ' · ' + mb(p.size) : '')),
      !p.remote && h('button', { class: 'btn pri', onclick: () => { ov.remove(); applyPack(p); } }, t('apply'))
    )]);
}
function viewPacks() {
  const list = S.packs.filter(p => (p.name + p.tags.join(' ')).toLowerCase().includes(S.q.toLowerCase()));
  return h('div', { class: 'view' }, h('h2', {}, t('packs')),
    h('div', { class: 'bar' },
      h('input', { class: 'grow', placeholder: t('search'), value: S.q, oninput: (e) => { S.q = e.target.value; const g = $('grid'); g.replaceWith(gridEl()); } }),
      h('button', { class: 'btn pri', onclick: async () => {
        const r = await api.invoke('import-pack');
        if (r.ok) { await loadPacks(); toast(t('imported')); render(); } else if (r.error) toast(errText(r));
      } }, t('import'))),
    gridEl());
}
const mb = (n) => Math.max(1, Math.round(n / 1048576)) + ' MB';
function allPacks() {
  const out = S.packs.map(p => {
    const c = S.catalog.find(e => e.localId === p.id);
    return { ...p, entry: c, update: !!(c && p.catalogId && String(c.version || 1) !== String(p.version)) };
  });
  for (const e of S.catalog) if (!S.packs.some(p => p.id === e.localId))
    out.push({ id: e.localId, name: e.name, description: e.description || '', tags: e.tags || [], items: e.items || [], preview: e.preview || null,
      shots: e.shots || [], remote: true, size: e.size, entry: e, temp: false });
  return out;
}
function gridEl() {
  const list = allPacks().filter(p => (p.name + p.tags.join(' ')).toLowerCase().includes(S.q.toLowerCase()));
  if (!list.length) return h('div', { id: 'grid', class: 'empty' }, t('empty'));
  return h('div', { id: 'grid', class: 'grid' }, list.map(p => {
    const act = S.cfg.active === p.id;
    const chip = act ? t('active') : p.update ? t('update') : p.remote ? t('online') : p.temp ? t('temp') : t('saved');
    return h('div', { class: 'card' + (act ? ' active' : '') },
      h('div', { class: 'cover', style: bg(p.preview, p.name), onclick: () => openPack(p) },
        h('span', { class: 'chip' + (act || p.update ? ' mg' : '') }, chip)),
      h('div', { class: 'cb' }, h('div', { class: 'n' }, p.name), h('div', { class: 'd' }, p.description),
        h('div', { class: 'tags' }, p.tags.map(x => h('span', { class: 'tag' }, x))),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => openPack(p) }, t('details')),
          p.remote ? h('button', { class: 'btn pri', onclick: () => downloadPack(p) }, t('download') + (p.size ? ' · ' + mb(p.size) : ''))
                   : h('button', { class: 'btn pri', onclick: () => applyPack(p) }, t('apply')))));
  }));
}
async function downloadPack(p) {
  const bar = h('div', { class: 'bar-i' }), txt = h('div', { class: 'pre' }, t('p_download'));
  const ov = modal([h('h3', {}, p.name), h('div', { class: 'bar-o' }, bar), txt], true);
  ov.onclick = null; ov.dataset.lock = '1'; progress = (d) => { bar.style.width = d.pct + '%'; txt.textContent = t(d.key); };
  const r = await api.invoke('download-pack', p.entry);
  ov.remove(); progress = null;
  if (!r.ok) return toast(errText(r));
  await loadPacks(); toast(t('downloaded')); render();
}
async function loadCatalog() {
  const r = await api.invoke('catalog');
  S.catalog = r.packs || [];
  if (!r.ok && !r.unconfigured) toast(t('offline'));
  if (S.tab === 'packs') render();
}

// ---------- вкладка «Конструктор» ----------
function addModDialog() {
  const name = h('input', { placeholder: t('mod_name') });
  const cat = h('select', {}, CATS.map(c => h('option', { value: c, ...(c === S.cat ? { selected: '' } : {}) }, t('cat_' + c))));
  const ov = modal([h('h3', {}, t('add_mod')), name, cat, h('div', { class: 'row' },
    h('button', { class: 'btn', onclick: () => ov.remove() }, t('cancel')),
    h('button', { class: 'btn pri', onclick: async () => {
      if (!name.value.trim()) return;
      const r = await api.invoke('mod-import', { name: name.value.trim(), category: cat.value });
      if (r.ok) { ov.remove(); await loadMods(); render(); } else if (r.error) toast(errText(r));
    } }, t('choose_file')))], true);
}
async function buildAndApply() {
  if (!S.build.length) return toast(t('build_empty'));
  const name = $('bname').value.trim() || t('my_pack');
  const go = async () => {
    const r = await api.invoke('build-pack', { name, ids: S.build });
    if (!r.ok) return toast(errText(r));
    S.build = []; await loadPacks(); switchTab('packs');
    const p = S.packs.find(x => x.id === r.id); if (p) applyPack(p);
  };
  const warn = await api.invoke('check-build', S.build);
  if (warn.length) confirmBox(t('conflicts') + '\n' + warn.join('\n'), go, t('build_anyway')); else go();
}
function viewBuilder() {
  const items = S.mods.filter(m => m.category === S.cat);
  const chosen = S.build.map(id => S.mods.find(m => m.id === id)).filter(Boolean);
  const modRow = (m, btn) => h('div', { class: 'mod' }, h('div', { class: 'pv', style: bg(m.preview, m.name) }),
    h('div', { class: 't' }, h('b', {}, m.name), h('span', {}, m.description || t('cat_' + m.category))), btn);
  return h('div', { class: 'view', style: 'height:100%' }, h('h2', {}, t('builder')),
    h('div', { class: 'builder' },
      h('div', { class: 'pane' }, CATS.map(c => h('div', { class: 'cat' + (c === S.cat ? ' on' : ''), onclick: () => { S.cat = c; render(); } }, t('cat_' + c)))),
      h('div', { class: 'pane' }, h('button', { class: 'btn', onclick: addModDialog }, t('add_mod')),
        items.length ? items.map(m => modRow(m, h('button', { class: 'btn', ...(S.build.includes(m.id) ? { disabled: '' } : {}),
          onclick: () => { S.build.push(m.id); render(); } }, t('add')))) : h('div', { class: 'empty', style: 'margin-top:30px' }, t('mods_empty'))),
      h('div', { class: 'pane' }, h('b', {}, t('my_build') + ` (${chosen.length})`),
        h('input', { id: 'bname', placeholder: t('pack_name'), value: S.bname || '', oninput: (e) => { S.bname = e.target.value; } }),
        h('div', { style: 'flex:1;display:flex;flex-direction:column;gap:8px' },
          chosen.map(m => modRow(m, h('button', { class: 'btn dng', onclick: () => { S.build = S.build.filter(x => x !== m.id); render(); } }, '✕')))),
        h('button', { class: 'btn pri big', onclick: buildAndApply }, t('build_apply')))));
}

// ---------- вкладка «Настройки» ----------
const sw = (key) => h('div', { class: 'sw' + (S.cfg[key] ? ' on' : ''), onclick: async () => { await setCfg({ [key]: !S.cfg[key] }); render(); } });
function srow(title, desc, ctrl) { return h('div', { class: 'srow' }, h('div', {}, title, desc && h('small', {}, desc)), ctrl); }
function viewSettings() {
  const tmp = S.packs.filter(p => p.temp).length;
  const ok = h('small', {}, '');
  const check = async () => { const v = await api.invoke('validate-path', S.cfg.dotaPath); ok.textContent = v ? '✓ ' + t('s_path_ok') : '✗ ' + t('s_path_bad'); ok.style.color = v ? '#2dff7a' : '#ff6b95'; };
  setTimeout(check, 0);
  return h('div', { class: 'view' }, h('h2', {}, t('settings')),
    h('div', { class: 'set' },
      srow(t('s_path'), null, h('button', { class: 'btn', onclick: async () => {
        const r = await api.invoke('choose-dota'); if (r.ok) { S.cfg = r.cfg; render(); } else if (r.error) toast(errText(r)); } }, t('choose'))),
      h('div', { class: 'srow' }, h('div', {}, h('small', { style: 'margin:0;word-break:break-all' }, S.cfg.dotaPath || '—'), ok)),
      srow(t('s_lang'), null, h('select', { onchange: async (e) => { await setCfg({ lang: e.target.value }); render(); renderNav(); } },
        h('option', { value: 'ru', ...(S.cfg.lang === 'ru' ? { selected: '' } : {}) }, 'Русский'),
        h('option', { value: 'en', ...(S.cfg.lang === 'en' ? { selected: '' } : {}) }, 'English'))),
      srow(t('s_snow'), null, sw('snow')), srow(t('s_anim'), null, sw('anim')), srow(t('s_fx'), null, sw('fx')), srow(t('s_discord'), null, sw('discord'))),
    h('div', { class: 'set' },
      srow(t('s_temp') + ` (${tmp})`, t('s_temp_d'), h('button', { class: 'btn', onclick: async () => { S.packs = await api.invoke('clear-temp'); render(); } }, t('s_clear'))),
      srow(t('s_open'), null, h('button', { class: 'btn', onclick: () => api.invoke('open-packs') }, '📁')),
      srow(t('s_restore'), t('s_restore_d'), h('button', { class: 'btn dng', onclick: () => confirmBox(t('s_restore') + '?', async () => {
        const r = await api.invoke('restore'); if (r.ok) { S.cfg.active = null; toast(t('restored')); render(); } else toast(errText(r)); }) }, t('s_restore'))),
      srow(t('s_verify'), null, h('button', { class: 'btn', onclick: () => api.invoke('steam-verify') }, 'Steam')),
      srow(t('s_update'), null, h('button', { class: 'btn', onclick: async () => {
        const r = await api.invoke('check-update');
        if (r.dev) return toast(t('upd_dev')); if (r.error) return toast(r.error); if (!r.available) return toast(t('upd_none'));
        confirmBox(t('upd_new', { v: r.version }), async () => {
          const bar = h('div', { class: 'bar-i' }); modal([h('div', { class: 'bar-o' }, bar)], true);
          progress = (d) => { bar.style.width = d.pct + '%'; }; api.invoke('install-update'); });
      } }, t('s_update')))));
}

// ---------- каркас ----------
function render() { const v = $('view'); v.replaceChildren(S.tab === 'packs' ? viewPacks() : S.tab === 'builder' ? viewBuilder() : viewSettings()); }
function renderNav() {
  $('nav').replaceChildren(...['packs', 'builder', 'settings'].map(k => h('button', { class: S.tab === k ? 'on' : '', onclick: () => switchTab(k) }, t(k))));
  $('stext').textContent = t(S.game ? 'game_on' : 'game_off');
}
function switchTab(k) { S.tab = k; renderNav(); render(); api.invoke('set-activity', k); }

// ---------- снег ----------
let snowOn = true, snowRun = false; const cv = $('snow'), cx = cv.getContext('2d'); let flakes = [];
function resize() { cv.width = innerWidth; cv.height = innerHeight; flakes = Array.from({ length: 90 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 2 + .6, v: Math.random() * .8 + .3, d: Math.random() * 6 })); }
addEventListener('resize', resize); resize();
function snowLoop() {
  if (snowRun) return; snowRun = true;
  const f = () => {
    if (!snowOn) { cx.clearRect(0, 0, cv.width, cv.height); snowRun = false; return; }
    cx.clearRect(0, 0, cv.width, cv.height); cx.fillStyle = 'rgba(225,195,255,.85)';
    for (const s of flakes) { s.y += s.v; s.d += .01; s.x += Math.sin(s.d) * .4; if (s.y > cv.height) { s.y = -5; s.x = Math.random() * cv.width; }
      cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.3); cx.fill(); }
    requestAnimationFrame(f);
  };
  f();
}

(async () => {
  const d = await api.invoke('init');
  S.cfg = d.cfg; S.packs = d.packs; S.mods = d.mods; S.game = d.game;
  applyFx(); renderNav(); render(); api.invoke('set-activity', 'packs'); loadCatalog();
})();
