Two tasks — specs only, no code changes yet.

## Task 1 — Update specs/roadmap.md
- Mark Phase 6 as complete:
  "## ✅ Phase 6 — Polish and Deploy"
- Update Phase 7 deliverables to reflect current 
  state — replace existing deliverables with:

  - Audit of existing test coverage against all 
    phases completed since Phase 1
  - `tests/game.test.js` expanded to cover any 
    gaps found in audit
  - `tests/cat.test.js` expanded to cover any 
    gaps found in audit
  - All existing tests must remain passing
  - `.github/workflows/test.yml` already active — 
    verify green on push after new tests added

- Update Phase 7 definition of done to:
  "Coverage audit completed and documented. 
  All gaps addressed. npm test passes locally 
  with expanded suite. GitHub Actions shows 
  green on push."

## Task 2 — Create feature spec files for Phase 7

### features/07-testing-ci/feature-plan.md

Two task groups:

Group 1 — Coverage Audit:
Perform a systematic audit of test coverage 
against all logic added or changed since Phase 1.
Audit must cover these areas in order:

1. State machine — all eight states:
   Fine, Hungry, Tired, Bored, Happy, 
   Showing Belly, Sick, Evolved
   Priority order: Sick > Evolved > Showing Belly > 
   Happy > Hungry > Tired > Bored > Fine

2. Tired state:
   - Triggers at Energy < 30
   - Blocked by higher priority states
   - Exits when Energy ≥ 30

3. Decay rates:
   - Normal: Hunger −3, Happiness −2, Energy −4
   - Evolved: Hunger −1.5, Happiness −1, Energy −2
   - Energy→Happiness penalty tiers

4. Poo mechanic:
   - Feed overflow poo
   - Natural poo after 5 ticks at Hunger = 100
   - Poo happiness drain −10 per tick per poo
   - Sick poo path: > 1 poo for 1 full tick

5. Easter Egg 2 — Tap to Pet:
   - Trust condition: feedCount ≥ 1 AND playCount ≥ 1
   - Willing condition: trust met AND all stats > 75
   - Willing outcome: Happiness +10
   - Unwilling outcome: Happiness −15, Energy −10
   - Blocked when Sick
   - Blocked when bellyActive = true

6. Easter Egg 1 — Evolution timer:
   - sessionStartTime recorded on startGame()
   - Elapsed time calculated correctly on evolution

Document audit findings in a coverage report 
section inside feature-plan.md:
- List each area audited
- Mark as: Covered / Partial / Missing
- Note which test file covers each area

Group 2 — Gap Resolution:
Based on audit findings:
- Add missing tests to tests/game.test.js 
  and/or tests/cat.test.js
- Fix any partial coverage
- Run full suite after each addition
- All existing tests must remain passing

### features/07-testing-ci/requirements.md
Explicit requirements including:

- REQ-T01: Audit covers all eight states and 
  correct priority order
- REQ-T02: Tired state has explicit test coverage
- REQ-T03: Energy→Happiness penalty tiers 
  have explicit test coverage
- REQ-T04: Both Easter egg mechanics have 
  explicit test coverage
- REQ-T05: All existing 81 tests continue to pass
- REQ-T06: GitHub Actions shows green after 
  new tests are pushed

### features/07-testing-ci/validation.m