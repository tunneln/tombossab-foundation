-- September 2026 issue. Mirrors the matching entry in frontend/data/newsletters.json.

insert into newsletter (public_id, title, issue, issue_date, headline, blurb, cover, file)
values
(
    'september-2026',
    'September 2026 Newsletter',
    'Issue #4',
    date '2026-09-01',
    'Celebrating Community at the Eritrean Festival',
    'Highlights from our booth at this year’s Eritrean Festival, plus a save-the-date for our first annual Gala Dinner this November.',
    '/newsletters/september-2026-cover.jpg',
    '/newsletters/september-2026-newsletter.pdf'
);
