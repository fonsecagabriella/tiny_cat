Three tasks — specs only, no code changes yet.

## Task 1 — Update specs/roadmap.md
- Mark Phase 5 as complete:
  "## ✅ Phase 5 — Easter Eggs"
- Remove "Smooth CSS transitions on stat bar changes 
  and state switches" from Phase 6 deliverables
- Add to Phase 6 deliverables:
  "Stat labels shown in full on screen: 
  'Food' (display only), 'Happiness', 'Energy'"
- Update Phase 6 definition of done to:
  "App is live at the GitHub Pages URL and passes 
  all success criteria in mission.md and all smoke 
  tests in validation.md. Stat labels display in 
  full with no abbreviations."

## Task 2 — Update specs/mission.md
Add a note under Stats section:

### Display Labels
The internal stat name 'Hunger' is displayed as 
'Food' on the game screen only.
All other stat names (Happiness, Energy) are 
displayed in full — no abbreviations anywhere.
This is a display-only change — all internal 
code, variable names, and test references 
continue to use 'hunger'.

## Task 3 — Create feature spec files for Phase 6

### features/06-polish-and-deploy/feature-plan.md
Five task groups:

Group 1 — Stat Label Update:
- In js/ui.js, update renderStatBar() or equivalent 
  to display 'Food' instead of 'Hunger' and full 
  names for Happiness and Energy
- No changes to variable names, js/cat.js, 
  js/game.js, or any test files
- Verify all three labels show correctly on screen

Group 2 — Responsive Layout:
- Audit current layout on mobile (≥ 320px wide) 
  and desktop
- Fix any elements that overflow or become 
  inaccessible below 420px width
- Test on Chrome DevTools mobile emulation: 
  iPhone SE (375px) and standard desktop (1280px)

Group 3 — Page Visibility API:
- Confirm or implement: when browser tab is hidden 
  and returned to focus, elapsed ticks since hide 
  are calculated and applied in bulk
- Stat decay must reflect real elapsed time, 
  not just resume from last tick
- No visual glitch on return to tab

Group 4 — Visual Consistency Audit:
- Check all seven states render correctly 
  with no layout breaks
- Confirm stat bars use steps() — no smooth 
  interpolation
- Confirm pixel-art rendering rules are applied 
  consistently (image-rendering: pixelated)
- Confirm dark/light mode works across all screens
- Confirm evolution badge renders correctly 
  after evolution

Group 5 — Pre-deploy Checklist:
- Confirm index.html loads with no console errors
- Confirm all links in header open in new tab
- Confirm footer text is correct
- Confirm npm test passes (all existing tests green)
- Document any manual cross-browser findings 
  (Chrome, Firefox, Safari) in validation.md

### features/06-polish-and-deploy/requirements.md
Explicit requirements including:
- REQ-P01: Stat labels — Food, Happiness, Energy 
  in full, no abbreviations
- REQ-P02: Responsive — all controls accessible 
  at ≥ 320px width
- REQ-P03: Page Visibility — elapsed ticks applied 
  on tab return
- REQ-P04: Visual consistency — steps() on bars, 
  pixelated rendering, no layout breaks
- REQ-P05: Deploy — app live at GitHub Pages URL, 
  no console errors on load

### features/06-polish-and-deploy/validation.md
Two levels:

Level 1 — Smoke tests:
- Stat labels show 'Food', 'Happiness', 'Energy'
- No console errors on load
- npm test passes
- App loads on mobile width (375px emulation)

Level 2 — Manual flow tests:
- Responsive: test on iPhone SE emulation and 
  desktop; all buttons reachable, no overflow
- Page Visibility: hide tab for 2+ minutes, 
  return — stats have decayed correctly
- Stat bar style: confirm steps() in DevTools 
  (no smooth transition on bar fill)
- Cross-browser: open in Chrome, Firefox, Safari; 
  document any differences
- Dark/light mode: verify on both screens in 
  both modes
- Evolution badge: trigger evolution, verify badge 
  persists through mode switch and tab hide/return

Show a summary of all files created or changed.