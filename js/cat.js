// cat.js — Cat entity and all pure game logic

const FOOD = {
  kibble: { base: 15, preferred: 30 },
  tuna:   { base: 20, preferred: 40 },
  treats: { base: 10, preferred: 20 }
};

function createCat(opts) {
  opts = opts || {};
  return {
    name:            opts.name       || '',
    colour:          opts.colour     || '#f4a261',
    preference:      opts.preference || ['kibble', 'tuna', 'treats'][Math.floor(Math.random() * 3)],

    hunger:          opts.hunger    !== undefined ? opts.hunger    : 80,
    happiness:       opts.happiness !== undefined ? opts.happiness : 80,
    energy:          opts.energy    !== undefined ? opts.energy    : 80,

    poos:            opts.poos      !== undefined ? opts.poos      : 0,

    hungryTicks:     opts.hungryTicks     || 0,
    pooSickTicks:    opts.pooSickTicks    || 0,
    evolvedTicks:    opts.evolvedTicks    || 0,
    bellyTicks:      opts.bellyTicks      || 0,
    fullHungerTicks: opts.fullHungerTicks || 0,

    sick:        opts.sick        || false,
    evolved:     opts.evolved     || false,
    bellyActive: opts.bellyActive || false,
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function applyDecay(cat) {
  const d = cat.evolved
    ? { hunger: 2.5, happiness: 1.5, energy: 3 }
    : { hunger: 5,   happiness: 3,   energy: 6 };
  cat.hunger    = clamp(cat.hunger    - d.hunger,    0, 100);
  cat.happiness = clamp(cat.happiness - d.happiness, 0, 100);
  cat.energy    = clamp(cat.energy    - d.energy,    0, 100);
}

// Low energy drains happiness — applied each tick after decay
function applyEnergyHappinessPenalty(cat) {
  if (cat.energy < 20) {
    cat.happiness = clamp(cat.happiness - 25, 0, 100);
  } else if (cat.energy < 50) {
    cat.happiness = clamp(cat.happiness - 10, 0, 100);
  }
}

function applyPooDrain(cat) {
  if (cat.poos > 0) {
    cat.happiness = clamp(cat.happiness - cat.poos, 0, 100);
  }
}

function applyFeed(cat, food) {
  const f = FOOD[food];
  if (!f) return 'invalid';
  const gain = cat.preference === food ? f.preferred : f.base;
  if (cat.hunger + gain > 100) {
    cat.hunger = 100;
    if (cat.poos < 5) {
      cat.poos++;
      cat.happiness = clamp(cat.happiness - 5, 0, 100);
      return 'poo';
    }
    return 'full';
  }
  cat.hunger = clamp(cat.hunger + gain, 0, 100);
  return 'ok';
}

function canPlay(cat) {
  return cat.energy > 10;
}

function applyPlay(cat) {
  if (!canPlay(cat)) return false;
  cat.happiness = clamp(cat.happiness + 20, 0, 100);
  cat.energy    = clamp(cat.energy    - 10, 0, 100);
  cat.hunger    = clamp(cat.hunger    - 10, 0, 100);
  return true;
}

// Shared by Play button and laser easter egg
var triggerPlay = applyPlay;

function applyRest(cat) {
  cat.energy    = clamp(cat.energy    + 30, 0, 100);
  cat.happiness = clamp(cat.happiness - 5,  0, 100);
}

function evaluateState(cat) {
  if (cat.sick)             return 'sick';
  if (cat.evolved)          return 'evolved';
  if (cat.happiness > 50)   return 'happy';
  if (cat.hunger < 30)      return 'hungry';
  if (cat.happiness < 15)   return 'bored';
  return 'normal';
}

function updateCounters(cat) {
  cat.hungryTicks     = cat.hunger    <  10                              ? cat.hungryTicks + 1     : 0;
  cat.pooSickTicks    = cat.poos      >  1                               ? cat.pooSickTicks + 1    : 0;
  cat.fullHungerTicks = cat.hunger   === 100                             ? cat.fullHungerTicks + 1 : 0;
  cat.evolvedTicks    = (cat.hunger >= 90 && cat.happiness >= 90 && cat.energy >= 90 && !cat.sick)
                        ? cat.evolvedTicks + 1 : 0;
  if (cat.happiness === 100 && !cat.sick && !cat.bellyActive) {
    cat.bellyTicks++;
  } else if (cat.happiness < 100 || cat.sick) {
    cat.bellyTicks = 0;
  }
}

function triggerNaturalPoo(cat) {
  if (cat.fullHungerTicks >= 10 && cat.poos < 5) {
    cat.poos++;
    cat.happiness     = clamp(cat.happiness - 5, 0, 100);
    cat.fullHungerTicks = 0;
    return true;
  }
  return false;
}

function triggerSick(cat) {
  if (cat.sick || cat.evolved) return false;
  if (cat.hungryTicks >= 5 || cat.pooSickTicks > 10) {
    cat.happiness = Math.floor(cat.happiness / 2);
    cat.sick      = true;
    return true;
  }
  return false;
}

function checkSickRecovery(cat) {
  if (!cat.sick) return false;
  if (cat.poos === 0 && cat.hunger >= 50 && cat.happiness > 50) {
    cat.sick         = false;
    cat.hungryTicks  = 0;
    cat.pooSickTicks = 0;
    return true;
  }
  return false;
}

function triggerEvolution(cat) {
  if (cat.evolved || cat.sick) return false;
  if (cat.evolvedTicks >= 5) {
    cat.evolved = true;
    return true;
  }
  return false;
}

function checkBellyEvent(cat) {
  if (cat.bellyTicks >= 5 && !cat.bellyActive && !cat.sick) {
    cat.bellyActive = true;
    return true;
  }
  return false;
}

function resolveBelly(cat, petted) {
  cat.bellyActive = false;
  cat.bellyTicks  = 0;
  if (!petted) return 'declined';
  const purr = Math.random() < 0.5;
  if (purr) {
    cat.happiness = clamp(cat.happiness + 15, 0, 100);
  } else {
    cat.happiness = clamp(cat.happiness - 20, 0, 100);
  }
  return purr ? 'purr' : 'attack';
}

function cleanPoo(cat) {
  if (cat.poos > 0) { cat.poos--; return true; }
  return false;
}

// One full tick — returns triggered events
// updateCounters runs first so fullHungerTicks/bellyTicks/evolvedTicks are
// evaluated against pre-decay stat values, then decay + penalties are applied.
function runTick(cat) {
  var events = { naturalpoo: false, sick: false, evolved: false, belly: false, recovery: false };
  updateCounters(cat);
  applyDecay(cat);
  applyEnergyHappinessPenalty(cat);
  applyPooDrain(cat);
  if (triggerNaturalPoo(cat))  events.naturalpoo = true;
  if (triggerSick(cat))        events.sick        = true;
  if (checkBellyEvent(cat))    events.belly       = true;
  if (triggerEvolution(cat))   events.evolved     = true;
  if (checkSickRecovery(cat))  events.recovery    = true;
  return events;
}
