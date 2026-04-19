# Requirements — Laser Easter Egg

## Functional Requirements

| ID | Requirement |
|---|---|
| EGG-01 | Clicking and dragging on the game screen shall activate a laser pointer visual (red dot following the cursor/finger). |
| EGG-02 | A drag is defined as: pointer held down AND moved ≥ 20 px from the starting point. |
| EGG-03 | Activating the laser shall apply the Play effect: Happiness +20, Energy −10. |
| EGG-04 | The Play effect shall fire once per drag gesture, not once per pixel moved. |
| EGG-05 | The laser shall be subject to the same Energy constraint as the Play button: no effect fires if Energy ≤ 10. |
| EGG-06 | When Energy ≤ 10, the laser dot shall appear grey instead of red to signal the blocked state. |
| EGG-07 | A 5-second cooldown shall apply between laser triggers; dragging again within the cooldown fires no additional effect. |
| EGG-08 | The laser dot shall disappear on pointer release (mouseup / touchend). |
| EGG-09 | The laser shall work on both desktop (mouse events) and mobile (touch events). |
| EGG-10 | There shall be no visible hint, tooltip, label, or instruction pointing to this interaction anywhere in the UI. |
| EGG-11 | The laser interaction shall not be available on the Welcome screen — only on the Game screen. |

## Constraints

- Must reuse the same `triggerPlay()` logic used by the Play button (no duplicate stat logic).
- Must not interfere with clicking action buttons (Feed, Play, Rest, New Cat).
- Must be consistent with `mission.md`: no permanent death, stats floored at 0.