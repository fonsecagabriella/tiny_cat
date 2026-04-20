# Requirements — Phase 5: Easter Eggs

All requirements are traceable to Phase 5 deliverables in `specs/roadmap.md`.

Neither Easter egg is announced, hinted at, or described anywhere in the visible UI before it is triggered.

---

## REQ-EE01 — Evolution Badge

| ID | Requirement |
|---|---|
| EE01.1 | `sessionStartTime` is recorded (via `Date.now()`) when `startGame()` is called |
| EE01.2 | On evolution, elapsed time is calculated as `Date.now() - sessionStartTime` |
| EE01.3 | Elapsed time is formatted as "Xm Ys" (e.g. "2m 14s"); seconds are always shown even if 0 |
| EE01.4 | The evolution overlay (`#evolution-overlay`) displays the formatted time string alongside the cat's name |
| EE01.5 | After the overlay is dismissed, a badge element (`#evolution-badge`) appears on the game screen |
| EE01.6 | Badge text format: "[cat name] evolved in Xm Ys" |
| EE01.7 | `#evolution-badge` is hidden (`.hidden` class) on page load and before evolution occurs |
| EE01.8 | Once shown, `#evolution-badge` persists for the remainder of the session — it is not removed by ticks, stat changes, or re-renders |
| EE01.9 | No badge element, placeholder, or label is visible on the game screen before evolution fires |
| EE01.10 | `#evolution-badge` is not reset or hidden when "New Cat" is clicked — session resets to welcome screen where the badge is not present |

---

## REQ-EE02 — Tap to Pet

### Trust condition

| ID | Requirement |
|---|---|
| EE02.1 | `cat.feedCount` is initialised to `0` in `createCat()` |
| EE02.2 | `cat.playCount` is initialised to `0` in `createCat()` |
| EE02.3 | `cat.feedCount` increments by 1 each time a feed action completes with result `'ok'` or `'poo'` (not `'full'` or `'invalid'`) |
| EE02.4 | `cat.playCount` increments by 1 each time `applyPlay()` or `triggerPlay()` returns `true` (includes laser easter egg) |
| EE02.5 | Both counters are per-session — they reset to 0 when a new cat is created |

### Tap interaction

| ID | Requirement |
|---|---|
| EE02.6 | A click event listener is attached to `#cat-sprite-container` |
| EE02.7 | The tap is blocked (no effect) when `cat.sick === true` |
| EE02.8 | The tap is blocked (no effect) when `cat.bellyActive === true` |
| EE02.9 | The tap is blocked (no effect) when the laser drag is active |

### Willing outcome

| ID | Requirement |
|---|---|
| EE02.10 | Willing condition: `cat.feedCount >= 1` AND `cat.playCount >= 1` AND `cat.hunger > 75` AND `cat.happiness > 75` AND `cat.energy > 75` |
| EE02.11 | On willing tap: `cat.happiness` increases by 10 (capped at 100) |
| EE02.12 | On willing tap: a pixel heart mark appears near the cat's head for 1.5 seconds, then disappears |
| EE02.13 | On willing tap: message "Purr… ♥" is shown in `#message-area` |
| EE02.14 | Stat bars re-render immediately after the stat change |

### Unwilling outcome

| ID | Requirement |
|---|---|
| EE02.15 | Unwilling condition: any of the willing conditions is not met (and tap is not blocked) |
| EE02.16 | On unwilling tap: `cat.happiness` decreases by 15 (floored at 0) |
| EE02.17 | On unwilling tap: `cat.energy` decreases by 10 (floored at 0) |
| EE02.18 | On unwilling tap: a pixel angry mark appears near the cat's head for 1.5 seconds, then disappears |
| EE02.19 | On unwilling tap: message "Ouch! Bad timing." is shown in `#message-area` |
| EE02.20 | Stat bars re-render immediately after the stat change |

### No hint rule

| ID | Requirement |
|---|---|
| EE02.21 | `#cat-sprite-container` has no `cursor: pointer` style, tooltip, `title` attribute, or any other visual indicator of interactivity |
| EE02.22 | No text, label, or UI element anywhere on the game screen hints at the tap-pet mechanic before it is triggered |
