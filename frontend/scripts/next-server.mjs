// Shared Next.js server fixture for the test suites and the screenshot harness.
// Serves the PRODUCTION build (frontend/.next) via `next start` on a free port.
//
// Hermeticity: content is baked at BUILD time — run `npm run build` without
// API_BASE_URL and every page renders from the committed fixtures in data/,
// offline and deterministic. This module only runs the already-built app.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const FRONTEND_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(FRONTEND_DIR, '.next');
const NEXT_BIN = path.join(FRONTEND_DIR, 'node_modules', 'next', 'dist', 'bin', 'next');

export function assertBuilt() {
  if (!existsSync(BUILD_DIR)) {
    throw new Error('frontend/.next missing — run "npm run build" first');
  }
}

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

// Start `next start` bound to loopback. Pass port 0 (default) to pick a free one.
// Resolves to { server, port, origin } — same shape the old static server had.
export async function startServer(port = 0) {
  assertBuilt();
  const actualPort = port || (await freePort());
  const origin = `http://127.0.0.1:${actualPort}`;

  const env = { ...process.env };
  delete env.API_BASE_URL; // belt-and-braces; content was already baked at build time

  const child = spawn(process.execPath, [NEXT_BIN, 'start', '-H', '127.0.0.1', '-p', String(actualPort)], {
    cwd: FRONTEND_DIR,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk; });

  const deadline = Date.now() + 30_000;
  let exited = false;
  child.once('exit', () => { exited = true; });
  for (;;) {
    if (exited) throw new Error(`next start exited before becoming ready:\n${stderr}`);
    try {
      const res = await fetch(`${origin}/`);
      if (res.ok) break;
    } catch { /* not up yet */ }
    if (Date.now() > deadline) {
      child.kill();
      throw new Error(`next start not ready after 30s on ${origin}\n${stderr}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  return {
    server: { close: (cb) => { child.kill(); cb?.(); } },
    port: actualPort,
    origin,
  };
}

// Make a Playwright page offline + deterministic: allow only same-origin requests
// (the site's own /css, /images) and abort everything external (Google Fonts,
// Donorbox) so runs don't hang on the network and stay repeatable.
export async function blockExternal(page, origin) {
  await page.route('**', (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort()
  );
}
