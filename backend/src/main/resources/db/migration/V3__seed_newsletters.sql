-- Seed migrated verbatim from frontend/data/newsletters.json.
-- Content rule: a new issue = a new versioned seed migration here PLUS the
-- matching update to frontend/data/newsletters.json (the build/test fixture).

insert into newsletter (public_id, title, issue, issue_date, headline, blurb, cover, file)
values
(
    'march-2026',
    'March 2026 Newsletter',
    'Issue #1',
    date '2026-03-01',
    'Breaking Barriers to Mental Health Care',
    'Our inaugural issue explores the mental health gap for East African communities and how culturally responsive, community-centered care can help close it.',
    '/newsletters/march-2026-cover.jpg',
    '/newsletters/march-2026-newsletter.pdf'
),
(
    'april-2026',
    'April 2026 Newsletter',
    'Issue #2',
    date '2026-04-01',
    'Six Unmet Needs in the Habesha Diaspora',
    'A look at the critical gaps facing Ethiopian and Eritrean communities living abroad — and why we must build culturally rooted solutions for them now.',
    '/newsletters/april-2026-cover.jpg',
    '/newsletters/april-2026-newsletter.pdf'
),
(
    'june-2026',
    'June 2026 Newsletter',
    'Issue #3',
    date '2026-06-01',
    'Meet Our June Guest Speaker: Dr. Yacob Tekie',
    'Get to know Dr. Yacob Tekie, guest speaker for our Coffee & Women Empowerment gathering, plus mental health resources for our community.',
    '/newsletters/june-2026-cover.jpg',
    '/newsletters/june-2026-newsletter.pdf'
);
