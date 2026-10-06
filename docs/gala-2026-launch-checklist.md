# Gala 2026 launch checklist

Manual steps outside the code for **https://tombossabfoundation.org/gala** (The Tombossa B Foundation Fundraising Gala, Saturday, November 28, 2026, Empire Event Center, Dallas). Everything the site shows comes from `frontend/config/gala-2026.js`; editing that file, then committing and deploying, is all a content change needs.

> The gala ships with the decoupling refactor (Vercel frontend). The live site is still the old nginx build, so none of this is public until the cutover in `deploy/RUNBOOK.md`.

## 1. Checkout platform setup

- [x] **Switched to Zeffy** (2026-10-04): `checkout.provider` is `'zeffy'` and `checkout.tickets.modalUrl` is the form's modal link. The site is now **on sale**: every ticket button opens the Zeffy form in a pop-up. Nothing was sold on Donorbox.
- [ ] **Update the Champion description in Zeffy**: it still promises "a pre-program reception with our scholars", which the site no longer offers.
- [ ] **End time**: Zeffy shows 5:00 PM - 10:00 PM, but the site has no end time (`endAt`). Set `endAt: '2026-11-28T22:00:00-06:00'` if 10 PM is right, so calendar entries and search listings show it too.
- [ ] Optional: paste the form's public page link into `checkout.tickets.hostedUrl` (Zeffy dashboard, share link). It adds an "open in a new tab" fallback.
- [ ] Create these ticket types:

  | Ticket type | Price | Notes |
  |---|---|---|
  | Student & Youth | $30 | Current students and guests 17 and younger |
  | General Admission | $55 | |
  | Champion | $85 | |
  | Community Sponsor | $500 | 5 seats |
  | Legacy Sponsor | $1,000 | 8 seats |
  | Scholarship Sponsor | $2,500 | Quantity limit 2 |
  | Sponsor a Seat | $55 | |

  Door tickets are **not** sold online.
- [ ] Sales end date: **Saturday, November 28, 2026, 12:00 PM CST** (noon on gala day), matching `sales.onlineCloseAt`. Change both together if it moves. Sales now run into the morning of the event, so give the caterer a projected headcount earlier and the final number that morning.
- [ ] Custom checkout questions:
  - Each guest's full name.
  - Dietary needs: none / vegan-fasting / vegetarian / allergies (describe).
  - For sponsors: recognition name and logo (or "we'll email you").
- [ ] Tickets are **QR codes**: turn on the platform's QR-code tickets and its check-in (scanner) app. Guests check in by scanning; if someone can't find their QR code, look them up by name. No ID is needed at the door (only the bar checks ID, for 21+).
- [ ] Tax receipts: enter each ticket type's tax-deductible (eligible) amount in Zeffy. These come from `fmvPerGuest` ($40 standard, $60 Champion) and match the page's estimates:

  | Ticket type | Price | Tax-deductible |
  |---|---|---|
  | Student & Youth | $30 | $0 |
  | General Admission | $55 | $15 |
  | Champion | $85 | $25 |
  | Community Sponsor | $500 | $300 |
  | Legacy Sponsor | $1,000 | $520 |
  | Scholarship Sponsor | $2,500 | $2,020 |
  | Sponsor a Seat | $55 | $55 (fully deductible) |

  Door tickets (sold in person): Student & Youth $0 · General Admission $25 · Champion $35.

  > These values need **treasurer/CPA sign-off** before sales open, and must **not change once sales open** (receipts already issued are based on them).
- [ ] Confirmation email copy: date, dress code (cocktail attire), what to bring (just the QR code ticket, on a phone or printed; ID only for drinks if 21+), and contact (contact@tombossabfoundation.org · 214 208 3936).
- [ ] Checkout URLs in `checkout` must be pasted exactly as the dashboard gives them. Never edit or construct them.
  - `checkout.tickets.modalUrl`: Zeffy's modal link (set). Ticket, sponsor, and Sponsor a Seat buttons, the desktop header button, and the `/gala` side tab open it in a pop-up. The site does this itself, so **don't add Zeffy's embed script** to the site: it only hooks up buttons present on the first page load (they'd stop working after navigating) and loads the form on every page view.
  - `checkout.tickets.embedSrc`: an inline embed URL, if you'd ever rather show the form on the page.
  - `checkout.tickets.hostedUrl`: the hosted ticket page. It's the "open in a new tab" fallback, and the only checkout if there's no embed.
  - `checkout.sponsorship.hostedUrl`: optional. Without it, "Become a Sponsor" uses the ticket link, then email.
  - `checkout.donationForm`: the Zeffy donation form embedded in the "Can't Make It?" section (set). Tip: set its theme color in Zeffy to match the gala page (it defaults to Zeffy red).

  With any ticket URL set, the site is on sale (unless `sales.openAt` is in the future); with none, it shows "Tickets go on sale soon" and the buttons link to the ticket section.

## 2. Content to fill in

Every `TODO_CONFIRM` in the config. Run `npm run dev` and open `/gala` to see a live checklist panel of the ones still unset. Until a value is filled in, its element is hidden or shows a fallback; nothing placeholder-like is ever shown.

- [ ] End time (`endAt`). The 5:00 PM start is confirmed and published; without an end time, calendar entries are start-only and the page shows just "5:00 PM".
- [ ] **Final confirmation that the scholars will attend and speak.** If not, edit the hero sentence in `copy.intro` ("words from the students your support makes possible", swap in "inspiring speakers") and the Speakers tile.
- [ ] Venue accessibility (`faq.accessibility`), silent auction access and remote bidding (`faq.auction`; the question is hidden until set).
- [ ] Board approval of the **proposed** wording (shown now): age policy (`faq.ages`), refund policy (`faq.refunds`), the "introduction to the scholar" Scholarship Sponsor benefit.
- [ ] Treasurer/CPA sign-off on the fair market values (`fmvPerGuest`: $40 standard = dinner + 1 drink + entertainment; $60 Champion = standard + 2 drinks). They drive the "Est. tax-deductible" lines and the amounts in the Tax receipts table above.
- [ ] Program print deadline (`tiers.give.programListing.deadline`) and sponsor logo deadline (`sponsorship.logoDeadline`).
- [ ] Speakers, schedule, music, auction items (`program.*`): each block appears once its list or value is set.
- [ ] Goal amount and headline (`goal.*`): the progress bar appears only when both are set. Update `amountRaised` by hand.
- [ ] Sponsorship packet PDF: put it in `frontend/public/` and set `sponsorship.packetPdf`.
- [ ] Gala imagery: the `/events` card uses a generated graphic (`public/images/gala-2026-card.jpg`). Swap it for a photo or poster at 740×476 if you have one.
- [ ] Late-sales details: `sales.doorSalesAvailable` (door prices are shown while true), `program.dinnerNote` (confirm with the caterer).

To mark a sponsor: add `{ name, level, logo, url }` to `sponsorship.sponsors` (`level` is `community`, `legacy` or `scholarship`; `logo` is a path in `public/`, or omit it). The "Thank You to Our Sponsors" wall appears automatically. For a Scholarship Sponsor, also bump `claimed` on that tier ("1 of 2 remaining", then "Sold out").

## 3. Before announcing

- [ ] Make one real low-cost test purchase and refund it.
- [ ] Check the link preview in the Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/), and click "Scrape Again" after any change to the image or title. Also send the link to yourself on WhatsApp and iMessage.
- [ ] Scan the QR code at print size (`public/images/gala-2026-qr.svg` for print, `.png` at 1024px). It encodes the plain https://tombossabfoundation.org/gala, with no tracking parameters.
- [ ] Confirm https://tombossabfoundation.org/events/gala-2026 redirects to `/gala`.
- [ ] On a real **iPhone (Safari)** and a real **Android phone (Chrome)**, tap **Share to Instagram Story** on `/gala`: the share menu opens with the story image; choose Instagram, then Story, and check the image fills the story. Add a Link sticker and paste (the button copies https://tombossabfoundation.org/gala). Automated tests cover the page side, but only a real phone shows the share menu and Instagram's own screens.

## 4. After the event

The page switches to its thank-you state on its own after 11:59 PM CST on November 28 (or `endAt`). The header button disappears, the gala card moves to Past Events, and the homepage slide shows "See the Recap" until December 2, then removes itself.

- [ ] Update `goal.amountRaised` (if the goal is shown).
- [ ] Add the sponsor wall (`sponsorship.sponsors`).
- [ ] Optionally add a recap and photos.
- [ ] In December, delete the gala slide from `SliderOne.js` (it already hides itself, but this removes the dead code).

## Regenerating the images

`node frontend/scripts/gala-assets.mjs` (needs network access for Google Fonts) rewrites the OG image, the Instagram story image, the `/events` card graphic, the Zeffy banner, and both QR files. Images whose inputs didn't change come out byte-for-byte identical. The story image shows the date, time, venue and the lowest ticket price from the config, so regenerate it after changing any of those. The OG image deliberately leaves the time off, because link previews are cached for a long time. After replacing it, re-scrape in the Facebook debugger.
