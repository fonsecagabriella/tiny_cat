# Requirements — Phase 2: Welcome Screen and Personalisation

All requirements are traceable to Phase 2 deliverables in `specs/roadmap.md` and the rules in `specs/mission.md`.

---

## REQ-W01 — Name Input

| ID | Requirement |
|---|---|
| W01.1 | Name input accepts a maximum of 20 characters (`maxlength="20"`) |
| W01.2 | Name input accepts a minimum of 1 non-whitespace character for Start to be enabled |
| W01.3 | Whitespace-only input (e.g. spaces, tabs) does not satisfy the minimum — Start remains disabled |
| W01.4 | The name entered by the user is stored on the cat object and displayed on the game screen |
| W01.5 | On restart (New Cat confirmed), the name input is cleared |

---

## REQ-W02 — Colour Picker

| ID | Requirement |
|---|---|
| W02.1 | The colour picker is a free colour input (`<input type="color">`), not preset swatches |
| W02.2 | Default colour on load is `#f4a261` (Rust) |
| W02.3 | Selected colour sets the `--cat-colour` CSS custom property on the `<html>` element |
| W02.4 | On restart (New Cat confirmed), the colour input resets to `#f4a261` |

---

## REQ-W03 — Start Button

| ID | Requirement |
|---|---|
| W03.1 | Start button is disabled on page load |
| W03.2 | Start button becomes enabled as soon as the name input contains ≥ 1 non-whitespace character |
| W03.3 | Start button returns to disabled if the name input is cleared or contains only whitespace |
| W03.4 | Clicking Start when disabled has no effect |

---

## REQ-W04 — Cat Creation

| ID | Requirement |
|---|---|
| W04.1 | On Start: `createCat()` is called with the entered name and chosen colour |
| W04.2 | Starting stats: Hunger 80, Happiness 80, Energy 80 |
| W04.3 | Preferred food is randomly assigned inside `createCat()` — one of: kibble, tuna, treats |
| W04.4 | Preferred food is not displayed to the user at any point |
| W04.5 | On Start: `startGame(cat)` is called immediately after `createCat()` |

---

## REQ-W05 — Game Screen Scaffold

| ID | Requirement |
|---|---|
| W05.1 | After Start, the game screen is shown and the welcome screen is hidden |
| W05.2 | The cat's name is displayed on the game screen |
| W05.3 | The chosen colour is applied via `--cat-colour` CSS custom property (set during swatch selection; carries over to game screen) |
| W05.4 | The game screen shows placeholder content for stat bars and action buttons (full visuals added in Phase 3) |

---

## REQ-W06 — New Cat Button

| ID | Requirement |
|---|---|
| W06.1 | A "New Cat" button is always visible on the game screen |
| W06.2 | Clicking New Cat triggers a confirmation prompt before any reset occurs |
| W06.3 | If the user cancels the confirmation, nothing changes — game continues |
| W06.4 | If the user confirms: `stopGame()` is called, cat state is cleared, name input is cleared, swatch resets to Rust, and the welcome screen is shown |
| W06.5 | After restart, the Start button is disabled (name input is empty) |

---

## REQ-W07 — Dark/Light Mode Toggle

| ID | Requirement |
|---|---|
| W07.1 | A single toggle button is visible on both the welcome screen and game screen |
| W07.2 | Dark mode is the default on page load — no user action required |
| W07.3 | Clicking the toggle switches between dark and light mode by setting `data-theme` on `<html>` |
| W07.4 | The toggle state persists through screen transitions (welcome → game → welcome) within the same session |
| W07.5 | The toggle state is not saved to `localStorage` — reloading the page resets to dark mode |
| W07.6 | Button label reads "Light Mode" when in dark mode, and "Dark Mode" when in light mode |

---

## REQ-W08 — Header Links (game screen only)

| ID | Requirement |
|---|---|
| W08.1 | Top of game screen shows three links: Fork (GitHub repo), GitHub profile, Personal website |
| W08.2 | Links open in a new tab |
| W08.3 | URLs to be confirmed by creator before implementation (placeholders acceptable for now) |

---

## REQ-W09 — Footer

| ID | Requirement |
|---|---|
| W09.1 | Bottom of game screen shows static text: "created with <3 and claude by imgabidotcom" |
| W09.2 | Footer is always visible on game screen |

---

## REQ-W10 — Pet Creation Transition

| ID | Requirement |
|---|---|
| W10.1 | After Start is clicked, before the game screen appears, a transition screen is shown |
| W10.2 | Transition shows: "[pet name] is being made" |
| W10.3 | A short animation plays (spinner, dots, or similar) |
| W10.4 | After animation completes, game screen fades in |
| W10.5 | Transition duration: approximately 2 seconds |