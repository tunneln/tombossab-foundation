# data/

JSON content fixtures. Each file is a flat **array of objects** doing double duty:

1. **Hermetic fixture** — builds/tests run with no `API_BASE_URL`, so pages render exactly this data (offline, deterministic).
2. **Production fallback** — `lib/api.js` serves this if the backend is ever unreachable at build/revalidate time.

The backend's Flyway seed migrations are the production source of truth; these files must stay **shape- and content-identical** to the API responses. **Content rule: every seed migration (`backend/src/main/resources/db/migration/V*__seed_*.sql`) updates its fixture here in the same PR.** `scripts/data.test.mjs` guards shape, uniqueness, asset existence, and ordering.

## Conventions

- Files: `recipients.json`, `newsletters.json`, `events.json`.
- String `id` slugs where applicable (`"elim-girma-2025"`, `"march-2026"`); events use `slug` (nullable — null means no detail page).
- Sortable field, newest-first: recipients `year` (desc, seed order within a year), newsletters `date` `"YYYY-MM"` (desc), events `eventDate` `"YYYY-MM-DD"` (desc).
- Asset paths point into `../public/`: `/recipients/*.jpg`, `/newsletters/*.jpg|.pdf`, `/images/*`.

## Generating newsletter assets

Copy the PDF into `../public/newsletters/`, then make a cover thumbnail with macOS Quick Look (ImageMagick here can't rasterize PDFs — no ghostscript):

```bash
qlmanage -t -s 600 -o /tmp "Some Newsletter.pdf"
sips -s format jpeg /tmp/"Some Newsletter.pdf.png" --out ../public/newsletters/<slug>-cover.jpg
```
