# Gala 2026 launch checklist

Manual steps outside the code for **https://tombossabfoundation.org/gala** (The Tombossa B Foundation Fundraising Gala, Saturday, November 28, 2026, Empire Event Center, Dallas). Everything the site shows comes from `frontend/config/gala-2026.js`; editing that file, then committing and deploying, is all a content change needs.

> The gala ships with the decoupling refactor (Vercel frontend). The live site is still the old nginx build, so none of this is public until the cutover in `deploy/RUNBOOK.md`.

## 1. Checkout platform setup

- [ ] **Switch from Donorbox to Zeffy (change provider, paste the new URLs) BEFORE sharing the link publicly, so no tickets are sold on the platform you're leaving.** In the config, set `checkout.provider: 'zeffy'` and replace the URLs. No code changes are needed: the embed height and the "optional tip" FAQ key off `provider`.
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
- [ ] Paste the URLs into `checkout` in the config exactly as the dashboard gives them. Never edit or construct them.
  - `checkout.tickets.embedSrc`: the embed/iframe URL. When set, the page shows the checkout inline, and the tier buttons read "Select tickets below".
  - `checkout.tickets.hostedUrl`: the hosted ticket page. It's the "open in a new tab" fallback, and the only checkout if there's no embed.
  - `checkout.sponsorship.hostedUrl`: optional. Without it, "Become a Sponsor" uses the ticket link, then email.
  - `checkout.donate`: fund-specific donation links. Both point at `/donatenow` until you have separate ones.

  As soon as either ticket URL is set, the site switches from "Tickets go on sale soon" to on sale (unless `sales.openAt` is in the future). Once `embedSrc` is set, the desktop header "Gala Tickets" button and the gold side tab on `/gala` (phones/tablets) open the checkout in a pop-up modal; until then they link to the ticket section.

## 2. Content to fill in

Every `TODO_CONFIRM` in the config. Run `npm run dev` and open `/gala` to see a live checklist panel of the ones still unset. Until a value is filled in, its element is hidden or shows a fallback; nothing placeholder-like is ever shown.

- [ ] End time (`endAt`). The 5:00 PM start is confirmed and published; without an end time, calendar entries are start-only and the page shows just "5:00 PM".
- [ ] **Final confirmation that the scholars will attend and speak.** If not, edit the hero sentence in `copy.intro` ("words from the students your support makes possible", swap in "inspiring speakers") and the Speakers tile.
- [ ] Parking (`faq.parking`; until then: "Parking details coming soon."), venue accessibility (`faq.accessibility`), silent auction access and remote bidding (`faq.auction`; the question is hidden until set).
- [ ] Board approval of the **proposed** wording (shown now): age policy (`faq.ages`), refund policy (`faq.refunds`), dietary answer, the student part of the Student & Youth eligibility answer, the "introduction to the scholar" Scholarship Sponsor benefit.
- [ ] Treasurer/CPA sign-off on the fair market values (`fmvPerGuest`: $40 standard = dinner + 1 drink + entertainment; $60 Champion = standard + 2 drinks). They drive the "Est. tax-deductible" lines and the amounts in the Tax receipts table above.
- [ ] Program print deadline (`tiers.give.programListing.deadline`) and sponsor logo deadline (`sponsorship.logoDeadline`).
- [ ] Speakers, schedule, music, auction items (`program.*`): each block appears once its list or value is set.
- [ ] Goal amount and headline (`goal.*`): the progress bar appears only when both are set. Update `amountRaised` by hand.
- [ ] Fund-specific donate links (`checkout.donate`).
- [ ] Sponsorship packet PDF: put it in `frontend/public/` and set `sponsorship.packetPdf`.
- [ ] Gala imagery: the `/events` card uses a generated graphic (`public/images/gala-2026-card.jpg`). Swap it for a photo or poster at 740×476 if you have one.
- [ ] Late-sales details: `sales.doorSalesAvailable` (door prices are shown while true), `program.dinnerNote` (confirm with the caterer).

To mark a sponsor: add `{ name, level, logo, url }` to `sponsorship.sponsors` (`level` is `community`, `legacy` or `scholarship`; `logo` is a path in `public/`, or omit it). The "Thank You to Our Sponsors" wall appears automatically. For a Scholarship Sponsor, also bump `claimed` on that tier ("1 of 2 remaining", then "Sold out").

## 3. Before announcing

- [ ] Make one real low-cost test purchase and refund it.
- [ ] Check the link preview in the Facebook Sharing Debugger (https://developers.facebook.com/tools/debug/), and click "Scrape Again" after any change to the image or title. Also send the link to yourself on WhatsApp and iMessage.
- [ ] Scan the QR code at print size (`public/images/gala-2026-qr.svg` for print, `.png` at 1024px). It encodes the plain https://tombossabfoundation.org/gala, with no tracking parameters.
- [ ] Confirm https://tombossabfoundation.org/events/gala-2026 redirects to `/gala`.

## 4. After the event

The page switches to its thank-you state on its own after 11:59 PM CST on November 28 (or `endAt`). The header button disappears, the gala card moves to Past Events, and the homepage slide shows "See the Recap" until December 2, then removes itself.

- [ ] Update `goal.amountRaised` (if the goal is shown).
- [ ] Add the sponsor wall (`sponsorship.sponsors`).
- [ ] Optionally add a recap and photos.
- [ ] In December, delete the gala slide from `SliderOne.js` (it already hides itself, but this removes the dead code).

## Regenerating the images

`node frontend/scripts/gala-assets.mjs` (needs network access for Google Fonts) rewrites the OG image, the `/events` card graphic, and both QR files. The OG image deliberately leaves the time off, because link previews are cached for a long time. After replacing it, re-scrape in the Facebook debugger.
