Specs only, no code changes yet.

## Task 1 — Update specs/roadmap.md
Mark Phase 3 as complete:
"## ✅ Phase 3 — Cat Sprite and Visual State Feedback"

## Task 2 — Create feature spec files for Phase 4

Create these three files:

### features/04-sick-and-recovery/feature-plan.md
Sequenced task groups to verify and complete the 
Sick → Recovery flow. The agent should first audit 
the current code against each deliverable, then 
implement what is missing or incorrect.

Deliverables to cover:
- Sick state visual (already in Phase 3 — verify only)
- Poo-click confirmation: in-page message, not 
  window.confirm; removal animation
- Recovery UI: visible status message when Sick 
  explaining exactly what the player needs to do
- Belly overlay: in-page Yes/No prompt, not 
  window.confirm
- Pet button: visible only during belly event; 
  resolves Purr or Attack with feedback message
- Edge case: Sick suppresses belly event

### features/04-sick-and-recovery/requirements.md
Explicit testable requirements for each deliverable.
Be specific about "in-page" vs browser dialogs —
window.confirm and window.alert are not acceptable
for any user-facing prompt in this phase.

### features/04-sick-and-recovery/validation.md
Two levels:
Level 1 — Smoke tests: Sick state reachable via 
  both paths (hunger and poo), recovery message 
  visible when Sick
Level 2 — Full flow tests:
  - Drive cat to Sick via hunger path
  - Drive cat to Sick via poo path  
  - Complete full recovery flow
  - Trigger belly event and interact with overlay
  - Verify Sick suppresses belly event
  - Verify Pet button visibility

Include console shortcuts for each flow.

Interview me if anything is unclear.
Wait for my answers before writing the files.