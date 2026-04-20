# Feature Plan — Phase 6: Polish and Deploy

## Overview

Final polish pass before the app is considered complete. Most infrastructure is already in place. This phase corrects stat label display, audits responsive behaviour, confirms the Page Visibility API implementation, runs a full visual consistency audit, and signs off on deployment readiness.

Files that may be touched: `js/ui.js`, `css/style.css`, `index.html`.
`js/cat.js`, `js/game.js`, and all test files must not be modified.

---

## Task Group 1 — Stat Label Update

**Goal:** Display stat names in full on the game screen. Hunger is shown as 'Food'. No abbreviations.

Tasks:
1. In `index.html`, update the three `<label>` elements in `.stats` from `HNG` / `HAP` / `NRG` to `Food` / `Happiness` / `Energy`
2. No changes to JavaScript variable names, `js/cat.js`, `js/game.js`, or any test file
3. Verify all three labels render correctly on screen without overflowing the stat row grid

Verify: Open game screen. Labels read "Food", "Happiness", "Energy". Bars and numeric values still aligned.

---

## Task Group 2 — Responsive Layout Audit

**Goal:** All controls are accessible and readable at ≥ 320 px wide. Nothing overflows or becomes unreachable on mobile.

Tasks:
1. Open Chrome DevTools → Device emulation → iPhone SE (375 px wide)
2. Check every element: stat bars, action buttons, poo area, message area, header, footer
3. Check at 320 px — the minimum supported width
4. Fix any overflow, clipping, or inaccessible elements via CSS adjustments
5. Re-check at standard desktop (1280 px) to confirm no regressions

Verify: All buttons reachable at 375 px. No horizontal scroll. Text does not overflow containers. Overlays fit the viewport.

---

## Task Group 3 — Page Visibility API

**Goal:** When the user hides the browser tab and returns, elapsed real time is converted to ticks and applied in bulk so stats reflect actual time passed.

Tasks:
1. Locate `onVisibilityChange()` in `js/game.js` — confirm it records `hiddenAt` on hide and applies bulk ticks on return
2. If already correctly implemented (it is, from Phase 1): document as verified — no code change needed
3. Verify behaviour manually: hide tab for 65 seconds (> 2 ticks), return, confirm stats have decayed by 2 ticks worth

Verify: Console log `cat.hunger` before hiding. Wait 65 s. Return to tab. `cat.hunger` decreased by 2 × decay rate (6 for normal, 3 for evolved).

---

## Task Group 4 — Visual Consistency Audit

**Goal:** Confirm all visual elements render correctly and consistently before shipping.

Checklist:
| # | Check | Where |
|---|---|---|
| V1 | All eight states render without layout breaks | Console — trigger each state |
| V2 | Stat bars use `steps()` — no smooth fill animation | DevTools Styles panel |
| V3 | `image-rendering: pixelated` applied to sprite and container | DevTools Styles panel |
| V4 | Dark mode renders correctly on welcome and game screen | Toggle theme button |
| V5 | Light mode renders correctly on welcome and game screen | Toggle theme button |
| V6 | Evolution badge appears after evolution and persists | Console evolution trigger |
| V7 | Tap-to-pet mark appears and disappears after 1.5 s | Tap sprite after setup |
| V8 | Poo removal animation plays before re-render | Create poo, click to clean |

Tasks:
1. Work through checklist V1–V8; note any failures
2. Fix any failures found; re-verify after fix

---

## Task Group 5 — Pre-deploy Checklist

**Goal:** App is ready to go live. No console errors. All links correct. Tests green.

Tasks:
1. Open `index.html` in browser with DevTools Console open — confirm zero errors on load and zero errors after starting a game
2. Confirm the GITHUB link in the game header opens `https://github.com/fonsecagabriella/tiny_cat` in a new tab
3. Confirm footer text reads correctly with the correct URL
4. Run `npm test` — all tests must pass
5. Push all changes to `main` — GitHub Pages deploys automatically
6. Open the live GitHub Pages URL and repeat smoke tests from Level 1 of `validation.md`
7. Document any cross-browser differences in `validation.md` Known Findings section
