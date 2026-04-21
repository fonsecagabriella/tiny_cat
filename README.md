# Tiny Cat 🐱

A browser-based Tamagotchi-style virtual pet built as a submission for the DeepLearning.AI 7-Day Challenge: Tiny Tamagotchi MVP with Spec-Driven Development.

👉 [Play Tiny Cat](https://fonsecagabriella.github.io/tiny_cat/)

---

## What is Tiny Cat?

Adopt a pixel art cat, keep it alive and happy, and guide it to evolve. All game logic runs in the browser — no backend, no login, no dependencies in the shipped app.

Core features:
- Real-time stat decay (Food, Happiness, Energy) on a 30-second tick
- Eight states: Fine, Hungry, Tired, Bored, Happy, Showing Belly, Sick, Evolved
- Actions: Feed (with food preference discovery), Play, Rest
- Poo mechanic with Sick path
- Full Sick → Recovery flow
- One evolution per session with permanently reduced decay
- Two Easter eggs discoverable through normal play
- Dark/light mode toggle
- Responsive layout (mobile and desktop)
- Pixel art inline SVG sprite with state-driven expressions

---

## Spec-Driven Development Workflow

This project was built following the SDD workflow from the Spec-Driven Development with Coding Agents course.

### How it was applied

**1. Constitution first**
Before any code was written, three constitution files were authored in collaboration with Claude Code:

| File | Purpose |
|---|---|
| `specs/mission.md` | Project goals, constraints, stats, actions, states, user flows, edge cases, success criteria |
| `specs/tech-stack.md` | Architecture decisions, game loop design, CI/CD setup |
| `specs/roadmap.md` | Seven phased deliverables with definitions of done |

**2. Feature loop**
Each phase followed the same repeatable cycle:
Plan → Implement → Validate → Replan

Feature specs were written before implementation for every phase:

| Phase | Feature folder | What it covers |
|---|---|---|
| 1 | `features/01-cat-stats/` | Core game loop, state machine, decay, poo mechanic |
| 2 | `features/02-welcome-screen/` | Welcome screen, personalisation, dark/light mode |
| 3 | `features/03-cat-sprite/` | Pixel art sprite, seven state expressions |
| 4 | `features/04-sick-and-recovery/` | Sick flow, poo cleaning, belly overlay |
| 5 | `features/05-easter-eggs/` | Evolution badge, tap-to-pet trust mechanic |
| 6 | `features/06-polish-and-deploy/` | Responsive layout, Page Visibility API, deploy |
| 7 | `features/07-testing-ci/` | Coverage audit, Jest test expansion, CI verification |

**3. Replanning**
Constitution files were updated throughout the project as decisions evolved — state machine changes, new states (Tired), decay rate adjustments, and visual mode additions were all propagated to specs before touching code.

---

## Challenge Requirements Coverage

| Requirement | Where it is specified | Where it is implemented |
|---|---|---|
| Pet naming | `specs/mission.md` — Flow 1 | `js/cat.js`, `js/ui.js` |
| 1 user, 1 evolution, 1 recovery path | `specs/mission.md` — Constraints | `js/cat.js` — evolved flag, sick recovery |
| Stats 0–100: Hunger, Happiness, Energy | `specs/mission.md` — Stats table | `js/cat.js` — stat boundaries |
| Stats tick down over time | `specs/mission.md` — Tick interval | `js/game.js` — 30s setInterval |
| Actions: Feed, Play, Rest | `specs/mission.md` — Actions table | `js/game.js` — action handlers |
| States: Normal, Sick, Evolved | `specs/mission.md` — States table | `js/cat.js` — evaluateState() |
| No permanent death | `specs/mission.md` — Constraints | Sick state has recovery path; no death condition exists |
| Easter eggs | `specs/mission.md` — Easter Eggs section | `js/game.js`, `js/ui.js` |
| No authentication, no multiple users | `specs/mission.md` — Constraints | No auth code anywhere in project |

---

## Rubric Self-Assessment

| Criteria | How it is met |
|---|---|
| Completeness | `specs/mission.md` defines mission, audience, constraints, all user flows (7), edge cases (15+), and success criteria (10) |
| Clarity and specificity | All thresholds, algorithms, and lifecycles are explicitly stated — e.g. decay rates per tick, state priority order, sick trigger conditions |
| Internal consistency (feature) | Each feature folder's plan, requirements, and validation reference the same requirement IDs and values |
| Internal consistency (constitution) | Feature specs were updated in the same commit as any constitution change — no orphaned values |
| Testability — 75%+ coverage | All validation.md files include explicit test IDs traceable to requirements.md |
| Testability — two levels | Every phase has Level 1 (smoke) and Level 2 (user flow or automated) tests |
| Testability — implemented suite | 90 Jest tests in `tests/` passing locally and in GitHub Actions CI |

---

## Repository Structure

```
specs/
  mission.md            ← constitution: what and why
  tech-stack.md         ← constitution: how it is built
  roadmap.md            ← constitution: phased plan
features/
  01-cat-stats/         ← phase 1 spec
  02-welcome-screen/    ← phase 2 spec
  03-cat-sprite/        ← phase 3 spec
  04-sick-and-recovery/ ← phase 4 spec
  05-easter-eggs/       ← phase 5 spec
  06-polish-and-deploy/ ← phase 6 spec
  07-testing-ci/        ← phase 7 spec
js/
  cat.js                ← cat entity and state machine
  game.js               ← game loop and action handlers
  ui.js                 ← DOM rendering
css/
  style.css             ← all styles
tests/
  game.test.js          ← unit tests: game logic
  cat.test.js           ← unit tests: cat entity
.github/
  workflows/
    test.yml            ← CI: runs on every push
index.html              ← single entry point
```

---

## Built with

- Vanilla HTML5, CSS3, JavaScript (ES6+) — no framework
- Inline SVG pixel art sprite
- Jest for unit testing
- GitHub Actions for CI
- GitHub Pages for hosting
- Claude Code as coding agent
- Spec-Driven Development workflow
