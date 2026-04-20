# Validation — Phase 5: Easter Eggs

Manual validation only. No unit tests required for this phase.
All checks are performed in a browser with DevTools open.
Start a game session before running any test (enter a name, click Start).

---

## EE-01 — Evolution Badge

### Level 1 — Smoke Tests

| # | Check | Expected |
|---|---|---|
| E01 | Inspect `#evolution-badge` on game screen load | Element has `.hidden` class; not visible |
| E02 | Inspect `#evolved-time` inside `#evolution-overlay` | Element present; empty or hidden |
| E03 | Trigger evolution overlay via console (shortcut below) | Evolution overlay shows time string in "Xm Ys" format |
| E04 | Click Continue to dismiss overlay | `#evolution-badge` appears on game screen with correct text |
| E05 | Advance several ticks via console | Badge still present; text unchanged |
| E06 | Inspect badge text | Format: "[cat name] evolved in Xm Ys" |

**Console shortcut — trigger evolution immediately:**
```js
// Wait at least a few seconds after game start so elapsed time is non-zero
cat.sick = false; cat.bellyActive = false;
cat.evolved = true;
renderGame({ evolved: true });
```

**Console shortcut — trigger evolution after a known delay:**
```js
// Note the time, then run after e.g. 75 seconds → expect "1m 15s"
cat.evolved = true;
renderGame({ evolved: true });
```

---

### Level 2 — Full Flow

**Flow: Verify badge text accuracy**

1. Start a new session. Note the time in DevTools console: `console.log(Date.now())`
2. Wait exactly 90 seconds (or use `setTimeout`)
3. Trigger evolution:
   ```js
   cat.evolved = true; renderGame({ evolved: true });
   ```
4. Check overlay — time string should read "1m 30s"
5. Click Continue
6. Check `#evolution-badge` — text should read "[name] evolved in 1m 30s"

**Edge case: sub-60-second evolution**
```js
// Trigger immediately after game start (within first minute)
cat.evolved = true; renderGame({ evolved: true });
```
Expected time string: "0m Xs" (e.g. "0m 4s").

---

## EE-02 — Tap to Pet

### Level 1 — Smoke Tests

| # | Check | Expected |
|---|---|---|
| T01 | Inspect `#cat-sprite-container` in Styles | No `cursor: pointer`; no `title` attribute |
| T02 | Inspect `#tap-mark` at rest | Hidden; no content visible |
| T03 | Tap cat with no feed/play history (console shortcut A) | Unwilling outcome: −15 HAP, −10 NRG, angry mark, "Ouch!" message |
| T04 | Tap cat with feed+play done but any stat ≤ 75 (console shortcut B) | Unwilling outcome |
| T05 | Tap cat with feed+play done and all stats > 75 (console shortcut C) | Willing outcome: +10 HAP, heart mark, "Purr… ♥" message |
| T06 | Heart/angry mark visible for ~1.5s then disappears | Mark auto-hides; no manual dismiss needed |
| T07 | Tap cat while Sick (console shortcut D) | No effect; no message; no mark |
| T08 | Tap cat while bellyActive (console shortcut E) | No effect; no message; no mark |

---

### Console Shortcuts

**Shortcut A — Unwilling: no trust (no feed/play history)**
```js
cat.sick = false; cat.bellyActive = false;
cat.feedCount = 0; cat.playCount = 0;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Now tap the sprite
```
Expected: Unwilling outcome (−15 HAP, −10 NRG).

---

**Shortcut B — Unwilling: trust met, stats too low**
```js
cat.sick = false; cat.bellyActive = false;
cat.feedCount = 1; cat.playCount = 1;
cat.hunger = 70; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Now tap the sprite
```
Expected: Unwilling outcome (hunger 70 ≤ 75 → not willing).

---

**Shortcut C — Willing: trust met, all stats > 75**
```js
cat.sick = false; cat.bellyActive = false;
cat.feedCount = 1; cat.playCount = 1;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Now tap the sprite
```
Expected: Willing outcome (+10 HAP, heart mark, "Purr… ♥").

---

**Shortcut D — Blocked: Sick**
```js
cat.sick = true;
cat.feedCount = 1; cat.playCount = 1;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Tap sprite — nothing should happen
```
Expected: No stat change, no mark, no message.

---

**Shortcut E — Blocked: bellyActive**
```js
cat.sick = false; cat.bellyActive = true;
cat.feedCount = 1; cat.playCount = 1;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Tap sprite — nothing should happen
```
Expected: No stat change, no mark, no message.

---

### Level 2 — Full Flow Tests

**Flow: Full session purr**

1. Start a new session
2. Feed the cat once (any food) → `cat.feedCount` should be 1
3. Play once → `cat.playCount` should be 1
4. Verify via console: `console.log(cat.feedCount, cat.playCount)` → `1 1`
5. Raise all stats above 75 if needed:
   ```js
   cat.hunger = 80; cat.happiness = 80; cat.energy = 80; renderGame({});
   ```
6. Tap the cat sprite
7. Expected: +10 HAP, heart mark for 1.5s, "Purr… ♥" message, stat bar updates

---

**Flow: Tap blocked during belly event**

```js
cat.sick = false; cat.evolved = false;
cat.bellyActive = false; cat.bellyTicks = 1;
cat.hunger = 100; cat.happiness = 100; cat.energy = 80;
cat.feedCount = 1; cat.playCount = 1;
updateCounters(cat);  // bellyTicks → 2
checkBellyEvent(cat); // bellyActive = true
renderGame({});
// Tap the sprite
```
Expected: No stat change from tap. Pet button visible; belly overlay can still be opened normally.

---

**Flow: Tap blocked when Sick**

```js
cat.sick = true;
cat.feedCount = 1; cat.playCount = 1;
cat.hunger = 80; cat.happiness = 80; cat.energy = 80;
renderGame({});
// Tap sprite repeatedly
```
Expected: No stat change, no mark, no message on any tap.

---

## Known Scope Boundaries

| Item | Phase |
|---|---|
| Responsive layout and CSS polish | Phase 6 |
| Page Visibility API catch-up ticks | Phase 6 |
| Tap-pet haptic feedback (mobile) | Out of scope |
