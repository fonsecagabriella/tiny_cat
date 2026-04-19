# Requirements

## Functional Requirements

### Session and Personalisation

| ID | Requirement |
|---|---|
| FR-01 | The app shall present a Welcome screen on every fresh load or restart. |
| FR-02 | The user shall enter a cat name (1–20 non-whitespace characters) before starting. |
| FR-03 | The Start button shall be disabled until the name field contains at least 1 non-whitespace character. |
| FR-04 | The name input shall be capped at 20 characters. |
| FR-05 | The user shall pick a cat colour via a colour picker before starting. |
| FR-06 | On Start, a cat shall be created with Hunger 80, Happiness 80, Energy 80. |
| FR-07 | On Start, a preferred food (Kibble, Tuna, or Treats) shall be randomly assigned and not disclosed to the user. |
| FR-08 | The session shall not persist across page refreshes or tab closes. |
| FR-09 | A "New Cat" button shall be available at all times on the Game screen. |
| FR-10 | Clicking "New Cat" shall display a confirmation prompt before resetting. |
| FR-11 | Confirming "New Cat" shall reset the session fully to the Welcome screen. |

### Stats and Decay

| ID | Requirement |
|---|---|
| FR-12 | Stats (Hunger, Happiness, Energy) shall each range from 0 to 100 inclusive. |
| FR-13 | Stats shall decay every 60 seconds (one tick). |
| FR-14 | In Normal state, decay rates shall be: Hunger −3, Happiness −2, Energy −4 per tick. |
| FR-15 | In Evolved state, decay rates shall be: Hunger −1.5, Happiness −1, Energy −2 per tick. |
| FR-16 | Stats shall floor at 0 and cap at 100; no stat shall exceed these bounds. |
| FR-17 | Each poo present shall reduce Happiness by an additional 1 per tick. |

### Actions

| ID | Requirement |
|---|---|
| FR-18 | The Feed action shall open a food selection panel with three options: Kibble, Tuna, Treats. |
| FR-19 | Kibble shall grant +15 Hunger (base) or +30 if it is the cat's preferred food. |
| FR-20 | Tuna shall grant +20 Hunger (base) or +40 if it is the cat's preferred food. |
| FR-21 | Treats shall grant +10 Hunger (base) or +20 if it is the cat's preferred food. |
| FR-22 | If feeding would push Hunger past 100, Hunger shall be capped at 100 and one poo shall be created (if poo count < 5). |
| FR-23 | The Feed button shall be disabled when poo count = 5. |
| FR-24 | The Play action shall increase Happiness by 20 and decrease Energy by 10. |
| FR-25 | The Play button shall be disabled when Energy ≤ 10. |
| FR-26 | The Rest action shall increase Energy by 30 and decrease Happiness by 5. |
| FR-27 | The Pet action shall only be available during an active belly-showing event. |
| FR-28 | The Pet action shall produce a random outcome: 50 % chance Purr (Happiness +15) or Attack (Happiness −20). |

### Poo Mechanic

| ID | Requirement |
|---|---|
| FR-29 | A poo shall be created when feeding overflows Hunger past 100. |
| FR-30 | A poo shall be created when Hunger has been at 100 for 10 consecutive ticks (natural overflow). |
| FR-31 | Each poo created shall immediately reduce Happiness by 5. |
| FR-32 | No more than 5 poos shall exist simultaneously. |
| FR-33 | A poo shall be removable by clicking on it; a confirmation message shall appear before removal. |

### Belly-Showing Event

| ID | Requirement |
|---|---|
| FR-34 | The belly-showing event shall trigger when Happiness = 100 for 5 consecutive ticks. |
| FR-35 | The belly-showing event shall be suppressed if the cat is Sick. |
| FR-36 | When triggered, a prompt shall ask the user whether to pet the belly. |
| FR-37 | If the user selects Yes, the Pet outcome shall be resolved randomly (FR-28). |
| FR-38 | If the user selects No, no stat change shall occur. |
| FR-39 | The belly counter shall reset after the event resolves (Yes or No). |
| FR-40 | The belly-showing event may fire multiple times per session. |

### States

| ID | Requirement |
|---|---|
| FR-41 | The cat shall display one of six states: Normal, Hungry, Bored, Happy, Sick, Evolved. |
| FR-42 | Display state priority shall be: Sick > Evolved > Happy > Hungry > Bored > Normal. |
| FR-43 | The Hungry state shall activate when Hunger < 30. |
| FR-44 | The Bored state shall activate when Happiness < 15. |
| FR-45 | The Happy state shall activate when Happiness > 50. |
| FR-46 | The Sick state shall activate when Hunger < 10 for 5 consecutive ticks. |
| FR-47 | The Sick state shall activate when more than 1 poo has been present for more than 10 consecutive ticks. |
| FR-48 | On entering Sick, Happiness shall be set to floor(Happiness / 2). |
| FR-49 | The Sick state shall resolve when all poos are cleaned AND Hunger ≥ 50 AND Happiness > 50. |
| FR-50 | The Evolved state shall activate when all stats ≥ 90 for 5 consecutive ticks and the cat is not Sick. |
| FR-51 | The Evolved state shall be permanent; once Evolved, the cat cannot revert. |
| FR-52 | An Evolved cat cannot become Sick. |
| FR-53 | A Sick cat cannot evolve. |

### Visuals and Feedback

| ID | Requirement |
|---|---|
| FR-54 | The cat sprite shall be an inline SVG coloured by the user's chosen colour. |
| FR-55 | The sprite shall display a distinct visual expression for each of the six states. |
| FR-56 | In Evolved state, the cat sprite shall appear visibly larger. |
| FR-57 | Stat bars shall display numeric values alongside the bar. |
| FR-58 | Action buttons shall provide immediate visual feedback (brief animation or highlight) on click. |
| FR-59 | A congratulations message shall be shown when the cat evolves. |
| FR-60 | Up to 5 poo icons shall be displayed in a dedicated poo area. |
| FR-61 | The belly-showing prompt shall be displayed as an overlay (not a browser alert). |

---

## Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | The app shall be fully static: no backend, no database, no build step. |
| NFR-02 | The app shall use no third-party libraries or package managers. |
| NFR-03 | The app shall be playable on Chrome, Firefox, and Safari (latest versions). |
| NFR-04 | The app shall be responsive and usable on screens ≥ 320 px wide. |
| NFR-05 | The app shall handle tab visibility changes: elapsed ticks shall be applied on tab return. |
| NFR-06 | The app shall load and be interactive within 3 seconds on a standard broadband connection. |
| NFR-07 | The entire application shall ship as plain .html, .css, and .js files. |
| NFR-08 | The app shall be hosted on GitHub Pages and accessible via a public URL. |
