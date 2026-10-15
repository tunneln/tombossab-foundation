# frontend/

## Conventions

- Brand accent gold `#f1ae44`. Reuse the shared classes (`theme-btn`, `section-heading`, `blog-item`, `recent-item`, `slide-bg*`) instead of bespoke CSS. **One deliberate exception: the gala.** Everything that belongs to the gala shares its own event palette (gold `#C9A45C`/`#E3C98F` on plum) so it all reads as one event. It lives in exactly these places: the `/gala` page (`components/gala/Gala.module.css`), its homepage slide (the `gala-slide__*` rules in style.css + responsive.css), the header "Gala Tickets" pill (`components/GalaNavButton.module.css`), the ticket checkout pop-up (`components/GalaCheckout.module.css`), and the `/events` gala card (`.blog__tag-gala`, `.event-card--gala`, `.event-card__pill` in style.css). Keep it to those; everything else uses the site's. Site styling is runtime CSS under `public/` (`css/` + `plugins/`) whose order is load-bearing — managed in `app/layout.js`, do not convert to bundler imports.
- Plain `<img>`, never `next/image`. Static assets in `frontend/public/`; PDF/static links get `<a target="_blank" rel="noopener noreferrer">`.
- Nav is `NavOne.js`; homepage slider is `SliderOne.js` (`slide-bg*` classes in style.css + responsive.css, never inline backgrounds).
