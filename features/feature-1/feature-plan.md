# Feature Plan — Laser Easter Egg

## Overview

A hidden interaction: clicking and dragging on the game screen activates a laser pointer that the cat chases. This produces the same effect as the Play action (+20 Happiness, −10 Energy) without using the Play button. There is no UI hint — the user discovers it by accident or curiosity.

## Implementation

### Files to modify
- `js/ui.js` — attach mouse/touch event listeners to the game screen
- `js/game.js` — expose a `triggerPlay()` function reusable by both the Play button and the laser
- `css/style.css` — laser beam and dot visual

### Sequence of work

1. **Refactor Play action** (`game.js`)
   Extract the Play logic into a shared `triggerPlay(cat)` function. The Play button and the laser both call this function. Respects the same constraint: disabled if Energy ≤ 10.

2. **Detect click-and-drag** (`ui.js`)
   Listen for `mousedown` + `mousemove` (desktop) and `touchstart` + `touchmove` (mobile) on the game screen container. A drag is defined as: mouse/touch held down AND moved ≥ 20 px from the starting point.

3. **Render the laser** (`ui.js`, `style.css`)
   While dragging, render a red dot (laser) that follows the cursor/finger position. Optionally draw a line from a fixed "pointer" origin to the dot.

4. **Trigger Play effect** (`ui.js` → `game.js`)
   On drag start (once per drag gesture, not continuously), call `triggerPlay(cat)`. The effect fires once per drag — not once per pixel moved. A cooldown of 5 seconds prevents spamming.

5. **End laser** (`ui.js`)
   On `mouseup` / `touchend`, remove the laser dot and line from the DOM.

## Key Decisions

- Effect fires **once per drag gesture**, not repeatedly while dragging.
- **5-second cooldown** between laser triggers (same drag spam protection as other actions).
- Laser is **visually suppressed** if Energy ≤ 10 (dot appears grey instead of red; no effect fires).
- No tooltip, no label, no mention in the UI — fully hidden discovery.
- Works on both desktop (mouse) and mobile (touch).