-- 2026 scholarship recipients.
-- Content rule: a new recipient = a new versioned seed migration here PLUS the
-- matching update to frontend/data/recipients.json (the build/test fixture).
--
-- A recipient can now be awarded in more than one year: award_year is the most
-- recent award (it sorts newest first), and first_award_year the first. The
-- site shows a range when they differ ("2025 – 2026 Recipient"). Order: award
-- year desc, then first award year desc (newer scholars first), then seed order.

alter table recipient add column first_award_year integer;
update recipient set first_award_year = award_year;
alter table recipient alter column first_award_year set not null;

-- Mattania Biniam was awarded the scholarship again for 2026 (2025 – 2026).
update recipient
set award_year = 2026,
    cohort     = '2026–2027',
    photo_alt  = 'Mattania Biniam, 2025–2026 East African Youth Scholarship recipient, in a white suit'
where public_id = 'mattania-biniam-2025';

insert into recipient (public_id, slug, name, award_year, first_award_year, cohort, scholarship, headline,
                       photo, photo_alt, heritage, school, major, highlights, blurb, story,
                       quote, quote_attribution)
values (
    'kaleb-alemayehu-2026',
    'kaleb-alemayehu',
    'Kaleb Alemayehu',
    2026,
    2026,
    '2026–2027',
    'East African Youth Scholarship',
    'Improving Lives Through Artificial Intelligence',
    '/recipients/kaleb-alemayehu.jpg',
    'Kaleb Alemayehu, 2026 East African Youth Scholarship recipient, in a black suit and red tie',
    'Eritrean-American',
    'East Texas A&M University',
    'Computer Science',
    '["3.56 College GPA", "AI Model Trainer", "Python & Java Programmer"]'::jsonb,
    'An Eritrean-American Computer Science student at East Texas A&M University, set on using technology and artificial intelligence to improve people''s lives and give back to his community.',
    '["For our selection committee, Kaleb Alemayehu''s application was a clear choice for the East African Youth Scholarship. A Computer Science student at East Texas A&M University with a 3.56 GPA, he balances his studies with two jobs: training AI models by writing and evaluating prompts, and serving elderly residents at a senior living community, where he steps up as lead during the busiest hours.", "An Eritrean-American, Kaleb has known Tombossa''s support since his family first moved to Texas, when it gave them hope at a time they needed it most. For him, this scholarship is a full-circle moment, and a powerful motivation to keep working hard.", "With hands-on experience in Python, Java, and artificial intelligence, Kaleb hopes to build solutions that improve people''s lives and give back to his community, and one day to pay that kindness forward to the students who come after him."]'::jsonb,
    'My family has been blessed by the kindness and generosity of the Tombossa family for many years. To now receive this scholarship feels incredibly meaningful and motivates me to continue working hard.',
    'Kaleb Alemayehu'
);
