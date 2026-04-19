# Tech Stack

## Overview

Tiny Cat is a fully static web application. There is no backend, no database, and no build step. All logic runs in the browser.

---

## Stack

| Layer | Choice | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic structure, no framework overhead |
| Styling | CSS3 (vanilla) | Full control, no dependencies |
| Logic | JavaScript (ES6+, vanilla) | Native browser APIs sufficient for game loop; no framework needed |
| Assets | Inline SVG or CSS-drawn sprites | No external asset loading, easy to theme with cat colour |
| Hosting | GitHub Pages | Free, zero-config static hosting; deploys directly from the `main` branch |

## No dependencies

The project uses no third-party libraries or package managers. There is no `node_modules`, no `npm`, no build pipeline, and no bundler. The entire app ships as plain `.html`, `.css`, and `.js` files.

---

## Architecture

```
index.html          ← single entry point, Welcome screen + Game screen
css/
  style.css         ← all styles
js/
  game.js           ← game loop, stat engine, state machine
  ui.js             ← DOM manipulation, rendering
  cat.js            ← cat entity: name, colour, stats, state
specs/              ← constitution documents (not shipped)
```

The app has two screens managed in the same HTML file, toggled by CSS visibility:

- **Welcome screen** — name input, colour picker, Start button
- **Game screen** — cat sprite, stat bars, action buttons, New Cat button

---

## Key Technical Decisions

### Game loop
A `setInterval` running every 60 seconds drives stat decay. On each tick:
1. Apply decay to all stats (floored at 0).
2. Apply poo happiness drain (−1 per poo present).
3. Update internal counters (hungry ticks, poo-sick ticks, evolved ticks, belly ticks, full-hunger ticks).
4. Evaluate triggered events (natural poo, Sick, belly-showing, Evolved).
5. Evaluate display state.
6. Re-render UI.

### State machine
The state is a derived value computed on every tick and after every user action, not stored independently. Priority evaluation order: Sick > Evolved > Happy > Hungry > Bored > Normal.

### Page Visibility
The app listens to `document.addEventListener('visibilitychange')`. When the tab returns to focus, elapsed ticks since hide are calculated and applied in bulk.

### Cat colour
The cat sprite is built with inline SVG. The chosen colour is applied as a CSS custom property (`--cat-colour`) so the entire sprite recolours from a single value.

### No persistence
Session state lives exclusively in memory (JS variables). Closing or refreshing the browser returns the user to the Welcome screen with a fresh cat.

---

## Hosting

- Repository: GitHub (public)
- Deployment: GitHub Pages, serving from the root of `main`
- URL pattern: `https://<username>.github.io/tiny-cat/`
- No CI/CD pipeline; pushes to `main` publish automatically via GitHub Pages settings
