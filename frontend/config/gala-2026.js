// Gala 2026: the single source of truth for every date, price, link, and line
// of copy on /gala, the homepage gala slide, and the /events gala card.
//
// Editing rules
//  - `null` means "not confirmed yet". The UI hides that element or shows a
//    graceful fallback, so never type placeholder text into a value.
//  - Every unconfirmed field is marked TODO_CONFIRM; in `npm run dev`, /gala
//    shows a floating checklist of the ones still null.
//  - Timestamps are ISO 8601 with the -06:00 offset (late November is CST).
//  - Checkout URLs: paste them exactly as the platform dashboard gives them.
//    NEVER construct or guess them.
//
// The gala is NOT in the events database: this file feeds the /events card too,
// so don't also add it as a Flyway seed (it would show twice).
export const gala = {
    canonicalUrl: 'https://tombossabfoundation.org/gala',
    name: 'The Tombossa B Foundation Fundraising Gala',
    year: 2026,
    tagline: 'An Evening for the Next Generation', // hidden if null
    dateDisplay: 'Saturday, November 28, 2026',
    eventDate: '2026-11-28', // drives the /events date badge
    timezone: 'America/Chicago',
    // startAt drives the countdown and state logic now, but the time itself is
    // only published (hero, FAQ, /events card, calendar links, JSON-LD) once
    // startTimeConfirmed is true: a wrong time saved to a calendar never updates.
    startAt: '2026-11-28T17:00:00-06:00', // 5:00 PM CST
    startTimeConfirmed: true,
    endAt: null, // TODO_CONFIRM e.g. '2026-11-28T22:00:00-06:00'
    venue: {
        name: 'Empire Event Center',
        street: '9560 Skillman St, Suite 126',
        city: 'Dallas',
        region: 'TX',
        postalCode: '75243',
    },
    dressCode: {
        label: 'Cocktail Attire',
        detail:
            'Think suits, cocktail dresses, or formal wear. Traditional Eritrean and East African attire is warmly welcomed.',
    },

    copy: {
        // Small line above the title (homepage slide + /gala hero), shown only
        // until ticket sales close: "announcing" reads stale on the day itself.
        kicker: 'Announcing a new annual tradition',
        // Hero intro, one string per paragraph. If program.speakers is still
        // empty at launch, "words from the students your support makes possible"
        // can be swapped for "inspiring speakers" here.
        intro: [
            'Two years ago, we gathered to honor Tombossa Negusse and launch a foundation in his name. This year, we celebrate what that legacy has already built: scholars like Mattania and Elim, and a community investing in the next generation of Eritrean and East African youth.',
            'Join us for an evening of dinner, music, a silent auction, and words from the students your support makes possible. Every ticket helps fund scholarships and mental wellness programs.', // TODO_CONFIRM scholars will speak
        ],
        pastIntro:
            'Thank you for an unforgettable night. Because of you, more students will walk through doors that once felt closed.',
        // Shown in the past state until givingTuesday.showUntil.
        givingTuesday: {
            line: "This Giving Tuesday, December 1, every gift continues Tombossa's legacy.",
            showUntil: '2026-12-02T23:59:59-06:00',
        },
        shareText:
            'Join me at the Tombossa B Foundation Fundraising Gala on Saturday, November 28! Every ticket supports scholarships for Eritrean and East African youth.',
    },

    // The homepage gala slide. It removes itself (client-side) after removeAfter.
    homeSlide: {
        dateLine: 'Saturday, November 28, 2026 · Dallas', // under the title (no time on the slide)
        subline: 'An evening for the next generation. One unforgettable night for our scholars.',
        closedSubline: 'Online sales have closed. See you tonight!', // sales close the morning of the gala
        pastSubline: 'Thank you for an unforgettable night.',
        removeAfter: '2026-12-02T23:59:59-06:00',
    },

    sales: {
        openAt: null, // null = on sale as soon as checkout links are configured
        onlineCloseAt: '2026-11-28T12:00:00-06:00', // noon on gala day: online sales stay open through the morning
        doorSalesAvailable: true, // TODO_CONFIRM; door tickets are limited, never sold online
    },

    // Fair market value of goods/services per guest, for tax disclosure.
    // Don't change these once sales open: buyers' receipts are based on them.
    fmvPerGuest: {
        standard: 40, // TODO_CONFIRM good-faith FMV: dinner + 1 drink + entertainment. Pending treasurer/CPA sign-off. (Also Student & Youth: 30 - 40 clamps to $0.)
        champion: 60, // TODO_CONFIRM standard + 2 additional drinks (~$10 each). Pending treasurer/CPA sign-off.
    },
    ein: '99-4436179', // as published in the site's donate modal disclaimer; shown in the tax FAQ

    goal: {
        // The whole progress section stays hidden unless both amountGoal and headline are set.
        headline: null,   // TODO_CONFIRM e.g. 'Help us fund 4 semester scholarships'
        amountGoal: null, // TODO_CONFIRM
        amountRaised: 0,  // updated manually
    },

    tiers: {
        attend: [
            {
                id: 'student',
                name: 'Student & Youth',
                price: 30,
                doorPrice: 40,
                fmvKey: 'standard',
                includes: ['Dinner', 'The full program'],
                tagline: "Because the future we're building should be in the room.",
                note: 'For current students and guests 17 and younger.',
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
                    'Two additional drink tickets',
                    "Your name in the evening's program",
                    'Extra proceeds support our mental wellness services',
                ],
            },
        ],

        sponsor: [
            {
                id: 'community',
                name: 'Community Sponsor',
                price: 500,
                seats: 5,
                seatType: 'standard',
                benefits: [
                    'Name on table signage',
                    'Recognition on our website and social media',
                    'Reserved table for 5', // keep in step with `seats`
                ],
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
                    'Reserved table for 8, with Champion benefits',
                ],
            },
            {
                id: 'scholarship',
                name: 'Scholarship Sponsor',
                price: 2500,
                seats: 8,
                seatType: 'champion',
                limit: 2,
                claimed: 0, // updated manually; shows "Sold out" when claimed >= limit
                badge: 'Limited to 2',
                lead: "Funds one student's scholarship for a full semester.",
                benefits: [
                    'Top billing at the event and online',
                    'An introduction to the scholar your gift supports', // TODO_CONFIRM board/scholar approval
                    'Reserved table for 8, with Champion benefits',
                ],
            },
        ],

        give: {
            sponsorSeat: {
                name: 'Sponsor a Seat',
                price: 55,
                fullyDeductible: true, // the buyer receives nothing, so the whole price is deductible
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
        packetPdf: null,    // TODO_CONFIRM path in /public, e.g. '/gala/sponsorship-packet.pdf'; link hidden if null
        sponsors: [],       // { name, level, logo, url } (level = a tiers.sponsor id); sponsor wall hidden while empty
    },

    checkout: {
        // 'donorbox' | 'zeffy'. Everything platform-specific (embed handling, the
        // Zeffy tip FAQ) keys off this value, so switching platforms = change it
        // and paste the new URLs below. No code changes.
        provider: 'donorbox', // TODO_CONFIRM placeholder: switching to 'zeffy' before launch
        // Paste URLs exactly as given by the platform dashboard. NEVER construct or guess them.
        tickets: { hostedUrl: null, embedSrc: null }, // TODO_CONFIRM all ticket + sponsorship + Sponsor a Seat types
        sponsorship: { hostedUrl: null }, // falls back to tickets.hostedUrl, then email
        donate: {
            'future-scholar': '/donatenow', // TODO_CONFIRM replace with fund-specific links when available
            'mental-wellness': '/donatenow',
        },
    },

    program: {
        schedule: [],       // TODO_CONFIRM { time, label }; schedule hidden while empty
        speakers: [],       // TODO_CONFIRM { name, role }; hidden while empty
        music: null,        // TODO_CONFIRM performer/DJ name
        auctionPreview: [], // { title, description, image }; hidden while empty
        dinnerNote: 'With vegan and fasting-friendly options.', // TODO_CONFIRM with caterer
    },

    // FAQ answers that are still unconfirmed. `null` renders the fallback shown
    // on the page (or hides the question, for auction). "Proposed" answers are
    // pending board approval.
    faq: {
        parking: null,       // TODO_CONFIRM fallback: 'Parking details coming soon.'
        ages:                // TODO_CONFIRM (proposed)
            'Guests of all ages are welcome; guests under 18 must be accompanied by an adult. Alcohol is served only to guests 21+ with valid ID.',
        refunds:             // TODO_CONFIRM (proposed)
            "All sales are final. If you can no longer attend, email us and we'll gladly transfer your ticket to another guest or convert it into a tax-deductible donation.",
        dietary:             // TODO_CONFIRM with caterer
            'Yes. Let us know your dietary needs (vegan/fasting, vegetarian, or allergies) during checkout.',
        studentEligibility:  // TODO_CONFIRM (proposed student wording)
            'Any current high school, college, or graduate student, and any guest 17 or younger. No ID needed: we check everyone in by the QR code on their ticket.',
        // Check-in is by QR code ticket; no ID at the door unless a guest can't find their QR code.
        checkIn:
            "Just your ticket's QR code, on your phone or printed. Can't find it? No problem: we'll look you up by name at check-in.",
        auction: null,       // TODO_CONFIRM silent auction without a ticket / remote bidding; question hidden while null
        accessibility: null, // TODO_CONFIRM
    },
};
