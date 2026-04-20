# Validation — Phase 4: Sick State, Poo Cleaning, and Recovery

Manual validation only. No unit tests required for this phase.
All checks are performed in a browser with DevTools open.
Start a game session before running any test (enter a name, click Start).

---

## Level 1 — Smoke Tests

Run these first. All must pass before proceeding to flow tests.

| # | Check | Expected |
|---|---|---|
| S01 | Drive cat to Sick via hunger path (console below) | Sick sprite appears; state label reads "Sick" and blinks |
| S02 | Inspect `#sick-hint` while Sick | Element is visible; lists unmet recovery conditions |
| S03 | Drive cat to Sick via poo path (console below) | Same as S01 |
| S04 | Click a poo icon | `#confirm-overlay` appears — no browser dialog |
| S05 | Inspect page source / console | No calls to `window.confirm` or `window.alert` |
| S06 | While not Sick, inspect `#sick-hint` | Element has `.hidden` class or `display: none` |
| S07 | Inspect `#pet-btn` when `cat.bellyActive === false` | Button has `.hidden` class |

**Console shortcut — Sick via hunger path:**
```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 0; cat.hungryTicks = 4;
runTick(cat);
renderGame({});
```

**Console shortcut — Sick via poo path:**
```js
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.poos = 2; cat.pooSickTicks = 0;
runTick(cat);
renderGame({});
```

---

## Level 2 — Full Flow Tests

### Flow A — Full Recovery from Sick (hunger path)

```js
// Set up Sick state via hunger path
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 5; cat.happiness = 60; cat.energy = 60;
cat.hungryTicks = 1; cat.poos = 0;
runTick(cat);
renderGame({});
```

Expected after setup: Cat is Sick. `#sick-hint` lists "feed (X/50)" and may list happiness.

Steps to recover:
1. Feed cat until Hunger ≥ 50 — check `#sick-hint` updates after each feed
2. Play or Pet until Happiness > 50 (if needed)
3. Call `checkSickRecovery(cat); renderGame({})` in console — or wait for next tick

Expected on recovery: Sick state clears; sprite returns to appropriate state; `#sick-hint` hidden.

---

### Flow B — Full Recovery from Sick (poo path)

```js
// Set up Sick state via poo path
cat.sick = false; cat.evolved = false; cat.bellyActive = false;
cat.hunger = 70; cat.happiness = 70; cat.energy = 70;
cat.poos = 2; cat.pooSickTicks = 0;
runTick(cat);
renderGame({});
```

Expected after setup: Cat is Sick. `#sick-hint` lists "clean poos".

Steps to recover:
1. Click each poo → confirm → observe poo removal animation (blinks 3×, then disappears)
2. After all poos cleaned: `#sick-hint` should update
3. Feed and Play if needed to meet Hunger ≥ 50 and Happiness > 50
4. `checkSickRecovery(cat); renderGame({})` or wait for tick

Expected on recovery: Same as Flow A.

---

### Flow C — Poo Removal Animation

```js
// Create a poo to test animation
cat.hunger = 100; cat.poos = 0; cat.happiness = 60;
applyFeed(cat, cat.preference);
renderGame({});
```

Expected: One poo icon in `#poo-area`.

Steps:
1. Click the poo icon → `#confirm-overlay` appears
2. Click Yes

Expected: Poo icon blinks (opacity flickers 3×, steps-based, ≤ 400ms), then disappears. Re-render shows 0 poos.

---

### Flow D — Belly Event Interaction

```js
// Trigger belly event
cat.sick = false; cat.evolved = false;
cat.bellyActive = false; cat.bellyTicks = 1;
cat.hunger = 80; cat.happiness = 100; cat.energy = 80;
updateCounters(cat);   // bellyTicks → 2
checkBellyEvent(cat);  // bellyActive = true
renderGame({});
```

Expected: `#pet-btn` is visible; `#belly-overlay` is not yet open.

**Sub-flow D1 — Click Pet button:**
1. Click `#pet-btn` → `#belly-overlay` appears with Yes and No buttons; no browser dialog

**Sub-flow D2 — Click Yes:**
Expected: Overlay closes; message in `#message-area` reads either "[name] purrs! 😻 +15 Happiness" or "[name] attacked! 🐾 -20 Happiness"; `#pet-btn` hidden.

**Sub-flow D3 — Click No:**
Re-trigger belly (repeat setup), click Pet → click No.
Expected: Overlay closes; no stat change; `#pet-btn` hidden.

---

### Flow E — Sick Suppresses Belly Event

```js
// Cat is Sick; try to trigger belly
cat.sick = true; cat.evolved = false;
cat.bellyActive = false; cat.bellyTicks = 4;
cat.hunger = 80; cat.happiness = 100; cat.energy = 80;
updateCounters(cat);   // happiness=100, but sick → bellyTicks should not increment
checkBellyEvent(cat);  // should NOT fire
renderGame({});
console.log('bellyActive:', cat.bellyActive); // expected: false
```

Expected: `cat.bellyActive` remains `false`; `#pet-btn` not visible; `#belly-overlay` does not appear.

---

### Flow F — Pet Button Visibility

| Scenario | `cat.bellyActive` | Expected `#pet-btn` |
|---|---|---|
| Game start | false | Hidden |
| Belly event fires | true | Visible |
| After Yes response | false | Hidden |
| After No response | false | Hidden |
| Sick state active | false | Hidden |

Verify each row using console `renderGame({})` after setting the relevant state.

---

## Known Scope Boundaries

| Item | Phase |
|---|---|
| Responsive layout and CSS polish | Phase 6 |
| Page Visibility API catch-up ticks | Phase 6 |
| Easter eggs | Phase 5 |
