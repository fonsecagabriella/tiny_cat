# Validation — Phase 3: Cat Sprite and Visual State Feedback

Manual validation only. No unit tests are required for this phase.
All checks are performed in a browser with DevTools open.
Start a game session before running any test (enter a name, click Start).

---

## Level 1 — Smoke Tests

Run these first. All must pass before proceeding to state tests.

| # | Check | Expected |
|---|---|---|
| S01 | Open game screen | Cat sprite is visible in `#cat-sprite-container` |
| S02 | Inspect sprite in Elements panel | SVG contains only `<rect>` and `<polygon>` elements — no `<circle>`, `<ellipse>`, or curved `<path>` |
| S03 | Zoom in on the sprite (browser zoom ≥ 200%) | Edges are hard and blocky; no anti-aliasing or smooth curves visible |
| S04 | Inspect `.cat-svg` in Styles panel | `image-rendering: pixelated` and `image-rendering: crisp-edges` are applied |
| S05 | Check sprite colour | Sprite body colour matches the colour chosen on the welcome screen |
| S06 | Change `--cat-colour` in DevTools on `<html>` | Trigger `renderGame({})` in console — sprite body updates to new colour |
| S07 | Inspect stat bars | Three bars (HNG, HAP, NRG) show value 80; numeric `80` displayed next to each |
| S08 | Inspect bar fill class | `.bar-fill` has class `high` (green) at value 80 |
| S09 | Click Feed → select a food | Hunger bar and numeric value update immediately |
| S10 | Inspect `#poo-area` on load | Area is empty (no poo icons) |
| S11 | Force a poo via console: `cat.hunger = 100; applyFeed(cat, cat.preference); renderGame({})` | One poo icon appears in `#poo-area` |
| S12 | Click the poo icon | Confirm dialog appears |
| S13 | Confirm the clean | Poo icon removed; `#poo-area` re-renders with 0 icons |
| S14 | Click any action button | Button shifts 3px down-right on press, snaps back on release |
| S15 | Inspect disabled Play button (drain energy first) | Disabled button does not shift on click |

---

## Level 2 — State Tests

Trigger each state using the console commands below. After each, verify the sprite expression is visually distinct from all others. The game screen must be active (game started) for `renderGame({})` to work.

**Note:** Because state is derived (not stored), higher-priority states block lower ones. Clear conflicting flags before testing a state. Priority order: Sick > Evolved > Showing Belly > Happy > Hungry > Tired > Bored > Fine.

---

### Fine

Game starts in Fine state — no console setup needed.

```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 60; cat.happiness = 60; cat.energy = 60; cat.poos = 0;
renderGame({});
```

Note: Stats set to 60 — above Fine threshold (≥ 50) but below Happy threshold (≥ 75).

Expected: Neutral expression — dot eyes, small straight mouth. No special styling.

---

### Hungry

```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 25;
renderGame({});
```

Expected: Brows angled downward toward centre; mouth curves down. State label reads "Hungry".

---

### Tired

```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 80; cat.happiness = 80; cat.energy = 25; cat.poos = 0;
renderGame({});
```

Expected: Half-closed eyes (thinner than Bored); small open square yawn mouth; ZZZ pixel mark near head. State label reads "Tired".

Note: Energy at 25 — below Tired threshold (< 30). Hungry threshold not met (Hunger still 80).

---

### Bored

```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 80; cat.happiness = 40; cat.energy = 80; cat.poos = 0;
renderGame({});
```

Expected: Half-height rectangle eyes (drooping lids); flat horizontal mouth. State label reads "Bored".

---

### Happy

```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80; cat.poos = 0;
renderGame({});
```

Expected: Closed upward-arc eyes; wide smile; small blush rectangles below each eye. State label reads "Happy".

---

### Showing Belly

```js
cat.sick = false; cat.evolved = false;
cat.bellyActive = true;
renderGame({});
```

Expected: Sprite shows cat on its back with lighter belly area visible. Warm tint overlay visible on the game screen background. State label reads "Belly" (or similar). Tint does not block any button.

---

### Sick

```js
cat.evolved = false; cat.bellyActive = false;
cat.sick = true;
renderGame({});
```

Expected: X eyes (two crossing rects per eye); uneven/jagged mouth; small indicator mark present. State label reads "Sick" and blinks. Sick hint bar visible.

---

### Evolved

```js
cat.sick = false; cat.bellyActive = false;
cat.evolved = true;
renderGame({});
```

Expected: Diamond/star eyes; wide smile; sparkle marks near head. Sprite is visibly larger than all other states (≥ 1.2× scale). State label reads "Evolved".

---

## Level 3 — Evolution Overlay

| Step | Action | Expected |
|---|---|---|
| 1 | Trigger evolution overlay via console: `renderGame({ evolved: true })` | Evolution overlay appears over game screen |
| 2 | Inspect overlay text | Cat's name is displayed; congratulations message visible |
| 3 | Click Continue | Overlay dismissed; game screen visible and functional |
| 4 | Check stats after dismiss | Stats unchanged; game loop still running |

---

## Known Scope Boundaries

| Item | Phase |
|---|---|
| Responsive layout and CSS polish | Phase 6 |
| Sick/recovery flow UI (sick hint, poo confirmation text) | Phase 4 |
| Belly overlay prompt (Yes/No interaction) | Phase 4 |
| Page Visibility API catch-up ticks | Phase 6 |
