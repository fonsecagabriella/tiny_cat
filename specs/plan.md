# Plan

## Architecture

Tiny Cat is a fully static single-page application. No build step, no package manager, no framework. All logic runs in the browser.

```
index.html          ← single entry point; both screens live here
css/
  style.css         ← all styles, including screen toggling and state-based classes
js/
  cat.js            ← Cat entity: stats, state, preference, poo list, counters
  game.js           ← tick engine, state machine, poo logic, belly logic
  ui.js             ← DOM rendering, screen switching, event listeners
tests/
  game.test.js      ← automated unit tests (vanilla JS, runs in browser)
specs/              ← constitution documents (not shipped to users)
```

### Two-screen model

`index.html` contains both the **Welcome screen** and the **Game screen**. One is visible at a time, toggled by adding/removing a CSS class (`hidden`).

---

## Data Model

The `Cat` object (defined in `cat.js`) holds all session state:

```js
{
  name:        String,        // user-entered, 1–20 chars
  colour:      String,        // CSS colour value from picker
  preference:  "kibble"|"tuna"|"treats",  // randomly assigned at creation

  hunger:      Number,        // 0–100
  happiness:   Number,        // 0–100
  energy:      Number,        // 0–100

  poos:        Number,        // 0–5, current poo count

  // Internal counters (reset on condition change)
  hungryTicks:     Number,    // ticks with hunger < 10
  pooSickTicks:    Number,    // ticks with poos > 1
  evolvedTicks:    Number,    // ticks with all stats >= 90
  bellyTicks:      Number,    // ticks with happiness = 100
  fullHungerTicks: Number,    // ticks with hunger = 100 (natural poo counter)

  state:       "normal"|"hungry"|"bored"|"happy"|"sick"|"evolved",
  evolved:     Boolean,       // permanent flag once evolved
  bellyActive: Boolean,       // true while belly-showing prompt is shown
}
```

---

## Tick Algorithm

Runs every 60 seconds via `setInterval`. On each tick:

```
1. Apply stat decay (skip if evolved = true for evolved rates, never skip entirely)
   - hunger  -= evolved ? 1.5 : 3    (floor at 0)
   - happiness -= evolved ? 1 : 2    (floor at 0)
   - energy  -= evolved ? 2 : 4      (floor at 0)

2. Apply poo happiness drain
   - happiness -= poos * 1            (floor at 0)

3. Update counters
   a. hungryTicks:     hunger < 10 ? +1 : reset to 0
   b. pooSickTicks:    poos > 1 ? +1 : reset to 0
   c. fullHungerTicks: hunger = 100 ? +1 : reset to 0
   d. bellyTicks:      happiness = 100 AND not sick AND not bellyActive ? +1 : reset to 0
   e. evolvedTicks:    all stats >= 90 AND not sick ? +1 : reset to 0

4. Trigger natural poo
   - if fullHungerTicks >= 10 AND poos < 5:
       poos += 1
       happiness = max(0, happiness - 5)
       fullHungerTicks = 0

5. Trigger Sick (if not already sick and not evolved)
   - if hungryTicks >= 5 OR pooSickTicks > 10:
       happiness = floor(happiness / 2)
       set state = "sick"

6. Trigger belly-showing event
   - if bellyTicks >= 5 AND not bellyActive AND not sick:
       bellyActive = true
       show belly prompt

7. Trigger evolution (if not already evolved and not sick)
   - if evolvedTicks >= 5:
       evolved = true
       set state = "evolved"

8. Evaluate display state (see State Machine below)

9. Re-render UI
```

---

## State Machine

The display state is evaluated after each tick and after each user action. It is a derived value — not stored independently except for `evolved` (permanent flag) and `sick` (active condition).

```
if sick:                         → "sick"
else if evolved:                 → "evolved"
else if happiness > 50:          → "happy"
else if hunger < 30:             → "hungry"
else if happiness < 15:          → "bored"
else:                            → "normal"
```

State is applied as a CSS class on the cat container for visual switching.

---

## Feed Action Algorithm

```
1. Show food selection panel (Kibble, Tuna, Treats)
2. User selects a food
3. Compute gain:
   - base = { kibble: 15, tuna: 20, treats: 10 }
   - gain = cat.preference === selected ? base * 2 : base
4. if hunger + gain > 100 AND poos < 5:
     hunger = 100
     poos += 1
     happiness = max(0, happiness - 5)
   else if hunger + gain > 100 AND poos = 5:
     hunger = 100   (no poo added; silently capped)
   else:
     hunger = hunger + gain
5. Re-evaluate state
6. Re-render UI
```

---

## Sick Recovery Check

Evaluated after every user action and every tick:

```
if state = "sick"
AND poos = 0
AND hunger >= 50
AND happiness > 50:
    state → normal (or re-evaluate via state machine)
    reset hungryTicks, pooSickTicks
```

---

## Belly Event

- Initiated by tick algorithm when `bellyTicks >= 5`.
- Displays a modal overlay (not a blocking `alert`).
- User chooses Yes or No.
  - **Yes:** `Math.random() < 0.5` → Purr: `happiness = min(100, happiness + 15)`, or Attack: `happiness = max(0, happiness - 20)`.
  - **No:** nothing.
- In both cases: `bellyActive = false`, `bellyTicks = 0`.

---

## Page Visibility Handling

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hiddenAt = Date.now();
  } else {
    const elapsed = Date.now() - hiddenAt;
    const missedTicks = Math.floor(elapsed / 60000);
    for (let i = 0; i < missedTicks; i++) tick();
  }
});
```

---

## Screen Layouts

### Welcome Screen
- App title
- Name input (max 20 chars; Start button disabled until valid)
- Colour picker
- Start button

### Game Screen
- Cat name + colour-tinted SVG sprite (expression changes per state)
- Three stat bars: Hunger, Happiness, Energy (with numeric value)
- Action buttons: Feed, Play, Rest (Pet hidden unless belly event active)
- Poo area: up to 5 clickable poo icons
- New Cat button (always visible, triggers confirmation)
- State label / notification area (messages for events)

---

## Roadmap Alignment

| Phase | Plan deliverables |
|---|---|
| Phase 1 | `cat.js`, `game.js` tick loop, state machine, all action logic, console-verifiable |
| Phase 2 | Welcome screen, name/colour input, game screen scaffold, New Cat restart |
| Phase 3 | SVG sprite, state-based expressions, stat bars, action button feedback |
| Phase 4 | Sick state visuals, poo icons, poo-click cleaning, recovery UI messaging |
| Phase 5 | Easter egg(s) — TBD |
| Phase 6 | Responsive polish, animations, Page Visibility, GitHub Pages deploy |
