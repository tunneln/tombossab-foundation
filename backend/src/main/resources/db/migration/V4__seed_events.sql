-- Events become data-driven: seeded from the hardcoded cards that lived in
-- frontend/components/PastEvents.js. A null slug means "no detail page".
-- Content rule: a new event = a new versioned seed migration here PLUS the
-- matching update to frontend/data/events.json (the build/test fixture).

insert into event (slug, title, event_date, time_label, venue, city, image, image_alt)
values
(
    'coffee-women-empowerment-1',
    'Coffee & Women Empowerment',
    date '2026-06-27',
    '2:00pm to 6:00pm',
    '7522 Overdale Dr.',
    'Dallas, TX',
    '/images/coffee-women-empowerment.jpg',
    'Coffee & Women Empowerment'
),
(
    'community-field-day-2025',
    'Community Field Day',
    date '2025-07-26',
    '3:30pm to 9:00pm',
    'Cottonwood Park',
    'Richardson, TX',
    '/images/img8.jpg',
    'Community Field Day'
),
(
    null,
    'Memorial of Tombossa Negusse | Foundation Inauguration',
    date '2024-11-30',
    '11:00am to 2:00pm',
    'High Point Center',
    'Dallas, TX',
    '/images/img7.jpg',
    ''
);
