const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { execFile } = require('child_process');
const { pathToFileURL } = require('url');
const crypto = require('crypto');

let appCfg = {}; try { appCfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'app-config.json'), 'utf8')); } catch {}
const CATALOG_URL = (appCfg.catalogUrl || '').trim();
const DISCORD_CLIENT_ID = (appCfg.discordClientId || '').trim();
const SINGLE_SLOT = ['terrain', 'cursors', 'loading', 'hud'];
let win, rpc = null, gameRunning = false, activity = 'packs';
const startedAt = new Date();

const U = (...p) => path.join(app.getPath('userData'), ...p);
const dir = (...p) => { const d = U(...p); fs.mkdirSync(d, { recursive: true }); return d; };
const defaults = { dotaPath: null, active: null, lang: 'ru', snow: true, anim: true, fx: true, discord: true };
const cfg = () => { try { return { ...defaults, ...JSON.parse(fs.readFileSync(U('config.json'), 'utf8')) }; } catch { return { ...defaults }; } };
const setCfg = (patch) => { const c = { ...cfg(), ...patch }; dir(); fs.writeFileSync(U('config.json'), JSON.stringify(c, null, 2)); return c; };
const send = (ch, d) => win && !win.isDestroyed() && win.webContents.send(ch, d);
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; } };
const slug = (s) => (s || 'pack').toLowerCase().replace(/[^a-z0-9а-я]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'pack';
const isDota = (p) => !!p && fs.existsSync(path.join(p, 'game', 'dota'));

function detectDota() {
  for (const d of 'CDEFGH') for (const r of ['Program Files (x86)\\Steam', 'Steam', 'SteamLibrary', 'Games\\Steam', 'Games\\SteamLibrary']) {
    const p = `${d}:\\${r}\\steamapps\\common\\dota 2 beta`;
    if (isDota(p)) return p;
  }
  return null;
}

// ---------- проверка файлов ----------
function validVpkFile(f) {
  try {
    const fd = fs.openSync(f, 'r'); const b = Buffer.alloc(4);
    fs.readSync(fd, b, 0, 4, 0); fs.closeSync(fd);
    return b.readUInt32LE(0) === 0x55aa1234;
  } catch { return false; }
}
const vpksIn = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter(f => /\.vpk$/i.test(f)) : []);
function layersOf(folder) {
  const subs = fs.readdirSync(folder, { withFileTypes: true })
    .filter(e => e.isDirectory() && vpksIn(path.join(folder, e.name)).length).map(e => path.join(folder, e.name)).sort();
  return subs.length ? subs : (vpksIn(folder).length ? [folder] : []);
}
function images(d) {
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort().map(f => pathToFileURL(path.join(d, f)).href);
}


function extractZip(file, folder) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(file);
  const entries = zip.getEntries();
  if (entries.some(e => e.entryName.includes('..') || path.isAbsolute(e.entryName))) throw new Error('BAD');
  if (!entries.some(e => /\.vpk$/i.test(e.entryName))) throw new Error('BAD');
  if (entries.reduce((s, e) => s + e.header.size, 0) > 4 * 1024 ** 3) throw new Error('BAD');
  zip.extractAllTo(folder, true);
  const bad = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/_dir\.vpk$/i.test(e.name) && !validVpkFile(p)) bad.push(p);
  } })(folder);
  if (bad.length || !layersOf(folder).length) throw new Error('BAD');
}

// ---------- паки и моды ----------
function listPacks() {
  const root = dir('packs');
  return fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => {
    const f = path.join(root, e.name), m = readJson(path.join(f, 'pack.json'));
    const shots = images(path.join(f, 'shots')), pv = images(f)[0] || shots[0] || null;
    return { id: e.name, name: m.name || e.name, description: m.description || '', tags: m.tags || [], items: m.items || [],
      temp: !!m.temp, preview: pv, shots, layers: layersOf(f).length, version: m.version || 0, catalogId: m.catalogId || null };
  });
}
function listMods() {
  const root = dir('mods');
  return fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => {
    const f = path.join(root, e.name), m = readJson(path.join(f, 'mod.json'));
    return { id: e.name, name: m.name || e.name, category: m.category || 'skins', description: m.description || '',
      slot: m.slot || null, conflicts: m.conflicts || [], preview: images(f)[0] || null };
  });
}
const slotOf = (m) => m.slot || (SINGLE_SLOT.includes(m.category) ? m.category : null);

// ---------- gameinfo.gi ----------
const BLOCK = /[ \t]*\/\/ DSL BEGIN[\s\S]*?\/\/ DSL END\r?\n?/g;
function patchGameInfo(dota, n) {
  const gi = path.join(dota, 'game', 'dota', 'gameinfo.gi');
  if (!fs.existsSync(gi + '.dsl.bak')) fs.copyFileSync(gi, gi + '.dsl.bak');
  let txt = fs.readFileSync(gi, 'utf8').replace(BLOCK, '');
  const next = txt.replace(/^([ \t]*)Game[ \t]+dota[ \t]*\r?$/m, (_m, ind) => {
    let s = `${ind}// DSL BEGIN\r\n`;
    for (let i = 0; i < n; i++) s += `${ind}Game    dota_mods${n === 1 ? '' : '/' + i}\r\n`;
    return s + `${ind}// DSL END\r\n${ind}Game    dota`;
  });
  if (next === txt) throw new Error('Не найдена строка "Game dota" в gameinfo.gi');
  fs.writeFileSync(gi, next);
}
async function restoreOriginal(dota) {
  const gi = path.join(dota, 'game', 'dota', 'gameinfo.gi');
  if (fs.existsSync(gi)) fs.writeFileSync(gi, fs.readFileSync(gi, 'utf8').replace(BLOCK, ''));
  await fsp.rm(path.join(dota, 'game', 'dota_mods'), { recursive: true, force: true });
}

// ---------- статус игры / Discord ----------
const isRunning = () => new Promise(res => {
  if (process.platform !== 'win32') return res(false);
  execFile('tasklist', ['/FI', 'IMAGENAME eq dota2.exe', '/FO', 'CSV', '/NH'], { windowsHide: true }, (e, out) => res(!e && /dota2\.exe/i.test(out)));
});
const ACT = {
  ru: { packs: 'Выбирает пак', builder: 'Создаёт сборку', settings: 'В настройках', game: 'Играет в Dota 2' },
  en: { packs: 'Browsing packs', builder: 'Building a pack', settings: 'In settings', game: 'Playing Dota 2' }
};
function setActivity() {
  const c = cfg();
  if (!rpc || !c.discord) return;
  const T = ACT[c.lang] || ACT.ru;
  rpc.setActivity({ details: gameRunning ? T.game : T[activity], state: 'Dota 2 Pack Manager',
    largeImageKey: 'logo', largeImageText: 'Dota 2 Pack Manager', startTimestamp: startedAt }).catch(() => {});
}
function initRpc() {
  if (!cfg().discordClientId && (!DISCORD_CLIENT_ID || /^0+$/.test(DISCORD_CLIENT_ID))) return; // ID ещё не вписан
  try {
    const RPC = require('discord-rpc');
    const c = new RPC.Client({ transport: 'ipc' });
    c.on('ready', () => { rpc = c; setActivity(); });
    c.login({ clientId: cfg().discordClientId || DISCORD_CLIENT_ID }).catch(() => { rpc = null; });
  } catch { rpc = null; }
}
setInterval(async () => {
  const r = await isRunning();
  if (r !== gameRunning) { gameRunning = r; send('game-status', r); setActivity(); }
}, 3000);

// ---------- IPC ----------
ipcMain.handle('init', async () => {
  let c = cfg();
  if (!isDota(c.dotaPath)) { const p = detectDota(); if (p) c = setCfg({ dotaPath: p }); }
  gameRunning = await isRunning();
  return { cfg: c, packs: listPacks(), mods: listMods(), game: gameRunning };
});
ipcMain.handle('set-cfg', (_e, patch) => { const c = setCfg(patch); setActivity(); return c; });
ipcMain.handle('choose-dota', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Папка "dota 2 beta"', properties: ['openDirectory'] });
  if (r.canceled) return { ok: false, cfg: cfg() };
  if (!isDota(r.filePaths[0])) return { ok: false, error: 'BAD_PATH', cfg: cfg() };
  return { ok: true, cfg: setCfg({ dotaPath: r.filePaths[0] }) };
});
ipcMain.handle('validate-path', (_e, p) => isDota(p));
ipcMain.handle('packs', () => listPacks());
ipcMain.handle('mods', () => listMods());
ipcMain.handle('set-activity', (_e, a) => { activity = a; setActivity(); });

ipcMain.handle('apply', async (_e, id) => {
  const c = cfg();
  if (!isDota(c.dotaPath)) return { ok: false, error: 'NO_PATH' };
  if (await isRunning()) return { ok: false, error: 'GAME_RUNNING' };
  try {
    const layers = layersOf(U('packs', id));
    if (!layers.length) return { ok: false, error: 'EMPTY' };
    const files = [];
    layers.forEach((l, i) => vpksIn(l).forEach(f => files.push([path.join(l, f), i, f])));
    const mods = path.join(c.dotaPath, 'game', 'dota_mods');
    send('progress', { pct: 5, key: 'p_backup' });
    await fsp.rm(mods, { recursive: true, force: true });
    let n = 0;
    for (const [src, i, f] of files) {
      const dst = layers.length === 1 ? mods : path.join(mods, String(i));
      await fsp.mkdir(dst, { recursive: true });
      await fsp.copyFile(src, path.join(dst, f));
      send('progress', { pct: 10 + Math.round(++n / files.length * 80), key: 'p_copy', file: f });
    }
    send('progress', { pct: 95, key: 'p_patch' });
    patchGameInfo(c.dotaPath, layers.length);
    send('progress', { pct: 100, key: 'p_done' });
    setCfg({ active: id });
    return { ok: true };
  } catch (e) { return { ok: false, error: 'FAIL', detail: e.message }; }
});
ipcMain.handle('restore', async () => {
  const c = cfg();
  if (!isDota(c.dotaPath)) return { ok: false, error: 'NO_PATH' };
  if (await isRunning()) return { ok: false, error: 'GAME_RUNNING' };
  try { await restoreOriginal(c.dotaPath); setCfg({ active: null }); return { ok: true }; }
  catch (e) { return { ok: false, error: 'FAIL', detail: e.message }; }
});

ipcMain.handle('import-pack', async () => {
  const r = await dialog.showOpenDialog(win, { filters: [{ name: 'Pack', extensions: ['zip', 'vpk'] }], properties: ['openFile'] });
  if (r.canceled) return { ok: false };
  const file = r.filePaths[0], base = path.basename(file).replace(/\.[^.]+$/, '');
  const id = `${slug(base)}-${Date.now()}`, folder = U('packs', id);
  try {
    fs.mkdirSync(folder, { recursive: true });
    if (/\.vpk$/i.test(file)) {
      if (!validVpkFile(file)) throw new Error('BAD');
      fs.copyFileSync(file, path.join(folder, 'pak01_dir.vpk'));
      fs.writeFileSync(path.join(folder, 'pack.json'), JSON.stringify({ name: base, description: '', tags: ['import'], items: [], temp: true }));
    } else {
      extractZip(file, folder);
      const m = readJson(path.join(folder, 'pack.json'));
      fs.writeFileSync(path.join(folder, 'pack.json'), JSON.stringify({ name: base, description: '', tags: ['import'], items: [], ...m, temp: true }));
    }
    return { ok: true, id };
  } catch (e) {
    fs.rmSync(folder, { recursive: true, force: true });
    return { ok: false, error: e.message === 'BAD' ? 'BAD' : 'FAIL', detail: e.message };
  }
});
ipcMain.handle('toggle-save', (_e, id) => {
  const f = U('packs', id, 'pack.json'), m = readJson(f);
  m.temp = !m.temp; fs.writeFileSync(f, JSON.stringify(m)); return true;
});
ipcMain.handle('delete-pack', (_e, id) => {
  fs.rmSync(U('packs', id), { recursive: true, force: true });
  if (cfg().active === id) setCfg({ active: null });
  return true;
});
ipcMain.handle('clear-temp', () => { clearTemp(); return listPacks(); });
function clearTemp() { for (const p of listPacks()) if (p.temp && cfg().active !== p.id) fs.rmSync(U('packs', p.id), { recursive: true, force: true }); }

ipcMain.handle('mod-import', async (_e, { name, category }) => {
  const r = await dialog.showOpenDialog(win, { filters: [{ name: 'VPK', extensions: ['vpk'] }], properties: ['openFile'] });
  if (r.canceled) return { ok: false };
  if (!validVpkFile(r.filePaths[0])) return { ok: false, error: 'BAD' };
  const id = `${slug(name)}-${Date.now()}`, f = dir('mods', id);
  fs.copyFileSync(r.filePaths[0], path.join(f, 'pak01_dir.vpk'));
  fs.writeFileSync(path.join(f, 'mod.json'), JSON.stringify({ name, category, description: '' }));
  return { ok: true };
});
ipcMain.handle('mod-delete', (_e, id) => { fs.rmSync(U('mods', id), { recursive: true, force: true }); return true; });
ipcMain.handle('check-build', (_e, ids) => {
  const out = [], seen = {};
  for (const m of listMods().filter(x => ids.includes(x.id))) {
    const s = slotOf(m);
    if (s) { if (seen[s]) out.push(`«${seen[s]}» ⟷ «${m.name}» [${s}]`); else seen[s] = m.name; }
    for (const c of m.conflicts) if (ids.includes(c)) out.push(`«${m.name}» ⟷ ${c}`);
  }
  return out;
});
ipcMain.handle('build-pack', (_e, { name, ids }) => {
  try {
    const mods = ids.map(id => listMods().find(m => m.id === id)).filter(Boolean);
    const id = `custom-${Date.now()}`, folder = dir('packs', id);
    mods.forEach((m, i) => {
      const ld = path.join(folder, `l${String(i).padStart(2, '0')}`); fs.mkdirSync(ld, { recursive: true });
      for (const f of vpksIn(U('mods', m.id))) fs.copyFileSync(path.join(U('mods', m.id), f), path.join(ld, f));
    });
    const first = mods.find(m => m.preview);
    if (first) { try { fs.copyFileSync(new URL(first.preview), path.join(folder, 'preview.png')); } catch {} }
    fs.writeFileSync(path.join(folder, 'pack.json'), JSON.stringify({ name, description: 'Custom build', tags: [...new Set(mods.map(m => m.category))],
      items: mods.map(m => ({ category: m.category, name: m.name, description: m.description })), temp: false }));
    return { ok: true, id };
  } catch (e) { return { ok: false, error: 'FAIL', detail: e.message }; }
});

ipcMain.handle('check-update', async () => {
  if (!app.isPackaged) return { dev: true };
  try {
    const { autoUpdater } = require('electron-updater');
    autoUpdater.autoDownload = false;
    const r = await autoUpdater.checkForUpdates();
    return { available: !!r && r.updateInfo.version !== app.getVersion(), version: r && r.updateInfo.version };
  } catch (e) { return { error: e.message }; }
});
ipcMain.handle('install-update', async () => {
  const { autoUpdater } = require('electron-updater'); // sha512 из latest.yml проверяется автоматически
  autoUpdater.on('download-progress', p => send('progress', { pct: Math.round(p.percent), key: 'p_update' }));
  autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall());
  await autoUpdater.downloadUpdate();
});

// ---------- онлайн-каталог ----------
ipcMain.handle('catalog', async () => {
  const url = cfg().catalogUrl || CATALOG_URL, cache = U('catalog-cache.json');
  const withIds = (j) => (j.packs || []).filter(p => p && p.id && p.name).map(p => ({ ...p, localId: slug(p.id) }));
  if (!url || url.includes('example.com')) return { ok: false, unconfigured: true, packs: withIds(readJson(cache)) };
  try {
    const r = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json(); dir(); fs.writeFileSync(cache, JSON.stringify(j));
    return { ok: true, packs: withIds(j) };
  } catch { return { ok: false, packs: withIds(readJson(cache)) }; }
});
ipcMain.handle('download-pack', async (_e, entry) => {
  if (!entry || !/^https:\/\//i.test(entry.url || '')) return { ok: false, error: 'BAD' };
  const id = slug(entry.id), tmp = U(`dl-${Date.now()}.zip`), folder = U('packs', id);
  try {
    dir();
    const res = await fetch(entry.url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const total = +res.headers.get('content-length') || entry.size || 0;
    const hash = crypto.createHash('sha256'), out = fs.createWriteStream(tmp);
    let got = 0;
    for await (const chunk of res.body) {
      hash.update(chunk); got += chunk.length;
      if (!out.write(chunk)) await new Promise(r => out.once('drain', r));
      send('progress', { pct: total ? Math.min(90, Math.round(got / total * 90)) : 45, key: 'p_download' });
    }
    await new Promise(r => out.end(r));
    if (entry.sha256 && hash.digest('hex') !== String(entry.sha256).toLowerCase()) throw new Error('HASH');
    send('progress', { pct: 95, key: 'p_patch' });
    const oldTemp = readJson(path.join(folder, 'pack.json')).temp;
    fs.rmSync(folder, { recursive: true, force: true });
    fs.mkdirSync(folder, { recursive: true });
    extractZip(tmp, folder);
    const m = readJson(path.join(folder, 'pack.json'));
    fs.writeFileSync(path.join(folder, 'pack.json'), JSON.stringify({
      name: entry.name, description: entry.description || '', tags: entry.tags || [], items: entry.items || [], ...m,
      temp: false, version: String(entry.version || 1), catalogId: entry.id }));
    if (cfg().active === id) setCfg({ active: null }); // файлы игры остались от старой версии — нужно применить заново
    return { ok: true };
  } catch (e) {
    fs.rmSync(folder, { recursive: true, force: true });
    return { ok: false, error: e.message === 'HASH' ? 'HASH' : e.message === 'BAD' ? 'BAD' : 'FAIL', detail: ['HASH', 'BAD'].includes(e.message) ? '' : e.message };
  } finally { fs.rmSync(tmp, { force: true }); }
});
ipcMain.handle('steam-verify', () => shell.openExternal('steam://validate/570'));
ipcMain.handle('open-packs', () => shell.openPath(dir('packs')));

app.whenReady().then(() => {
  win = new BrowserWindow({ width: 1180, height: 740, minWidth: 920, minHeight: 600, backgroundColor: '#0d0d13',
    autoHideMenuBar: true, title: 'Dota 2 Pack Manager', icon: path.join(__dirname, 'assets', 'icon.png'), webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true } });
  win.loadFile('index.html');
  initRpc();
});
app.on('before-quit', clearTemp);
app.on('window-all-closed', () => app.quit());
