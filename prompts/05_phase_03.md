Three tasks — specs only, no code yet.

## Task 1 — Update specs/roadmap.md
- Mark Phase 2 as complete: 
  "## ✅ Phase 2 — Welcome Screen and Personalisation"
- Fix Phase 3 deliverables:
  Replace "Distinct visual expression per state: 
  Normal, Hungry, Bored, Happy, Sick, Evolved"
  with "Distinct visual expression per state: 
  Fine, Hungry, Bored, Happy, Showing Belly, Sick, Evolved"
- Fix Phase 3 definition of done:
  Replace "All six states" with "All seven states"

## Task 2 — Create feature spec files for Phase 3
Create these three files:

### features/03-cat-sprite/feature-plan.md
Sequenced task groups for implementing the cat sprite 
and visual state feedback. Aim for 4-5 groups. Include:
- Pixel art SVG cat sprite (base, tinted by --cat-colour)
- Seven distinct visual expressions (one per state)
- Evolved sprite visibly larger
- Segmented stat bars with numeric display
- Poo icons area (up to 5, each clickable)
- Action button click animation
- Evolution congratulations message

### features/03-cat-sprite/requirements.md
Explicit, testable requirements traceable to Phase 3 
deliverables. Include pixel art style constraints:
- Sprite must use image-rendering: pixelated
- Hard edges, no gradients or blur
- Tinted via --cat-colour CSS custom property
- Each state must produce a visually distinct expression

### features/03-cat-sprite/validation.md
Two levels:
Level 1 — Smoke tests: sprite renders, colour applies, 
  stat bars show correct values
Level 2 — Manual state tests: trigger each of the seven 
  states and verify distinct visual expression

## Task 3 — Update features/02-welcome-screen
Update feature-plan.md Group 3 to reflect that the colour 
picker is a free <input type="color">, not preset swatches.

Interview me if anything is unclear.
Wait for my answers before writing the files.