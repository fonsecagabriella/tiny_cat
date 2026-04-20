Three tasks — specs only, no code changes yet.

## Task 1 — Update specs/roadmap.md
- Add ✅ to Phase 1 title: "## ✅ Phase 1 — Core Game Loop"
- In Phase 2 definition of done, update to:
  "Full new-session (Flow 1) and restart (Flow 7) user flows 
  work end-to-end. Dark/light mode toggle works correctly. 
  Validation is manual only — no unit tests required for 
  this phase."
- In Phase 3 deliverables, add:
  "Pixel art cat sprite matching the retro 8-bit CRT visual 
  style. Sprite recolours via --cat-colour CSS custom property."

## Task 2 — Update specs/mission.md
Add a new section after Constraints:

### Visual Modes
| Mode | Description |
|---|---|
| Dark (default) | Dark background, bright accent colours — matches retro CRT style |
| Light | Light background, muted palette — optional, user-toggled |

- Toggle is persistent within the session (not saved to localStorage)
- Toggle is visible at all times on the game screen
- Dark mode is the default on load

## Task 3 — Create feature spec files for Phase 2
Create these three files:

### features/02-welcome-screen/feature-plan.md
Sequenced task groups for implementing the welcome screen 
and personalisation. Base on Phase 2 deliverables in 
specs/roadmap.md. Include dark/light mode toggle as a 
task group. Aim for 4-5 groups.

### features/02-welcome-screen/requirements.md
Explicit, testable requirements. Include:
- Name input: max 20 chars, min 1 non-whitespace character
- Colour picker behaviour
- Start button disabled state
- Cat creation with starting stats (Hunger 80, Happiness 80, Energy 80)
- Preferred food randomly assigned on Start (not revealed to user)
- Game screen scaffold: shows cat name and chosen colour
- New Cat button: confirmation prompt → resets to Welcome screen
- Dark/light mode toggle: visible at all times, dark is default,
  persists within session only

### features/02-welcome-screen/validation.md
Manual validation only — no unit tests for this phase.
Two levels:
Level 1 — Smoke tests: page loads, Welcome screen visible, 
  Start button disabled on empty name
Level 2 — User flow tests: cover Flow 1 (new session) and 
  Flow 7 (restart) from specs/mission.md in full, 
  plus dark/light mode toggle behaviour

Interview me if anything is unclear.
Wait for my answers before writing the files.