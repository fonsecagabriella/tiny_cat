# Feature Plan — Phase 2: Welcome Screen and Personalisation

## Overview

Implement the welcome screen, cat personalisation flow, game screen scaffold, restart flow, and dark/light mode toggle. No game logic changes — this phase wires the UI to the existing `createCat()` and `startGame()` functions from Phase 1.

## Files

- `index.html` — welcome screen + game screen markup; two screens toggled by CSS
- `js/ui.js` — DOM manipulation, event listeners, screen transitions
- `css/style.css` — swatch colours, screen visibility rules, dark/light theme variables

---

## Task Groups

### Group 1 — HTML Structure

**Goal:** Both screens exist in the DOM with correct element IDs. Neither screen has functionality yet.

Tasks:
1. Create welcome screen markup: heading, name input (`maxlength="20"`), colour swatch container, Start button
2. Create game screen scaffold markup: cat name display, colour indicator area, action button stubs (Feed, Play, Rest, New Cat), stat placeholder text
3. Set initial visibility: welcome screen visible, game screen hidden (CSS class or `hidden` attribute)
4. Dark/light toggle button present in both screens' markup

Verify: Page loads showing welcome screen. Game screen is not visible. Inspect DOM confirms both screens exist.

---

### Group 2 — Name Input and Start Button

**Goal:** Start button is disabled until the name field contains at least one non-whitespace character. Input is capped at 20 characters.

Tasks:
1. Attach `input` event listener to name field; on each keystroke, enable/disable Start button based on `value.trim().length >= 1`
2. Enforce `maxlength="20"` via HTML attribute (no JS needed)
3. Start button is disabled (`disabled` attribute) on page load
4. Prevent form submission default if wrapped in a `<form>`

Verify: Start button disabled on empty input and whitespace-only input. Enabled as soon as one non-whitespace character is typed. Input cannot exceed 20 characters.

---

### Group 3 — Colour Picker

**Goal:** A free colour input is shown with `#f4a261` as the default. Changing the colour updates `--cat-colour` on `<html>`.

Tasks:
1. Render `<input type="color" id="cat-colour" value="#f4a261">` in the welcome form
2. On page load, set `--cat-colour` on `<html>` to `#f4a261`
3. Attach `input` event listener: on each change, update `--cat-colour` on `<html>` to the selected value
4. On restart (New Cat confirmed): reset `colourInput.value` to `#f4a261` and update `--cat-colour` accordingly

Verify: Colour input shows Rust on load. Picking a new colour immediately updates `--cat-colour` (check in DevTools → Elements → `<html>` style). Restarting resets the input and property to `#f4a261`.

---

### Group 4 — Cat Creation and New Cat Flow

**Goal:** Clicking Start creates the cat and transitions to the game screen. New Cat resets to the welcome screen.

Tasks:
1. Start button click handler: read name input and colour input value; call `createCat({ name, colour })` (preference randomly assigned inside `createCat`); call `startGame(cat)`; show transition screen for ~2s; transition to game screen
2. Game screen: render cat name in name display element; `--cat-colour` is already set from colour input selection
3. New Cat button click handler: show confirmation prompt (custom modal); on confirm, call `stopGame()`; clear cat reference; reset name input and colour input to `#f4a261`; transition to welcome screen

Verify: Flow 1 — enter name, pick colour, click Start → transition screen appears, then game screen shows correct name, `--cat-colour` matches chosen colour. Flow 7 — click New Cat, confirm → welcome screen with cleared name and colour input reset to `#f4a261`.

---

### Group 5 — Dark/Light Mode Toggle

**Goal:** A toggle button switches between dark (default) and light theme on both screens. Preference lasts the session only.

Tasks:
1. Toggle button click handler: check current `data-theme` on `<html>`; if absent or `"dark"`, set `data-theme="light"`; otherwise set `data-theme="dark"`
2. `css/style.css`: define CSS custom properties under `[data-theme="dark"]` (default) and `[data-theme="light"]`; apply `[data-theme="dark"]` as the base/default on `html`
3. Toggle button label updates on each click: "Light Mode" when currently in dark mode; "Dark Mode" when currently in light mode
4. No localStorage interaction — on page reload, dark mode is restored by the CSS default

Verify: Toggle switches theme on welcome screen and game screen. Transitioning between screens preserves the current theme. Reloading the page resets to dark mode.