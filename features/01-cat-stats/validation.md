# Validation — Phase 1: Core Game Loop

Two levels of validation. Both must pass before Phase 1 is considered done.

---

## Level 1 — Automated (Jest)

### Existing: `tests/game.test.js`

All 56 tests must pass. Run with:
```
node -e "$(cat js/cat.js tests/game.test.js)"
```
(Until Jest is configured in Phase 7 — at that point, `npm test` replaces this.)

Coverage already in `game.test.js`:
- Stat decay (Normal and Evolved rates, floor at 0)
- Energy → Happiness penalty (all three thresholds, no stacking)
- Poo drain (−10 × poo count per tick)
- All feed outcomes (base and preferred gain, overflow → poo, max poos)
- Play and Rest effects and constraints
- State machine (all seven states, priority overrides)
- Sick triggers (hunger path, poo path), Happiness halving, recovery conditions
- Evolution trigger, Evolved blocking Sick
- Natural poo (5-tick trigger, Happiness −5, counter reset)
- Belly event (2-tick trigger, suppression while Sick, Purr/Attack outcomes)

---

### New: `tests/cat.test.js`

Create this file to cover stat boundary and action-constraint cases not in `game.test.js`.

#### Stat boundaries

| Test | Setup | Expected |
|---|---|---|
| Hunger caps at 100 | `hunger: 98`, feed kibble (preferred, +30) | `hunger === 100`, poo created |
| Happiness caps at 100 | `happiness: 95`, `applyPlay` | `happiness === 100` (not 115) |
| Energy caps at 100 | `energy: 95`, `applyRest` | `energy === 100` (not 125) |
| Hunger floors at 0 | `hunger: 2`, normal decay | `hunger === 0` |
| Happiness floors at 0 | `happiness: 1`, energy penalty (Energy < 20) | `happiness === 0` |
| Energy floors at 0 | `energy: 3`, evolved decay | `energy === 0` |

#### Action constraints

| Test | Setup | Expected |
|---|---|---|
| Feed disabled at 5 poos | `poos: 5`, feed any food | `poos === 5`, result `'full'` |
| Play disabled at Energy = 10 | `energy: 10` | `canPlay === false` |
| Play disabled at Energy = 0 | `energy: 0` | `canPlay === false` |
| Play allowed at Energy = 11 | `energy: 11` | `canPlay === true` |
| Rest does not go above 100 | `energy: 80`, `applyRest` | `energy === 100` |
| Rest happiness floor | `happiness: 2`, `applyRest` | `happiness === 0` |

#### Poo drain boundary

| Test | Setup | Expected |
|---|---|---|
| 1 poo drains 10 Happiness | `happiness: 50, poos: 1` | `happiness === 40` |
| 5 poos drain 50 Happiness | `happiness: 60, poos: 5` | `happiness === 10` |
| Poo drain floors at 0 | `happiness: 10, poos: 5` | `happiness === 0` |

#### Counter behaviour

| Test | Setup | Expected |
|---|---|---|
| hungryTicks resets when Hunger ≥ 10 | `hunger: 10, hungryTicks: 3`, call `updateCounters` | `hungryTicks === 0` |
| pooSickTicks resets when poos ≤ 1 | `poos: 1, pooSickTicks: 3`, call `updateCounters` | `pooSickTicks === 0` |
| evolvedTicks resets when any stat < 90 | `hunger: 89, evolvedTicks: 1`, call `updateCounters` | `evolvedTicks === 0` |
| fullHungerTicks resets after natural poo | After `triggerNaturalPoo` fires | `fullHungerTicks === 0` |

#### Happy state — poo constraint

| Test | Setup | Expected |
|---|---|---|
| Happy blocked when poos > 1 | `hunger: 80, happiness: 80, energy: 80, poos: 2` | `evaluateState` returns `'fine'` (not `'happy'`) |
| Happy allowed when poos = 1 | `hunger: 80, happiness: 80, energy: 80, poos: 1` | `evaluateState` returns `'happy'` |
| Happy allowed when poos = 0 | `hunger: 80, happiness: 80, energy: 80, poos: 0` | `evaluateState` returns `'happy'` |

#### cleanPoo

| Test | Setup | Expected |
|---|---|---|
| cleanPoo on 0 poos | `poos: 0` | returns `false`, `poos === 0` |
| cleanPoo on 1 poo | `poos: 1` | returns `true`, `poos === 0` |

---

## Level 2 — Manual (Browser Console)

Open `index.html` in a browser. Open DevTools console. Run the following checks — all must produce the stated output.

### Setup helper
```js
// Create a test cat and expose it
var c = createCat({ name: 'Test', hunger: 80, happiness: 80, energy: 80 });
```

---

### Decay

```js
// Normal decay
var c = createCat({ hunger: 50, happiness: 50, energy: 50 });
applyDecay(c);
console.log(c.hunger, c.happiness, c.energy); // 47, 48, 46

// Evolved decay
var c2 = createCat({ hunger: 50, happiness: 50, energy: 50, evolved: true });
applyDecay(c2);
console.log(c2.hunger, c2.happiness, c2.energy); // 48.5, 49, 48
```

---

### Energy → Happiness penalty

```js
var c = createCat({ happiness: 60, energy: 10 });
applyEnergyHappinessPenalty(c);
console.log(c.happiness); // 35  (−25 penalty)

var c2 = createCat({ happiness: 60, energy: 30 });
applyEnergyHappinessPenalty(c2);
console.log(c2.happiness); // 50  (−10 penalty)

var c3 = createCat({ happiness: 60, energy: 50 });
applyEnergyHappinessPenalty(c3);
console.log(c3.happiness); // 60  (no penalty)
```

---

### State machine — all seven states

```js
// Fine
var c = createCat({ hunger: 60, happiness: 60, energy: 60 });
console.log(evaluateState(c)); // 'fine'

// Hungry
c.hunger = 29;
console.log(evaluateState(c)); // 'hungry'

// Bored
var c2 = createCat({ hunger: 60, happiness: 40, energy: 60 });
console.log(evaluateState(c2)); // 'bored'

// Happy — no poos
var c3 = createCat({ hunger: 80, happiness: 80, energy: 80 });
console.log(evaluateState(c3)); // 'happy'

// Happy blocked by poos > 1
var c3b = createCat({ hunger: 80, happiness: 80, energy: 80, poos: 2 });
console.log(evaluateState(c3b)); // 'fine'  (stats ≥ 50, no other threshold crossed)

// Showing Belly
var c4 = createCat({ hunger: 80, happiness: 80, energy: 80, bellyActive: true });
console.log(evaluateState(c4)); // 'belly'

// Evolved
var c5 = createCat({ hunger: 95, happiness: 95, energy: 95, evolved: true });
console.log(evaluateState(c5)); // 'evolved'

// Sick
var c6 = createCat({ hunger: 5, happiness: 20, energy: 20, sick: true });
console.log(evaluateState(c6)); // 'sick'
```

---

### Priority overrides

```js
// Sick beats Evolved
var c = createCat({ evolved: true, sick: true });
console.log(evaluateState(c)); // 'sick'  ← impossible in normal play; confirm logic holds

// Evolved beats belly
var c2 = createCat({ evolved: true, bellyActive: true });
console.log(evaluateState(c2)); // 'evolved'

// Sick suppresses belly event
var c3 = createCat({ happiness: 100, bellyTicks: 1, sick: true });
updateCounters(c3);
checkBellyEvent(c3);
console.log(c3.bellyActive); // false
```

---

### Sick — hunger path

```js
// Drive to Sick via hunger path (2 ticks with Hunger < 10)
var c = createCat({ hunger: 5, happiness: 60, energy: 60, hungryTicks: 1 });
runTick(c);
console.log(c.sick);       // true
console.log(c.happiness);  // 29  (floor(58 / 2), after decay happiness 60−2=58)
```

---

### Sick — poo path

```js
// Drive to Sick via poo path (>1 poo at end of any tick)
var c = createCat({ hunger: 50, happiness: 60, energy: 60, poos: 2 });
runTick(c);
console.log(c.sick); // true
```

---

### Sick recovery

```js
var c = createCat({ hunger: 60, happiness: 60, energy: 60, poos: 0, sick: true });
checkSickRecovery(c);
console.log(c.sick); // false

// Fails if any condition unmet
var c2 = createCat({ hunger: 40, happiness: 60, energy: 60, poos: 0, sick: true });
checkSickRecovery(c2);
console.log(c2.sick); // true  (hunger < 50)
```

---

### Poo mechanic

```js
// Feed overflow
var c = createCat({ hunger: 90, happiness: 60, poos: 0, preference: 'tuna' });
applyFeed(c, 'tuna'); // 90+20=110 → overflow
console.log(c.hunger, c.poos, c.happiness); // 100, 1, 55

// Natural poo at 5 ticks
var c2 = createCat({ hunger: 100, poos: 0, fullHungerTicks: 4 });
runTick(c2);
console.log(c2.poos, c2.fullHungerTicks); // 1, 0

// Poo drain
var c3 = createCat({ happiness: 60, poos: 3 });
applyPooDrain(c3);
console.log(c3.happiness); // 30  (60 − 30)
```

---

### Belly event

```js
// Trigger after 2 ticks
var c = createCat({ happiness: 100, bellyTicks: 1, sick: false, bellyActive: false });
updateCounters(c);    // bellyTicks → 2
checkBellyEvent(c);
console.log(c.bellyActive); // true

// Resolve — purr (stub Math.random)
Math.random = () => 0.1;
var outcome = resolveBelly(c, true);
console.log(outcome, c.happiness); // 'purr', 115 → clamped 100...
// Note: happiness after purr = 100 + 15 capped at 100 if already at 100.
// Use a cat with happiness < 85 to observe unclamped result.
var c2 = createCat({ happiness: 70, bellyActive: true });
Math.random = () => 0.1;
console.log(resolveBelly(c2, true), c2.happiness); // 'purr', 85
```

---

### Evolution

```js
// Trigger after 2 ticks
var c = createCat({ hunger: 92, happiness: 92, energy: 92, evolvedTicks: 1 });
runTick(c);
console.log(c.evolved); // true

// Evolved decay kicks in next tick
applyDecay(c);
// Stats drop by 1.5 / 1 / 2 (not 3 / 2 / 4)
console.log(c.hunger, c.happiness, c.energy);

// Evolved blocks Sick
var c2 = createCat({ hunger: 5, hungryTicks: 1, evolved: true });
runTick(c2);
console.log(c2.sick); // false
```

---

## Known Scope Boundaries

| Item | Phase |
|---|---|
| Belly visual overlay (Yes/No prompt) | Phase 4 |
| All DOM rendering and stat bar UI | Phase 3 |
| Welcome screen and cat creation UI | Phase 2 |
| Poo click-to-clean UI | Phase 4 |
| CSS and visual polish | Phase 6 |
