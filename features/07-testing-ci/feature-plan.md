# Feature Plan — Phase 7: Testing & CI

## Overview

All infrastructure (test runner, GitHub Actions) was established in Phase 1. This phase audits coverage against everything added since, identifies gaps, and fills them. No architectural changes. Files that may be touched: `tests/game.test.js`, `tests/cat.test.js`. All other files must not be modified.

---

## Task Group 1 — Coverage Audit

Perform a systematic audit of test coverage against all logic added or changed since Phase 1. Work through each area in order. Record findings in the Coverage Report section below.

### Area 1 — State machine: all eight states and priority order

State machine returns: `'sick'`, `'evolved'`, `'belly'`, `'happy'`, `'hungry'`, `'tired'`, `'bored'`, `'fine'` (priority highest → lowest).

Check each state has at least one test that:
- Confirms the correct return value given appropriate cat state
- Confirms higher-priority states override it

Check list:

| State | Return value tested | Priority override tested |
|---|---|---|
| Sick | game.test.js — "Sick > Bored priority", "Sick > Happy priority" | ✓ |
| Evolved | game.test.js — "Evolved > Happy priority" | ✓ |
| Belly | game.test.js — "State: belly when bellyActive" | Partial — not tested against Hungry/Tired/Bored |
| Happy | game.test.js — "State: happy when all stats ≥ 75" | ✓ (Sick, Evolved override it) |
| Hungry | game.test.js — "State: hungry when hunger < 30" | Partial — not tested against Tired |
| Tired | **MISSING** | **MISSING** |
| Bored | game.test.js — "State: bored when happiness < 50" (×2) | Partial — not tested against Tired |
| Fine | game.test.js — "State: fine when all stats ≥ 50 (default)" | n/a (lowest priority) |

### Area 2 — Tired state

Tired state was added in Phase 3. Check for:
- Trigger: `evaluateState` returns `'tired'` when energy < 30
- Exit: returns something other than `'tired'` when energy ≥ 30
- Priority: Hungry (higher) overrides Tired; Tired (higher) overrides Bored

Current coverage: **MISSING** — no tests for tired state exist.

### Area 3 — Decay rates

Normal and evolved decay rates, Energy→Happiness penalty tiers.

Current coverage: **Fully covered** — game.test.js sections "Stat Decay" and "Energy → Happiness Penalty".

### Area 4 — Poo mechanic

Feed-overflow poo, natural poo after 5 ticks at Hunger 100, poo happiness drain (−10/tick/poo), sick poo path.

Current coverage: **Fully covered** — game.test.js sections "Poo Drain" and "Poo Mechanic", cat.test.js "Poo Drain Boundary".

### Area 5 — Easter Egg 2: Tap to Pet

The tap-pet decision logic (trust/willing evaluation, stat mutations) lives in `js/ui.js`, which is not loaded by the test runner. Stat mutations (+10 happiness, −15 happiness, −10 energy) are applied inline in ui.js with no dedicated cat.js function.

What is testable via the current runner:
- `feedCount` and `playCount` properties initialised correctly by `createCat()`

What is outside the current test scope (manual-only):
- Trust condition evaluation: `feedCount ≥ 1 AND playCount ≥ 1`
- Willing condition evaluation: trust met AND all stats > 75
- Willing outcome: Happiness +10
- Unwilling outcome: Happiness −15, Energy −10
- Blocked when `cat.sick === true`
- Blocked when `cat.bellyActive === true`

Current coverage of testable portion: **MISSING** — no test verifies `feedCount`/`playCount` defaults on `createCat`.

### Area 6 — Easter Egg 1: Evolution timer

`sessionStartTime` is set in `startGame()` in `js/game.js`. Elapsed time formatting is handled in `js/ui.js`. Neither file is loaded by the test runner.

Current coverage: **Outside test scope** — no unit test is possible without refactoring. Covered by manual testing only.

---

## Coverage Report

| Area | Status | Test file |
|---|---|---|
| Decay rates — normal | Covered | game.test.js |
| Decay rates — evolved | Covered | game.test.js |
| Energy→Happiness penalty tiers | Covered | game.test.js |
| Feed action (all foods, overflow, poo cap) | Covered | game.test.js, cat.test.js |
| Play action (effects, blocked at ≤ 10) | Covered | game.test.js, cat.test.js |
| Rest action (effects, cap, floor) | Covered | game.test.js, cat.test.js |
| Poo drain per tick | Covered | game.test.js, cat.test.js |
| Natural poo (5 full-hunger ticks) | Covered | game.test.js |
| Sick triggers — hunger path | Covered | game.test.js |
| Sick triggers — poo path | Covered | game.test.js |
| Sick recovery conditions | Covered | game.test.js |
| Sick priority (Sick > Bored, Sick > Happy) | Covered | game.test.js |
| Evolved trigger | Covered | game.test.js |
| Evolved immunity to Sick | Covered | game.test.js |
| Evolved priority (Evolved > Happy) | Covered | game.test.js |
| Belly event trigger / suppress / resolve | Covered | game.test.js |
| State: Fine, Hungry, Bored, Happy, Belly, Sick, Evolved | Covered | game.test.js |
| State: **Tired** | **Missing** | — |
| Priority: Hungry > Tired | **Missing** | — |
| Priority: Tired > Bored | **Missing** | — |
| Stat caps and floors | Covered | cat.test.js |
| Counter reset behaviour | Covered | cat.test.js |
| Happy poo constraint | Covered | cat.test.js |
| cleanPoo | Covered | cat.test.js |
| createCat feedCount / playCount defaults | **Missing** | — |
| Tap-pet trust/willing logic | Outside scope (manual) | — |
| Evolution timer sessionStartTime | Outside scope (manual) | — |

**Gaps to address:**
1. Tired state — trigger, exit, priority (game.test.js)
2. feedCount / playCount initial values (cat.test.js)

---

## Task Group 2 — Gap Resolution

### Gap 1 — Tired state (add to `tests/game.test.js`)

Add to the "State Machine" section:

1. `State: tired when energy < 30` — `evaluateState` returns `'tired'` for a cat with energy 29, hunger 60, happiness 60
2. `State: not tired when energy = 30` — `evaluateState` does NOT return `'tired'` for a cat with energy 30, hunger 60, happiness 60
3. `Hungry > Tired priority` — when hunger < 30 AND energy < 30, `evaluateState` returns `'hungry'`
4. `Tired > Bored priority` — when energy < 30 AND happiness < 50, `evaluateState` returns `'tired'`

### Gap 2 — feedCount / playCount defaults (add to `tests/cat.test.js`)

Add to the "Counter Behaviour" section:

1. `createCat feedCount defaults to 0` — `createCat({}).feedCount === 0`
2. `createCat playCount defaults to 0` — `createCat({}).playCount === 0`

### Verification

After each addition: run `npm test`. All existing tests must continue to pass.
Final expected count: 81 existing + 4 (Tired) + 2 (feedCount/playCount) = **87 tests**.
