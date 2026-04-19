// ui.js — DOM rendering, screens, events, and laser easter egg

// ─── SVG Cat Sprite ───────────────────────────────────────────────────────────

function getCatSVG(state, colour) {
  var inner = '#ffb3ba';

  var faces = {
    normal: {
      eyes: [
        '<circle cx="82" cy="90" r="7" fill="#333"/>',
        '<circle cx="85" cy="87" r="2.5" fill="white"/>',
        '<circle cx="118" cy="90" r="7" fill="#333"/>',
        '<circle cx="121" cy="87" r="2.5" fill="white"/>'
      ].join(''),
      mouth:  '<path d="M 90 113 Q 100 121 110 113" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
      extras: ''
    },
    hungry: {
      eyes: [
        '<ellipse cx="82" cy="92" rx="7" ry="5.5" fill="#333"/>',
        '<circle cx="85" cy="89" r="2" fill="white"/>',
        '<line x1="75" y1="85" x2="89" y2="88" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>',
        '<ellipse cx="118" cy="92" rx="7" ry="5.5" fill="#333"/>',
        '<circle cx="121" cy="89" r="2" fill="white"/>',
        '<line x1="111" y1="88" x2="125" y2="85" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>'
      ].join(''),
      mouth:  '<path d="M 90 118 Q 100 110 110 118" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
      extras: ''
    },
    bored: {
      eyes: [
        '<ellipse cx="82" cy="93" rx="7" ry="4" fill="#333"/>',
        '<circle cx="85" cy="91" r="1.5" fill="white"/>',
        '<ellipse cx="118" cy="93" rx="7" ry="4" fill="#333"/>',
        '<circle cx="121" cy="91" r="1.5" fill="white"/>'
      ].join(''),
      mouth:  '<line x1="91" y1="115" x2="109" y2="115" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>',
      extras: ''
    },
    happy: {
      eyes: [
        '<path d="M 75 93 Q 82 82 89 93" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
        '<path d="M 111 93 Q 118 82 125 93" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      ].join(''),
      mouth:  '<path d="M 87 111 Q 100 124 113 111" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>',
      extras: [
        '<circle cx="71" cy="102" r="7" fill="#ffb3c1" opacity="0.65"/>',
        '<circle cx="129" cy="102" r="7" fill="#ffb3c1" opacity="0.65"/>'
      ].join('')
    },
    sick: {
      eyes: [
        '<line x1="75" y1="83" x2="89" y2="97" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>',
        '<line x1="89" y1="83" x2="75" y2="97" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>',
        '<line x1="111" y1="83" x2="125" y2="97" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>',
        '<line x1="125" y1="83" x2="111" y2="97" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>'
      ].join(''),
      mouth:  '<path d="M 90 114 Q 95 121 100 115 Q 105 109 110 115" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
      extras: [
        '<ellipse cx="143" cy="77" rx="7" ry="9" fill="#d4e8ff" stroke="#b0cce8" stroke-width="1"/>',
        '<path d="M 140 74 Q 143 82 146 74" fill="#b0cce8"/>'
      ].join('')
    },
    evolved: {
      eyes: [
        '<polygon points="82,83 84,88 89,90 84,92 82,97 80,92 75,90 80,88" fill="#FFD700"/>',
        '<polygon points="118,83 120,88 125,90 120,92 118,97 116,92 111,90 116,88" fill="#FFD700"/>'
      ].join(''),
      mouth:  '<path d="M 85 110 Q 100 126 115 110" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>',
      extras: [
        '<circle cx="71" cy="102" r="8" fill="#ffb3c1" opacity="0.7"/>',
        '<circle cx="129" cy="102" r="8" fill="#ffb3c1" opacity="0.7"/>',
        '<text x="97" y="54" font-size="13" fill="#FFD700" text-anchor="middle">✦</text>',
        '<text x="112" y="48" font-size="9" fill="#FFD700" text-anchor="middle">✦</text>'
      ].join('')
    }
  };

  var f = faces[state] || faces.normal;

  return [
    '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="cat-svg state-' + state + '">',
    '  <path d="M 148 212 Q 188 188 172 148" stroke="' + colour + '" stroke-width="15" fill="none" stroke-linecap="round"/>',
    '  <ellipse cx="100" cy="185" rx="56" ry="46" fill="' + colour + '"/>',
    '  <ellipse cx="74" cy="222" rx="20" ry="11" fill="' + colour + '"/>',
    '  <ellipse cx="126" cy="222" rx="20" ry="11" fill="' + colour + '"/>',
    '  <circle cx="100" cy="95" r="54" fill="' + colour + '"/>',
    '  <polygon points="56,63 43,18 85,48" fill="' + colour + '"/>',
    '  <polygon points="144,63 157,18 115,48" fill="' + colour + '"/>',
    '  <polygon points="59,60 50,26 81,48" fill="' + inner + '"/>',
    '  <polygon points="141,60 150,26 119,48" fill="' + inner + '"/>',
    '  <line x1="35" y1="101" x2="80" y2="101" stroke="#666" stroke-width="1" opacity="0.5"/>',
    '  <line x1="35" y1="109" x2="80" y2="108" stroke="#666" stroke-width="1" opacity="0.5"/>',
    '  <line x1="120" y1="101" x2="165" y2="101" stroke="#666" stroke-width="1" opacity="0.5"/>',
    '  <line x1="120" y1="108" x2="165" y2="109" stroke="#666" stroke-width="1" opacity="0.5"/>',
    '  <ellipse cx="100" cy="106" rx="5" ry="4" fill="#ff9999"/>',
    '  ' + f.extras,
    '  ' + f.eyes,
    '  ' + f.mouth,
    '</svg>'
  ].join('\n');
}

// ─── Screen Management ────────────────────────────────────────────────────────

function showScreen(id) {
  document.getElementById('welcome-screen').classList.toggle('hidden', id !== 'welcome');
  document.getElementById('game-screen').classList.toggle('hidden',   id !== 'game');
}

// ─── Rendering ────────────────────────────────────────────────────────────────

function renderStatBar(id, value) {
  var fill = document.getElementById(id + '-bar');
  var val  = document.getElementById(id + '-val');
  if (!fill || !val) return;
  var pct = Math.round(clamp(value, 0, 100));
  fill.style.width = pct + '%';
  fill.className = 'bar-fill ' + (pct > 50 ? 'high' : pct > 25 ? 'mid' : 'low');
  val.textContent = pct;
}

function renderPoos() {
  var area = document.getElementById('poo-area');
  if (!area || !cat) return;
  area.innerHTML = '';
  for (var i = 0; i < cat.poos; i++) {
    var btn = document.createElement('button');
    btn.className   = 'poo-btn';
    btn.textContent = '💩';
    btn.title       = 'Click to clean';
    btn.addEventListener('click', onPooClick);
    area.appendChild(btn);
  }
}

function renderButtons() {
  if (!cat) return;
  document.getElementById('feed-btn').disabled = cat.poos >= 5;
  document.getElementById('play-btn').disabled = !canPlay(cat);
  document.getElementById('pet-btn').classList.toggle('hidden', !cat.bellyActive);
}

function renderStateLabel() {
  if (!cat) return;
  var state = evaluateState(cat);
  var labels = {
    normal:  'Normal',
    hungry:  'Hungry 🍽',
    bored:   'Bored 😑',
    happy:   'Happy 😸',
    sick:    'Sick 🤒',
    evolved: 'Evolved ✨'
  };
  document.getElementById('state-label').textContent = labels[state] || state;
  document.getElementById('state-label').className   = 'state-label state-' + state;
}

function renderSprite() {
  if (!cat) return;
  var state     = evaluateState(cat);
  var container = document.getElementById('cat-sprite-container');
  container.innerHTML = getCatSVG(state, cat.colour);
}

function renderGame(events) {
  if (!cat) return;
  events = events || {};
  renderSprite();
  renderStatBar('hunger',    cat.hunger);
  renderStatBar('happiness', cat.happiness);
  renderStatBar('energy',    cat.energy);
  renderPoos();
  renderButtons();
  renderStateLabel();
  renderSickHint();

  if (events.sick)      showMessage('Your cat is sick! Feed, clean, and cheer them up. 🤒', 5000);
  if (events.naturalpoo) showMessage('Your cat pooped! 💩', 3000);
  if (events.evolved)   showEvolutionOverlay();
  if (events.belly)     showOverlay('belly-overlay');
  if (events.recovery)  showMessage('Your cat feels better! 😸', 3000);
}

function renderSickHint() {
  var hint = document.getElementById('sick-hint');
  if (!hint || !cat) return;
  if (cat.sick) {
    var parts = [];
    if (cat.poos > 0)       parts.push('clean poos');
    if (cat.hunger < 50)    parts.push('feed (' + Math.round(cat.hunger) + '/50)');
    if (cat.happiness <= 50) parts.push('happiness (' + Math.round(cat.happiness) + '/50)');
    hint.textContent = parts.length ? 'To recover: ' + parts.join(', ') : 'Almost recovered…';
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }
}

// ─── Messages ─────────────────────────────────────────────────────────────────

var messageTimer = null;

function showMessage(text, duration) {
  var area = document.getElementById('message-area');
  if (!area) return;
  area.textContent  = text;
  area.classList.add('visible');
  if (messageTimer) clearTimeout(messageTimer);
  messageTimer = setTimeout(function () {
    area.classList.remove('visible');
  }, duration || 3000);
}

// ─── Overlays ─────────────────────────────────────────────────────────────────

function showOverlay(id) {
  document.getElementById(id).classList.remove('hidden');
}
function hideOverlay(id) {
  document.getElementById(id).classList.add('hidden');
}

function showEvolutionOverlay() {
  document.getElementById('evolved-name').textContent = cat.name + ' evolved!';
  showOverlay('evolution-overlay');
}

// ─── Confirm helper ───────────────────────────────────────────────────────────

var confirmCallback = null;

function showConfirm(message, onYes) {
  document.getElementById('confirm-message').textContent = message;
  confirmCallback = onYes;
  showOverlay('confirm-overlay');
}

// ─── Poo click ────────────────────────────────────────────────────────────────

function onPooClick() {
  showConfirm('Clean up the poo? 💩', function () {
    cleanPoo(cat);
    checkSickRecovery(cat);
    renderGame({});
  });
}

// ─── Laser Easter Egg ─────────────────────────────────────────────────────────

var laserDot        = null;
var laserDragStart  = null;
var laserFired      = false;
var laserCooldownUntil = 0;

function initLaser() {
  var area = document.getElementById('game-screen');

  function getPos(e) {
    var rect = area.getBoundingClientRect();
    var src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function onDragStart(e) {
    if (e.target.closest('button') || e.target.closest('.overlay') || e.target.closest('.panel')) return;
    laserDragStart = getPos(e);
    laserFired     = false;
  }

  function onDragMove(e) {
    if (!laserDragStart) return;
    var pos  = getPos(e);
    var dist = Math.hypot(pos.x - laserDragStart.x, pos.y - laserDragStart.y);
    if (dist < 20) return;

    // Show laser dot
    if (!laserDot) {
      laserDot = document.createElement('div');
      laserDot.id = 'laser-dot';
      area.appendChild(laserDot);
    }
    var canEnergy = canPlay(cat);
    laserDot.className = canEnergy ? 'laser-active' : 'laser-blocked';
    laserDot.style.left = pos.x + 'px';
    laserDot.style.top  = pos.y + 'px';

    // Fire once per drag, after cooldown
    if (!laserFired && Date.now() > laserCooldownUntil) {
      laserFired = true;
      var played = triggerPlay(cat);
      if (played) {
        laserCooldownUntil = Date.now() + 5000;
        checkSickRecovery(cat);
        renderGame({});
        showMessage(cat.name + ' chases the laser! +20 Happiness ✦', 2000);
      }
    }
  }

  function onDragEnd() {
    laserDragStart = null;
    if (laserDot) { laserDot.remove(); laserDot = null; }
  }

  area.addEventListener('mousedown',  onDragStart);
  area.addEventListener('mousemove',  onDragMove);
  area.addEventListener('mouseup',    onDragEnd);
  area.addEventListener('mouseleave', onDragEnd);
  area.addEventListener('touchstart', onDragStart, { passive: true });
  area.addEventListener('touchmove',  onDragMove,  { passive: true });
  area.addEventListener('touchend',   onDragEnd);
}

// ─── Event listeners ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // Welcome screen
  var nameInput  = document.getElementById('cat-name');
  var colourInput = document.getElementById('cat-colour');
  var startBtn   = document.getElementById('start-btn');

  nameInput.addEventListener('input', function () {
    startBtn.disabled = nameInput.value.trim().length === 0;
  });

  startBtn.addEventListener('click', function () {
    var name   = nameInput.value.trim().slice(0, 20);
    var colour = colourInput.value;
    cat = createCat({ name: name, colour: colour });
    document.getElementById('cat-name-display').textContent = name;
    document.documentElement.style.setProperty('--cat-colour', colour);
    showScreen('game');
    startGame(cat);
    renderGame({});
  });

  // Feed
  document.getElementById('feed-btn').addEventListener('click', function () {
    if (cat.poos >= 5) return;
    document.getElementById('food-panel').classList.remove('hidden');
  });

  document.querySelectorAll('.food-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var food   = btn.dataset.food;
      var result = applyFeed(cat, food);
      document.getElementById('food-panel').classList.add('hidden');
      checkSickRecovery(cat);
      renderGame({});
      var foodNames = { kibble: 'Kibble', tuna: 'Tuna', treats: 'Treats' };
      if (result === 'poo') {
        showMessage('Too much food — ' + cat.name + ' pooped! 💩', 3000);
      } else if (result === 'full') {
        showMessage(cat.name + ' is stuffed! (Already 5 poos)', 3000);
      } else {
        var preferred = cat.preference === food ? ' (favourite!) ⭐' : '';
        showMessage(foodNames[food] + preferred + ' — Hunger +' + (cat.preference === food ? FOOD[food].preferred : FOOD[food].base), 2500);
      }
    });
  });

  document.getElementById('food-cancel').addEventListener('click', function () {
    document.getElementById('food-panel').classList.add('hidden');
  });

  // Play
  document.getElementById('play-btn').addEventListener('click', function () {
    if (!canPlay(cat)) return;
    applyPlay(cat);
    checkSickRecovery(cat);
    renderGame({});
    showMessage(cat.name + ' plays! +20 Happiness, -10 Energy', 2000);
  });

  // Rest
  document.getElementById('rest-btn').addEventListener('click', function () {
    applyRest(cat);
    checkSickRecovery(cat);
    renderGame({});
    showMessage(cat.name + ' rests. +30 Energy', 2000);
  });

  // Pet (belly event)
  document.getElementById('pet-btn').addEventListener('click', function () {
    showOverlay('belly-overlay');
  });

  document.getElementById('belly-yes').addEventListener('click', function () {
    hideOverlay('belly-overlay');
    var outcome = resolveBelly(cat, true);
    renderGame({});
    if (outcome === 'purr') {
      showMessage(cat.name + ' purrs! 😻 +15 Happiness', 3000);
    } else {
      showMessage(cat.name + ' attacked! 🐾 -20 Happiness', 3000);
    }
  });

  document.getElementById('belly-no').addEventListener('click', function () {
    hideOverlay('belly-overlay');
    resolveBelly(cat, false);
    renderGame({});
  });

  // Evolution overlay
  document.getElementById('evolution-ok').addEventListener('click', function () {
    hideOverlay('evolution-overlay');
  });

  // Confirm overlay
  document.getElementById('confirm-yes').addEventListener('click', function () {
    hideOverlay('confirm-overlay');
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
  });
  document.getElementById('confirm-no').addEventListener('click', function () {
    hideOverlay('confirm-overlay');
    confirmCallback = null;
  });

  // New Cat
  document.getElementById('new-cat-btn').addEventListener('click', function () {
    showConfirm('Start over with a new cat?', function () {
      stopGame();
      cat = null;
      nameInput.value    = '';
      startBtn.disabled  = true;
      colourInput.value  = '#f4a261';
      showScreen('welcome');
    });
  });

  // Laser
  initLaser();
});
