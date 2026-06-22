# data/

JSON content for data-driven pages. Each file is a flat **array of objects**, read at build time via `getStaticProps` and sorted in the page (see `../pages/`).

## Conventions

- Every object has a string `id` slug: `"elim-girma-2025"`, `"march-2026"`.
- Keep a sortable field and sort newest-first in the page: `recipients.json` uses `year` (desc); `newsletters.json` uses `date` as `"YYYY-MM"` (desc via `localeCompare`).
- File paths in the JSON point at assets in `../public/` — `recipients.json` → `/recipients/*.jpg`; `newsletters.json` → `/newsletters/*.jpg` cover + `/newsletters/*.pdf` file.
- **Adding an entry = append an object + drop its asset(s) in `../public/`.** No component or page code should need to change.

## Generating newsletter assets

Copy the PDF into `../public/newsletters/`, then make a cover thumbnail with macOS Quick Look (ImageMagick here can't rasterize PDFs — no ghostscript):

```bash
qlmanage -t -s 600 -o /tmp "Some Newsletter.pdf"
sips -s format jpeg /tmp/"Some Newsletter.pdf.png" --out ../public/newsletters/<slug>-cover.jpg
```
