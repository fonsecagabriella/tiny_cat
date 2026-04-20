# Feature Plan — Phase 4: Sick State, Poo Cleaning, and Recovery

## Overview

Complete and verify the full Sick → Recovery flow. Most deliverables are already implemented from earlier phases. The agent must audit each one against the requirements before writing any code. Only implement what is missing or incorrect. The one confirmed new feature is the poo removal animation.

No game logic changes — `js/game.js` and `js/cat.js` must not be modified.

## Files

- `js/ui.js` — poo removal animation logic
- `css/style.css` — poo removal animation keyframes and class

---

## Task Groups

### Group 1 — Audit: Verify Existing Implementations

**Goal:** Check each Phase 4 deliverable against the current codebase before touching any code. If a check fails, note it and fix it within this group.

Audit checklist:

| # | What to check | Where to look |
|---|---|---|
| A1 | Sick sprite expression is visually distinct (X eyes, jagged mouth, sweat drop) | `getCatSVG()` in `js/ui.js`, verify `face_sick` definition |
| A2 | Poo-click handler uses in-page overlay — no `window.confirm` or `window.alert` anywhere in the flow | `onPooClick()` in `js/ui.js`; search for `window.confirm` and `window.alert` |
| A3 | `#confirm-overlay` is shown with Yes/No buttons; clicking Yes cleans the poo and re-renders | `onPooClick`, `confirm-yes` handler in `js/ui.js` |
| A4 | `renderSickHint()` shows a visible status bar when Sick listing what the player still needs to do | `renderSickHint()` in `js/ui.js`; `#sick-hint` in `index.html` |
| A5 | `#sick-hint` is hidden when the cat is not Sick | `renderSickHint()` logic |
| A6 | Belly overlay is in-page (`#belly-overlay`) with Yes/No buttons — no `window.confirm` | `belly-yes`, `belly-no` handlers in `js/ui.js`; `#belly-overlay` in `index.html` |
| A7 | Pet button (`#pet-btn`) is visible only when `cat.bellyActive === true` | `renderButtons()` in `js/ui.js` |
| A8 | Pet button is hidden at all other times | same |
| A9 | Clicking Yes on belly overlay resolves Purr or Attack with a feedback message in `#message-area` | `belly-yes` handler |
| A10 | Clicking No on belly overlay resolves without stat change and hides the overlay | `belly-no` handler |
| A11 | `checkBellyEvent()` in `cat.js` is blocked when `cat.sick === true` | `cat.js` line ~163 |

Verify: All checks pass. If any fails, fix it and re-verify.

---

### Group 2 — Poo Removal Animation

**Goal:** When a poo is confirmed-cleaned, the poo icon plays a brief CRT-style pixel animation before disappearing. The animation must feel intentional and match the retro aesthetic.

Animation spec:
- Style: pixel blink — the poo icon flashes opacity 3 times over ~300ms, then disappears
- Implementation: CSS `@keyframes poo-remove` on a `.poo-removing` class applied to the button
- JS: in `onPooClick`'s confirm callback, apply `.poo-removing` to the clicked poo button, wait for `animationend`, then call `cleanPoo` and `renderGame`

Tasks:
1. In `css/style.css`: add `@keyframes poo-remove` — three opacity blinks (1 → 0 → 1 → 0 → 1 → 0), total duration 300ms, `steps(1)` for pixel-snap
2. Add `.poo-removing` class rule: `animation: poo-remove 0.3s steps(1) forwards`
3. In `js/ui.js`: refactor `onPooClick` — capture a reference to the clicked button; in the confirm callback, add `.poo-removing` to it, listen for `animationend`, then clean and re-render

Verify: Click a poo → confirm → the poo icon blinks 3 times then disappears. Re-render shows correct reduced count.

---

### Group 3 — Verify Full End-to-End Flow

**Goal:** Confirm all flows work together without regression after Group 2 changes.

Tasks:
1. Run `npm test` — all 81 tests must pass
2. Manually verify each Level 2 flow in `validation.md` (console shortcuts provided there)

Verify: All automated tests pass. All manual validation checks pass.
