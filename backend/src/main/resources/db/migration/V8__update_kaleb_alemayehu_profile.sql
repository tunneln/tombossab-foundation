-- Kaleb Alemayehu's updates: a new photo (same file, /recipients/kaleb-alemayehu.jpg),
-- his current job (Desk Assistant at East Texas A&M University) and role (Vice
-- President of AAMMP, the African American Male Mentorship Program), and his
-- heritage as Ethiopian-American (also V7's fix). Every value is set outright, so
-- this alone brings a database that missed V7 up to date, and re-running it is a
-- no-op. Mirrors the matching entry in frontend/data/recipients.json.

update recipient
set photo_alt  = 'Kaleb Alemayehu, 2026 East African Youth Scholarship recipient, in a black suit and tie',
    heritage   = 'Ethiopian-American',
    highlights = '["3.56 College GPA", "AAMMP Vice President", "Python & Java Programmer"]'::jsonb,
    blurb      = 'An Ethiopian-American Computer Science student at East Texas A&M University, set on using technology and artificial intelligence to improve people''s lives and give back to his community.',
    story      = '["For our selection committee, Kaleb Alemayehu''s application was a clear choice for the East African Youth Scholarship. A Computer Science student at East Texas A&M University with a 3.56 GPA, he balances his studies with work as a Desk Assistant at the university and serves as Vice President of the African American Male Mentorship Program (AAMMP).", "An Ethiopian-American, Kaleb has known Tombossa''s support since his family first moved to Texas, when it gave them hope at a time they needed it most. For him, this scholarship is a full-circle moment, and a powerful motivation to keep working hard.", "With hands-on experience in Python, Java, and artificial intelligence, Kaleb hopes to build solutions that improve people''s lives and give back to his community, and one day to pay that kindness forward to the students who come after him."]'::jsonb
where public_id = 'kaleb-alemayehu-2026';
