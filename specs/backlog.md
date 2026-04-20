# Backlog

Unplanned work, deferred fixes, and ideas that are out of scope for the current phase but worth tracking.

---

## Bugs / Fixes

| # | Description | Priority | Source |
|---|---|---|---|
| ~~BUG-01~~ | ~~Jest/Node incompatibility: `tests/game.test.js` is browser-only and must be rewritten for Jest before CI works.~~ | ~~High~~ | ~~KI-01~~ | **Resolved** — `tests/game.test.js` rewritten; 57 tests passing. `tests/cat.test.js` added; 24 tests passing. |
| ~~BUG-02~~ | ~~`specs/tech-stack.md` "No dependencies" section contradicts the Jest requirement — clarify scope to shipped app only.~~ | ~~Low~~ | ~~KI-02~~ | **Resolved** — "No dependencies" section clarified to shipped app only. |
| BUG-03 | Belly counter not reset mid-event: if happiness drops while belly overlay is open, the counter retains its value and may re-trigger immediately. | Medium | KI-04 |

---

## Infrastructure

| # | Description | Priority |
|---|---|---|
| ~~INF-01~~ | ~~Create `package.json` and `.github/workflows/test.yml` for Jest CI.~~ | ~~High~~ | **Resolved** — `package.json`, `tests/run.js`, and `.github/workflows/test.yml` all in place. 81 tests pass on push. |
| INF-02 | Set up GitHub Pages deployment (enable in repo settings, confirm base URL). | High |

---

## Features (deferred)

| # | Description | Notes |
|---|---|---|
| FEAT-01 | Feature 2 — TBD | To be defined after Feature 1 (Easter Egg) is complete |
| FEAT-02 | Feature 3 — TBD | To be defined after Feature 2 is complete |

---

## Polish / Nice-to-have

| # | Description |
|---|---|
| POL-01 | Add entrance animation on Welcome screen (cat sprite fades/bounces in). |
| POL-02 | Sound effects (purr, feeding, poo cleaning) — optional, user-toggle. |
| POL-03 | Add a small clock/timer showing time until next tick. |
| POL-04 | Evolved state: add subtle sparkle particle animation around the sprite. |
