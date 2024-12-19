# Compare Cart

A small React notebook for comparing pack prices and planning a purchase.

## Project context

Created in September 2026 as a present-day reconstruction of incremental development using technology available in 2023–2024. Historical author and committer dates are intentionally assigned; they do not establish original authorship or publication in those years. Repository creation remains in 2026. The original 2023 history is preserved.

## Run

Use Node 20, then `npm ci`, `npm run dev`, `npm test`, or `npm run build`. There is no backend, account, checkout, or live product feed. Enter your own prices.

## Comparison rules

Add, edit, or remove up to six products. Prices are USD pack prices from 0.01 to 99999.99; packs contain 1–1000 whole units. Choose items, grams, or milliliters for the whole comparison. Changing the label does not convert quantities.

Best unit price compares exact integer ratios and preserves ties. Display rounds to the nearest cent, half up; very small unit costs can display $0.00. Sorting never changes stored order. An optional quantity of 1–10000 shows whole packs needed, purchase cost, and surplus. Best unit price does not necessarily mean lowest purchase cost for that quantity. Taxes and discounts are excluded.

## Storage and backups

Products and the measure label persist in localStorage on the same browser/origin. Original saved product arrays migrate when next edited. Sorting, quantity needed, and unsaved form edits are session-only.

Export downloads the current comparison as JSON, including session-only products. Import validates a file of at most 16 KB, then asks before replacing the current comparison. Export first to keep a copy. Invalid imports leave the comparison unchanged. Legacy product-array backups are accepted.

Malformed storage is preserved; changes remain session-only. Blocked writes show a warning. A check refuses to overwrite data changed in another tab; it is not a transactional synchronization system. Keep one active tab, export if a warning appears, and reload to read external changes. Clearing browser data removes saved products.

## Compatibility and verification

January 18, 2024 introduces Vite 5.0.11 and a Node 20 toolchain. November 14 updates React to 18.3.1, Vite to 5.4.11, and React Testing Library to 16.0.1. All resolved package publication dates were audited against the introducing milestone: 282 versions in January and 240 in November.

Tests cover money parsing, exact ratios, ties, bounded purchase costs, editing, sorting, migration, invalid backups, and stale or unavailable storage. Browser checks cover the main workflow, backup confirmation, persistence, keyboard focus, and mobile layout. CI runs tests and builds on Node 20.18.1, released November 20, 2024. Local verification uses Node 20.19.0 (a later maintenance patch) and current Chrome, not an original 2024 runtime/browser.

The frozen historical toolchain has known dependency advisories. It is a local demonstration; update dependencies before current production deployment.
