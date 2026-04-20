# Feature Plan — Phase 3: Cat Sprite and Visual State Feedback

## Overview

Replace the existing smooth SVG cat with a true pixel-art sprite. Add distinct visual expressions for all seven states, evolve size scaling, belly overlay tint, and polish all visual feedback elements (stat bars, poo area, button animations, evolution message).

No game logic changes — this phase is purely visual. `js/game.js` and `js/cat.js` must not be modified.

## Files

- `js/ui.js` — `getCatSVG()` function rewritten; belly overlay tint logic added
- `css/style.css` — pixel art rendering rules, belly tint overlay, button animation, evolved scale

---

## Task Groups

### Group 1 — Pixel Art Base Sprite

**Goal:** Replace the existing smooth SVG with a true pixel-grid sprite. The base shape must use only right angles and 45° diagonals — no curves, no smooth paths, no gradients. The body is tinted by `--cat-colour`.

Tasks:
1. Rewrite `getCatSVG()` in `js/ui.js` — build the cat silhouette from `<rect>` and `<polygon>` elements only; no `<circle>`, `<ellipse>`, or curved `<path>` commands
2. Apply `--cat-colour` to all body elements via the `colour` parameter passed to the function
3. Use fixed colours for non-body elements (inner ear, nose, whiskers, facial features)
4. Ensure the SVG element carries `class="cat-svg state-[state]"`
5. In `css/style.css`: confirm `image-rendering: pixelated` and `image-rendering: crisp-edges` are set on `.cat-svg` and `#cat-sprite-container`; remove any `filter: drop-shadow` or blur that contradicts the pixel-art aesthetic

Verify: Open game screen. Sprite is visible. Zoom in — edges are hard and blocky, no anti-aliasing. Body colour matches the chosen colour from the picker.

---

### Group 2 — Seven State Expressions

**Goal:** Each of the seven states produces a visually distinct face. Expressions are composed entirely of pixel-grid elements (rects, polygons — no curves).

States and required expressions:

| State | Expression |
|---|---|
| Fine | Neutral: open dot eyes, small straight mouth |
| Hungry | Angled-down inner brows, downturned mouth |
| Bored | Half-height rectangle eyes (drooping lids), flat line mouth |
| Happy | Closed arc eyes (upward curve built from step-rects), wide smile, blush marks |
| Showing Belly | Cat flipped on its back — body oriented upward, lighter belly area visible |
| Sick | X eyes (two crossing rects per eye), wavy/uneven mouth, small indicator mark |
| Evolved | Star/diamond eyes (pixel diamond shape), large wide smile, small sparkle marks |

Tasks:
1. Define a `faces` object in `getCatSVG()` with one entry per state key; each entry contains the pixel-grid SVG markup for eyes, mouth, and extras
2. For `belly` state: restructure the body layout — rotate or recompose the sprite to show the cat on its back; add a lighter-coloured belly rectangle
3. For `happy` state: add blush marks as small pixel rectangles below the eyes
4. For `evolved` state: add two small pixel sparkle marks near the head
5. Fall back to `fine` expression if an unknown state is passed

Verify: Without reloading, trigger each state via console (see `validation.md` Level 2). Each state shows a visually distinct face. Belly state shows the cat on its back.

---

### Group 3 — Evolved Scale and Belly Overlay

**Goal:** The evolved sprite is visibly larger. The belly state applies a warm screen tint.

Tasks:
1. In `css/style.css`: `.cat-svg.state-evolved` gets `transform: scale(1.25)` — noticeably larger than other states
2. Add a `#belly-tint` overlay `<div>` to `index.html` inside `#game-screen`: full-screen, `pointer-events: none`, `position: absolute`, `inset: 0`, hidden by default
3. In `css/style.css`: `#belly-tint` uses `background: rgba(255, 200, 100, 0.08)` when active; hidden otherwise
4. In `js/ui.js`: `renderSprite()` adds/removes `.active` class (or toggles `hidden`) on `#belly-tint` based on whether current state is `belly`

Verify: Start game, trigger `evolved` state via console — sprite is noticeably larger. Trigger `belly` state — game screen has a visible warm tint. Switch to another state — tint disappears.

---

### Group 4 — Stat Bars and Poo Area

**Goal:** Stat bars accurately display current values with colour coding. Poo icons are correct in count and clickable.

Tasks:
1. Confirm `renderStatBar()` in `js/ui.js` applies colour classes correctly: `.high` (green, >50), `.mid` (yellow, 26–50), `.low` (red, 0–25)
2. Confirm `.bar-fill` CSS transition uses `steps()` for a pixel-snap effect (no smooth animation)
3. Confirm `renderPoos()` creates exactly `cat.poos` poo buttons in `#poo-area`; each has a click handler that triggers the clean-up confirmation flow
4. Confirm `#poo-area` empties and re-renders correctly after a poo is cleaned

Verify: Start game. All three bars show 80. Feed to overflow — poo appears and is clickable. Click poo → confirm → poo removed. Stat bars update after each action.

---

### Group 5 — Action Button Animation and Evolution Message

**Goal:** Action buttons give immediate pixel-style feedback on click. Evolution produces a congratulations overlay.

Tasks:
1. In `css/style.css`: `.btn:active:not(:disabled)` uses `transform: translate(3px, 3px)` with `box-shadow: none` — pixel-offset press effect; duration is governed by the `:active` pseudo-class (no extra keyframe needed)
2. Confirm `renderGame()` calls `showEvolutionOverlay()` when `events.evolved` is true
3. Confirm `showEvolutionOverlay()` sets the cat's name in `#evolved-name` and shows `#evolution-overlay`
4. Confirm the overlay's Continue button hides the overlay and returns to the game screen

Verify: Click each action button — it shifts down-right on press and snaps back on release. Drive the cat to evolved state via console — evolution overlay appears with the cat's name, clicking Continue dismisses it.
