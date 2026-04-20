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
| S10 | Rust swatch is visually selected | Rust swatch has active/selected styling; others do not |
| S11 | Check `--cat-colour` on `<html>` | Value is `#f4a261` (Rust) |
| S12 | Click dark/light toggle | `data-theme` on `<html>` switches; page colours update |
| S13 | Click toggle again | `data-theme` switches back to dark |

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
| 8 | Click the Slate swatch | Slate swatch is active; `--cat-colour` = `#6c8ebf`; other swatches are inactive |
| 9 | Click Start | Welcome screen hidden; game screen shown |
| 10 | Inspect game screen | Cat name `"Noodle"` displayed; colour `#6c8ebf` applied |
| 11 | Open console, inspect `cat` object | `cat.name === "Noodle"`, `cat.colour === "#6c8ebf"`, `cat.hunger === 80`, `cat.happiness === 80`, `cat.energy === 80`, `cat.preference` is one of `kibble/tuna/treats` |
| 12 | Reload the page | Welcome screen shown again; name input empty; Rust swatch selected |

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
| 6 | Inspect welcome screen | Name input is empty; Rust swatch is selected; Start is disabled |
| 7 | Open console, inspect game state | Tick interval has stopped; cat reference is null or cleared |

---

### Dark/Light Mode Toggle

| Step | Action | Expected |
|---|---|---|
| 1 | Open `index.html` | Dark mode is active by default |
| 2 | Click toggle on welcome screen | Light mode activates; background/text colours change |
| 3 | Start a game (Flow 1 step 6–9) | Game screen shown in light mode — theme carried over |
| 4 | Click toggle on game screen | Switches back to dark mode |
| 5 | Click New Cat → confirm restart | Welcome screen shown in dark mode |
| 6 | Click toggle on welcome screen | Switches to light mode |
| 7 | Start game again | Game screen shown in light mode |
| 8 | Reload the page | Dark mode restored (not persisted) |
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