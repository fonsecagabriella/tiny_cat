# Feature Plan — Phase 5: Easter Eggs

## Overview

Two hidden interactions reward players who explore beyond the core loop. Neither is hinted at in the visible UI. Both must coexist with the existing state machine without conflicting.

Files that may be touched: `js/ui.js`, `js/game.js`, `js/cat.js`, `css/style.css`, `index.html`.

---

## Task Group 1 — EE-01: Evolution Badge

**Goal:** When the cat evolves, record how long the session has been running and display the elapsed time as a permanent badge on the game screen.

### Tasks

1. **Record session start time** — In `js/game.js`, when `startGame()` is called, record `sessionStartTime = Date.now()`. Expose it as a module-level variable accessible from `ui.js`.

2. **Calculate elapsed time on evolution** — In `js/ui.js`, update `showEvolutionOverlay()` to calculate elapsed milliseconds (`Date.now() - sessionStartTime`), convert to "Xm Ys" format, and pass the string to a new `renderEvolutionBadge(timeStr)` function.

3. **Show time string in evolution overlay** — Add a `<p id="evolved-time"></p>` element to `#evolution-overlay` in `index.html`. `showEvolutionOverlay()` sets its `textContent` to the formatted time string.

4. **Persist badge after overlay is dismissed** — Add a `<div id="evolution-badge"></div>` element to the game screen in `index.html`, hidden by default. `renderEvolutionBadge(timeStr)` sets its text to `"[name] evolved in Xm Ys"` and removes the `.hidden` class. The badge element remains visible for the rest of the session.

5. **Badge hidden before evolution** — `#evolution-badge` carries `.hidden` on page load and is never shown unless evolution has occurred.

6. **No UI hint before trigger** — The badge element must not be visible, and no label or placeholder must appear in the game screen before evolution fires.

Verify: Start game, trigger evolution via console (`cat.evolved = true; renderGame({ evolved: true })`). Evolution overlay shows time string. Click Continue — badge appears on game screen with correct name and time. Remains through ticks.

---

## Task Group 2 — EE-02: Tap to Pet

**Goal:** Clicking/tapping the cat sprite produces a purr or a bite depending on whether trust and willing conditions are met.

### Tasks

1. **Track feedCount and playCount on cat** — In `js/cat.js`, add `feedCount: 0` and `playCount: 0` to `createCat()`. In `js/ui.js`, increment `cat.feedCount` inside each food-option click handler (after a successful feed, not on overflow/full). Increment `cat.playCount` in the play button handler and in the laser drag handler (once per successful `triggerPlay`).

2. **Add tap listener on `#cat-sprite-container`** — In `js/ui.js`, inside `initLaser()` or in a new `initTapPet()` function called from `DOMContentLoaded`, attach a `click` event to `#cat-sprite-container`. Guard against firing during laser drag (use a flag or check drag distance).

3. **Evaluate conditions on tap**:
   - Trust: `cat.feedCount >= 1 && cat.playCount >= 1`
   - Willing: trust met AND `cat.hunger > 75 && cat.happiness > 75 && cat.energy > 75`
   - Blocked: `cat.sick === true` or `cat.bellyActive === true` — tap does nothing

4. **Willing outcome** — Apply `cat.happiness = clamp(cat.happiness + 10, 0, 100)`. Show a pixel heart mark (`#tap-mark`) near the cat head for 1.5 seconds. Show message "Purr… ♥" in `#message-area`. Re-render stats.

5. **Unwilling outcome** — Apply `cat.happiness = clamp(cat.happiness - 15, 0, 100)` and `cat.energy = clamp(cat.energy - 10, 0, 100)`. Show a pixel angry mark (`#tap-mark`) near the cat head for 1.5 seconds. Show message "Ouch! Bad timing." in `#message-area`. Re-render stats.

6. **`#tap-mark` element** — A small `<div id="tap-mark">` positioned absolutely over the cat sprite container, hidden by default. On each tap outcome, set its content (pixel heart or angry mark as SVG or CSS), show it, then hide it after 1.5 seconds. No CSS transition — use `setTimeout` for the hide only.

7. **No hint in UI** — `#tap-mark` is invisible at rest. No label, tooltip, or cursor change on the sprite container hints at the interaction.

Verify: Use console shortcuts from `validation.md` to set up each scenario; tap the sprite; confirm correct outcome, message, and mark appear then disappear.
