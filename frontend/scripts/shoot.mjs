// Visual screenshot harness for the production build.
//
// Usage:
//   npm run build                         # produce frontend/.next
//   node scripts/shoot.mjs <label> [paths...]
//
// Serves the build via `next start` (scripts/next-server.mjs) and screenshots
// each path at four viewports that exercise all three responsive image branches
// (mobile <=1024, tablet 1025-1366, desktop >1366).
//
// Output: <SHOT_OUT or ./.shots>/<label>/<page>__<viewport>.png
//
// Example: node scripts/shoot.mjs before / /about /sponsor
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { startServer, blockExternal } from './next-server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

async function main() {
  const { stop, origin } = await startServer(PORT);
  console.log(`serving production build at ${origin}`);

  const browser = await chromium.launch();
  const results = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
    });
    const page = await ctx.newPage();
    await blockExternal(page, origin);
    for (const route of pages) {
      const name = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
      const dir = path.join(SHOT_BASE, label);
      await mkdir(dir, { recursive: true });
      const dest = path.join(dir, `${name}__${vp.name}.png`);
      await page.goto(`${origin}${route}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000); // let the first slide's background paint
      await page.screenshot({ path: dest }); // viewport (above the fold) — where hero fill shows
      results.push(dest);
    }
    await ctx.close();
  }
  await browser.close();
  stop();
  console.log(`\nwrote ${results.length} screenshots to ${path.join(SHOT_BASE, label)}`);
  results.forEach((r) => console.log('  ' + r));
}

main().catch((e) => { console.error(e); process.exit(1); });
