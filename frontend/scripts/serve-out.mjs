// Tiny static file server for the exported site (frontend/out).
// Shared by the screenshot harness (shoot.mjs) and the asset tests
// (images.test.mjs) so both serve absolute /css, /images paths the same way.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUT_DIR = path.resolve(__dirname, '../out');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject', '.pdf': 'application/pdf',
};

// Map a URL path to a file inside outDir, honouring clean URLs (/about -> about.html)
// and directory indexes. Returns null for misses or any path that escapes outDir.
export function resolveFile(urlPath, outDir = OUT_DIR) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.resolve(outDir, `.${p}`);
  const candidates = [
    file,
    file + '.html',        // clean URL -> .html
    path.join(file, 'index.html'),
  ];
  for (const candidate of candidates) {
    const rel = path.relative(outDir, candidate);
    if (rel.startsWith('..') || path.isAbsolute(rel)) continue;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export function createServer(outDir = OUT_DIR) {
  return http.createServer(async (req, res) => {
    const file = resolveFile(req.url, outDir);
    if (!file) { res.writeHead(404); res.end('404'); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(500); res.end('500'); }
  });
}

// Start the server bound to loopback. Pass port 0 to let the OS pick a free one.
// Resolves to { server, port, origin }.
export async function startServer(outDir = OUT_DIR, port = 0) {
  const server = createServer(outDir);
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  const actualPort = server.address().port;
  return { server, port: actualPort, origin: `http://127.0.0.1:${actualPort}` };
}

// Make a Playwright page offline + deterministic: allow only same-origin requests
// (the exported site's own /css, /images) and abort everything external (Google
// Fonts, Donorbox) so runs don't hang on the network and stay repeatable.
export async function blockExternal(page, origin) {
  await page.route('**', (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort()
  );
}
