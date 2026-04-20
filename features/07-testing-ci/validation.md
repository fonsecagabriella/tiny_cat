# Validation — Phase 7: Testing & CI

Manual validation. All checks performed in a terminal with the project root as the working directory.

---

## Level 1 — Smoke Tests

Run these first. All must pass before proceeding.

| # | Check | Expected |
|---|---|---|
| S01 | Run `npm test` before any changes | All 81 existing tests pass; exit code 0 |
| S02 | Inspect `tests/game.test.js` | No test for Tired state exists |
| S03 | Inspect `tests/cat.test.js` | No test for `feedCount` or `playCount` defaults exists |

---

## Level 2 — Gap Resolution Tests

### Flow 1 — Tired State Tests (game.test.js)

After adding the four Tired tests:

1. Run `npm test`
2. Confirm the four new tests appear in output and pass:
   - `State: tired when energy < 30`
   - `State: not tired when energy = 30`
   - `Hungry > Tired priority`
   - `Tired > Bored priority`
3. Confirm all previously passing tests still pass (count ≥ 81 + 4 = 85 game-suite tests)

Expected: `npm test` exits 0. New tests listed as `✓`. No regressions.

---

### Flow 2 — feedCount / playCount Tests (cat.test.js)

After adding the two default-value tests:

1. Run `npm test`
2. Confirm the two new tests appear in output and pass:
   - `createCat feedCount defaults to 0`
   - `createCat playCount defaults to 0`
3. Confirm all previously passing cat.test.js tests still pass

Expected: `npm test` exits 0. New tests listed as `✓`. No regressions.

---

### Flow 3 — Final Full Suite

After all additions:

1. Run `npm test`
2. Confirm total count is 87 (57 + 4 = 61 game-suite, 24 + 2 = 26 cat-suite)
3. Confirm exit code 0

```
── Results: 61/61 passed ──
── Results: 26/26 passed ──
```

---

### Flow 4 — GitHub Actions

1. Push all changes to `main`
2. Navigate to the repository on GitHub → Actions tab
3. Confirm the most recent workflow run shows green (all steps pass)

Expected: Green check on the `main` branch. No failures in the test step.

---

## Known Scope Boundaries

| Item | Status |
|---|---|
| Tap-to-pet logic (trust/willing/outcomes) | Outside unit-test scope — logic in `js/ui.js`; covered by manual testing in Phase 5 validation.md |
| Evolution timer (`sessionStartTime`) | Outside unit-test scope — logic in `js/game.js` and `js/ui.js`; covered by manual testing in Phase 5 validation.md |
| Page Visibility API elapsed-tick logic | Outside unit-test scope — logic in `js/game.js`; covered by manual testing in Phase 6 validation.md |
