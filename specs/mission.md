# Mission

## Project Summary

Tiny Cat is a browser-based Tamagotchi-style virtual pet web app. The user adopts a single cat, keeps it alive and happy through four core actions, and can guide it to evolve into its final form. The project is a portfolio piece built as part of the DeepLearning.AI 7-day challenge.

## Target Audience

General public — any visitor to the hosted GitHub Pages URL. No account or login is required. The experience is designed to be immediately understandable and playable by a non-technical audience.

## Core Purpose

Demonstrate a complete, polished, interactive front-end application: real-time stat decay, state machine logic, visual feedback, and personalisation — all running entirely in the browser with no backend.

---

## Constraints

| Constraint | Detail |
|---|---|
| One pet | A single cat per session |
| One evolution | The cat evolves exactly once, permanently |
| One recovery path | Sick → Normal via cleaning + feeding + happiness > 50 |
| No authentication | No login, no accounts |
| No multiple users | Single-session, single-player |
| No mini-games | Actions are Feed, Play, Rest, Pet only |
| No permanent death | The cat becomes Sick at low stats but never dies |
| No persistence | Closing or refreshing the browser resets the session to the welcome screen |

---

## Visual Modes

| Mode | Description |
|---|---|
| Dark (default) | Dark background, bright accent colours — matches retro CRT style |
| Light | Light background, muted palette — optional, user-toggled |

- Toggle is persistent within the session (not saved to localStorage)
- Toggle is visible at all times on both the welcome screen and game screen
- Dark mode is the default on load
- Button label reads "Light Mode" in dark mode and "Dark Mode" in light mode

---

## Stats

| Stat | Range | Normal decay | Evolved decay | Notes |
|---|---|---|---|---|
| Hunger | 0–100 | −3 per tick | −1.5 per tick | 100 = full; triggers poo on overflow |
| Happiness | 0–100 | −2 per tick | −1 per tick | 100 = very happy; triggers belly event on overflow |
| Energy | 0–100 | −4 per tick | −2 per tick | 100 = fully rested |

**Tick interval:** 30 seconds (real time).

### Display Labels

The internal stat name 'Hunger' is displayed as 'Food' on the game screen only.
All other stat names (Happiness, Energy) are displayed in full — no abbreviations anywhere.
This is a display-only change — all internal code, variable names, and test references continue to use 'hunger'.
Stats floor at 0 and cap at 100. Feeding when Hunger = 100, or playing when Energy ≤ 10, triggers overflow behaviour rather than exceeding the cap.

### Energy → Happiness penalty (applied each tick after decay)

| Energy level | Happiness lost per tick |
|---|---|
| Energy < 20 | −25 |
| Energy 20–49 | −10 |
| Energy ≥ 50 | no penalty |

Penalties do not stack — only the stricter threshold applies.

---

## Actions

| Action | Effect | Constraints |
|---|---|---|
| Feed | Opens food selection (3 options); selected food increases Hunger | If Hunger = 100, action creates a poo instead; disabled if poo count = 5 |
| Play | Happiness +20, Energy −10, Hunger −10 | Disabled if Energy ≤ 10 |
| Rest | Energy +30, Happiness −5 | Happiness floored at 0 |
| Pet | Random outcome: Purr (Happiness +15) or Attack (Happiness −20) | Only available during a belly-showing event |

### Food Options

Each cat has a **preferred food** randomly assigned at session start. The user discovers it by trial and error.

| Food | Base hunger gain | If preferred |
|---|---|---|
| Kibble | +15 | +30 |
| Tuna | +20 | +40 |
| Treats | +10 | +20 |

If the selected food would push Hunger past 100, Hunger is set to 100 and a poo is created.

---

## Poo Mechanic

| Trigger | Condition |
|---|---|
| Feed overflow | Feeding when Hunger = 100, or when food gain would exceed 100 |
| Natural overflow | Hunger has been at 100 for 5 consecutive ticks |

- Each poo that appears reduces Happiness by 5 immediately.
- Each poo present drains an additional **10 Happiness per tick**.
- Maximum of 5 poos on screen simultaneously. No new poos are created once the limit is reached.
- User cleans a poo by clicking on it; a confirmation message appears before cleaning.
- Poos contribute to Sick if left uncleaned (see States).

---

## Belly-Showing Event

- Fires when Happiness = 100 for 2 consecutive ticks.
- Blocked if the cat is currently Sick.
- A prompt appears: "Your cat wants to show you its belly. Pet it?"
- **Yes** → 50 % chance of Purr (Happiness +15) or Attack (Happiness −20).
- **No** → nothing happens; the belly counter resets.
- The event can fire multiple times per session.

---

## States

| State | Trigger condition | Exit condition |
|---|---|---|
| Fine | All stats ≥ 50 | Any stat drops below 50 |
| Hungry | Hunger < 30 | Hunger ≥ 30 |
| Tired | Energy < 30 | Energy ≥ 30 |
| Bored | Happiness < 50 | Happiness ≥ 50 |
| Happy | All stats ≥ 75 AND poo count ≤ 1 | Any stat drops below 75 OR poo count > 1 |
| Showing Belly | Belly event fires | User responds Yes or No |
| Sick | Hunger < 10 for 2 consecutive ticks OR > 1 poo present for 1 full tick | All poos cleaned AND Hunger ≥ 50 AND Happiness > 50 |
| Evolved | All stats ≥ 90 for 2 consecutive ticks AND not Sick | Permanent — no reversion |

State priority (highest → lowest): Sick > Evolved > Showing Belly > Happy > Hungry > Tired > Bored > Fine.
Only one state is displayed at a time.

**On entering Sick:** Happiness is immediately set to `floor(current Happiness / 2)`.
**Evolved blocks Sick transition:** a cat that is Evolved cannot become Sick, but Sick blocks evolution.

---

## User Flows

### Flow 1 — New session
1. User opens the app and sees the Welcome screen.
2. User enters a name for the cat (required, max 20 characters) and picks a colour.
3. User clicks "Start" → cat is created in Normal state with Hunger 80, Happiness 80, Energy 80.
4. A preferred food is randomly assigned (not revealed to the user).
5. Stats begin ticking down on a 30-second interval.

### Flow 2 — Normal play loop
1. User observes stat bars and cat expression.
2. User performs Feed, Play, or Rest actions as needed.
3. Stats stay above thresholds → cat remains in Normal or Happy state.

### Flow 3 — Poo and cleaning
1. User overfeeds or cat reaches natural poo trigger → poo appears, Happiness −5.
2. User clicks on poo → confirmation prompt → poo is removed.
3. If > 1 poo remains uncleaned for 1 full tick → cat becomes Sick.

### Flow 4 — Recovery from Sick
1. Sick is triggered (hunger path or poo path).
2. Happiness is halved on entry.
3. User cleans all poos, feeds the cat (Hunger ≥ 50), and raises happiness > 50.
4. All three conditions met simultaneously → state returns to Normal.

### Flow 5 — Belly showing
1. Happiness = 100 for 2 consecutive ticks → belly-showing prompt appears.
2. User selects Yes → random Purr or Attack outcome.
3. Happiness is adjusted; belly counter resets.

### Flow 6 — Evolution
1. All three stats remain ≥ 90 for 2 consecutive ticks while not Sick.
2. State transitions to Evolved → sprite grows larger, decay rates halved, congratulations message shown.

### Flow 7 — Restart
1. User clicks "New Cat" button (available at any time).
2. Confirmation prompt: "Start over with a new cat?"
3. User confirms → session resets to Welcome screen.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Feed when Hunger = 100 | Creates a poo; Hunger stays at 100 |
| Feed when poo count = 5 | Feed button disabled |
| Play when Energy ≤ 10 | Play button disabled; tooltip explains why |
| Sick and Bored simultaneously | Sick takes visual priority |
| Tired and Bored simultaneously | Tired takes visual priority; Bored is suppressed |
| Tired and Hungry simultaneously | Hungry takes visual priority; Tired is suppressed |
| Sick cat reaches all stats ≥ 90 | Cannot evolve; Sick must be cured first |
| Belly event fires while Sick | Event is suppressed; belly counter resets |
| Pet action when no belly event | Pet button not visible |
| Poo count > 1 for 1 full tick | Cat becomes Sick (poo path) |
| All stats ≥ 75 but poo count > 1 | Cat is not Happy; falls to next applicable state |
| Restart after evolution | Evolution is not preserved; session resets fully |
| Empty name on Welcome screen | Start button disabled until ≥ 1 non-whitespace character |
| Name longer than 20 characters | Input capped at 20 characters |
| Browser tab hidden | Elapsed ticks computed on return (Page Visibility API); stats updated in bulk |
| Stat already at 100, action applied | Stat stays at 100; overflow rules apply |
| Happiness hits 0 due to Rest spam | Happiness floors at 0 |

---

## Success Criteria

1. A visitor can open the app and understand what to do within 10 seconds, without reading instructions.
2. All three stat bars visibly decay in real time.
3. All eight states (Fine, Hungry, Tired, Bored, Happy, Showing Belly, Sick, Evolved) are reachable through normal play.
4. The poo mechanic works: poos appear, reduce happiness, and can be cleaned.
5. The cat can recover from Sick to Normal via the three-part recovery path.
6. The belly-showing event fires and produces a random outcome.
7. The cat can evolve exactly once per session, with visibly reduced decay.
8. The app is playable on desktop and mobile browsers (Chrome, Firefox, Safari).
9. All controls (Feed, Play, Rest, Pet, New Cat) behave correctly and provide immediate visual feedback.
10. The app loads and runs with no backend, no database, and no login.

---

## Help Screen

- A small `(i)` button is visible on both the welcome screen and game screen at all times
- Clicking it opens an overlay titled "DECIPHER ME, HUMAN"
- The overlay contains a cryptic riddle written in cat personality / retro pixel tone
- The riddle hints at all core mechanics and both Easter eggs without naming them directly
- Overlay is dismissed by clicking anywhere outside it or a CLOSE button
- No game state is affected by opening or closing the overlay

---

## Easter Eggs

| # | Name | Trigger | Effect |
|---|---|---|---|
| EE-01 | Evolution Badge | Cat evolves | Badge shows evolution time on game screen |
| EE-02 | Tap to Pet | Tap/click cat sprite | Purr (+10 HAP) if willing; Bite (−15 HAP, −10 NRG) if not |

### EE-02 Conditions

**Trust condition** (tracked since session start — both must be true):
- Feed used ≥ 1 time
- Play used ≥ 1 time

**Willing condition** (evaluated at time of tap — both must be true):
- Trust condition met
- All stats > 75

Tap-pet is blocked when `cat.sick === true` or `cat.bellyActive === true`.
