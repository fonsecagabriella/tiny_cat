# Requirements — Phase 1: Core Game Loop

All requirements are traceable to Phase 1 deliverables in `specs/roadmap.md` and the rules in `specs/mission.md`.

---

## REQ-01 — Tick Interval

| ID | Requirement |
|---|---|
| R01.1 | The game loop fires every 30 seconds via `setInterval` |
| R01.2 | When the browser tab is hidden, missed ticks are computed on return using `Date.now()` and applied in bulk |
| R01.3 | The interval constant is 30 000 ms — no other value is acceptable |

---

## REQ-02 — Cat Entity

| ID | Requirement |
|---|---|
| R02.1 | `createCat(opts)` returns an object with: name, colour, preference (one of kibble/tuna/treats, randomly assigned), hunger, happiness, energy, poos |
| R02.2 | Starting stats: Hunger 80, Happiness 80, Energy 80 |
| R02.3 | Starting poos: 0 |
| R02.4 | Internal counters initialise at 0: hungryTicks, pooSickTicks, evolvedTicks, bellyTicks, fullHungerTicks |
| R02.5 | Starting flags: sick = false, evolved = false, bellyActive = false |

---

## REQ-03 — Stat Decay

| ID | Requirement |
|---|---|
| R03.1 | Normal decay per tick: Hunger −3, Happiness −2, Energy −4 |
| R03.2 | Evolved decay per tick: Hunger −1.5, Happiness −1, Energy −2 |
| R03.3 | All stats floor at 0 and cap at 100 |
| R03.4 | Evolved decay applies as soon as `evolved = true`; no restart required |

### Energy → Happiness Penalty (applied each tick after decay)

| ID | Requirement |
|---|---|
| R03.5 | Energy < 20: Happiness −25 per tick |
| R03.6 | Energy 20–49: Happiness −10 per tick |
| R03.7 | Energy ≥ 50: no penalty |
| R03.8 | Penalties do not stack — only the stricter threshold applies |
| R03.9 | Penalty is applied after decay, before poo drain |

---

## REQ-04 — Player Actions

### Feed

| ID | Requirement |
|---|---|
| R04.1 | Food options: kibble (base +15, preferred +30), tuna (base +20, preferred +40), treats (base +10, preferred +20) |
| R04.2 | If `hunger + gain > 100`: Hunger is set to 100 and a poo is created (Happiness −5) |
| R04.3 | Feed is disabled (returns `'full'` without creating a poo) when poo count = 5 |
| R04.4 | Feed when Hunger = 100 creates a poo if poo count < 5 |

### Play

| ID | Requirement |
|---|---|
| R04.5 | Play: Happiness +20, Energy −10, Hunger −10 |
| R04.6 | Play is disabled when Energy ≤ 10 (`canPlay` returns false; `applyPlay` returns false) |

### Rest

| ID | Requirement |
|---|---|
| R04.7 | Rest: Energy +30, Happiness −5 |
| R04.8 | Happiness floors at 0; it cannot go negative |

---

## REQ-05 — Poo Mechanic

| ID | Requirement |
|---|---|
| R05.1 | Each poo drains 10 Happiness per tick (10 × poo count) |
| R05.2 | Maximum 5 poos simultaneously; no new poos created once the limit is reached |
| R05.3 | Each poo created (feed overflow or natural) reduces Happiness by 5 immediately |
| R05.4 | Natural poo: created when fullHungerTicks ≥ 5 (Hunger = 100 for 5 consecutive ticks); resets fullHungerTicks to 0 |
| R05.5 | `cleanPoo(cat)` decrements poo count by 1; no effect if poos = 0 |

---

## REQ-06 — State Machine

Priority order (highest → lowest): **Sick > Evolved > Showing Belly > Happy > Hungry > Bored > Fine**

Only one state is returned at a time. State is a derived value — not stored.

| ID | State | Trigger |
|---|---|---|
| R06.1 | Sick | `sick = true` |
| R06.2 | Evolved | `evolved = true` AND NOT sick |
| R06.3 | Showing Belly | `bellyActive = true` AND NOT sick AND NOT evolved |
| R06.4 | Happy | All stats ≥ 75 AND poo count ≤ 1 |
| R06.5 | Hungry | Hunger < 30 |
| R06.6 | Bored | Happiness < 50 |
| R06.7 | Fine | Default — all stats ≥ 50 and no other condition met |

Note: The visual overlay for the Showing Belly state (Yes/No prompt) is out of scope for Phase 1. `bellyActive` is a logic flag only. See Phase 4.

---

## REQ-07 — Sick State

| ID | Requirement |
|---|---|
| R07.1 | Hunger path: Sick triggers when hungryTicks ≥ 2 (Hunger < 10 for 2 consecutive ticks) |
| R07.2 | Poo path: Sick triggers when pooSickTicks ≥ 1 (> 1 poo present at the end of any tick) |
| R07.3 | On Sick entry: Happiness = floor(Happiness / 2) |
| R07.4 | Sick is blocked if `evolved = true` |
| R07.5 | Evolution is blocked if `sick = true` |
| R07.6 | Recovery: `sick` clears when poos = 0 AND Hunger ≥ 50 AND Happiness > 50 (all three simultaneously) |
| R07.7 | On recovery: hungryTicks and pooSickTicks reset to 0 |

---

## REQ-08 — Belly Event

| ID | Requirement |
|---|---|
| R08.1 | Belly event fires when bellyTicks ≥ 2 (Happiness = 100 for 2 consecutive ticks) AND not Sick AND bellyActive is false |
| R08.2 | `checkBellyEvent` sets `bellyActive = true` |
| R08.3 | `resolveBelly(cat, true)` — 50 % chance of Purr (Happiness +15) or Attack (Happiness −20); resets bellyActive and bellyTicks |
| R08.4 | `resolveBelly(cat, false)` — no stat change; resets bellyActive and bellyTicks |
| R08.5 | Belly event is suppressed while Sick; bellyTicks resets when cat is Sick or Happiness < 100 |
| R08.6 | The belly visual overlay (Yes/No prompt) is out of scope for Phase 1 — addressed in Phase 4 |

---

## REQ-09 — Evolution

| ID | Requirement |
|---|---|
| R09.1 | Evolution triggers when evolvedTicks ≥ 2 (all stats ≥ 90 for 2 consecutive ticks) AND not Sick |
| R09.2 | Sets `evolved = true` permanently — no reversion |
| R09.3 | Evolved decay rates apply automatically from the next tick (Hunger −1.5, Happiness −1, Energy −2) |
| R09.4 | An Evolved cat cannot become Sick |
| R09.5 | evolvedTicks resets to 0 if any stat drops below 90 or the cat is Sick before the threshold is reached |
