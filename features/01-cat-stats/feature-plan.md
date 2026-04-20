# Feature Plan — Phase 1: Core Game Loop

## Overview

Implement all game logic for the core tick-based engine: stat decay, player actions, poo mechanic, belly event, and evolution. No visual output — correctness is verified via browser console and automated unit tests.

## Files

- `js/cat.js` — cat entity, all pure game logic functions
- `js/game.js` — tick loop, visibility handler
- `tests/game.test.js` — tests for tick-level behaviour
- `tests/cat.test.js` — tests for stat boundaries, actions, poo, belly, evolution

---

## Task Groups

### Group 1 — Cat Entity and Stat Decay

**Goal:** A cat object exists with correct starting values and decays on every tick.

Tasks:
1. Define `createCat(opts)` — name, colour, preference, stats (Hunger 80, Happiness 80, Energy 80), poo count, and all internal counters (hungryTicks, pooSickTicks, evolvedTicks, bellyTicks, fullHungerTicks)
2. Implement `applyDecay(cat)` — Normal: −3/−2/−4; Evolved: −1.5/−1/−2; floored at 0
3. Implement `applyEnergyHappinessPenalty(cat)` — Energy < 20: −25 Happiness; Energy 20–49: −10 Happiness; Energy ≥ 50: no penalty; no stacking
4. Implement `clamp(val, min, max)` utility
5. Implement `startGame(cat)` / `stopGame()` / `onTick()` in `game.js` — 30-second `setInterval`; calls `runTick(cat)` each tick
6. Implement `onVisibilityChange()` — compute and apply missed ticks using `Date.now()` and 30 000 ms interval

Verify: Console-log stats before and after a tick; confirm decay values and floor behaviour.

---

### Group 2 — Player Actions and Poo Mechanic

**Goal:** Feed, Play, and Rest actions work correctly; poos are created, drain happiness, and can be cleaned.

Tasks:
1. Implement `applyFeed(cat, food)` — kibble/tuna/treats base and preferred gains; overflow → poo + Happiness −5; max 5 poos
2. Implement `canPlay(cat)` — disabled at Energy ≤ 10
3. Implement `applyPlay(cat)` — Happiness +20, Energy −10, Hunger −10; respects `canPlay`
4. Implement `applyRest(cat)` — Energy +30, Happiness −5; Happiness floored at 0
5. Implement `applyPooDrain(cat)` — −10 Happiness per poo present per tick
6. Implement `triggerNaturalPoo(cat)` — fires when fullHungerTicks ≥ 5; resets counter; Happiness −5; max 5 poos
7. Implement `cleanPoo(cat)` — decrement poo count

Verify: Manually test each action in console. Confirm poo creation paths (feed overflow and natural), happiness drain per tick, and clean removal.

---

### Group 3 — State Machine

**Goal:** `evaluateState(cat)` returns the correct state at all times, in strict priority order.

Tasks:
1. Implement `evaluateState(cat)` with priority: Sick > Evolved > Showing Belly (`bellyActive`) > Happy (all stats ≥ 75 AND poos ≤ 1) > Hungry (Hunger < 30) > Bored (Happiness < 50) > Fine
2. Wire `evaluateState` into `runTick` — called after all stat mutations each tick
3. Verify state transitions for every state by setting stats in the console and calling `evaluateState`

Note: Showing Belly resolves via the `bellyActive` boolean flag. The visual overlay for the belly event is out of scope for Phase 1 — see Phase 4.

Verify: Manually force each state by setting cat properties in the console; confirm priority overrides (e.g. Sick cat with all stats ≥ 90 stays Sick, not Evolved).

---

### Group 4 — Sick and Recovery

**Goal:** The cat enters Sick via two paths and can fully recover.

Tasks:
1. Implement `updateCounters(cat)` — increment hungryTicks, pooSickTicks, evolvedTicks, bellyTicks, fullHungerTicks each tick; reset counters when conditions no longer hold
2. Implement `triggerSick(cat)` — hunger path: hungryTicks ≥ 2; poo path: pooSickTicks ≥ 1; Happiness halved on entry; blocked if Evolved
3. Implement `checkSickRecovery(cat)` — poos = 0 AND Hunger ≥ 50 AND Happiness > 50; resets sick-related counters
4. Wire into `runTick` in correct order: updateCounters → applyDecay → applyEnergyHappinessPenalty → applyPooDrain → triggerNaturalPoo → triggerSick → checkBellyEvent → triggerEvolution → checkSickRecovery

Verify: Drive cat into Sick via both paths in the console. Confirm Happiness halving. Confirm all three recovery conditions must be met simultaneously.

---

### Group 5 — Belly Event and Evolution

**Goal:** The belly event fires correctly and evolution is permanent.

Tasks:
1. Implement `checkBellyEvent(cat)` — fires when bellyTicks ≥ 2 AND not Sick AND not already active; sets `bellyActive = true`
2. Implement `resolveBelly(cat, petted)` — resets `bellyActive` and `bellyTicks`; if petted: 50 % Purr (Happiness +15) or Attack (Happiness −20)
3. Implement `triggerEvolution(cat)` — fires when evolvedTicks ≥ 2 AND not Sick; sets `evolved = true` permanently; decay rates halved automatically via `applyDecay`
4. Confirm Evolved blocks Sick and Sick blocks Evolution

Note: The belly overlay prompt (Yes/No UI) is out of scope for Phase 1 — see Phase 4. `bellyActive` is a logic flag only at this stage.

Verify: Force bellyTicks = 2 in console; confirm `checkBellyEvent` sets flag. Force evolvedTicks = 2; confirm `triggerEvolution` fires and decay rates change on next tick.
