// ui.js — DOM rendering, screens, events, and laser easter egg

// ─── SVG Cat Sprite (pixel art — rect and polygon only) ───────────────────────

function getCatSVG(state, colour) {
  var inner = '#f0a0a0'; // inner ear: fixed pink

  // ── Fine expression ────────────────────────────────────────────────────────
  var face_fine = {
    eyes: [
      '<rect x="58" y="80" width="14" height="14" fill="#2a2a2a"/>',
      '<rect x="62" y="82" width="5"  height="5"  fill="white"/>',
      '<rect x="128" y="80" width="14" height="14" fill="#2a2a2a"/>',
      '<rect x="132" y="82" width="5"  height="5"  fill="white"/>'
    ].join(''),
    mouth: [
      '<rect x="86"  y="116" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="106" y="116" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="94"  y="120" width="12" height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: ''
  };

  // ── Hungry expression ─────────────────────────────────────────────────────
  var face_hungry = {
    eyes: [
      // Left eye
      '<rect x="58" y="80" width="14" height="14" fill="#2a2a2a"/>',
      '<rect x="62" y="82" width="5"  height="5"  fill="white"/>',
      // Left brow (angled down toward centre: high on left, low on right)
      '<rect x="54" y="68" width="8"  height="4"  fill="#2a2a2a"/>',
      '<rect x="62" y="72" width="8"  height="4"  fill="#2a2a2a"/>',
      // Right eye
      '<rect x="128" y="80" width="14" height="14" fill="#2a2a2a"/>',
      '<rect x="132" y="82" width="5"  height="5"  fill="white"/>',
      // Right brow (angled down toward centre: low on left, high on right)
      '<rect x="130" y="72" width="8"  height="4"  fill="#2a2a2a"/>',
      '<rect x="138" y="68" width="8"  height="4"  fill="#2a2a2a"/>'
    ].join(''),
    mouth: [
      // Downturned mouth: corners down, centre up
      '<rect x="84"  y="122" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="108" y="122" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="92"  y="118" width="16" height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: ''
  };

  // ── Tired expression ──────────────────────────────────────────────────────
  var face_tired = {
    eyes: [
      // Left eye: very thin (height 4, thinner than Bored's 7)
      '<rect x="58" y="83" width="14" height="4" fill="#2a2a2a"/>',
      // Right eye
      '<rect x="128" y="83" width="14" height="4" fill="#2a2a2a"/>'
    ].join(''),
    mouth: [
      // Small open square (yawn): dark outline with lighter interior
      '<rect x="90" y="114" width="20" height="14" fill="#2a2a2a"/>',
      '<rect x="93" y="117" width="14" height="8"  fill="#cc7777"/>'
    ].join(''),
    extras: [
      // ZZZ pixel mark: three stacked rects, decreasing width, near top-right of head
      '<rect x="150" y="54" width="10" height="4" fill="#aaaaff"/>',
      '<rect x="152" y="46" width="8"  height="4" fill="#aaaaff"/>',
      '<rect x="154" y="38" width="6"  height="4" fill="#aaaaff"/>'
    ].join('')
  };

  // ── Bored expression ──────────────────────────────────────────────────────
  var face_bored = {
    eyes: [
      // Left eye: half-height (drooping lid) — top half dark, shorter
      '<rect x="58" y="80" width="14" height="7"  fill="#2a2a2a"/>',
      '<rect x="62" y="82" width="5"  height="4"  fill="white"/>',
      // Right eye
      '<rect x="128" y="80" width="14" height="7"  fill="#2a2a2a"/>',
      '<rect x="132" y="82" width="5"  height="4"  fill="white"/>'
    ].join(''),
    mouth: [
      // Flat horizontal line
      '<rect x="84" y="118" width="32" height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: ''
  };

  // ── Happy expression ──────────────────────────────────────────────────────
  var face_happy = {
    eyes: [
      // Left eye: closed upward arc built from step-rects (∩ shape)
      '<rect x="58"  y="88" width="4"  height="8"  fill="#2a2a2a"/>',
      '<rect x="62"  y="84" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="66"  y="82" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="70"  y="84" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="68"  y="88" width="4"  height="4"  fill="#2a2a2a"/>',
      // Right eye
      '<rect x="128" y="88" width="4"  height="8"  fill="#2a2a2a"/>',
      '<rect x="132" y="84" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="136" y="82" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="140" y="84" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="138" y="88" width="4"  height="4"  fill="#2a2a2a"/>'
    ].join(''),
    mouth: [
      // Wide smile: corners up, centre down
      '<rect x="80"  y="118" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="112" y="118" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="88"  y="122" width="24" height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: [
      // Blush marks: small pink rects below each eye
      '<rect x="54"  y="100" width="12" height="6" fill="#ff8888" opacity="0.55"/>',
      '<rect x="134" y="100" width="12" height="6" fill="#ff8888" opacity="0.55"/>'
    ].join('')
  };

  // ── Sick expression ───────────────────────────────────────────────────────
  var face_sick = {
    eyes: [
      // Left eye: X shape — pixel staircase, no rotation
      // diagonal top-left → bottom-right
      '<rect x="57" y="79" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="61" y="83" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="65" y="87" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="69" y="91" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="73" y="95" width="4" height="4" fill="#2a2a2a"/>',
      // diagonal top-right → bottom-left
      '<rect x="73" y="79" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="69" y="83" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="61" y="91" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="57" y="95" width="4" height="4" fill="#2a2a2a"/>',
      // Right eye: X shape — pixel staircase
      '<rect x="123" y="79" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="127" y="83" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="131" y="87" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="135" y="91" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="139" y="95" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="139" y="79" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="135" y="83" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="127" y="91" width="4" height="4" fill="#2a2a2a"/>',
      '<rect x="123" y="95" width="4" height="4" fill="#2a2a2a"/>'
    ].join(''),
    mouth: [
      // Uneven/jagged mouth
      '<rect x="84"  y="116" width="6"  height="4" fill="#2a2a2a"/>',
      '<rect x="90"  y="120" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="98"  y="116" width="6"  height="4" fill="#2a2a2a"/>',
      '<rect x="104" y="120" width="8"  height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: [
      // Sweat drop indicator mark (top-right of head)
      '<rect x="154" y="52" width="6"  height="10" fill="#88ccff"/>',
      '<rect x="152" y="60" width="10" height="4"  fill="#88ccff"/>'
    ].join('')
  };

  // ── Evolved expression ────────────────────────────────────────────────────
  var face_evolved = {
    eyes: [
      // Left eye: pixel diamond shape
      '<rect x="65"  y="78" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="61"  y="82" width="12" height="4"  fill="#2a2a2a"/>',
      '<rect x="57"  y="86" width="16" height="4"  fill="#2a2a2a"/>',
      '<rect x="61"  y="90" width="12" height="4"  fill="#2a2a2a"/>',
      '<rect x="65"  y="94" width="4"  height="4"  fill="#2a2a2a"/>',
      // Right eye: pixel diamond shape
      '<rect x="131" y="78" width="4"  height="4"  fill="#2a2a2a"/>',
      '<rect x="127" y="82" width="12" height="4"  fill="#2a2a2a"/>',
      '<rect x="123" y="86" width="16" height="4"  fill="#2a2a2a"/>',
      '<rect x="127" y="90" width="12" height="4"  fill="#2a2a2a"/>',
      '<rect x="131" y="94" width="4"  height="4"  fill="#2a2a2a"/>'
    ].join(''),
    mouth: [
      // Wide smile
      '<rect x="78"  y="118" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="114" y="118" width="8"  height="4" fill="#2a2a2a"/>',
      '<rect x="86"  y="122" width="28" height="4" fill="#2a2a2a"/>'
    ].join(''),
    extras: [
      // Sparkle marks near head: + shape, left side
      '<rect x="14"  y="28" width="4"  height="16" fill="#ffff00"/>',
      '<rect x="8"   y="34" width="16" height="4"  fill="#ffff00"/>',
      // Sparkle marks near head: + shape, right side
      '<rect x="178" y="28" width="4"  height="16" fill="#ffff00"/>',
      '<rect x="172" y="34" width="16" height="4"  fill="#ffff00"/>'
    ].join('')
  };

  var faces = {
    fine:    face_fine,
    hungry:  face_hungry,
    tired:   face_tired,
    bored:   face_bored,
    happy:   face_happy,
    sick:    face_sick,
    evolved: face_evolved
  };
  var f = faces[state] || face_fine;

  // ── Belly state: cat on its back ───────────────────────────────────────────
  if (state === 'belly') {
    return [
      '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="cat-svg state-belly">',
      // Four legs pointing up
      '  <rect x="44"  y="16" width="24" height="72" fill="' + colour + '"/>',
      '  <rect x="76"  y="8"  width="24" height="80" fill="' + colour + '"/>',
      '  <rect x="100" y="8"  width="24" height="80" fill="' + colour + '"/>',
      '  <rect x="132" y="16" width="24" height="72" fill="' + colour + '"/>',
      // Body
      '  <rect x="36"  y="84" width="128" height="80" fill="' + colour + '"/>',
      // Belly highlight
      '  <rect x="52"  y="96" width="96"  height="56" fill="white" fill-opacity="0.25"/>',
      // Head at bottom
      '  <rect x="40"  y="160" width="120" height="64" fill="' + colour + '"/>',
      // Ears pointing down
      '  <polygon points="56,160 44,224 88,160"  fill="' + colour + '"/>',
      '  <polygon points="112,160 156,224 144,160" fill="' + colour + '"/>',
      '  <polygon points="62,160 54,208 80,160"   fill="' + inner + '"/>',
      '  <polygon points="120,160 146,208 138,160" fill="' + inner + '"/>',
      // Nose
      '  <rect x="93" y="192" width="14" height="8" fill="#ff9999"/>',
      // Happy eyes
      '  <rect x="62"  y="174" width="14" height="14" fill="#2a2a2a"/>',
      '  <rect x="66"  y="176" width="5"  height="5"  fill="white"/>',
      '  <rect x="124" y="174" width="14" height="14" fill="#2a2a2a"/>',
      '  <rect x="128" y="176" width="5"  height="5"  fill="white"/>',
      // Happy mouth
      '  <rect x="86"  y="202" width="8"  height="4" fill="#2a2a2a"/>',
      '  <rect x="106" y="202" width="8"  height="4" fill="#2a2a2a"/>',
      '  <rect x="94"  y="206" width="12" height="4" fill="#2a2a2a"/>',
      // Tail to right
      '  <rect x="160" y="92" width="32" height="20" fill="' + colour + '"/>',
      '  <rect x="176" y="76" width="20" height="20" fill="' + colour + '"/>',
      '</svg>'
    ].join('\n');
  }

  // ── Upright cat body (all states except belly) ─────────────────────────────
  return [
    '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="cat-svg state-' + state + '">',
    // Tail (vertical with curl tip)
    '  <rect x="148" y="152" width="20" height="48" fill="' + colour + '"/>',
    '  <rect x="136" y="144" width="24" height="16" fill="' + colour + '"/>',
    // Body
    '  <rect x="52" y="132" width="96" height="64" fill="' + colour + '"/>',
    // Left paw
    '  <rect x="52"  y="192" width="28" height="40" fill="' + colour + '"/>',
    // Right paw
    '  <rect x="120" y="192" width="28" height="40" fill="' + colour + '"/>',
    // Head
    '  <rect x="40" y="48" width="120" height="88" fill="' + colour + '"/>',
    // Left ear
    '  <polygon points="48,56 64,4 92,56"   fill="' + colour + '"/>',
    // Right ear
    '  <polygon points="108,56 136,4 152,56" fill="' + colour + '"/>',
    // Inner left ear
    '  <polygon points="56,56 68,20 84,56"   fill="' + inner + '"/>',
    // Inner right ear
    '  <polygon points="116,56 132,20 144,56" fill="' + inner + '"/>',
    // Nose
    '  <rect x="92" y="104" width="16" height="10" fill="#ff9999"/>',
    // Whiskers (thin rects)
    '  <rect x="4"   y="100" width="36" height="3" fill="#888888" opacity="0.6"/>',
    '  <rect x="4"   y="110" width="36" height="3" fill="#888888" opacity="0.6"/>',
    '  <rect x="160" y="100" width="36" height="3" fill="#888888" opacity="0.6"/>',
    '  <rect x="160" y="110" width="36" height="3" fill="#888888" opacity="0.6"/>',
    // Face (extras, eyes, mouth from expression object)
    '  ' + f.extras,
    '  ' + f.eyes,
    '  ' + f.mouth,
    '</svg>'
  ].join('\n');
}

// ─── Screen Management ────────────────────────────────────────────────────────

function showScreen(id) {
  document.getElementById('welcome-screen').classList.toggle('hidden',    id !== 'welcome');
  document.getElementById('transition-screen').classList.toggle('hidden', id !== 'transition');
  var gameEl = document.getElementById('game-screen');
  gameEl.classList.toggle('hidden', id !== 'game');
  if (id === 'game') {
    gameEl.style.opacity = '0';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { gameEl.style.opacity = '1'; });
    });
  }
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
    fine:    'Fine',
    hungry:  'Hungry',
    tired:   'Tired',
    bored:   'Bored',
    happy:   'Happy',
    belly:   'Belly',
    sick:    'Sick',
    evolved: 'Evolved'
  };
  document.getElementById('state-label').textContent = labels[state] || state;
  document.getElementById('state-label').className   = 'state-label state-' + state;
}

function renderSprite() {
  if (!cat) return;
  var state     = evaluateState(cat);
  var container = document.getElementById('cat-sprite-container');
  container.innerHTML = getCatSVG(state, cat.colour);
  var tint = document.getElementById('belly-tint');
  if (tint) tint.classList.toggle('active', state === 'belly');
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

function onPooClick(e) {
  var btn = e.currentTarget;
  showConfirm('Clean up the poo? 💩', function () {
    btn.classList.add('poo-removing');
    btn.addEventListener('animationend', function () {
      cleanPoo(cat);
      checkSickRecovery(cat);
      renderGame({});
    }, { once: true });
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
  var nameInput   = document.getElementById('cat-name');
  var colourInput = document.getElementById('cat-colour');
  var startBtn    = document.getElementById('start-btn');

  // Group 3 — Colour picker: initialise --cat-colour on load
  document.documentElement.style.setProperty('--cat-colour', colourInput.value);
  colourInput.addEventListener('input', function () {
    document.documentElement.style.setProperty('--cat-colour', colourInput.value);
  });

  // Group 5 — Theme toggle
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var label = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    document.getElementById('theme-toggle-welcome').textContent = label;
    document.getElementById('theme-toggle-game').textContent    = label;
  }

  function onThemeToggle() {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
  }

  document.getElementById('theme-toggle-welcome').addEventListener('click', onThemeToggle);
  document.getElementById('theme-toggle-game').addEventListener('click', onThemeToggle);

  // Group 2 — Name input / Start button
  nameInput.addEventListener('input', function () {
    startBtn.disabled = nameInput.value.trim().length === 0;
  });

  // Group 4 — Cat creation with transition (REQ-W10)
  startBtn.addEventListener('click', function () {
    var name   = nameInput.value.trim().slice(0, 20);
    var colour = colourInput.value;
    cat = createCat({ name: name, colour: colour });
    startGame(cat);
    document.getElementById('transition-name').textContent = name + ' is being made';
    document.getElementById('cat-name-display').textContent = name;
    showScreen('transition');
    setTimeout(function () {
      renderGame({});
      showScreen('game');
    }, 2000);
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
      document.documentElement.style.setProperty('--cat-colour', '#f4a261');
      showScreen('welcome');
    });
  });

  // Laser
  initLaser();
});
