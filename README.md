# myMapúa Redesign

A responsive static student portal prototype inspired by Mapúa's myMapúa experience. The app recreates a dashboard-style interface for common student tasks such as profile management, grades, schedule, payment history, curriculum tracking, and support pages.

## Overview

This project is built as a front-end-only web app using plain HTML, CSS, and JavaScript. It includes:

- A sidebar navigation with hash-based route views
- Dashboard and profile flows
- Grades and curriculum tracking views
- Schedule and payment/finance sections
- Light/dark theme toggle
- Mobile-friendly layout and print/export interactions

## Project structure

- `index.html` — app shell and route entry
- `styles.css` — main UI styling
- `mobile-fixes.css` — responsive overrides for smaller screens
- `script.js` — page rendering, route logic, and interactions
- `assets/` — logos and static visual assets
- `data/mds/` — source content used for prototype records
- `reference/` — reference materials and design inspiration
- `scripts/visual-check.mjs` — visual regression tooling for desktop/mobile previews

## Notes

- The app is intentionally static and front-end focused.
- It is designed to demo a polished student portal experience rather than function as a production backend system.
- The `scripts/visual-check.mjs` workflow is intended for design validation and route coverage.
