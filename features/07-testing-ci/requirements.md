# Requirements — Phase 7: Testing & CI

All requirements are traceable to Phase 7 deliverables in `specs/roadmap.md`.

---

## REQ-T01 — State Machine Coverage

| ID | Requirement |
|---|---|
| T01.1 | All eight states (Fine, Hungry, Tired, Bored, Happy, Belly, Sick, Evolved) have at least one test confirming the correct return value from `evaluateState()` |
| T01.2 | The full priority order (Sick > Evolved > Belly > Happy > Hungry > Tired > Bored > Fine) is verified by explicit tests for the critical adjacent pairs |

---

## REQ-T02 — Tired State Coverage

| ID | Requirement |
|---|---|
| T02.1 | A test confirms `evaluateState()` returns `'tired'` when `cat.energy < 30` and no higher-priority state is active |
| T02.2 | A test confirms `evaluateState()` does not return `'tired'` when `cat.energy >= 30` |
| T02.3 | A test confirms Hungry (higher priority) overrides Tired: when both `hunger < 30` and `energy < 30`, `evaluateState()` returns `'hungry'` |
| T02.4 | A test confirms Tired (higher priority) overrides Bored: when both `energy < 30` and `happiness < 50`, `evaluateState()` returns `'tired'` |

---

## REQ-T03 — Energy→Happiness Penalty Coverage

| ID | Requirement |
|---|---|
| T03.1 | All three penalty tiers are covered by existing tests in `game.test.js`: Energy < 20 (−25), Energy 20–49 (−10), Energy ≥ 50 (no penalty) |
| T03.2 | Non-stacking behaviour is confirmed: a single test shows the stricter tier applies when both thresholds are met |

*Note: T03.1–T03.2 are already met by existing tests. Listed here to document coverage formally.*

---

## REQ-T04 — Easter Egg Coverage

| ID | Requirement |
|---|---|
| T04.1 | A test confirms `createCat()` initialises `feedCount` to 0 |
| T04.2 | A test confirms `createCat()` initialises `playCount` to 0 |
| T04.3 | The trust condition, willing condition, and outcome stat effects for Tap to Pet are documented as outside the unit-test scope (logic resides in `js/ui.js`) and covered by manual testing per `validation.md` |
| T04.4 | The Evolution timer (`sessionStartTime`) is documented as outside the unit-test scope (logic resides in `js/game.js` and `js/ui.js`) and covered by manual testing per Phase 5 `validation.md` |

---

## REQ-T05 — Existing Tests Preserved

| ID | Requirement |
|---|---|
| T05.1 | All 81 tests present before Phase 7 continue to pass after new tests are added |
| T05.2 | No existing test name, assertion, or setup code is modified |
| T05.3 | `npm test` exits with code 0 after all additions |

---

## REQ-T06 — GitHub Actions

| ID | Requirement |
|---|---|
| T06.1 | After new tests are pushed to `main`, GitHub Actions workflow completes with green status |
| T06.2 | The existing `.github/workflows/test.yml` requires no modification |
