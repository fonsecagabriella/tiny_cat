# Requirements — Phase 3: Cat Sprite and Visual State Feedback

All requirements are traceable to Phase 3 deliverables in `specs/roadmap.md`.

---

## REQ-S01 — Pixel Art Style

| ID | Requirement |
|---|---|
| S01.1 | The cat sprite is an inline SVG built exclusively from `<rect>` and `<polygon>` elements — no `<circle>`, `<ellipse>`, or curved `<path>` commands |
| S01.2 | All edges are hard: no anti-aliasing, no gradients, no blur, no drop-shadow filters |
| S01.3 | The SVG element and its container must carry `image-rendering: pixelated` and `image-rendering: crisp-edges` |
| S01.4 | The sprite is inline SVG injected into the DOM — not an external image file |

---

## REQ-S02 — Colour Tinting

| ID | Requirement |
|---|---|
| S02.1 | All body elements (head, torso, ears, limbs, tail) use the `colour` value passed to `getCatSVG()`, which reflects `--cat-colour` |
| S02.2 | Non-body elements (inner ear, nose, facial features, whiskers) use fixed colours independent of `--cat-colour` |
| S02.3 | Changing `--cat-colour` and re-rendering updates the sprite colour immediately without a page reload |

---

## REQ-S03 — State Expressions

| ID | Requirement |
|---|---|
| S03.1 | Eight distinct visual expressions are defined: Fine, Hungry, Tired, Bored, Happy, Showing Belly, Sick, Evolved |
| S03.2 | Each state is visually distinguishable from all others without reading any text label |
| S03.3 | **Fine** — neutral dot eyes, small straight mouth |
| S03.4 | **Hungry** — brows angled downward toward centre, mouth curves down |
| S03.5 | **Bored** — eyes are half-height rectangles (drooping lids), mouth is a flat horizontal line |
| S03.6 | **Happy** — eyes are closed upward arcs (built from step-rects), wide smile, small blush rectangles below each eye |
| S03.7 | **Showing Belly** — sprite reoriented to show cat on its back; lighter-coloured belly rectangle visible in centre |
| S03.8 | **Sick** — each eye is two crossing rectangles forming an X; mouth is uneven/jagged; a small indicator mark (e.g. droplet or sweat mark) is present |
| S03.9 | **Evolved** — eyes are pixel diamond shapes; mouth is a wide smile; two small sparkle marks appear near the head |
| S03.10 | If an unknown state key is passed to `getCatSVG()`, the Fine expression is used as fallback |
| S03.11 | **Tired** — eyes are half-height rectangles (thinner than Bored's drooping lids), mouth is a small open square (yawn), a pixel ZZZ mark appears near the top of the head |

---

## REQ-S04 — Showing Belly State

| ID | Requirement |
|---|---|
| S04.1 | The Showing Belly sprite shows the cat on its back with a lighter belly area visible |
| S04.2 | When the belly state is active, a warm tint overlay (`rgba(255, 200, 100, 0.08)`) is applied over the game screen |
| S04.3 | The overlay is `pointer-events: none` and does not block interaction with any button |
| S04.4 | The overlay is removed immediately when the belly state ends |

---

## REQ-S05 — Evolved Sprite Size

| ID | Requirement |
|---|---|
| S05.1 | The evolved sprite is visibly larger than all other state sprites |
| S05.2 | Size increase is applied via CSS `transform: scale()` on `.cat-svg.state-evolved` |
| S05.3 | The scale value must be large enough to be noticeable at a glance (≥ 1.2×) |

---

## REQ-S06 — Stat Bars

| ID | Requirement |
|---|---|
| S06.1 | Three stat bars are displayed: Hunger, Happiness, Energy |
| S06.2 | Each bar is segmented into 10 equal blocks with visible gaps between them |
| S06.3 | Bar fill colour reflects the current value: green (> 50), yellow (26–50), red (0–25) |
| S06.4 | A numeric value (0–100) is displayed alongside each bar |
| S06.5 | Bars update in real time on each tick and immediately after each player action |
| S06.6 | Bar fill transition uses `steps()` for a pixel-snap effect — no smooth interpolation |

---

## REQ-S07 — Poo Area

| ID | Requirement |
|---|---|
| S07.1 | Up to 5 poo icons are displayed in `#poo-area` |
| S07.2 | The number of poo icons always equals `cat.poos` |
| S07.3 | Each poo icon is a clickable button |
| S07.4 | Clicking a poo icon triggers the clean-up confirmation flow |
| S07.5 | After a poo is confirmed-cleaned, `#poo-area` re-renders with the updated count |

---

## REQ-S08 — Action Button Animation

| ID | Requirement |
|---|---|
| S08.1 | All action buttons (Feed, Play, Rest, Pet) respond to click with a pixel-offset press animation |
| S08.2 | Press animation: button translates 3px right and 3px down, box-shadow removed |
| S08.3 | Animation is governed by the CSS `:active` pseudo-class — no additional JavaScript or keyframes required |
| S08.4 | Disabled buttons do not animate |

---

## REQ-S09 — Evolution Message

| ID | Requirement |
|---|---|
| S09.1 | When `events.evolved` is true in `renderGame()`, the evolution overlay is shown |
| S09.2 | The overlay displays the cat's name and a congratulations message |
| S09.3 | The overlay must be explicitly dismissed by the user before play continues |
| S09.4 | Dismissing the overlay does not affect game state or stats |
