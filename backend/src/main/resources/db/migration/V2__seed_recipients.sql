-- Seed migrated verbatim from frontend/data/recipients.json.
-- Content rule: a new recipient = a new versioned seed migration here PLUS the
-- matching update to frontend/data/recipients.json (the build/test fixture).
-- Insert order within a year is the display order (API sorts year desc, id asc).

insert into recipient (public_id, slug, name, award_year, cohort, scholarship, headline,
                       photo, photo_alt, heritage, school, major, highlights, blurb, story,
                       quote, quote_attribution)
values (
    'mattania-biniam-2025',
    'mattania-biniam',
    'Mattania Biniam',
    2025,
    '2025–2026',
    'East African Youth Scholarship',
    'Engineering Impact Through Analytics',
    '/recipients/mattania-biniam.jpg',
    'Mattania Biniam, 2025 East African Youth Scholarship recipient, in a white suit',
    'Eritrean-American',
    'Southern Methodist University',
    'Management Science',
    '["4.2 Weighted GPA", "Church Youth Leader", "Varsity Basketball Captain"]'::jsonb,
    'An Eritrean-American headed to SMU to study Management Science, with a vision to use data and analytics to make a positive impact on the world.',
    '["For our selection committee, awarding Mattania Biniam the East African Youth Scholarship was an easy decision. He embodies the very spirit of our foundation — excelling in the classroom, leading in his community, and competing on the court, all with remarkable drive.", "An Eritrean-American headed to Southern Methodist University to study Management Science, Mattania carries both a rich heritage and a bold future. For his family, this scholarship is more than financial relief; it''s a vote of confidence from a community that believes in him.", "With a vision to use data and analytics to leave a positive footprint on the world, Mattania is exactly the kind of leader our community is proud to invest in."]'::jsonb,
    'I wanted to be part of a community that understands both my heritage and my dreams. It''s not just financial help — it''s encouragement, and a reminder that my community believes in me.',
    'Mattania Biniam'
);

insert into recipient (public_id, slug, name, award_year, cohort, scholarship, headline,
                       photo, photo_alt, heritage, school, major, highlights, blurb, story,
                       quote, quote_attribution)
values (
    'elim-girma-2025',
    'elim-girma',
    'Elim Girma',
    2025,
    '2025–2026',
    'East African Youth Scholarship',
    'Protecting Communities Through Cyber Innovation',
    '/recipients/elim-girma.jpg',
    'Elim Girma, 2025 East African Youth Scholarship recipient',
    'First-generation Eritrean-American',
    'Texas Tech University',
    'Cybersecurity Analyst',
    '["Top 10% of Class", "Student-Organization Leader", "Future Cybersecurity Analyst"]'::jsonb,
    'A first-generation Eritrean-American channeling her talents toward a career as a Cybersecurity Analyst at Texas Tech University, driven to shield others from digital threats.',
    '["For our selection committee, Elim Girma''s application was a standout choice for the East African Youth Scholarship. She graduated in the top 10% of her class while leading numerous student organizations, pairing exceptional communication skills with a fierce work ethic.", "A first-generation Eritrean-American, Elim is heading to Texas Tech University to pursue a career as a Cybersecurity Analyst. For her, this scholarship is far more than a door to higher education; it''s a vote of confidence that lets her deepen her studies, build professional networks, and step into a new independence.", "Driven by a calling to shield others from digital threats, Elim is moving into a career where her leadership will safeguard data and uplift her community."]'::jsonb,
    'Growing up, higher education has always been the goal. I''m inspired to help people through cybersecurity, and I knew the Tombossa B Foundation was just the right place to do so.',
    'Elim Girma'
);
