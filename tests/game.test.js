// game.test.js — Automated unit tests for Tiny Cat
// Requires cat.js to be loaded first (globals: createCat, applyDecay, etc.)

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
function assertRange(value, min, max, label) {
  if (value < min || value > max)
    throw new Error((label ? label + ': ' : '') + value + ' not in [' + min + ', ' + max + ']');
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

// ─── Stat Decay ──────────────────────────────────────────────────────────────

test('Normal decay: hunger −3', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.hunger, 47, 'hunger');
});
test('Normal decay: happiness −2', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.happiness, 48, 'happiness');
});
test('Normal decay: energy −4', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50 });
  applyDecay(cat);
  assertEqual(cat.energy, 46, 'energy');
});
test('Evolved decay: hunger −1.5', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50, evolved: true });
  applyDecay(cat);
  assertEqual(cat.hunger, 48.5, 'hunger evolved');
});
test('Evolved decay: happiness −1', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50, evolved: true });
  applyDecay(cat);
  assertEqual(cat.happiness, 49, 'happiness evolved');
});
test('Evolved decay: energy −2', function () {
  var cat = createCat({ hunger: 50, happiness: 50, energy: 50, evolved: true });
  applyDecay(cat);
  assertEqual(cat.energy, 48, 'energy evolved');
});
test('Stats floor at 0', function () {
  var cat = createCat({ hunger: 1, happiness: 1, energy: 1 });
  applyDecay(cat);
  assert(cat.hunger >= 0, 'hunger >= 0');
  assert(cat.happiness >= 0, 'happiness >= 0');
  assert(cat.energy >= 0, 'energy >= 0');
});
test('Stats never exceed 100 after Rest', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 100 });
  applyRest(cat);
  assert(cat.energy <= 100, 'energy capped');
});

// ─── Poo Drain ───────────────────────────────────────────────────────────────

test('Poo drain: 3 poos drain 30 happiness per tick', function () {
  var cat = createCat({ happiness: 60, poos: 3 });
  applyPooDrain(cat);
  assertEqual(cat.happiness, 30);
});
test('No poos: no happiness drain', function () {
  var cat = createCat({ happiness: 60, poos: 0 });
  applyPooDrain(cat);
  assertEqual(cat.happiness, 60);
});

// ─── Energy → Happiness Penalty ──────────────────────────────────────────────

test('Energy < 20: happiness −25', function () {
  var cat = createCat({ happiness: 60, energy: 15 });
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 35);
});
test('Energy < 50 (≥ 20): happiness −10', function () {
  var cat = createCat({ happiness: 60, energy: 35 });
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 50);
});
test('Energy ≥ 50: no happiness penalty', function () {
  var cat = createCat({ happiness: 60, energy: 50 });
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 60);
});
test('Energy < 20 and < 50: only −25 penalty applies (no stacking)', function () {
  var cat = createCat({ happiness: 60, energy: 10 });
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 35);
});
test('Energy penalty floors happiness at 0', function () {
  var cat = createCat({ happiness: 10, energy: 5 });
  applyEnergyHappinessPenalty(cat);
  assertEqual(cat.happiness, 0);
});

// ─── Feed Action ─────────────────────────────────────────────────────────────

test('Kibble +15 (not preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'tuna' });
  applyFeed(cat, 'kibble');
  assertEqual(cat.hunger, 65);
});
test('Kibble +30 (preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'kibble');
  assertEqual(cat.hunger, 80);
});
test('Tuna +20 (not preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'tuna');
  assertEqual(cat.hunger, 70);
});
test('Tuna +40 (preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'tuna' });
  applyFeed(cat, 'tuna');
  assertEqual(cat.hunger, 90);
});
test('Treats +10 (not preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'kibble' });
  applyFeed(cat, 'treats');
  assertEqual(cat.hunger, 60);
});
test('Treats +20 (preferred)', function () {
  var cat = createCat({ hunger: 50, preference: 'treats' });
  applyFeed(cat, 'treats');
  assertEqual(cat.hunger, 70);
});
test('Feed overflow creates poo', function () {
  var cat = createCat({ hunger: 90, happiness: 60, poos: 0, preference: 'tuna' });
  var result = applyFeed(cat, 'tuna'); // 90+20=110
  assertEqual(cat.hunger, 100, 'hunger capped');
  assertEqual(cat.poos, 1, 'poo created');
  assertEqual(result, 'poo');
});
test('Feed overflow reduces happiness by 5', function () {
  var cat = createCat({ hunger: 95, happiness: 60, poos: 0, preference: 'kibble' });
  applyFeed(cat, 'kibble'); // 95+15=110
  assertEqual(cat.happiness, 55);
});
test('Feed at max poos (5) caps hunger, no new poo', function () {
  var cat = createCat({ hunger: 90, happiness: 60, poos: 5, preference: 'tuna' });
  var result = applyFeed(cat, 'tuna');
  assertEqual(cat.poos, 5);
  assertEqual(result, 'full');
});

// ─── Play & Rest ─────────────────────────────────────────────────────────────

test('Play +20 happiness, −10 energy, −10 hunger', function () {
  var cat = createCat({ happiness: 50, energy: 50, hunger: 80 });
  applyPlay(cat);
  assertEqual(cat.happiness, 70);
  assertEqual(cat.energy, 40);
  assertEqual(cat.hunger, 70);
});
test('Play blocked when energy ≤ 10', function () {
  var cat = createCat({ happiness: 50, energy: 10 });
  assert(!canPlay(cat), 'canPlay false');
  var result = applyPlay(cat);
  assert(!result, 'applyPlay returns false');
  assertEqual(cat.happiness, 50, 'happiness unchanged');
});
test('triggerPlay is same function as applyPlay', function () {
  assert(triggerPlay === applyPlay, 'triggerPlay === applyPlay');
});
test('Rest +30 energy −5 happiness', function () {
  var cat = createCat({ happiness: 50, energy: 40 });
  applyRest(cat);
  assertEqual(cat.energy, 70);
  assertEqual(cat.happiness, 45);
});
test('Rest happiness floors at 0', function () {
  var cat = createCat({ happiness: 3, energy: 40 });
  applyRest(cat);
  assertEqual(cat.happiness, 0);
});

// ─── State Machine ───────────────────────────────────────────────────────────

test('State: hungry when hunger < 30', function () {
  var cat = createCat({ hunger: 29, happiness: 60, energy: 60 });
  assertEqual(evaluateState(cat), 'hungry');
});
test('State: bored when happiness < 50', function () {
  var cat = createCat({ hunger: 50, happiness: 14, energy: 50 });
  assertEqual(evaluateState(cat), 'bored');
});
test('State: happy when all stats ≥ 75', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80 });
  assertEqual(evaluateState(cat), 'happy');
});
test('State: fine when all stats ≥ 50 (default)', function () {
  var cat = createCat({ hunger: 60, happiness: 60, energy: 60 });
  assertEqual(evaluateState(cat), 'fine');
});
test('State: bored when happiness < 50', function () {
  var cat = createCat({ hunger: 50, happiness: 35, energy: 50 });
  assertEqual(evaluateState(cat), 'bored');
});
test('State: belly when bellyActive', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, bellyActive: true });
  assertEqual(evaluateState(cat), 'belly');
});
test('Sick > Bored priority', function () {
  var cat = createCat({ hunger: 5, happiness: 5, energy: 5, sick: true });
  assertEqual(evaluateState(cat), 'sick');
});
test('Sick > Happy priority', function () {
  var cat = createCat({ hunger: 5, happiness: 80, energy: 50, sick: true });
  assertEqual(evaluateState(cat), 'sick');
});
test('Evolved > Happy priority', function () {
  var cat = createCat({ hunger: 95, happiness: 95, energy: 95, evolved: true });
  assertEqual(evaluateState(cat), 'evolved');
});
test('State: tired when energy < 30', function () {
  var cat = createCat({ hunger: 60, happiness: 60, energy: 29 });
  assertEqual(evaluateState(cat), 'tired');
});
test('State: not tired when energy = 30', function () {
  var cat = createCat({ hunger: 60, happiness: 60, energy: 30 });
  assert(evaluateState(cat) !== 'tired', 'should not be tired at energy 30');
});
test('Hungry > Tired priority', function () {
  var cat = createCat({ hunger: 29, happiness: 60, energy: 29 });
  assertEqual(evaluateState(cat), 'hungry');
});
test('Tired > Bored priority', function () {
  var cat = createCat({ hunger: 60, happiness: 40, energy: 29 });
  assertEqual(evaluateState(cat), 'tired');
});
test('Sick > Evolved priority', function () {
  var cat = createCat({ hunger: 5, happiness: 5, energy: 5, sick: true, evolved: true });
  assertEqual(evaluateState(cat), 'sick');
});
test('Evolved > Belly priority', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, evolved: true, bellyActive: true });
  assertEqual(evaluateState(cat), 'evolved');
});
test('Belly > Happy priority', function () {
  var cat = createCat({ hunger: 80, happiness: 80, energy: 80, bellyActive: true });
  assertEqual(evaluateState(cat), 'belly');
});
test('Sick triggers after 2 ticks with hunger < 10', function () {
  var cat = createCat({ hunger: 5, happiness: 60, energy: 60, hungryTicks: 1 });
  runTick(cat);
  assert(cat.sick, 'sick=true');
});
test('Sick halves happiness on entry (hunger path)', function () {
  // updateCounters: hungryTicks→5 (≥2 → sick path eligible); decay: happiness 60−2=58, energy 60−4=56;
  // energy 56 >= 50 → no energy penalty; triggerSick: floor(58/2)=29
  var cat = createCat({ hunger: 5, happiness: 60, energy: 60, hungryTicks: 4 });
  runTick(cat);
  assertEqual(cat.happiness, 29);
});
test('Sick triggers via poo path (>1 poo for 1 full tick)', function () {
  var cat = createCat({ hunger: 50, happiness: 60, energy: 60, poos: 2, pooSickTicks: 0 });
  runTick(cat);
  assert(cat.sick, 'sick via poo path');
});
test('Sick clears when all recovery conditions met', function () {
  var cat = createCat({ hunger: 60, happiness: 60, energy: 60, poos: 0, sick: true });
  checkSickRecovery(cat);
  assert(!cat.sick, 'sick cleared');
});
test('Sick not cleared if poos remain', function () {
  var cat = createCat({ hunger: 60, happiness: 60, energy: 60, poos: 1, sick: true });
  checkSickRecovery(cat);
  assert(cat.sick, 'still sick');
});
test('Sick not cleared if hunger < 50', function () {
  var cat = createCat({ hunger: 40, happiness: 60, energy: 60, poos: 0, sick: true });
  checkSickRecovery(cat);
  assert(cat.sick, 'still sick');
});
test('Sick not cleared if happiness ≤ 50', function () {
  var cat = createCat({ hunger: 60, happiness: 50, energy: 60, poos: 0, sick: true });
  checkSickRecovery(cat);
  assert(cat.sick, 'still sick (happiness must be > 50)');
});
test('Evolved triggers after 2 ticks with all stats ≥ 90', function () {
  var cat = createCat({ hunger: 92, happiness: 92, energy: 92, evolvedTicks: 1 });
  runTick(cat);
  assert(cat.evolved, 'evolved=true');
});
test('Evolved blocked while sick', function () {
  var cat = createCat({ hunger: 92, happiness: 92, energy: 92, evolvedTicks: 1, sick: true });
  runTick(cat);
  assert(!cat.evolved, 'evolved blocked by sick');
});
test('Evolved cat cannot become sick', function () {
  var cat = createCat({ hunger: 5, happiness: 10, energy: 10, hungryTicks: 4, evolved: true });
  runTick(cat);
  assert(!cat.sick, 'evolved immune to sick');
});

// ─── Poo Mechanic ────────────────────────────────────────────────────────────

test('Natural poo created after 5 full-hunger ticks', function () {
  var cat = createCat({ hunger: 100, happiness: 60, poos: 0, fullHungerTicks: 4 });
  runTick(cat);
  assertEqual(cat.poos, 1);
  assertEqual(cat.fullHungerTicks, 0);
});
test('Natural poo reduces happiness by 5', function () {
  // updateCounters: fullHungerTicks→10 (≥5 → triggers); decay: happiness 60−2=58, energy 80−4=76;
  // energy 76 >= 50 → no penalty; triggerNaturalPoo: happiness 58−5=53
  var cat = createCat({ hunger: 100, happiness: 60, poos: 0, fullHungerTicks: 9 });
  runTick(cat);
  assertEqual(cat.happiness, 53);
});
test('Poo count capped at 5', function () {
  var cat = createCat({ hunger: 100, happiness: 60, poos: 5, fullHungerTicks: 4 });
  runTick(cat);
  assertEqual(cat.poos, 5);
});
test('cleanPoo reduces poo count by 1', function () {
  var cat = createCat({ poos: 3 });
  cleanPoo(cat);
  assertEqual(cat.poos, 2);
});

// ─── Belly Event ─────────────────────────────────────────────────────────────

test('Belly event triggers after 2 ticks at happiness 100', function () {
  var cat = createCat({ hunger: 50, happiness: 100, energy: 50, bellyTicks: 1, sick: false, bellyActive: false });
  updateCounters(cat); // happiness=100, not sick → bellyTicks++ = 2
  checkBellyEvent(cat);
  assert(cat.bellyActive, 'bellyActive=true');
});
test('Belly event suppressed when sick', function () {
  var cat = createCat({ happiness: 100, bellyTicks: 4, sick: true, bellyActive: false });
  updateCounters(cat);
  checkBellyEvent(cat);
  assert(!cat.bellyActive, 'suppressed while sick');
});
test('Belly counter resets after decline', function () {
  var cat = createCat({ happiness: 80, bellyActive: true, bellyTicks: 5 });
  resolveBelly(cat, false);
  assertEqual(cat.bellyTicks, 0);
  assert(!cat.bellyActive);
});
test('Belly purr: happiness +15', function () {
  // Override Math.random to return 0.1 (< 0.5 → purr)
  var origRandom = Math.random;
  Math.random = function () { return 0.1; };
  var cat = createCat({ happiness: 70, bellyActive: true });
  var outcome = resolveBelly(cat, true);
  assertEqual(outcome, 'purr');
  assertEqual(cat.happiness, 85);
  Math.random = origRandom;
});
test('Belly attack: happiness −20', function () {
  var origRandom = Math.random;
  Math.random = function () { return 0.9; }; // >= 0.5 → attack
  var cat = createCat({ happiness: 70, bellyActive: true });
  var outcome = resolveBelly(cat, true);
  assertEqual(outcome, 'attack');
  assertEqual(cat.happiness, 50);
  Math.random = origRandom;
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
