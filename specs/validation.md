# Validation

## Overview

Two levels of testing are defined:

- **Level 1 — Automated unit tests** (`tests/game.test.js`): a vanilla JS test suite that runs directly in the browser (open `tests/runner.html`) or in Node. Tests verify game logic in isolation by calling functions from `cat.js` and `game.js` directly. No DOM interaction.
- **Level 2 — Manual user flow tests**: step-by-step checklists that verify complete user journeys in the live app.

Coverage target: ≥ 75 % of test cases map to an explicit requirement in `requirements.md` or a specification in `mission.md` or `plan.md`.

---

## Level 1 — Automated Unit Tests

### Test runner

`tests/runner.html` loads `tests/game.test.js` and displays pass/fail output in the browser console and as a results summary in the page.

```js
// tests/game.test.js
// Minimal assertion helpers — no external dependencies

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, label) {
  if (actual !== expected)
    throw new Error(`${label || ''} — expected ${expected}, got ${actual}`);
}

function assertRange(value, min, max, label) {
  if (value < min || value > max)
    throw new Error(`${label || ''} — ${value} not in [${min}, ${max}]`);
}
```

---

### Stat Decay (FR-14, FR-15, FR-16)

```js
test('Normal decay reduces hunger by 3', () => {
  const cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.hunger, 47, 'hunger after normal decay');
});

test('Normal decay reduces happiness by 2', () => {
  const cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.happiness, 48, 'happiness after normal decay');
});

test('Normal decay reduces energy by 4', () => {
  const cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.energy, 46, 'energy after normal decay');
});

test('Evolved decay reduces hunger by 1.5', () => {
  const cat = createCat({ hunger: 50, happiness: 50, energy: 50, evolved: true });
  applyDecay(cat);
  assertEqual(cat.hunger, 48.5, 'hunger after evolved decay');
});

test('Stats floor at 0 — no negative values', () => {
  const cat = createCat({ hunger: 1, happiness: 1, energy: 1 });
  applyDecay(cat);
  assert(cat.hunger >= 0, 'hunger >= 0');
  assert(cat.happiness >= 0, 'happiness >= 0');
  assert(cat.energy >= 0, 'energy >= 0');
});

test('Stats cap at 100 — Rest does not exceed 100', () => {
  const cat = createCat({ hunger: 80, happiness: 80, energy: 100 });
  applyRest(cat);
  assertEqual(cat.energy, 100, 'energy capped at 100');
});
```

---

### Feed Action (FR-19 – FR-23)

```js
test('Kibble adds 15 hunger (not preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'tuna' });
  applyFeed(cat, 'kibble');
  assertEqual(cat.hunger, 65, 'kibble hunger gain');
});

test('Kibble adds 30 hunger (preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'kibble');
  assertEqual(cat.hunger, 80, 'kibble preferred hunger gain');
});

test('Tuna adds 20 hunger (not preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'tuna');
  assertEqual(cat.hunger, 70, 'tuna hunger gain');
});

test('Tuna adds 40 hunger (preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'tuna' });
  applyFeed(cat, 'tuna');
  assertEqual(cat.hunger, 90, 'tuna preferred hunger gain');
});

test('Treats add 10 hunger (not preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'treats');
  assertEqual(cat.hunger, 60, 'treats hunger gain');
});

test('Treats add 20 hunger (preferred)', () => {
  const cat = createCat({ hunger: 50, preference: 'treats' });
  applyFeed(cat, 'treats');
  assertEqual(cat.hunger, 70, 'treats preferred hunger gain');
});

test('Feed overflow creates poo', () => {
  const cat = createCat({ hunger: 90, happiness: 60, poos: 0, preference: 'tuna' });
  applyFeed(cat, 'tuna'); // 90 + 20 = 110 → overflow
  assertEqual(cat.hunger, 100, 'hunger capped at 100');
  assertEqual(cat.poos, 1, 'poo created on overflow');
});

test('Feed overflow reduces happiness by 5', () => {
  const cat = createCat({ hunger: 95, happiness: 60, poos: 0, preference: 'kibble' });
  applyFeed(cat, 'kibble'); // 95 + 15 = 110 → overflow
  assertEqual(cat.happiness, 55, 'happiness reduced by poo');
});

test('Feed at max poos (5) does not add new poo', () => {
  const cat = createCat({ hunger: 90, happiness: 60, poos: 5, preference: 'tuna' });
  applyFeed(cat, 'tuna');
  assertEqual(cat.poos, 5, 'poo count unchanged at max');
});
```

---

### Play and Rest Actions (FR-24 – FR-26)

```js
test('Play adds 20 happiness and removes 10 energy', () => {
  const cat = createCat({ happiness: 50, energy: 50 });
  applyPlay(cat);
  assertEqual(cat.happiness, 70, 'happiness after play');
  assertEqual(cat.energy, 40, 'energy after play');
});

test('Play is blocked when energy <= 10', () => {
  const cat = createCat({ happiness: 50, energy: 10 });
  const result = canPlay(cat);
  assert(!result, 'play blocked at energy 10');
});

test('Rest adds 30 energy and removes 5 happiness', () => {
  const cat = createCat({ happiness: 50, energy: 40 });
  applyRest(cat);
  assertEqual(cat.energy, 70, 'energy after rest');
  assertEqual(cat.happiness, 45, 'happiness after rest');
});

test('Rest happiness floors at 0', () => {
  const cat = createCat({ happiness: 3, energy: 40 });
  applyRest(cat);
  assertEqual(cat.happiness, 0, 'happiness floored at 0');
});
```

---

### State Machine (FR-41 – FR-53)

```js
test('Hungry state when hunger < 30', () => {
  const cat = createCat({ hunger: 29, happiness: 60, energy: 60 });
  assertEqual(evaluateState(cat), 'hungry', 'hungry state triggered');
});

test('Bored state when happiness < 15', () => {
  const cat = createCat({ hunger: 50, happiness: 14, energy: 50 });
  assertEqual(evaluateState(cat), 'bored', 'bored state triggered');
});

test('Happy state when happiness > 50', () => {
  const cat = createCat({ hunger: 50, happiness: 51, energy: 50 });
  assertEqual(evaluateState(cat), 'happy', 'happy state triggered');
});

test('Sick takes priority over Bored', () => {
  const cat = createCat({ hunger: 5, happiness: 5, energy: 5, sick: true });
  assertEqual(evaluateState(cat), 'sick', 'sick priority over bored');
});

test('Sick takes priority over Happy', () => {
  const cat = createCat({ hunger: 5, happiness: 80, energy: 50, sick: true });
  assertEqual(evaluateState(cat), 'sick', 'sick priority over happy');
});

test('Evolved takes priority over Happy', () => {
  const cat = createCat({ hunger: 95, happiness: 95, energy: 95, evolved: true });
  assertEqual(evaluateState(cat), 'evolved', 'evolved priority over happy');
});

test('Sick state triggered after 5 ticks with hunger < 10', () => {
  const cat = createCat({ hunger: 5, happiness: 60, energy: 60, hungryTicks: 4 });
  runTick(cat);
  assertEqual(cat.sick, true, 'sick triggered by hunger path');
});

test('Sick halves happiness on entry', () => {
  const cat = createCat({ hunger: 5, happiness: 60, energy: 60, hungryTicks: 4 });
  runTick(cat);
  assertEqual(cat.happiness, 30, 'happiness halved on sick entry');
});

test('Sick triggered by poo path (>1 poo for >10 ticks)', () => {
  const cat = createCat({ hunger: 50, happiness: 60, energy: 60, poos: 2, pooSickTicks: 10 });
  runTick(cat);
  assertEqual(cat.sick, true, 'sick triggered by poo path');
});

test('Sick clears when all conditions met', () => {
  const cat = createCat({ hunger: 60, happiness: 60, energy: 60, poos: 0, sick: true });
  checkSickRecovery(cat);
  assert(!cat.sick, 'sick cleared on recovery');
});

test('Sick does not clear if poos remain', () => {
  const cat = createCat({ hunger: 60, happiness: 60, energy: 60, poos: 1, sick: true });
  checkSickRecovery(cat);
  assert(cat.sick, 'sick not cleared while poos remain');
});

test('Evolved state triggered after 5 ticks with all stats >= 90', () => {
  const cat = createCat({ hunger: 92, happiness: 92, energy: 92, evolvedTicks: 4 });
  runTick(cat);
  assertEqual(cat.evolved, true, 'evolved triggered');
});

test('Evolved cannot trigger while sick', () => {
  const cat = createCat({ hunger: 92, happiness: 92, energy: 92, evolvedTicks: 4, sick: true });
  runTick(cat);
  assert(!cat.evolved, 'evolved blocked by sick');
});

test('Evolved cat cannot become sick', () => {
  const cat = createCat({ hunger: 5, happiness: 10, energy: 10, hungryTicks: 4, evolved: true });
  runTick(cat);
  assert(!cat.sick, 'evolved cat immune to sick');
});
```

---

### Poo Mechanic (FR-29 – FR-33)

```js
test('Natural poo created after 10 ticks at hunger 100', () => {
  const cat = createCat({ hunger: 100, happiness: 60, poos: 0, fullHungerTicks: 9 });
  runTick(cat);
  assertEqual(cat.poos, 1, 'natural poo created');
  assertEqual(cat.fullHungerTicks, 0, 'full hunger counter reset');
});

test('Natural poo reduces happiness by 5', () => {
  const cat = createCat({ hunger: 100, happiness: 60, poos: 0, fullHungerTicks: 9 });
  runTick(cat);
  assertEqual(cat.happiness, 55, 'happiness reduced by natural poo');
});

test('Poo count does not exceed 5', () => {
  const cat = createCat({ hunger: 100, happiness: 60, poos: 5, fullHungerTicks: 9 });
  runTick(cat);
  assertEqual(cat.poos, 5, 'poo count capped at 5');
});

test('Cleaning a poo reduces poo count by 1', () => {
  const cat = createCat({ poos: 3 });
  cleanPoo(cat);
  assertEqual(cat.poos, 2, 'poo count after cleaning');
});

test('Poo drain: each poo reduces happiness by 1 per tick', () => {
  const cat = createCat({ hunger: 50, happiness: 60, energy: 50, poos: 3, evolved: false });
  applyPooDrain(cat);
  assertEqual(cat.happiness, 57, 'happiness drained by 3 poos');
});
```

---

### Belly-Showing Event (FR-34 – FR-40)

```js
test('Belly event triggers after 5 ticks with happiness = 100', () => {
  const cat = createCat({ happiness: 100, bellyTicks: 4, sick: false, bellyActive: false });
  runTick(cat);
  assert(cat.bellyActive, 'belly event triggered');
});

test('Belly event suppressed when sick', () => {
  const cat = createCat({ happiness: 100, bellyTicks: 4, sick: true, bellyActive: false });
  runTick(cat);
  assert(!cat.bellyActive, 'belly event suppressed when sick');
});

test('Belly counter resets after event resolves', () => {
  const cat = createCat({ happiness: 80, bellyActive: true });
  resolveBelly(cat, false); // user says No
  assertEqual(cat.bellyTicks, 0, 'belly counter reset');
  assert(!cat.bellyActive, 'belly no longer active');
});
```

---

## Level 2 — Manual User Flow Tests

Run these checks in the live app after each phase is complete.

### Smoke Tests (run first)

| # | Check | Expected |
|---|---|---|
| S-01 | Open app | Welcome screen shown, no errors in console |
| S-02 | Enter name + pick colour + Start | Game screen shown, cat name visible, sprite coloured |
| S-03 | Wait 2 minutes | Stat bars visibly decrease |
| S-04 | Click Feed → select Kibble | Hunger stat increases |
| S-05 | Click Play | Happiness increases, Energy decreases |
| S-06 | Click Rest | Energy increases, Happiness slightly decreases |
| S-07 | Click New Cat → confirm | Returns to Welcome screen |

### User Flow Tests

| # | Flow | Steps | Expected |
|---|---|---|---|
| UF-01 | Hungry state | Let Hunger fall below 30 | Cat expression changes; Hungry state label shown |
| UF-02 | Bored state | Let Happiness fall below 15 | Cat expression changes; Bored state label shown |
| UF-03 | Happy state | Keep Happiness above 50 | Happy expression shown |
| UF-04 | Poo — feed overflow | Feed cat when Hunger = 100 | Poo icon appears; Happiness decreases by 5 |
| UF-05 | Poo — natural | Keep Hunger at 100 for 10+ ticks | Poo icon appears automatically |
| UF-06 | Poo cleaning | Click a poo icon | Confirmation appears; poo removed after confirm |
| UF-07 | Poo max | Create 5 poos | Feed button disables; no 6th poo appears |
| UF-08 | Sick — hunger path | Let Hunger stay < 10 for 5 ticks | Sick state triggered; Happiness halved |
| UF-09 | Sick — poo path | Leave > 1 poo for > 10 ticks | Sick state triggered; Happiness halved |
| UF-10 | Recovery from Sick | Clean poos, Feed to ≥ 50, raise Happiness > 50 | Cat returns to Normal |
| UF-11 | Belly event | Keep Happiness at 100 for 5 ticks | Belly prompt appears |
| UF-12 | Pet — purr | Accept belly pet; observe outcome | Happiness increases by 15 |
| UF-13 | Pet — attack | Accept belly pet; observe outcome | Happiness decreases by 20 |
| UF-14 | Belly declined | Decline belly pet | No stat change; belly counter resets |
| UF-15 | Evolution | Keep all stats ≥ 90 for 5 ticks | Evolved state; sprite larger; decay slows |
| UF-16 | Evolved decay | Wait after evolution | Stat bars decay at half the normal rate |
| UF-17 | Sick blocks evolution | Reach 5 ticks ≥ 90 while Sick | Evolution does not trigger |
| UF-18 | Food preference | Try all three foods on separate sessions | One food consistently grants higher hunger gain |
| UF-19 | Play disabled | Let Energy drop to 10 | Play button disabled |
| UF-20 | Tab hide/return | Hide tab for 3+ minutes, return | Elapsed ticks applied; stats reflect correct decay |
| UF-21 | Mobile layout | Open on mobile (≥ 320 px) | All controls accessible; stat bars readable |
| UF-22 | Cross-browser | Open in Chrome, Firefox, Safari | App functions identically in all three |

---

## Requirement Coverage Map

| Test ID(s) | Requirements covered |
|---|---|
| Stat decay tests | FR-14, FR-15, FR-16 |
| Feed action tests | FR-18, FR-19, FR-20, FR-21, FR-22, FR-23 |
| Play / Rest tests | FR-24, FR-25, FR-26 |
| State machine tests | FR-41, FR-42, FR-43, FR-44, FR-45, FR-46, FR-47, FR-48, FR-49, FR-50, FR-51, FR-52, FR-53 |
| Poo mechanic tests | FR-29, FR-30, FR-31, FR-32, FR-33 |
| Belly event tests | FR-34, FR-35, FR-36, FR-37, FR-38, FR-39, FR-40 |
| S-01 – S-07 | FR-01, FR-06, FR-13, NFR-01, NFR-06 |
| UF-01 – UF-03 | FR-43, FR-44, FR-45 |
| UF-04 – UF-07 | FR-29, FR-31, FR-32, FR-33 |
| UF-08 – UF-10 | FR-46, FR-47, FR-48, FR-49 |
| UF-11 – UF-14 | FR-34, FR-35, FR-36, FR-37, FR-38, FR-39, FR-40 |
| UF-15 – UF-17 | FR-50, FR-51, FR-52, FR-53 |
| UF-18 | FR-07, FR-19, FR-20, FR-21 |
| UF-19 | FR-25 |
| UF-20 | NFR-05 |
| UF-21 | NFR-04 |
| UF-22 | NFR-03 |
