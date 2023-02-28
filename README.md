# Compare Cart

A small React product comparison notebook. Add products and compare pack prices using the same unit of measure.

## Project context

Created in September 2026 as a present-day reconstruction of a February 2023 learning project. Historical author and committer dates are intentionally assigned; they do not establish original authorship or publication in 2023. Repository creation remains in 2026.

## Run

Use Node 18, then `npm ci`, `npm run dev`, `npm test`, or `npm run build`. Dependencies are pinned with a lockfile resolved before February 2, 2023. React 18.2 and Vite 4 provide component-based UI and a small build setup. There is no backend or external service.

## Comparison rules

Compare up to six products using a single unit of measure, such as grams or individual items. Prices are USD pack prices from 0.01 to 99999.99; packs contain 1–1000 whole units. The best-price calculation compares integer ratios so rounded display values do not determine the winner. All tied products receive the label. Display rounds to the nearest cent, half up; very small unit costs may display $0.00.

There is no checkout, tax calculation, or live product feed. Enter your own prices. Products persist in localStorage on the same browser/origin. Use one tab at a time; concurrent tabs can overwrite each other's changes. Malformed saved data is preserved and the comparison remains usable for the session; blocked writes show a warning.

## Verification

`npm test` covers decimal parsing, exact best-price ties, half-cent display, invalid pack sizes, removal/focus, valid saved IDs, malformed records, and storage failures. Browser checks cover adding/removing/reloading, the six-product limit, literal text rendering, keyboard focus, corrupt/blocked storage, and mobile wrapping.

The implementation derives comparison results from products instead of maintaining duplicate state or adding memoization for a six-item list. A separate product component handles display; money, comparison, and storage helpers have focused tests.

Dependencies, including all 252 resolved lockfile package versions, were checked against npm publication timestamps before February 2, 2023. Tested with Node 18.20.5 (a later maintenance release) and current Chrome, not an original 2023 runtime/browser. The frozen toolchain has known legacy dependency advisories and is intended for local historical demonstration rather than current production deployment.

Assigned commit dates: February 2, 4, 7, 10, 13, 16, 19, 22, 25, and 28, 2023. Future upgrades should be separate, tested changes instead of rewriting this baseline.
