// Использование: node tools/make-catalog.js <BASE_URL> [папка_с_паками=packs-src] [выходная=catalog-dist]
// Каждая подпапка packs-src/<id>/ = один пак: pak01_dir.vpk, pack.json, preview.png, shots/*.png
const fs = require('fs'), path = require('path'), crypto = require('crypto'), archiver = require('archiver');
const [base, src = 'packs-src', out = 'catalog-dist'] = process.argv.slice(2);
if (!base) { console.log('Укажи базовую ссылку, например:\nnode tools/make-catalog.js https://github.com/USER/REPO/releases/download/packs/'); process.exit(1); }
const B = base.endsWith('/') ? base : base + '/';
const sha = (f) => new Promise((res, rej) => { const h = crypto.createHash('sha256'); fs.createReadStream(f).on('data', d => h.update(d)).on('end', () => res(h.digest('hex'))).on('error', rej); });
const imgs = (d) => fs.existsSync(d) ? fs.readdirSync(d).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort() : [];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const packs = [];
  for (const e of fs.readdirSync(src, { withFileTypes: true }).filter(e => e.isDirectory())) {
    const id = e.name, dir = path.join(src, id);
    if (!/^[a-z0-9_-]+$/i.test(id)) { console.log('ПРОПУСК (имя папки только латиница/цифры/-/_):', id); continue; }
    let meta = {}; try { meta = JSON.parse(fs.readFileSync(path.join(dir, 'pack.json'), 'utf8')); } catch {}
    const zip = path.join(out, id + '.zip');
    await new Promise((res, rej) => { const o = fs.createWriteStream(zip), a = archiver('zip', { zlib: { level: 1 } }); o.on('close', res); a.on('error', rej); a.pipe(o); a.directory(dir, false); a.finalize(); });
    const entry = { id, name: meta.name || id, description: meta.description || '', tags: meta.tags || [], items: meta.items || [], version: meta.version || 1,
      url: B + id + '.zip', sha256: await sha(zip), size: fs.statSync(zip).size, preview: null, shots: [] };
    const pv = imgs(dir).find(f => /^preview\./i.test(f));
    if (pv) { const n = `${id}-preview${path.extname(pv)}`; fs.copyFileSync(path.join(dir, pv), path.join(out, n)); entry.preview = B + n; }
    imgs(path.join(dir, 'shots')).forEach((f, i) => { const n = `${id}-shot${i + 1}${path.extname(f)}`; fs.copyFileSync(path.join(dir, 'shots', f), path.join(out, n)); entry.shots.push(B + n); });
    packs.push(entry); console.log('OK', id, (entry.size / 1048576).toFixed(1) + ' MB');
  }
  fs.writeFileSync(path.join(out, 'catalog.json'), JSON.stringify({ version: 1, packs }, null, 2));
  console.log(`\nГотово: ${packs.length} паков. Загрузи ВСЕ файлы из папки "${out}" по ссылке ${B}`);
})();
