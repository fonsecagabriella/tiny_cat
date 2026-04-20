# Requirements — Phase 4: Sick State, Poo Cleaning, and Recovery

All requirements are traceable to Phase 4 deliverables in `specs/roadmap.md`.

**Important:** `window.confirm` and `window.alert` are not acceptable for any user-facing prompt in this phase. All confirmations and overlays must be in-page HTML elements.

---

## REQ-R01 — Sick State Visual

| ID | Requirement |
|---|---|
| R01.1 | When `evaluateState(cat)` returns `'sick'`, the sprite rendered by `getCatSVG('sick', colour)` shows X eyes (two pixel-staircase diagonals per eye), a jagged/uneven mouth, and a small indicator mark |
| R01.2 | The state label reads "Sick" and blinks using the CSS blink animation |
| R01.3 | The Sick expression is visually distinguishable from all other states without reading the label |

---

## REQ-R02 — Poo-Click Confirmation

| ID | Requirement |
|---|---|
| R02.1 | Clicking a poo icon shows `#confirm-overlay` — an in-page HTML overlay — not a browser dialog |
| R02.2 | `window.confirm` and `window.alert` must not be called anywhere in the poo-click flow |
| R02.3 | The confirm overlay displays a message asking the player to confirm the clean-up |
| R02.4 | Clicking Yes in the confirm overlay cleans one poo, re-renders `#poo-area`, and updates all stat bars |
| R02.5 | Clicking No in the confirm overlay closes it without changing any game state |

---

## REQ-R03 — Poo Removal Animation

| ID | Requirement |
|---|---|
| R03.1 | When a poo clean-up is confirmed, the poo icon plays a pixel blink animation before disappearing |
| R03.2 | The animation uses `steps(1)` for a pixel-snap effect — no smooth easing |
| R03.3 | The animation completes before `#poo-area` re-renders with the updated count |
| R03.4 | The animation duration is ≤ 400ms — it must feel snappy, not sluggish |
| R03.5 | The animation is governed by CSS — no `setTimeout`-based delays used as a substitute |

---

## REQ-R04 — Recovery UI

| ID | Requirement |
|---|---|
| R04.1 | When `cat.sick === true`, a visible status bar (`#sick-hint`) is displayed on the game screen |
| R04.2 | `#sick-hint` lists each unmet recovery condition: poos to clean, hunger level needed (≥ 50), happiness level needed (> 50) |
| R04.3 | Conditions that are already met are not listed |
| R04.4 | When all conditions are met but recovery has not yet been checked, the hint reads "Almost recovered…" |
| R04.5 | `#sick-hint` is hidden (`display: none` or `.hidden` class) when the cat is not Sick |

---

## REQ-R05 — Belly Overlay

| ID | Requirement |
|---|---|
| R05.1 | The belly-showing prompt is `#belly-overlay` — an in-page HTML overlay — not a browser dialog |
| R05.2 | `window.confirm` and `window.alert` must not be called anywhere in the belly event flow |
| R05.3 | The overlay contains two buttons: Yes and No |
| R05.4 | Clicking Yes resolves the belly event (50% Purr / 50% Attack), closes the overlay, and displays an outcome message in `#message-area` |
| R05.5 | Clicking No closes the overlay and resets the belly counter without changing stats |

---

## REQ-R06 — Pet Button

| ID | Requirement |
|---|---|
| R06.1 | `#pet-btn` is visible if and only if `cat.bellyActive === true` |
| R06.2 | `#pet-btn` is hidden at all other times, including during Sick, Evolved, Fine, and all other states |
| R06.3 | Clicking `#pet-btn` opens the belly overlay (`#belly-overlay`) |
| R06.4 | After the belly event resolves, `#pet-btn` returns to hidden |

---

## REQ-R07 — Sick Suppresses Belly Event

| ID | Requirement |
|---|---|
| R07.1 | `checkBellyEvent()` does not set `cat.bellyActive = true` when `cat.sick === true` |
| R07.2 | While the cat is Sick, the belly overlay does not appear even if happiness reaches 100 |
| R07.3 | The Pet button does not appear while the cat is Sick |
