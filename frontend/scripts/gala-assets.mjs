// One-off generator for the gala's static images (dev-only; outputs are committed):
//   public/images/gala-2026-og.jpg    1200x630 link-preview image (og:image / twitter:image);
//                                     JPEG keeps it well under WhatsApp's ~300 KB preview limit
//   (public/images/gala-2026-og.png is the earlier PNG version, no longer generated or
//    referenced; it stays so previews cached under its URL keep showing an image)
//   public/images/gala-2026-story.jpg 1080x1920 Instagram story image (the "Share to Instagram Story" button)
//   public/images/gala-2026-card.jpg  740x476  /events card image (2x the 370x238 card)
//   public/images/gala-2026-zeffy-banner.png  1080x1080 checkout-platform banner
//                                     (Zeffy campaign banners are square, < 1200px wide)
//   public/images/gala-2026-qr.svg    QR code for https://tombossabfoundation.org/gala
//   public/images/gala-2026-qr.png    same, 1024px
//
//   node scripts/gala-assets.mjs
//
// The images are HTML rendered by Playwright (already a dev dependency) with the
// real Playfair Display + Poppins web fonts; the script aborts if a font fails to
// load, so a fallback typeface can never be baked in. Needs network (Google Fonts).
// The time is deliberately NOT on the OG image: previews are cached for a long time.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright';
import { gala } from '../config/gala-2026.js';
import { displayName, formatPrice, formatTime, minTicketPrice, timePublished, venueCity } from '../lib/gala.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(__dirname, '../public/images');
const GALA_URL = 'https://tombossabfoundation.org/gala';

const INK = '#120C1C';
const LOGO = `data:image/png;base64,${readFileSync(path.join(IMAGES, 'logo-white.png')).toString('base64')}`;
const MOTIF = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='18' viewBox='0 0 28 18'%3E%3Cg fill='none' stroke='%23C9A45C' stroke-width='1'%3E%3Cpath d='M0 1.5h28M0 16.5h28'/%3E%3Cpath d='M14 4l5 5-5 5-5-5z'/%3E%3C/g%3E%3Cg fill='%23C9A45C'%3E%3Cpath d='M14 7.6l1.4 1.4-1.4 1.4-1.4-1.4z'/%3E%3Ccircle cx='0' cy='9' r='1.3'/%3E%3Ccircle cx='28' cy='9' r='1.3'/%3E%3C/g%3E%3C/svg%3E\")";

const page = (width, height, body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Poppins:wght@500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  body {
    background: ${INK} radial-gradient(ellipse at 50% 45%, rgba(61,33,89,.9) 0%, rgba(43,23,64,.45) 45%, transparent 75%);
    color: #F7F1E6; font-family: 'Poppins', sans-serif;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
    position: relative;
  }
  .band { position: absolute; left: 0; right: 0; height: 18px; background: ${MOTIF} repeat-x center; }
  .display { font-family: 'Playfair Display', serif; font-weight: 700; }
  ${extraCss}
</style></head><body>${body}</body></html>`;

const OG = page(1200, 630, `
  <div class="band" style="top: 28px"></div>
  <img src="${LOGO}" alt="" style="width: 190px; margin-bottom: 26px">
  <h1 class="display" style="font-size: 70px; line-height: 1.08; max-width: 1000px; text-wrap: balance">${displayName()}</h1>
  <p style="margin-top: 30px; font-size: 30px; font-weight: 600; letter-spacing: .04em; color: #E3C98F">${[gala.dateDisplay, venueCity()].filter(Boolean).join(' · ')}</p>
  <p style="margin-top: 16px; font-size: 24px; font-weight: 500; color: #CBBFD6">tombossabfoundation.org/gala</p>
  <div class="band" style="bottom: 28px"></div>`);

// Keeps the lockup clear of the card's date badge (top-left) and sale pill (top-right).
const CARD = page(740, 476, `
  <div class="band" style="top: 22px"></div>
  <p style="margin-top: 30px; font-size: 19px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: #E3C98F">The Tombossa B Foundation</p>
  <p class="display" style="font-size: 76px; line-height: 1.05; margin-top: 12px">Fundraising Gala</p>
  <p class="display" style="font-size: 60px; line-height: 1; margin-top: 4px; color: #C9A45C; letter-spacing: .06em">${gala.year}</p>
  <div class="band" style="bottom: 22px"></div>`);

// Square banner for the checkout platform: name only, no logo (Zeffy shows the organization's own). The event page there already
// shows the date, time, and venue, and buyers are already on it (so no URL either).
const BANNER = page(1080, 1080, `
  <div class="band" style="top: 44px"></div>
  <h1 class="display" style="font-size: 96px; line-height: 1.06; max-width: 920px; text-wrap: balance">${displayName()}</h1>
  <p class="display" style="font-size: 92px; line-height: 1; margin-top: 22px; color: #C9A45C; letter-spacing: .06em">${gala.year}</p>
  ${gala.tagline ? `<p style="margin-top: 28px; font-family: 'Playfair Display', serif; font-style: italic; font-size: 44px; color: #E3C98F">${gala.tagline}</p>` : ''}
  <div class="band" style="bottom: 44px"></div>`);

// Instagram story (9:16). Instagram overlays its own UI on the top ~250px and
// the bottom ~340px, so everything sits between them. The gap above the price
// is room for the Link sticker supporters add; the URL is printed too, so the
// story still points to tickets without one.
const when = [timePublished() && formatTime(gala.startAt), gala.venue.name, venueCity().split(',')[0]].filter(Boolean).join(' · ');
const STORY = page(1080, 1920, `
  <div class="band" style="top: 270px"></div>
  <img src="${LOGO}" alt="" style="width: 230px; margin-bottom: 52px">
  <p class="display" style="font-size: 60px; line-height: 1.2">${gala.copy.titleLead}</p>
  <p class="display" style="font-size: 116px; line-height: 1.05">${gala.shortName}</p>
  <p class="display" style="font-size: 116px; line-height: 1.05; color: #C9A45C; letter-spacing: .06em">${gala.year}</p>
  ${gala.tagline ? `<p style="margin-top: 26px; font-family: 'Playfair Display', serif; font-style: italic; font-size: 50px; color: #E3C98F">${gala.tagline}</p>` : ''}
  <p style="margin-top: 70px; font-size: 44px; font-weight: 600; letter-spacing: .02em; color: #E3C98F">${gala.dateDisplay}</p>
  <p style="margin-top: 14px; font-size: 34px; font-weight: 500; color: #CBBFD6">${when}</p>
  ${minTicketPrice() != null ? `<p style="margin-top: 190px; padding: 22px 54px; border-radius: 999px; background: #C9A45C; color: ${INK}; font-size: 40px; font-weight: 600; letter-spacing: .04em">Tickets from ${formatPrice(minTicketPrice())}</p>` : '<div style="height: 190px"></div>'}
  <p style="margin-top: 26px; font-size: 36px; font-weight: 500; color: #F7F1E6">tombossabfoundation.org/gala</p>
  <div class="band" style="bottom: 340px"></div>`);

async function render(browser, html, width, height, file, type) {
  const tab = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await tab.setContent(html, { waitUntil: 'networkidle' });
  // Load both families explicitly: the browser only fetches fonts a page uses,
  // and not every image uses both (the banner has no Poppins text).
  await tab.evaluate(() => Promise.all([
    document.fonts.load("700 40px 'Playfair Display'"),
    document.fonts.load("600 20px 'Poppins'"),
  ]));
  await tab.evaluate(() => document.fonts.ready);
  const fontsOk = await tab.evaluate(() =>
    document.fonts.check("700 40px 'Playfair Display'") && document.fonts.check("600 20px 'Poppins'")
    && [...document.fonts].some((f) => f.family.includes('Playfair') && f.status === 'loaded'));
  if (!fontsOk) throw new Error(`web fonts did not load for ${file}; check the network and retry`);
  await tab.screenshot({ path: path.join(IMAGES, file), type, ...(type === 'jpeg' && { quality: 88 }) });
  await tab.close();
  console.log(`wrote public/images/${file}`);
}

const browser = await chromium.launch();
try {
  await render(browser, OG, 1200, 630, 'gala-2026-og.jpg', 'jpeg');
  await render(browser, STORY, 1080, 1920, 'gala-2026-story.jpg', 'jpeg');
  await render(browser, CARD, 740, 476, 'gala-2026-card.jpg', 'jpeg');
  await render(browser, BANNER, 1080, 1080, 'gala-2026-zeffy-banner.png', 'png');
} finally {
  await browser.close();
}

// QR: high error correction, ink on white, 4-module quiet zone. Plain URL (no
// UTM parameters: the site has no analytics of its own).
const QR_OPTIONS = { errorCorrectionLevel: 'H', margin: 4, color: { dark: INK, light: '#FFFFFF' } };
await QRCode.toFile(path.join(IMAGES, 'gala-2026-qr.svg'), GALA_URL, { ...QR_OPTIONS, type: 'svg' });
await QRCode.toFile(path.join(IMAGES, 'gala-2026-qr.png'), GALA_URL, { ...QR_OPTIONS, type: 'png', width: 1024 });
console.log('wrote public/images/gala-2026-qr.svg and gala-2026-qr.png');
