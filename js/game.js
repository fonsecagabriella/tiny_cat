// game.js — Tick engine and page visibility handling

var cat              = null;
var tickInterval     = null;
var hiddenAt         = null;
var sessionStartTime = null;

function startGame(newCat) {
  cat              = newCat;
  sessionStartTime = Date.now();
  stopGame();
  tickInterval = setInterval(onTick, 30000);
  document.addEventListener('visibilitychange', onVisibilityChange);
}

function stopGame() {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  document.removeEventListener('visibilitychange', onVisibilityChange);
}

function onTick() {
  if (!cat) return;
  var events = runTick(cat);
  if (typeof renderGame === 'function') renderGame(events);
}

function onVisibilityChange() {
  if (document.hidden) {
    hiddenAt = Date.now();
  } else {
    if (hiddenAt && cat) {
      var elapsed      = Date.now() - hiddenAt;
      var missedTicks  = Math.floor(elapsed / 30000);
      for (var i = 0; i < missedTicks; i++) runTick(cat);
      if (missedTicks > 0 && typeof renderGame === 'function') renderGame({});
    }
    hiddenAt = null;
  }
}
