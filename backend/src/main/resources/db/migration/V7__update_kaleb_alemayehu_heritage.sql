-- Kaleb Alemayehu asked to be listed as Ethiopian-American, not Eritrean-American.
-- Mirrors the matching entry in frontend/data/recipients.json.

update recipient
set heritage = 'Ethiopian-American',
    blurb    = replace(blurb, 'Eritrean-American', 'Ethiopian-American'),
    story    = replace(story::text, 'Eritrean-American', 'Ethiopian-American')::jsonb
where public_id = 'kaleb-alemayehu-2026';
