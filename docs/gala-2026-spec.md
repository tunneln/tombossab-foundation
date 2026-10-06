# Build: Tombossa B Foundation Gala 2026 — Event Page & Ticket Portal

You're working in the codebase for **tombossabfoundation.org**, the website of the Tombossa B Foundation, a 501(c)(3) providing scholarships and mental wellness support to Eritrean and East African youth. The founder and VP, Noel, is the site's sole engineer. You're building the page that will sell tickets and sponsorships for the foundation's biggest event of the year. It will be shared widely by link, QR code, WhatsApp, and social media, so correctness, polish, and link previews matter more than speed.

Read this whole document before doing anything.

---

## Ground rules

1. **Recon first, then stop.** Complete Phase 0, report back, and wait for Noel's approval before writing code.
2. **Never render placeholder text publicly.** Every unconfirmed value is `null` in config (marked `// TODO_CONFIRM`). The UI must hide that element or show a graceful fallback ("Venue to be announced"). The strings `TODO`, `null`, `undefined`, `[X]`, or empty brackets must never appear on the live page.
3. **One source of truth.** Event details, prices, copy, dates, and links live in a single config file. No price or date is hardcoded anywhere else, including the homepage slide and the events page.
4. **Use the copy in this document verbatim.** Don't invent facts, numbers, testimonials, impact claims, sponsor names, or speakers. If something you need isn't here or in the existing site data, leave it `null` and list it in your final report.
5. **Don't process payments.** Checkout happens entirely on a third-party nonprofit platform (Zeffy or Donorbox) via embed or link. No card data, no new backend endpoints, no attendee PII stored on our servers. Leave the Spring Boot backend untouched.
6. **Don't break anything.** Existing slides, pages, and styles must look and behave exactly as before. Scope all gala styles so they can't leak into global CSS.
7. **Git hygiene.** Work on a new branch `gala-2026`. Commit per phase with clear messages. Don't push, merge, or deploy.
8. **Dependencies.** Ask before adding any runtime dependency. Small dev-only tools for one-off asset scripts (QR code, image rendering) are fine if you name them in your plan.
9. **No secrets.** Embed URLs and form slugs are public by nature; nothing else sensitive goes in the repo.

---

## Event facts (confirmed)

- **Event:** The Tombossa B Foundation Gala 2026
- **Date:** Saturday, November 28, 2026 (the Saturday after Thanksgiving)
- **Time zone:** America/Chicago. **Late November is CST, UTC−06:00** (DST ends November 1, 2026). Use `-06:00` offsets for all event timestamps.
- **Includes:** dinner, drinks, music, silent auction, speakers
- **Significance:** Almost exactly two years after the foundation's inauguration and memorial for Tombossa Negusse on November 30, 2024
- **Expected attendance:** 100–200
- **Dress code:** Cocktail attire
- **Scholarships:** $2,500–$5,000 per student per year
- **Foundation contact:** contact@tombossabfoundation.org · 214 208 3936 · 7522 Overdale Drive, Dallas, TX 75254 (organization address, *not* the venue)
- **Existing donate page:** `/donatenow` (Donorbox)
- **Existing scholar content:** the Award Recipients page (`/award-recipients`) is data-driven. Reuse its data source for the scholar spotlight; don't duplicate it.

---

## Phase 0 — Recon and plan (read-only; stop after this)

Investigate and report concisely on:

1. **Stack:** Next.js version and router (expected: 13, pages router), JS or TS, styling approach (CSS modules, global template CSS, Tailwind, Bootstrap?), and font loading.
2. **Homepage hero slider:**
   - Which component and library it uses, and how slides are defined (data array vs. JSX).
   - Autoplay and timing settings.
   - It currently has three slides: mission, September newsletter, scholars.
3. **Events page (`/events`):**
   - How events are defined (data file vs. hardcoded JSX).
   - The card component and its date-badge format (currently renders like `27Jun 2026`).
   - Whether events are split by date. Currently it shows only a "Past Events" section.
4. **Event detail pages:** whether `/events/[slug]` is a dynamic route fed by data or a set of individual pages.
5. **Award recipients data source:** file path and shape (name, school, major, photo, quote).
6. **`<head>` and meta handling — important.** On the live site, *every page* serves the same OG tags: generic title and description, `og:url` set to the homepage, and `twitter:image` as a relative path. If unchanged, links to the gala page will preview as the homepage on Facebook, WhatsApp, and iMessage. Find where these tags are set (Layout component? `_app`? `_document`?) and how a page can override them. Next's `<Head>` dedupes by `key`; tags set in `_document` can't be overridden per page.
7. **Build and deploy model:**
   - Check `next.config.js` for `output: 'export'`, which disables Next redirects and image optimization.
   - Check how the app is served (expected: `next start` behind nginx on Lightsail).
   - Report whether nginx config lives in the repo and whether it sets a `Content-Security-Policy`. If it does, it will need `frame-src` for the checkout embed.
8. **Other:** whether a `sitemap.xml` or `robots.txt` exists, whether any analytics is installed, and where images live (`/public/images`?).

Then propose:

- A file-by-file plan, including a decision on fixing per-page meta in the minimal, safest way.
- Any deviations from this spec, with reasons.
- Any questions.

**Wait for approval.**

---

## Deliverables overview

1. **Gala config:** a single source of truth (Section 1).
2. **`/gala` page:** a distinctive event page that doubles as the ticket portal (Section 2).
3. **Homepage hero:** a new **first** slide promoting the gala (Section 3).
4. **`/events` page:** a new "Upcoming Events" section with a featured gala card (Section 4).
5. **Sharing and SEO:**
   - Per-page meta and a custom OG image.
   - Event structured data.
   - Calendar links, share buttons, and a QR code.
   - Sitemap entry and a redirect from `/events/gala-2026` (Section 5).
6. **Launch checklist doc** for Noel's manual steps (Section 8).

**Canonical URL: `https://tombossabfoundation.org/gala`.** This is the link printed on flyers and encoded in QR codes, so it must never change. Add a permanent redirect from `/events/gala-2026` to `/gala`. Use `next.config.js` redirects if the app runs on `next start`; if it's a static export, propose an nginx rule instead.

---

## 1. Gala config (single source of truth)

Create something like `data/gala2026.js` (or `.ts` if the repo uses TS; match existing conventions and data-file locations). Use this content, adapting the shape to the codebase's conventions while keeping every value:

```js
export const gala = {
  canonicalUrl: 'https://tombossabfoundation.org/gala',
  name: 'The Tombossa B Foundation Gala',
  year: 2026,
  tagline: 'Two Years of Legacy', // TODO_CONFIRM (proposed; hide if null)
  dateDisplay: 'Saturday, November 28, 2026',
  timezone: 'America/Chicago',
  startAt: null, // TODO_CONFIRM e.g. '2026-11-28T18:00:00-06:00'
  endAt: null,   // TODO_CONFIRM e.g. '2026-11-28T22:00:00-06:00'
  venue: {
    name: null,       // TODO_CONFIRM
    street: null,     // TODO_CONFIRM
    city: null,       // TODO_CONFIRM
    region: 'TX',
    postalCode: null, // TODO_CONFIRM
  },
  dressCode: {
    label: 'Cocktail attire',
    detail:
      'Think suits, cocktail dresses, or formal wear. Traditional Eritrean and East African attire is warmly welcomed.',
  },

  sales: {
    openAt: null, // null = on sale as soon as checkout links are configured
    onlineCloseAt: '2026-11-23T23:59:00-06:00', // TODO_CONFIRM (caterer headcount deadline)
    doorSalesAvailable: true, // TODO_CONFIRM; door tickets are limited, never sold online
  },

  // Fair market value of goods/services per guest, for tax disclosure. Set by the treasurer.
  fmvPerGuest: {
    standard: null, // TODO_CONFIRM dinner + 1 drink (applies to Student and GA)
    champion: null, // TODO_CONFIRM dinner + 3 drinks + reception
  },
  ein: null, // TODO_CONFIRM shown in the tax note if set

  goal: {
    // Hide the whole progress section unless both amountGoal and headline are set.
    headline: null, // TODO_CONFIRM e.g. 'Help us fund 4 semester scholarships'
    amountGoal: null, // TODO_CONFIRM
    amountRaised: 0, // updated manually by Noel
  },

  tiers: {
    attend: [
      {
        id: 'student',
        name: 'Student',
        price: 30,
        doorPrice: 40,
        fmvKey: 'standard',
        includes: ['Dinner', 'The full program', 'One drink ticket'],
        tagline: "Because the future we're building should be in the room.",
        note: 'Valid student ID required at check-in.',
      },
      {
        id: 'ga',
        name: 'General Admission',
        price: 55,
        doorPrice: 65,
        fmvKey: 'standard',
        includes: ['Dinner', 'One drink ticket', 'The full program', 'Silent auction access'],
      },
      {
        id: 'champion',
        name: 'Champion',
        price: 85,
        doorPrice: 95,
        fmvKey: 'champion',
        featured: true,
        badge: 'The full experience',
        includes: [
          'Everything in General Admission',
          'Reserved seating near the stage',
          'Pre-program reception with our scholars and the Negusse family', // TODO_CONFIRM scholars attending
          'Two additional drink tickets',
          "Your name in the evening's program",
        ],
        tagline: 'Includes a gift to the Future Scholar Fund.',
      },
    ],

    sponsor: [
      {
        id: 'community',
        name: 'Community Sponsor',
        price: 500,
        seats: 5,
        seatType: 'standard',
        benefits: ['Name on table signage', 'Recognition on our website and social media'],
        seatsLine: 'Includes a reserved table for 5.',
      },
      {
        id: 'legacy',
        name: 'Legacy Sponsor',
        price: 1000,
        seats: 8,
        seatType: 'champion',
        benefits: [
          'Logo on event slides and the printed program',
          'Recognition from the stage',
          'A feature on our website and social media',
        ],
        seatsLine: 'Includes a reserved table for 8 with Champion benefits.',
      },
      {
        id: 'scholarship',
        name: 'Scholarship Sponsor',
        price: 2500,
        seats: 8,
        seatType: 'champion',
        limit: 2,
        claimed: 0, // updated manually; show "Sold out" when claimed >= limit
        badge: 'Limited to 2',
        lead: "Funds one student's scholarship for a full semester.",
        benefits: [
          'Top billing at the event and online',
          'An introduction to the scholar your gift supports', // TODO_CONFIRM board/scholar approval
        ],
        seatsLine: 'Includes a reserved table for 8 with Champion benefits.',
      },
    ],

    give: {
      sponsorSeat: {
        name: 'Sponsor a Seat',
        price: 55,
        description: 'Give a student or family a seat at the table.',
      },
      funds: [
        { id: 'future-scholar', name: 'Future Scholar Fund' },
        { id: 'mental-wellness', name: 'Mental Wellness Fund' },
      ],
      presetAmounts: [50, 100, 250, 500], // plus "Other"
      impactLine: "Ten gifts of $250 fund one student's semester.",
      programListing: {
        threshold: 100,
        deadline: null, // TODO_CONFIRM program print deadline, e.g. 'November 20'
      },
    },
  },

  sponsorship: {
    logoDeadline: null, // TODO_CONFIRM e.g. 'November 14'
    packetPdf: null,    // TODO_CONFIRM path in /public; hide link if null
    sponsors: [],       // { name, level, logo, url } — hide sponsor wall while empty
  },

  checkout: {
    provider: null, // TODO_CONFIRM 'zeffy' | 'donorbox'
    // Paste URLs exactly as given by the platform dashboard. NEVER construct or guess them.
    tickets:     { hostedUrl: null, embedSrc: null }, // all ticket + sponsorship + Sponsor a Seat types
    sponsorship: { hostedUrl: null }, // falls back to tickets.hostedUrl, then mailto
    donate: {
      'future-scholar':  '/donatenow', // replace with fund-specific links when available
      'mental-wellness': '/donatenow',
    },
  },

  program: {
    schedule: [],   // { time, label } — hide schedule section while empty. TODO_CONFIRM
    speakers: [],   // { name, role } — hide while empty. TODO_CONFIRM
    music: null,    // TODO_CONFIRM performer/DJ name
    auctionPreview: [], // { title, description, image } — hide while empty
    dinnerNote: 'With vegan and fasting-friendly options.', // TODO_CONFIRM with caterer
  },
};
```

**Helpers (in the same module or next to it):**

- **Tier deductible:**
  - Individual tiers: `max(0, price − fmvPerGuest[fmvKey])`.
  - Sponsor tiers: `max(0, price − seats × fmvPerGuest[seatType])`.
  - Return `null` if the relevant FMV is unset, so the UI hides the line.
  - Student's FMV may exceed its price. Clamp at 0, never show a negative.
- **`getGalaState(now)`:** returns one of the values below.

| State | When |
|---|---|
| `coming_soon` | No checkout link configured, or before `openAt` |
| `on_sale` | Normal selling period |
| `online_closed` | After `onlineCloseAt` and before the event ends |
| `past` | After `endAt`; if `endAt` is null, after 11:59 PM CST on Nov 28 |

- **Dev-only state override:** a `?galaState=past` query parameter (any state) that works only when `process.env.NODE_ENV !== 'production'`.
- **Dev-only checklist:** in development, render a small floating panel on `/gala` listing every unconfirmed (`null` / `TODO_CONFIRM`) field. It must never render in production.

**Date logic and hydration:** if the site is statically generated or exported, state must be computed **client-side after mount**, or it gets frozen at build time. Render a stable server default (`on_sale` if checkout is configured, otherwise `coming_soon`) and update in `useEffect` to avoid hydration mismatches. The same applies to any countdown.

---

## 2. The `/gala` page

### Visual direction: "semi-unique"

This page should feel like an invitation: unmistakably special, yet clearly part of the same official site. Keep the site's normal header and footer; trust matters on a page that takes payments. Inside the page, switch to a dedicated gala palette scoped to a wrapper (e.g., CSS module or `.gala-theme` with custom properties).

**Palette.** Deep aubergine and champagne gold. The plum ties to the site's existing purple (the Donorbox wall uses `#7c3bae`; verify the brand purple in CSS) while gold signals the occasion.

| Token | Hex | Use |
|---|---|---|
| `--gala-ink` | `#120C1C` | Hero and darkest backgrounds |
| `--gala-plum` | `#2B1740` | Dark section backgrounds |
| `--gala-plum-raised` | `#3D2159` | Cards on dark backgrounds |
| `--gala-gold` | `#C9A45C` | Primary buttons, borders, rules, accents |
| `--gala-gold-soft` | `#E3C98F` | Hover states, small accent text on dark |
| `--gala-ivory` | `#F7F1E6` | Light section backgrounds |
| `--gala-text-dark` | `#1F1629` | Body text on ivory |
| `--gala-text-light` | `#F7F1E6` | Body text on dark |
| `--gala-muted-light` | `#CBBFD6` | Secondary text on dark |

**Contrast rules (WCAG AA):**

- Gold on ink is about 8:1; fine for text and buttons.
- Primary buttons use **gold background with ink text**.
- **Never use gold for text on ivory** (about 2:1, fails). On ivory, gold is decorative only (rules, borders, icons); text uses `--gala-text-dark`.
- Every section sets an explicit background color.

**Rhythm.** Alternate dark and light sections:

| Section | Background |
|---|---|
| Hero | Ink |
| Story | Ivory |
| Evening | Plum |
| Scholars | Ivory |
| Tickets | Ink |
| Sponsor | Plum |
| Give | Ivory |
| FAQ | Ivory, or a slightly darker ivory variant |
| Closing | Ink |

**Typography:**

- Display serif for headings via `next/font/google`, e.g., **Cormorant Garamond** (600/700) or **Playfair Display**. Use it only at ≥ 28px; it's thin at small sizes.
- Keep the site's existing body font for everything else.
- Small-caps or letter-spaced uppercase for eyebrows and labels.

**Heritage motif (optional, tasteful):**

- A thin, abstract geometric border band in gold, inspired by the woven borders of traditional East African textiles. Implement it as a lightweight inline SVG or CSS pattern.
- Use it as a divider under the hero and around the featured tier only.
- Keep it simple and abstract. Don't replicate any specific design or use flag colors. If it looks kitschy, drop it and tell Noel.

**Motion:**

- Subtle only: fade/rise on scroll and a soft shimmer on the gold rule.
- Everything off under `prefers-reduced-motion`.

**The design must not depend on photos we don't have yet.** It should look complete with typography, palette, and motif alone. If you use existing site images (e.g., inauguration or gallery photos), list which ones so Noel can approve.

### Page sections (in order, with copy)

Use one `<h1>`. Give every section an `id` for anchor links.

#### 2.1 Hero (`#top`) — ink background

- **H1:** `The Tombossa B Foundation Gala`
- **Under H1:**
  - The year, `2026`, in large gold display numerals or as part of the lockup.
  - The tagline, if set: `Two Years of Legacy`.
- **Details row** (icon + text chips):
  - Date: `Saturday, November 28, 2026`
  - Time: formatted from `startAt` in CST, e.g., "6:00 PM"; fallback `Time to be announced`
  - Venue: name and city; fallback `Venue to be announced`
  - Dress code: `Cocktail attire`
- **Intro copy:**

  > Two years ago, we gathered to honor Tombossa Negusse and launch a foundation in his name. This year, we celebrate what that legacy has already built: scholars like Mattania and Elim, and a community investing in the next generation of Eritrean and East African youth.
  >
  > Join us for an evening of dinner, music, a silent auction, and words from the students your support makes possible. Every ticket helps fund scholarships and mental wellness programs.

  (The phrase "words from the students your support makes possible" is `TODO_CONFIRM` that scholars will speak. If `program.speakers` stays empty at launch, Noel may swap it for "inspiring speakers." Make this sentence easy to edit in config.)
- **CTAs:**
  - Primary: `Get Tickets` → `#tickets`
  - Secondary (outline): `Become a Sponsor` → `#sponsor`
  - Text link: `Can't make it? Give here` → `#give`
- **Countdown:** optional, client-only, shown only in `on_sale`/`online_closed`. Format: "57 days to go". Keep it subtle.
- Gold motif divider at the bottom.

#### 2.2 Why we gather (`#story`) — ivory

- **Heading:** `Why We Gather`
- **Copy:**

  > Tombossa Negusse fled war in Eritrea as a teenager, earned his degrees in Oklahoma, and built a life in Dallas defined by family, enterprise, and generosity. He and his wife, Birkiti, dreamed of opening doors for young people in our community. Two years ago, we launched this foundation to carry that dream forward. Today, our first scholars are in college, and we're just getting started.

- **Link:** `Read Tombossa's story` → `/about`

#### 2.3 The evening (`#evening`) — plum

- **Heading:** `The Evening`
- **Four feature tiles** (icon, title, one line):
  - **Dinner:** `A full dinner to share with our community.` Append `program.dinnerNote` if set.
  - **Music:** `Music throughout the evening.` Name the performer if `program.music` is set.
  - **Silent Auction:** `Bid on one-of-a-kind items, with proceeds supporting our programs.`
  - **Speakers:** `Hear from the scholars and community your support makes possible.`
- **Optional sub-blocks:**
  - Schedule list, only if `program.schedule` is non-empty.
  - Speakers list, only if `program.speakers` is non-empty.
  - Auction preview, only if `program.auctionPreview` is non-empty.

#### 2.4 Scholar spotlight (`#scholars`) — ivory

- **Heading:** `Your Ticket, Their Future`
- **Subheading:** `Meet the recipients of our East African Youth Scholarship.`
- **Content:**
  - Cards pulled from the **existing award-recipients data**: photo, name, school, field, and quote, using existing quotes verbatim.
  - Truncate quotes gracefully on mobile if needed.
- **Link:** `Meet our scholars` → `/award-recipients`

#### 2.5 Goal progress (`#goal`)

- Render only when `goal.headline` and `goal.amountGoal` are set. No fake numbers, ever.
- Gold progress bar with "$X raised of $Y".
- Place it directly above the ticket section, or merge it into its header.

#### 2.6 Tickets (`#tickets`) — ink. This is the portal.

- **Heading:** `Attend the Gala`
- **Subheading:** `Every ticket helps fund scholarships and mental wellness programs for Eritrean and East African youth.`
- **Three tier cards** from `tiers.attend`:
  - Each shows the name, price (`$55`, no cents), includes list, tagline/note, and an "Est. tax-deductible: $X" line only if computable.
  - **Champion** is visually featured: gold border/motif, a `The full experience` badge, slightly raised.
  - On mobile, cards stack with Champion **second** (natural order), still featured.
- **Each card's CTA:**
  - **Embed mode:** CTA reads `Select tickets below` and scrolls to the checkout block.
  - **Link mode:** CTA reads `Get Tickets` and opens `checkout.tickets.hostedUrl`.
- **Notes under the cards** (small text, each conditional on its data):
  - `Drink tickets can be redeemed for non-alcoholic drinks. Alcohol served to guests 21+ with valid ID.`
  - Sales close: `Online sales close Monday, November 23.` Derive the weekday/date from `sales.onlineCloseAt`; don't hardcode.
  - Door prices (if `doorSalesAvailable`): `Door tickets, if available: Student $40 · General Admission $65 · Champion $95.`
  - `Tables are available in advance only.`
- **Checkout block:**
  - **Embed mode:** render the platform embed (`checkout.tickets.embedSrc`) in a responsive container.
    - The iframe needs a `title`, e.g., "Gala ticket checkout".
    - Set a sensible `min-height` so it doesn't collapse on mobile.
    - Lazy-load it when near the viewport.
    - Below it, add the fallback link `Trouble loading checkout? Open it in a new tab →` using `hostedUrl`.
  - **Link mode:** show a large `Get Your Tickets` button.
- **State behavior:**

| State | Ticket section shows |
|---|---|
| `coming_soon` | `Tickets go on sale soon.` plus a link to subscribe to the newsletter (reuse the site's existing newsletter subscribe) or email us. No dead buttons. |
| `online_closed` | `Online ticket sales have closed.` plus the door-price line if applicable. Hide the embed. |
| `past` | Section hidden (see 2.11). |

#### 2.7 Sponsorship (`#sponsor`) — plum

- **Heading:** `Become a Gala Sponsor`
- **Subheading:** `For businesses, organizations, and families who want to stand behind our scholars publicly.`
- **Three sponsor cards** from `tiers.sponsor`. Layout rule: these must read as sponsorships at a glance, not group tickets.
  - Card order, top to bottom: **level name → price → lead line (Scholarship Sponsor only) → benefits list → `seatsLine` in smaller, muted text at the bottom.**
  - Scholarship Sponsor shows the `Limited to 2` badge. Once `claimed > 0`, show "1 of 2 remaining"; at the limit, show "Sold out" and disable the CTA.
  - Each card shows "Est. tax-deductible: $X" when computable.
- **CTA:** `Become a Sponsor`. Target: `sponsorship.hostedUrl` → `tickets.hostedUrl` → `mailto:contact@tombossabfoundation.org?subject=Gala%202026%20Sponsorship` (first one that's set).
- **Under the cards:**
  - `Need an invoice, a W-9, or a custom package? Email contact@tombossabfoundation.org.`
  - Packet: `Download the sponsorship packet (PDF)`, only if `packetPdf` is set.
  - Logo deadline: `To appear in printed materials, sponsor by {logoDeadline}.`, only if set.
- **Sponsor wall:** a logo grid by level, only if `sponsorship.sponsors` is non-empty. Heading `Thank You to Our Sponsors`.

#### 2.8 Can't make it (`#give`) — ivory

- **Heading:** `Can't Make It? You Can Still Be There.`
- **Two cards:**
  - **Sponsor a Seat — $55**
    - Copy: `Give a student or family a seat at the table.`
    - CTA: `Sponsor a Seat` → tickets checkout. Sponsor a Seat is a ticket type on the platform.
  - **Give to a Fund**
    - A toggle between `Future Scholar Fund` and `Mental Wellness Fund`.
    - Preset amount chips: `$50 · $100 · $250 · $500 · Other`.
    - Below: `Ten gifts of $250 fund one student's semester.`
    - CTA: `Give` → the selected fund's link in `checkout.donate`. If the platform link supports an amount parameter, Noel will confirm; otherwise the chips are visual guidance only and the CTA just opens the fund's page. Don't invent URL parameters.
- **Note under the cards:** `Gifts of $100 or more are listed as Friends of the Foundation in the gala program.` If `programListing.deadline` is set, append ` Give by {deadline} to be included.`

#### 2.9 FAQ (`#faq`) — accessible accordion

Use `<button aria-expanded>` with the panel linked via `aria-controls`. One item open at a time is fine.

Items with unconfirmed content render the fallback shown in brackets below. Wording marked "proposed" is a suggestion pending board approval: render it, but list it in your final report.

| Question | Answer |
|---|---|
| **What should I wear?** | `Cocktail attire. Think suits, cocktail dresses, or formal wear. Traditional Eritrean and East African attire is warmly welcomed.` |
| **When and where is the gala?** | Date, time, venue, and address from config, with an embedded Google Map (follow the existing event-page pattern) only if the venue is set. [Fallback: `Saturday, November 28, 2026. Venue and time will be announced soon. Follow us on Instagram or subscribe to our newsletter for updates.`] |
| **Is there parking?** | `TODO_CONFIRM` [Fallback: `Parking details will be shared once the venue is announced.`] |
| **Is the gala open to all ages?** | `TODO_CONFIRM` (proposed: `Guests of all ages are welcome; guests under 18 must be accompanied by an adult. Alcohol is served only to guests 21+ with valid ID.`) |
| **What's the refund policy?** | `TODO_CONFIRM` (proposed: `All sales are final. If you can no longer attend, email us and we'll gladly transfer your ticket to another guest or convert it into a tax-deductible donation.`) |
| **Will there be vegan or fasting-friendly food?** | `Yes. Let us know your dietary needs (vegan/fasting, vegetarian, or allergies) during checkout.` (`TODO_CONFIRM` with caterer) |
| **Who qualifies for a Student ticket?** | `Any current high school, college, or graduate student. Please bring a valid student ID to check-in.` (`TODO_CONFIRM`) |
| **Can I buy tickets for other people?** | `Yes. You'll be asked for each guest's name at checkout so we can have name tags ready.` |
| **Is my ticket tax-deductible?** | `The Tombossa B Foundation is a 501(c)(3) nonprofit{, EIN ein}. The portion of your ticket above the value of the dinner and drinks you receive is tax-deductible to the extent allowed by law.` Then, if FMV values are set, a per-tier list of estimated deductible amounts. |
| **Can I attend the silent auction without a ticket, or bid remotely?** | `TODO_CONFIRM` [Fallback: hide this item.] |
| **Is the venue accessible?** | `TODO_CONFIRM` [Fallback: `Please email us with any accessibility needs and we'll make sure you're taken care of.`] |
| **How do I become a sponsor?** | `Choose a sponsorship level above, or email contact@tombossabfoundation.org for an invoice, W-9, or a custom package.` |
| **Why does checkout ask for an optional tip?** | Render **only if `checkout.provider === 'zeffy'`**: `We use Zeffy, a free platform for nonprofits, so the foundation receives your full payment. Zeffy is supported by optional tips. You're welcome to set the tip to $0.` (Noel: verify against Zeffy's current terms.) |
| **I can't attend. How else can I help?** | `Sponsor a seat for a student or family, give to one of our funds, or share this page with someone who'd love to be there.` Link to `#give`. |
| **Who do I contact with questions?** | `Email contact@tombossabfoundation.org or call 214 208 3936.` |

#### 2.10 Closing / share (`#share`) — ink

- **Heading:** `Share the Night`
- **Copy:** `The more people in the room, the more students we can support.`
- **Share buttons:**
  - Native share via the Web Share API where available.
  - Copy link (with a "Copied!" confirmation).
  - **WhatsApp:** `https://wa.me/?text=` plus encoded text and URL. Make it prominent; much of the community shares on WhatsApp.
  - Facebook: `https://www.facebook.com/sharer/sharer.php?u=`
  - X: `https://x.com/intent/post?text=&url=`
  - Email: `mailto:` with a subject and body.
  - Share text: `Join me at the Tombossa B Foundation Gala on Saturday, November 28! Every ticket supports scholarships for Eritrean and East African youth.` followed by the canonical URL.
- **Add to calendar** (only when `startAt` and venue are set):
  - Google Calendar link.
  - A generated `.ics` file. Use UTC (`Z`) timestamps computed from config, or include a proper `VTIMEZONE`. Don't emit floating times.
- Final `Get Tickets` button, hidden in `past` state.

#### 2.11 State: `past` (after the event)

- **Hero:**
  - H1 stays `The Tombossa B Foundation Gala`.
  - Replace the intro with: `Thank you for an unforgettable night. Because of you, more students will walk through doors that once felt closed.`
- **Primary CTA:** `Keep the momentum going: Give today` → `#give`.
- Add a line: `This Giving Tuesday, December 1, every gift continues Tombossa's legacy.` Show it only until December 2, 2026.
- **Hide:** tickets, sponsorship CTAs, countdown, calendar.
- **Keep:** story, scholars, give, and the sponsor wall ("Thank You to Our Sponsors").

### Mobile sticky CTA

On viewports < 768px, show a slim bottom bar with `Get Tickets — from $30` (compute the minimum price from config) linking to `#tickets`.

- Appears after the user scrolls past the hero.
- Hides while `#tickets` is in view, and in `coming_soon` and `past` states.
- Must not cover the checkout iframe or the footer links. Pad the page bottom.

---

## 3. Homepage hero — new first slide

Insert a new slide **at index 0** of the existing hero slider. The existing three slides keep their content and order after it.

**Content:**

- Eyebrow: `Saturday, November 28, 2026`
- Headline: `The Tombossa B Foundation Gala`
- Subline: `Two years of legacy. One unforgettable night for our scholars.`
- Primary button: `Get Tickets` → `/gala`
- Secondary button: `Become a Sponsor` → `/gala#sponsor`

**Styling:**

- Use the gala palette (ink background, gold accents, optional motif) so it's visibly different from the other slides.
- Fit the slider's existing dimensions, controls, and responsive behavior.
- Text must be legible at 375px width.
- If the slider autoplays, make sure the gala slide shows first on load. Don't change global autoplay timing without asking.

**States:**

| State | Slide behavior |
|---|---|
| `on_sale` | As described above |
| `coming_soon` | Primary button reads `Learn More` → `/gala` |
| `online_closed` | Subline becomes `Online sales have closed. See you on November 28!`; button `Event Details` → `/gala` |
| `past` | Subline becomes `Thank you for an unforgettable night.`; button `See the Recap` → `/gala`. After December 2, 2026, remove the slide automatically, client-side. |

---

## 4. `/events` page — new "Upcoming Events" section

- Add an **"Upcoming Events"** section **above** "Past Events", matching the existing section header style (section icon and heading).
- **Gala card:**
  - Use the existing card component and layout: image, date badge in the existing format (`28Nov 2026` style), title, time, and location lines.
  - Title: `Tombossa B Foundation Gala 2026`
  - Time: from config, or `Time TBA`
  - Location: venue lines, or `Venue TBA`
  - Link: image and title link to **`/gala`**. Don't create a separate `/events/[slug]` detail page.
  - Add a small gold `Tickets on sale` pill, shown only in `on_sale` state.
  - Give the card a subtle gala accent (thin gold border or plum/gold date badge) so it stands out without breaking the page's look.
  - **Card image:** if no gala image exists, create a simple gala-palette graphic (text lockup and motif) at the dimensions the existing cards use, in `/public/images/`. Tell Noel so he can swap it.
- **Moving to Past Events:**
  - After the event (`past` state), the gala should move to Past Events.
  - If events are already sorted or split by date, plug into that. Otherwise implement a minimal date split.
  - Remember the build-time freezing caveat; client-side is fine.
  - Hide the "Upcoming Events" section when it's empty.
  - In Past Events, the gala card still links to `/gala`, which shows the thank-you state.

---

## 5. Sharing and SEO

This page will be shared everywhere. The link preview is the first impression.

1. **Per-page meta:**
   - Implement the approach approved in Phase 0 so `/gala` sets its own tags without breaking defaults on other pages. A tidy fix that lets *every* page pass its own title/description/URL is welcome if it's low-risk.
   - All OG and Twitter image URLs must be **absolute**.
   - In the table below, `\|` is only markdown escaping; the real title uses a plain pipe, matching the site's existing "Tombossa B Foundation | …" title pattern.

   **Tags for `/gala`:**

   | Tag | Value |
   |---|---|
   | `<title>` | `Tombossa B Foundation Gala 2026 \| Tickets & Sponsorship` |
   | `meta description` and `og:description` | `Dinner, music, a silent auction, and inspiring speakers — Saturday, November 28, 2026. Every ticket funds scholarships for Eritrean and East African youth.` (155 characters; keep it under 160) |
   | `og:title` / `twitter:title` | `The Tombossa B Foundation Gala · November 28, 2026` |
   | `og:url` / `link rel="canonical"` | `https://tombossabfoundation.org/gala` |
   | `og:image` / `twitter:image` | `https://tombossabfoundation.org/images/gala-2026-og.jpg` (1200×630, JPEG under 250 KB), with `og:image:width`, `og:image:height`, and `og:image:alt` |
   | `twitter:card` | `summary_large_image` |
   | `og:type` | `website` |

2. **OG image (`/public/images/gala-2026-og.jpg`, 1200×630):**
   - Content:
     - Gala palette background with the gold motif.
     - Foundation logo (from `/public/images/logo-white.png` if it exists).
     - `The Tombossa B Foundation Gala`
     - `Saturday, November 28, 2026`
     - `tombossabfoundation.org/gala`
   - Generate it with a small one-off script in `/scripts`: author an SVG, rasterize with `@resvg/resvg-js` or `sharp`, and load the display font file explicitly so text renders correctly.
   - Commit it as a **JPEG**, not a PNG: WhatsApp drops link-preview images over ~300 KB, and a lossless 1200×630 PNG of this design is ~336 KB. `scripts/gala-assets.mjs` writes it at JPEG quality 88 (~90 KB), and the render tests fail if any page's preview image is 250 KB or more. Keep key text inside the center ~1000×500 safe area; some platforms crop.
   - If rasterizing fonts is troublesome, commit the SVG and ask Noel to export it.
3. **Structured data:**
   - Add a JSON-LD `Event` (schema.org) **only when `startAt` and venue are set**, since Google requires a location.
   - Fields:
     - `name`, `description`, `image`, `startDate`, `endDate` (ISO with `-06:00`)
     - `eventStatus: EventScheduled`, `eventAttendanceMode: OfflineEventAttendanceMode`
     - `location` (`Place` + `PostalAddress`)
     - `organizer` (`Organization`, name and URL)
     - `offers`: one `Offer` per attend tier, with `price`, `priceCurrency: "USD"`, `availability` reflecting state, `url` (canonical), and `validFrom`
   - Output via `<script type="application/ld+json">` in `<Head>`.
4. **Redirect** `/events/gala-2026` → `/gala` (permanent).
5. **Sitemap:** add `/gala` if a sitemap exists. Don't block it in `robots.txt`.
6. **QR code:**
   - Generate `/public/images/gala-2026-qr.svg` and `.png` (1024px, high error correction, ink on white with a quiet zone) encoding `https://tombossabfoundation.org/gala`.
   - Use a dev-only script (e.g., `qrcode` package) in `/scripts`.
   - If analytics is present (Phase 0), ask Noel whether to encode a UTM version instead.

---

## 6. Accessibility and performance

**Accessibility:**

- Semantic landmarks and heading order; one `<h1>`.
- Visible `:focus-visible` styles in gold on dark and ink on light.
- Tap targets ≥ 44px.
- Meaningful `alt` text; decorative SVGs get `aria-hidden="true"`.
- Iframes have a `title`.
- Accordions are keyboard-operable.
- Smooth-scroll anchors respect reduced motion.
- No horizontal scroll at 320px.

**Performance:**

- The hero is text-led, so LCP should be fast. Use `next/image` (or the repo's existing image approach) with proper `sizes`.
- Load fonts via `next/font` with `display: swap` and only the weights you use.
- Lazy-load the checkout iframe and the map.
- No heavy animation libraries; CSS is enough.

---

## 7. QA checklist (run before your final report)

- [ ] `npm run build` and lint pass with no new warnings.
- [ ] `/gala` renders correctly at 320, 375, 768, 1024, and 1440px widths.
- [ ] Every state (`coming_soon`, `on_sale`, `online_closed`, `past`) checked via the dev override, on `/gala`, the homepage slide, and `/events`.
- [ ] With all `TODO_CONFIRM` fields null, the production build shows **no** placeholder strings. Grep the built HTML for `TODO`, `null`, `undefined`, and `[`.
- [ ] Deductible math verified by hand against at least two FMV test values, then reset to null. Never negative.
- [ ] Champion is featured; Scholarship Sponsor limit/sold-out logic works (test `claimed` = 0, 1, 2).
- [ ] View-source on `/gala` shows the correct title, description, canonical, and absolute OG/Twitter tags. Other pages' meta is unchanged (or improved, if the global fix was approved).
- [ ] The JSON-LD validates (paste into the schema.org validator) when test venue/time values are set.
- [ ] The `.ics` opens with the correct local time (6:00 PM CST stays 6:00 PM in America/Chicago).
- [ ] Existing homepage slides, `/events` past events, `/award-recipients`, and `/donatenow` are unchanged.
- [ ] The redirect `/events/gala-2026` → `/gala` works.
- [ ] Keyboard-only walkthrough of `/gala` works; reduced motion disables animations.

---

## 8. Launch checklist doc for Noel

Create `docs/gala-2026-launch-checklist.md` covering the manual steps outside the code:

**1. Checkout platform setup (Zeffy or Donorbox):**

- **Ticket types:**

  | Ticket type | Price | Notes |
  |---|---|---|
  | Student | $30 | |
  | General Admission | $55 | |
  | Champion | $85 | |
  | Community Sponsor | $500 | 5 seats |
  | Legacy Sponsor | $1,000 | 8 seats |
  | Scholarship Sponsor | $2,500 | Quantity limit 2 |
  | Sponsor a Seat | $55 | |

  Door tickets are **not** sold online.
- Sales end date matching `sales.onlineCloseAt`.
- **Custom checkout questions:**
  - Each guest's full name.
  - Dietary needs: none / vegan-fasting / vegetarian / allergies (describe).
  - Student ID acknowledgment for the Student type.
  - For sponsors: recognition name and logo (or "we'll email you").
- **Tax receipts:** if the platform supports a per-ticket deductible/eligible amount, set it to price minus FMV.
- Confirmation email copy (date, dress code, what to bring, contact).
- Paste the hosted URL and embed URL into the config. Don't edit them.

**2. Content to fill in** (auto-generate this list from every `TODO_CONFIRM` in the config):

- Venue, time, parking, age policy, refund policy, FMV values, EIN
- Program print deadline, logo deadline
- Speakers, schedule, music, auction items
- Goal amount, fund-specific donate links
- Sponsorship packet PDF, gala imagery

**3. Before announcing:**

- Make one real low-cost test purchase and refund it.
- Check the link preview in the Facebook Sharing Debugger (scrape again after any OG change) and by sending the link to yourself on WhatsApp and iMessage.
- Scan the QR code from print size.

**4. After the event:**

- Update `amountRaised`.
- Add the sponsor wall.
- Optionally add a recap and photos.

---

## 9. Out of scope / don'ts

- No custom payment handling, accounts, or attendee databases.
- No changes to the Spring Boot backend, nginx, or deployment, except proposing the redirect or CSP change in your report if needed.
- No global style changes beyond the approved meta fix.
- Don't invent content: no fake sponsors, speakers, raised amounts, attendee counts, or "most popular" claims.
- Don't change the canonical URL once built.

---

## Final report (after implementation)

Reply with:

1. Files created and changed, one line each.
2. How to update the config (where to paste checkout links, how to mark a sponsor or update amount raised).
3. The full list of remaining `TODO_CONFIRM` fields, and any copy marked "proposed".
4. Anything you deviated on or couldn't do, and why.
5. Deployment notes: anything Noel must do on the server (CSP `frame-src`, redirect rule if static export, cache purge for the OG image).
