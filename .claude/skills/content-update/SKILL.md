---
name: content-update
description: Add or change site content (award recipients, newsletters, events) — the paired Flyway seed migration + frontend fixture, assets, and tests. Use for any request like "add the new newsletter", "add this year's recipients", or "add an event".
---

# Content update (recipients / newsletters / events)

The one rule: **a content change = a new Flyway seed migration + the matching fixture update in the same PR.** Postgres (seeded by migrations) is production's source of truth; `frontend/data/*.json` is the hermetic fixture and production fallback and must stay shape- and content-identical to the API response.

## Steps

1. **Assets first** (if any), into `frontend/public/`:
   - Recipients: `/recipients/<slug>.jpg`. Newsletters: `/newsletters/<slug>.pdf` plus a cover thumbnail.
   - PDF cover thumbnails: ImageMagick here **cannot** rasterize PDFs (no ghostscript). Use macOS Quick Look:
     ```bash
     qlmanage -t -s 600 -o /tmp "Some Newsletter.pdf"
     sips -s format jpeg /tmp/"Some Newsletter.pdf.png" --out frontend/public/newsletters/<slug>-cover.jpg
     ```
   - Mind the image budget: `images.test.mjs` enforces 1 MB per image (gallery exempt).
2. **Migration**: add `backend/src/main/resources/db/migration/V<next>__seed_<thing>.sql`.
   - **Never edit an applied `V*` file** — always take the next number. Copy the INSERT format from the previous seed migration for the same table.
3. **Fixture**: mirror the same rows in `frontend/data/<thing>.json`.
   - Field names must match the backend Response record exactly — the fixtures are the API's contract.
   - Newest-first ordering: recipients by `year` desc (seed order within a year), newsletters by `date` `"YYYY-MM"` desc, events by `eventDate` `"YYYY-MM-DD"` desc.
   - Event `slug: null` means "no detail page — don't link". A non-null event slug needs a `DETAILS` registry entry in `frontend/app/events/[slug]/page.js`.
4. **Verify both sides**:
   - `cd frontend && npm run build && npm test` — `data.test.mjs` guards shape, uniqueness, ordering, and that every referenced asset exists.
   - `cd backend && ./mvnw test`; run `./mvnw verify` to prove the migration actually applies (Docker/colima setup in `TESTING.md`).
5. **Don't** manually ping `/api/revalidate` — the backend deploy workflow POSTs it after deploy, which is when production content actually changes.
