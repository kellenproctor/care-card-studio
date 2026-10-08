# A Little Care

A responsive, account-free coastal affirmation card studio built with React, TypeScript, Vite, and Bun.

```sh
bun install
bun run dev
bun run build
```

The compact studio combines message and motif editing in one sidebar, with a sheet-mode dropdown at the top. Edit affirmations, choose one of four hand-painted single-species botanical designs, add an optional heading, with a standard back featuring “With care,” above a blank signature space, the Rotary Club of Newport Coast logo, and a small quoted common/scientific flower name at bottom center. Four different editable affirmations and flower motifs are the default; each numbered card has its own message and motif. use the numbered card selector, or repeat one card. Both Print and Download PDF include two pages: fronts followed by backs. Back-sheet columns are reversed so flower labels align with the matching fronts using the recommended duplex settings.

## Printing

- Landscape cards: **5.5 × 4.25 inches**, on **11 × 8.5-inch landscape Letter**.
- Portrait cards: **4.25 × 5.5 inches**, on **8.5 × 11-inch portrait Letter**.
- Both layouts use an exact 2 × 2 grid with optional center cut guides and a quarter-inch internal safe margin around each card’s text and artwork.
- Main text is normally 28 pt; supporting text has been removed. Long messages adapt to fit.

Print at Actual Size / 100%, with browser headers and footers disabled. Use short-edge duplex for landscape, long-edge for portrait; test one sheet because printer feed behavior varies. Printer scaling cannot be controlled by a web app.

The studio fits typical desktop screens without page scrolling; smaller tablets and phones use a responsive scrolling layout. Extremely short windows may scroll inside the controls.

Messages remain in browser memory and are not sent to a server. Reset clears customizations. Fonts use Google Fonts with local serif and sans-serif fallbacks. Artwork lives in `public/art`.

## Botanical references

The four illustrations depict California poppy with driftwood, dune lupine with seaweed, seaside daisy with driftwood, and sea-cliff buckwheat with seaweed. Original watercolor assets and sweeping L-shaped corner motifs were created for this project using imagegen. Fronts use an airy upper-left and lower-right composition inspired by the supplied reference, with a larger lower corner and a clear text area. Artwork stays within the quarter-inch safe area. Common and scientific names are informed by:

- [California Native Plant Society: The Coastal Native Garden](https://www.cnps.org/gardening/the-coastal-native-garden-5526)
- [California Coastal Commission: Upper Newport Bay plants](https://www.coastal.ca.gov/publiced/unbweb/unb_plants.html)
- [Calflora: Seaside Daisy](https://www.calflora.org/app/taxon?crn=3140)

PDF downloads use losslessly compressed, transparent PNG artwork at 288 dpi. Cards have no printed background fill: the loaded paper supplies the color. The on-screen white sheet is only a paper preview. Typical two-page exports are about 4.3 MB.
