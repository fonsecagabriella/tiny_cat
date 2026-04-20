# Requirements — Phase 6: Polish and Deploy

All requirements are traceable to Phase 6 deliverables in `specs/roadmap.md`.

---

## REQ-P01 — Stat Labels

| ID | Requirement |
|---|---|
| P01.1 | The stat label for Hunger is displayed as 'Food' on the game screen |
| P01.2 | The stat label for Happiness is displayed as 'Happiness' in full — no abbreviation |
| P01.3 | The stat label for Energy is displayed as 'Energy' in full — no abbreviation |
| P01.4 | No abbreviations (HNG, HAP, NRG, or similar) appear anywhere on the game screen |
| P01.5 | The change is display-only — all internal variable names, `js/cat.js`, `js/game.js`, and test files continue to use `hunger`, `happiness`, `energy` unchanged |

---

## REQ-P02 — Responsive Layout

| ID | Requirement |
|---|---|
| P02.1 | All action buttons (Feed, Play, Rest, Pet) are fully visible and tappable at 375 px viewport width |
| P02.2 | All stat bars, labels, and numeric values are visible without horizontal scroll at 375 px |
| P02.3 | All overlays (confirm, belly, evolution) fit within the viewport at 375 px with no overflow |
| P02.4 | The game screen is usable at the minimum supported width of 320 px — no controls are clipped or unreachable |
| P02.5 | No regressions at desktop width (≥ 1280 px) |

---

## REQ-P03 — Page Visibility API

| ID | Requirement |
|---|---|
| P03.1 | When the browser tab is hidden, the hide timestamp is recorded |
| P03.2 | When the tab returns to focus, elapsed time since hide is calculated |
| P03.3 | The number of missed 30-second ticks is computed: `floor(elapsed / 30000)` |
| P03.4 | All missed ticks are applied in bulk via `runTick()` before the next render |
| P03.5 | Stats after return reflect the correct decayed values — as if the game had been running in the foreground |
| P03.6 | No visual glitch or console error occurs when returning to a hidden tab |

---

## REQ-P04 — Visual Consistency

| ID | Requirement |
|---|---|
| P04.1 | All eight states (Fine, Hungry, Tired, Bored, Happy, Belly, Sick, Evolved) render without layout breaks |
| P04.2 | Stat bar fill transitions use `steps()` — no smooth interpolation visible |
| P04.3 | `image-rendering: pixelated` and `image-rendering: crisp-edges` are applied to `.cat-svg` and `#cat-sprite-container` |
| P04.4 | Dark mode is visually correct on both welcome screen and game screen |
| P04.5 | Light mode is visually correct on both welcome screen and game screen |
| P04.6 | The evolution badge appears after evolution and is not removed by ticks, re-renders, or theme switches |

---

## REQ-P05 — Deployment

| ID | Requirement |
|---|---|
| P05.1 | `index.html` loads in browser with zero console errors |
| P05.2 | Starting a game produces zero console errors |
| P05.3 | The GITHUB header link points to the correct repository URL and opens in a new tab |
| P05.4 | The footer attribution text is correct |
| P05.5 | `npm test` passes with all existing tests green before deployment |
| P05.6 | The app is live at the GitHub Pages URL and fully functional |
