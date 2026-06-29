// Visual screenshot harness for the static export.
//
// Usage:
//   npm run build                         # produce frontend/out
//   node scripts/shoot.mjs <label> [paths...]
//
// Serves frontend/out over a tiny local HTTP server (so absolute /css, /images
// paths resolve) and screenshots each path at four viewports that exercise all
// three responsive image branches (mobile <=1024, tablet 1025-1366, desktop >1366).
//
// Output: <SHOT_OUT or ./.shots>/<label>/<page>__<viewport>.png
//
// Example: node scripts/shoot.mjs before / /about /sponsor
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../out');
const SHOT_BASE = process.env.SHOT_OUT || path.resolve(__dirname, '../.shots');
const PORT = Number(process.env.SHOT_PORT || 5099);

const label = process.argv[2] || 'shot';
const pages = process.argv.slice(3).length ? process.argv.slice(3) : ['/'];

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844,  dsf: 2 },  // -> mobile image
  { name: 'tablet',  width: 768,  height: 1024, dsf: 2 },  // -> mobile image (common iPad)
  { name: 'laptop',  width: 1280, height: 800,  dsf: 1 },  // -> tablet image
  { name: 'desktop', width: 1600, height: 900,  dsf: 1 },  // -> desktop image
];

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject', '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(OUT_DIR, p);
  if (existsSync(file) && statSync(file).isFile()) return file;
  if (existsSync(file + '.html')) return file + '.html';        // clean URL -> .html
  if (existsSync(path.join(file, 'index.html'))) return path.join(file, 'index.html');
  return null;
}

const server = http.createServer(async (req, res) => {
  const file = resolveFile(req.url);
  if (!file) { res.writeHead(404); res.end('404'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(500); res.end('500'); }
});

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(`No ${OUT_DIR}. Run "npm run build" first.`);
    process.exit(1);
  }
  await new Promise((r) => server.listen(PORT, r));
  console.log(`serving ${OUT_DIR} at http://localhost:${PORT}`);

  const browser = await chromium.launch();
  const results = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
    });
    const page = await ctx.newPage();
    // Deterministic + offline: only allow same-origin assets; abort external
    // (Google Fonts, Donorbox) so runs don't hang on the network and are repeatable.
    await page.route('**', (r) => {
      r.request().url().startsWith(`http://localhost:${PORT}`) ? r.continue() : r.abort();
    });
    for (const route of pages) {
      const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
      const dir = path.join(SHOT_BASE, label);
      await mkdir(dir, { recursive: true });
      const dest = path.join(dir, `${name}__${vp.name}.png`);
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000); // let the first slide's background paint
      await page.screenshot({ path: dest }); // viewport (above the fold) — where hero fill shows
      results.push(dest);
    }
    await ctx.close();
  }
  await browser.close();
  server.close();
  console.log(`\nwrote ${results.length} screenshots to ${path.join(SHOT_BASE, label)}`);
  results.forEach((r) => console.log('  ' + r));
}

main().catch((e) => { console.error(e); server.close(); process.exit(1); });
