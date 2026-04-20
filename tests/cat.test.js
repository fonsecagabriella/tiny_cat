// cat.test.js — Stat boundaries, action constraints, poo drain, counters, Happy poo rule
// Covers the cases listed in features/01-cat-stats/validation.md (Level 1 — New: tests/cat.test.js)

var passed = 0, failed = 0, total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    log('pass', '✓ ' + name);
  } catch (e) {
    failed++;
    log('fail', '✗ ' + name + '\n    ' + e.message);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}
function assertEqual(actual, expected, label) {
  if (actual !== expected)
    throw new Error((label ? label + ': ' : '') + 'expected ' + expected + ', got ' + actual);
}

function log(type, msg) {
  if (typeof document !== 'undefined') {
    var el = document.getElementById('results');
    if (el) {
      var line = document.createElement('div');
      line.className = 'result-' + type;
      line.textContent = msg;
      el.appendChild(line);
    }
  }
  if (typeof console !== 'undefined') {
    type === 'pass' ? console.log(msg) : console.error(msg);
  }
}

// ─── Stat Boundaries ─────────────────────────────────────────────────────────

test('Hunger caps at 100: preferred kibble gain overflows', function () {
  var cat = createCat({ hunger: 98, preference: 'kibble', poos: 0, happiness: 60 });
  var result = applyFeed(cat, 'kibble'); // 98 + 30 = 128 → overflow
  assertEqual(cat.hunger, 100, 'hunger capped');
  assertEqual(cat.poos, 1, 'poo created');
  assertEqual(result, 'poo');
});

test('Happiness caps at 100: Play from 95', function () {
  var cat = createCat({ happiness: 95, energy: 50, hunger: 80 });
  applyPlay(cat);
  assertEqual(cat.happiness, 100, 'happiness capped at 100');
});

test('Energy caps at 100: Rest from 95', function () {
  var cat = createCat({ energy: 95, happiness: 50 });
  applyRest(cat);
  assertEqual(cat.energy, 100, 'energy capped at 100');
});

test('Hunger floors at 0: normal decay on Hunger 2', function () {
  var cat = createCat({ hunger: 2, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.hunger, 0, 'hunger floored at 0');
});

test('Happiness floors at 0: energy penalty on Happiness 1', function () {
  var cat = createCat({ happiness: 1, energy: 10 }); // energy < 20 → −25 penalty
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 0, 'happiness floored at 0');
});

test('Energy floors at 0: evolved decay on Energy 1', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 1, evolved: true });
  applyDecay(cat); // evolved decay: −2 → 1 − 2 = −1 → 0
  assertEqual(cat.energy, 0, 'energy floored at 0');
});

// ─── Action Constraints ───────────────────────────────────────────────────────

test('Feed returns full and creates no poo when overflow attempted at 5 poos', function () {
  // hunger=100: any feed attempt overflows; poos=5 blocks new poo → 'full'
  var cat = createCat({ hunger: 100, poos: 5, preference: 'kibble', happiness: 60 });
  var result = applyFeed(cat, 'kibble');
  assertEqual(cat.poos, 5, 'poo count unchanged');
  assertEqual(result, 'full');
});

test('canPlay false at Energy = 10', function () {
  var cat = createCat({ energy: 10 });
  assert(!canPlay(cat), 'canPlay false at 10');
});

test('canPlay false at Energy = 0', function () {
  var cat = createCat({ energy: 0 });
  assert(!canPlay(cat), 'canPlay false at 0');
});

test('canPlay true at Energy = 11', function () {
  var cat = createCat({ energy: 11 });
  assert(canPlay(cat), 'canPlay true at 11');
});

test('Rest does not push Energy above 100', function () {
  var cat = createCat({ energy: 80, happiness: 50 });
  applyRest(cat);
  assertEqual(cat.energy, 100, 'energy capped at 100');
});

test('Rest floors Happiness at 0', function () {
  var cat = createCat({ energy: 40, happiness: 2 });
  applyRest(cat); // 2 − 5 = −3 → 0
  assertEqual(cat.happiness, 0, 'happiness floored at 0');
});

// ─── Poo Drain Boundary ───────────────────────────────────────────────────────

test('1 poo drains 10 Happiness per tick', function () {
  var cat = createCat({ happiness: 50, poos: 1 });
  applyPooDrain(cat);
  assertEqual(cat.happiness, 40);
});

test('5 poos drain 50 Happiness per tick', function () {
  var cat = createCat({ happiness: 60, poos: 5 });
  applyPooDrain(cat);
  assertEqual(cat.happiness, 10);
});

test('Poo drain floors Happiness at 0', function () {
  var cat = createCat({ happiness: 10, poos: 5 }); // 10 − 50 = −40 → 0
  applyPooDrain(cat);
  assertEqual(cat.happiness, 0);
});

// ─── Counter Behaviour ────────────────────────────────────────────────────────

test('hungryTicks resets when Hunger ≥ 10', function () {
  var cat = createCat({ hunger: 10, happiness: 50, energy: 50, hungryTicks: 3 });
  updateCounters(cat);
  assertEqual(cat.hungryTicks, 0, 'hungryTicks reset');
});

test('pooSickTicks resets when poos ≤ 1', function () {
  var cat = createCat({ poos: 1, hunger: 50, happiness: 50, energy: 50, pooSickTicks: 3 });
  updateCounters(cat);
  assertEqual(cat.pooSickTicks, 0, 'pooSickTicks reset');
});

test('evolvedTicks resets when any stat < 90', function () {
  var cat = createCat({ hunger: 89, happiness: 95, energy: 95, evolvedTicks: 1 });
  updateCounters(cat);
  assertEqual(cat.evolvedTicks, 0, 'evolvedTicks reset');
});

test('createCat feedCount defaults to 0', function () {
  var cat = createCat({});
  assertEqual(cat.feedCount, 0, 'feedCount');
});
test('createCat playCount defaults to 0', function () {
  var cat = createCat({});
  assertEqual(cat.playCount, 0, 'playCount');
});
test('fullHungerTicks resets after natural poo fires', function () {
  var cat = createCat({ hunger: 100, poos: 0, fullHungerTicks: 4, happiness: 60 });
  updateCounters(cat); // fullHungerTicks → 5
  triggerNaturalPoo(cat);
  assertEqual(cat.fullHungerTicks, 0, 'fullHungerTicks reset to 0');
  assertEqual(cat.poos, 1, 'poo was created');
});

// ─── Happy State — Poo Constraint ────────────────────────────────────────────

test('Happy blocked when poos > 1 (returns fine)', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, poos: 2 });
  assertEqual(evaluateState(cat), 'fine');
});

test('Happy allowed when poos = 1', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, poos: 1 });
  assertEqual(evaluateState(cat), 'happy');
});

test('Happy allowed when poos = 0', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, poos: 0 });
  assertEqual(evaluateState(cat), 'happy');
});

// ─── cleanPoo ─────────────────────────────────────────────────────────────────

test('cleanPoo on 0 poos returns false and leaves poos at 0', function () {
  var cat = createCat({ poos: 0 });
  var result = cleanPoo(cat);
  assert(!result, 'returns false');
  assertEqual(cat.poos, 0);
});

test('cleanPoo on 1 poo returns true and leaves poos at 0', function () {
  var cat = createCat({ poos: 1 });
  var result = cleanPoo(cat);
  assert(result, 'returns true');
  assertEqual(cat.poos, 0);
});

// ─── Summary ─────────────────────────────────────────────────────────────────

(function summary() {
  var msg = '\n── Results: ' + passed + '/' + total + ' passed';
  if (failed > 0) msg += ', ' + failed + ' failed';
  msg += ' ──';

  if (typeof document !== 'undefined') {
    var el = document.getElementById('results');
    if (el) {
      var s = document.createElement('div');
      s.className = failed === 0 ? 'summary-pass' : 'summary-fail';
      s.textContent = msg;
      el.appendChild(s);
    }
  }
  if (typeof console !== 'undefined') console.log(msg);
})();
