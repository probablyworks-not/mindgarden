# Mind Garden

A dependency-free, static implementation of the supplied Mind Garden design. Includes its original typography, garden animations, scroll reveals, product cards, work carousel, and matching internal pages.

## Run locally

```sh
npm run dev
```

Open http://localhost:4173. After editing source files, run `npm run build` and refresh the browser. The dev server serves the generated `dist` directory.

## Build and check

```sh
npm run build
npm run check
```

Node.js 20 or newer is required. No dependency installation is needed. `dist/` is the complete deployable website; it can be served by any static host.

## Vercel

Import this repository into Vercel. The included `vercel.json` specifies `npm run build` and the `dist` output directory. No environment variables or backend are required. If choosing a framework preset, select Other.

This project is prepared for deployment; no production deployment has been made.

## Update content

- `src/home.html`: homepage copy, product cards, writing previews, work history, and about text.
- `src/content.json`: titles and descriptions for the ten internal placeholder pages. New entries generate new pages and appear in their corresponding collection automatically. Update homepage cards separately when adding entries.
- `scripts/build.mjs`: shared page layout, placeholder body text, collection pages, and contact page. Replace the placeholder block here with article or case study content when ready.
- `src/styles.css`: original design styles, animations, and self-hosted font declarations.
- `src/enhancements.css`: responsive layout, accessibility, and internal page styles.
- `src/garden.js`: garden icon placement, navigation, scroll reveal, carousel, and work disclosures.
- `src/assets/icons.json`: the full set of 251 supplied hand-drawn icons, plus animation-specific icons from the standalone design.

All writing previews and internal content are placeholders. The supplied product names, about copy, and sample work history are retained from the reference; replace sample history before publication. Contact details are a placeholder until real email/social destinations are supplied.

The original `mindgarden-standalone.html` and `mind-garden-icons.html` are retained as references and are not included in the production build. Fonts are self-hosted, so the website requires no external font requests. Reduced-motion preferences disable decorative animations.

## Routes

- `/`: homepage
- `/products/`, `/ideas/`, `/writings/`: collection pages
- `/products/<slug>/`, `/ideas/<slug>/`, `/writings/<slug>/`: detail pages
- `/contact/`: contact placeholder
- `404.html`: custom missing-page screen

Writings are currently hidden: the homepage section is saved in `src/writings-section.html`, and writing entries are retained in `src/content.json` but excluded from the build. To restore, remove the writings filter in `scripts/build.mjs`, restore the section to `src/home.html`, and add its navigation links.
