# Roadmap

Each phase is a discrete, shippable increment. Phases build on each other; later phases must not break earlier ones.

---

## Phase 1 — Core Game Loop

**Goal:** The game engine works. Stats decay, actions fire, state transitions happen — verifiable via browser console with no visual polish.

Deliverables:
- `cat.js`: Cat entity with name, colour, food preference, stats (Hunger 80, Happiness 80, Energy 80), poo count, and all internal tick counters
- `game.js`: 60-second tick loop with stat decay (Normal: −3/−2/−4; Evolved: −1.5/−1/−2)
- Action handlers: Feed (3 food options, preference logic, overflow → poo), Play (+20 Happiness, −10 Energy), Rest (+30 Energy, −5 Happiness)
- Poo mechanic: feed-overflow poo, natural-poo counter (10 ticks at Hunger 100), poo happiness drain (−1/tick/poo), max 5 poos
- State machine: Normal, Hungry, Bored, Happy, Sick, Evolved evaluated on every tick with correct priority
- Sick counters: hunger path (5 ticks < 10) and poo path (> 1 poo for > 10 ticks); Happiness halved on Sick entry
- Sick recovery: poos = 0 AND Hunger ≥ 50 AND Happiness > 50
- Evolved: 5 ticks with all stats ≥ 90 AND not Sick; permanent flag; decay rates halved
- Belly-showing event: 5 ticks at Happiness = 100 AND not Sick; random Purr/Attack outcome
- Play disabled at Energy ≤ 10; Feed disabled at poo count = 5
- Minimal HTML output (text only) proving all logic works

Definition of done: All state transitions and stat effects manually verified via browser console. Automated unit tests in `tests/game.test.js` pass.

---

## Phase 2 — Welcome Screen and Personalisation

**Goal:** The user can name and colour their cat before starting; restarts work end-to-end.

Deliverables:
- Welcome screen: name input (max 20 chars), colour picker, Start button
- Start button disabled until name has ≥ 1 non-whitespace character
- On Start: cat created with starting stats, preferred food randomly assigned
- Game screen scaffold showing cat name and chosen colour
- "New Cat" button with confirmation prompt → resets to Welcome screen

Definition of done: Full new-session (Flow 1) and restart (Flow 7) user flows work end-to-end.

---

## Phase 3 — Cat Sprite and Visual State Feedback

**Goal:** The cat has a visible presence. Its appearance reflects its current state.

Deliverables:
- Inline SVG cat sprite tinted by `--cat-colour` CSS custom property
- Distinct visual expression per state: Normal, Hungry, Bored, Happy, Sick, Evolved
- Evolved sprite visibly larger than Normal
- Stat bars (Hunger, Happiness, Energy) with numeric display
- Poo icons (up to 5) in a dedicated area; each is clickable
- Visual feedback on action buttons (brief animation on click)
- Congratulations message shown on evolution

Definition of done: All six states produce a visually distinct cat without refreshing the page. Poo icons appear and are clickable.

---

## Phase 4 — Sick State, Poo Cleaning, and Recovery

**Goal:** The full Sick → Recovery flow is complete and clearly communicated.

Deliverables:
- Sick state visual (distinct sprite expression)
- Poo-click confirmation message and removal animation
- Recovery UI: status message explaining what is needed ("Feed and clean to recover")
- Belly-showing overlay prompt (not a browser alert) with Yes/No options
- Pet action button: appears only during belly event; resolves Purr or Attack with feedback message
- Edge case: Sick suppresses belly-showing event

Definition of done: A cat can be driven into Sick state (both paths) and fully recovered. Belly event fires, is interactive, and resets correctly.

---

## Phase 5 — Easter Eggs

**Goal:** Hidden interactions reward curious or attentive players.

Details to be confirmed with creator before implementation.

Deliverables (placeholder):
- At least one discoverable interaction not listed in any visible UI
- Easter egg does not conflict with state machine logic or stat values
- Easter egg is reachable through normal play without breaking the game loop

Definition of done: Easter egg can be triggered and produces a distinct, intentional response.

---

## Phase 6 — Polish and Deploy

**Goal:** The app is visually complete, responsive, and live on GitHub Pages.

Deliverables:
- Consistent visual design (colour palette, typography, spacing)
- Responsive layout: playable on mobile (≥ 320 px wide) and desktop
- Smooth CSS transitions on stat bar changes and state switches
- Page Visibility API: elapsed ticks computed and applied on tab return
- Final GitHub Pages deployment with correct base URL
- Manual cross-browser check: Chrome, Firefox, Safari

Definition of done: App is live at the GitHub Pages URL and passes all success criteria in `mission.md` and all smoke tests in `validation.md`.
