# Validation — Phase 2: Welcome Screen and Personalisation

Manual validation only. No unit tests are required for this phase.
All checks are performed in a browser with DevTools open.

---

## Level 1 — Smoke Tests

Run these first. All must pass before proceeding to user flow tests.

| # | Check | Expected |
|---|---|---|
| S01 | Open `index.html` in browser | Page loads without console errors |
| S02 | Inspect the DOM | Welcome screen element is visible; game screen element is hidden |
| S03 | Check `<html>` in Elements panel | `data-theme="dark"` is set (or no attribute, with dark as CSS default) |
| S04 | Dark/light toggle is visible | Toggle button present on welcome screen |
| S05 | Name input is empty on load | Input value is `""` |
| S06 | Start button state on load | Start button has `disabled` attribute |
| S07 | Type a single space into name input | Start button remains disabled |
| S08 | Type one character into name input | Start button becomes enabled |
| S09 | Clear the name input | Start button returns to disabled |
| S10 | Check colour input value on load | `<input type="color">` value is `#f4a261` (Rust) |
| S11 | Check `--cat-colour` on `<html>` | Value is `#f4a261` (Rust) |
| S12 | Click dark/light toggle | `data-theme` on `<html>` switches; page colours update; button label changes to "Dark Mode" |
| S13 | Click toggle again | `data-theme` switches back to dark; button label returns to "Light Mode" |
| S14 | Start a game and inspect game screen header | Three links are visible: Fork, GitHub profile, Personal website |
| S15 | Inspect game screen footer | Static text "created with <3 and claude by imgabidotcom" is visible |
| S16 | Click Start with a valid cat name | Transition screen appears before game screen; shows "[name] is being made" |
| S17 | Observe transition duration | Transition plays for approximately 2 seconds before game screen appears |

---

## Level 2 — User Flow Tests

### Flow 1 — New Session (from specs/mission.md)

**Goal:** User can name their cat, pick a colour, and start the game.

| Step | Action | Expected |
|---|---|---|
| 1 | Open `index.html` | Welcome screen shown, game screen hidden |
| 2 | Leave name input empty, click Start | Not possible — Start button is disabled |
| 3 | Type `"  "` (spaces only) | Start remains disabled |
| 4 | Type `"Noodle"` | Start becomes enabled |
| 5 | Clear the input | Start returns to disabled |
| 6 | Type `"Noodle"` again | Start enabled |
| 7 | Type 25 characters | Input caps at 20 characters; excess is rejected |
| 8 | Use colour input to pick `#6c8ebf` (Slate) | `--cat-colour` on `<html>` updates to `#6c8ebf` |
| 9 | Click Start | Transition screen appears ("Noodle is being made"); after ~2s, game screen shown |
| 10 | Inspect game screen | Cat name `"Noodle"` displayed; colour `#6c8ebf` applied; header links visible; footer text visible |
| 11 | Open console, inspect `cat` object | `cat.name === "Noodle"`, `cat.colour === "#6c8ebf"`, `cat.hunger === 80`, `cat.happiness === 80`, `cat.energy === 80`, `cat.preference` is one of `kibble/tuna/treats` |
| 12 | Reload the page | Welcome screen shown again; name input empty; colour input value is `#f4a261` |

---

### Flow 7 — Restart (from specs/mission.md)

**Goal:** New Cat resets the session cleanly.

| Step | Action | Expected |
|---|---|---|
| 1 | Complete Flow 1 to reach game screen with cat named `"Noodle"` | Game screen showing |
| 2 | Click New Cat | Confirmation prompt appears |
| 3 | Click Cancel on prompt | Prompt closes; game screen remains; cat is unchanged |
| 4 | Click New Cat again | Confirmation prompt appears again |
| 5 | Click Confirm | Welcome screen shown; game screen hidden |
| 6 | Inspect welcome screen | Name input is empty; colour input value is `#f4a261`; Start is disabled |
| 7 | Open console, inspect game state | Tick interval has stopped; cat reference is null or cleared |

---

### Dark/Light Mode Toggle

| Step | Action | Expected |
|---|---|---|
| 1 | Open `index.html` | Dark mode is active by default; toggle button reads "Light Mode" |
| 2 | Click toggle on welcome screen | Light mode activates; background/text colours change; button label reads "Dark Mode" |
| 3 | Start a game (Flow 1 step 6–9) | Game screen shown in light mode — theme and label carried over |
| 4 | Click toggle on game screen | Switches back to dark mode; label reads "Light Mode" |
| 5 | Click New Cat → confirm restart | Welcome screen shown in dark mode; label reads "Light Mode" |
| 6 | Click toggle on welcome screen | Switches to light mode; label reads "Dark Mode" |
| 7 | Start game again | Game screen shown in light mode |
| 8 | Reload the page | Dark mode restored (not persisted); label reads "Light Mode" |
| 9 | Check `localStorage` in Application panel | No theme key present |

---

## Known Scope Boundaries

| Item | Phase |
|---|---|
| Cat sprite (SVG/pixel art) | Phase 3 |
| Stat bars with live values | Phase 3 |
| Action button functionality | Phase 3 / Phase 4 |
| Poo cleaning UI | Phase 4 |
| Belly overlay prompt | Phase 4 |
| Responsive layout and CSS polish | Phase 6 |