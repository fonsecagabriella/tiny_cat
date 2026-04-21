# Validation ��� Phase 6: Polish and Deploy

Manual validation. All checks performed in a browser with DevTools open.
Start a game session before running any state or flow test.

---

## Level 1 — Smoke Tests

Run these first. All must pass before proceeding to flow tests.

| # | Check | Expected |
|---|---|---|
| S01 | Open game screen | Stat labels read "Food", "Happiness", "Energy" — no abbreviations |
| S02 | Open browser console on load | Zero errors in Console panel |
| S03 | Start a game (enter name, click Start) | Zero errors after game starts |
| S04 | Run `npm test` in terminal | All existing tests pass |
| S05 | Open app in Chrome DevTools → Device emulation → iPhone SE (375 px) | App fits viewport; no horizontal scroll |
| S06 | Inspect `.bar-fill` transition in DevTools Styles | `transition` property uses `steps()` |
| S07 | Inspect `.cat-svg` in DevTools Styles | `image-rendering: pixelated` present |
| S08 | Click theme toggle | Both dark and light modes render without broken layout |
| S09 | Inspect welcome screen | `(i)` button visible |
| S10 | Start a game; inspect game screen | `(i)` button visible |
| S11 | Click `(i)` on either screen | Overlay opens with title "DECIPHER ME, HUMAN" |
| S12 | Click CLOSE or outside the overlay box | Overlay dismisses cleanly |

---

## Level 2 — Manual Flow Tests

### Flow 1 — Stat Labels

1. Start a game
2. Inspect the three stat rows on the game screen

Expected: Labels read "Food", "Happiness", "Energy" with numeric values and bars all aligned. Nothing overflows the stat row grid.

---

### Flow 2 — Responsive Layout

**iPhone SE (375 px):**
1. Open DevTools → Toggle device toolbar → iPhone SE
2. Start a game
3. Tap Feed → Food panel opens; tap a food; panel closes
4. Tap Play, Rest; confirm buttons are fully visible and tappable
5. Create a poo (console: `cat.hunger = 100; applyFeed(cat, cat.preference); renderGame({})`) → click poo → confirm overlay fits screen
6. Trigger evolution overlay: `cat.evolved = true; renderGame({ evolved: true })` → overlay fits; Continue button reachable

Expected: No overflow. All buttons reachable. Overlays fit within viewport.

**320 px minimum:**
1. Set viewport to 320 px
2. Repeat step 3–6 above

Expected: Nothing clipped or unreachable.

**Desktop (1280 px):**
1. Reset to desktop viewport
2. Confirm layout looks correct; no regressions

---

### Flow 3 — Page Visibility API

```js
// Before hiding: note hunger value
console.log('hunger before hide:', cat.hunger);
```

1. Start a game; note `cat.hunger` in console
2. Switch to a different tab or minimise browser window
3. Wait 65 seconds (more than 2 full 30-second ticks)
4. Return to the tab
5. Check `cat.hunger` in console

Expected: `cat.hunger` decreased by 2 × normal hunger decay (6 points for unevolved cat, or 3 for evolved). No console errors on return.

```js
// Verify after return:
console.log('hunger after return:', cat.hunger);
// Expected: approximately (hunger_before - 6) for normal cat
```

---

### Flow 4 — Visual Consistency Audit

**All eight states:**
```js
// Fine
cat.sick=false; cat.evolved=false; cat.bellyActive=false;
cat.hunger=60; cat.happiness=60; cat.energy=60; cat.poos=0; renderGame({});

// Hungry
cat.hunger=25; renderGame({});

// Tired
cat.hunger=80; cat.happiness=80; cat.energy=25; cat.poos=0; renderGame({});

// Bored
cat.hunger=80; cat.happiness=40; cat.energy=80; cat.poos=0; renderGame({});

// Happy
cat.hunger=80; cat.happiness=80; cat.energy=80; cat.poos=0; renderGame({});

// Belly
cat.bellyActive=true; renderGame({});

// Sick
cat.bellyActive=false; cat.sick=true; renderGame({});

// Evolved
cat.sick=false; cat.evolved=true; renderGame({});
```

Expected for each: distinct sprite expression, correct state label, no layout breaks.

**Evolution badge:**
```js
cat.sick=false; cat.bellyActive=false; cat.evolved=true;
renderGame({ evolved: true });
// Click Continue → badge appears
// Toggle theme; badge still visible
```

---

### Flow 5 — Cross-Browser Check

Open the live GitHub Pages URL in each browser. Run Level 1 smoke tests S01–S08 in each.

Document findings in the Known Findings section below.

| Browser | Version tested | Result | Notes |
|---|---|---|---|
| Chrome | | | |
| Firefox | | | |
| Safari | | | |

---

### Flow 7 — Help Overlay

1. Start a game; note the current `cat.hunger` value in console
2. Click `(i)` — overlay opens
3. Wait 35 seconds (long enough for one tick to fire)
4. Dismiss overlay (CLOSE or click outside)
5. Check `cat.hunger` in console

Expected: `cat.hunger` has decreased normally — the game loop continued running while the overlay was open. No console errors.

---

### Flow 6 — Dark / Light Mode

1. Start in dark mode (default)
2. Verify: welcome screen, game screen, all overlays look correct
3. Click theme toggle → light mode
4. Verify: welcome screen, game screen, all overlays look correct in light mode
5. Start game in light mode → play a round; confirm no visual breakage
6. Toggle back to dark mid-session; confirm no breakage

---

## Known Findings

*(Fill in after cross-browser testing)*

| Browser | Finding | Severity |
|---|---|---|
| | | |

---

## Known Scope Boundaries

| Item | Status |
|---|---|
| Haptic feedback on mobile tap-pet | Out of scope |
| PWA / offline support | Out of scope |
| Accessibility (ARIA labels, keyboard nav) | Out of scope |
