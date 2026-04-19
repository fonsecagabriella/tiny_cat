Update specs/tech-stack.md to add a GitHub Actions CI section.

Add the following after the "Hosting" section:

---

## Testing & CI

| Layer | Choice | Rationale |
|---|---|---|
| Test framework | Jest (via Node.js) | Industry standard for JS unit tests; runs in CI without a browser |
| CI platform | GitHub Actions | Native to GitHub; free for public repos |

### Test scope
Unit tests cover the game logic only (`js/game.js`, `js/cat.js`). The UI layer (`js/ui.js`) is not unit tested — it is covered by manual user flow tests in `validation.md`.

### GitHub Actions workflow
A workflow file at `.github/workflows/test.yml` runs on every push to `main` and on every pull request:
1. Install Node.js (LTS)
2. Install Jest (`npm install --save-dev jest`)
3. Run `npm test`

Tests must pass before a feature branch is considered done.

### Test location
All test files live in `tests/`. Naming convention: `[module].test.js` (e.g. `game.test.js`, `cat.test.js`).