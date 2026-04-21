Add a new feature to Phase 6: the (i) help button.
Two tasks — specs first, then implement.

## Task 1 — Update specs

### specs/mission.md
Add to the UI section (or after Easter Eggs):

## Help Screen
- A small (i) button is visible on both the 
  welcome screen and game screen at all times
- Clicking it opens an overlay titled 
  "DECIPHER ME, HUMAN"
- The overlay contains a cryptic riddle written 
  in cat personality / retro pixel tone
- The riddle hints at all core mechanics and 
  both Easter eggs without naming them directly
- Overlay is dismissed by clicking anywhere 
  outside it or a CLOSE button
- No game state is affected by opening or 
  closing the overlay

### features/06-polish-and-deploy/requirements.md
Add REQ-P06 — Help Screen:

| ID | Requirement |
|---|---|
| P06.1 | (i) button visible on both welcome and game screen |
| P06.2 | Clicking (i) opens overlay with title "DECIPHER ME, HUMAN" |
| P06.3 | Overlay contains the riddle text defined in this spec |
| P06.4 | Overlay dismissed by CLOSE button or clicking outside |
| P06.5 | Opening overlay does not pause or affect game state |
| P06.6 | Overlay style matches retro pixel aesthetic |

### features/06-polish-and-deploy/validation.md
Add to Level 1 smoke tests:
- (i) button visible on welcome screen and game screen
- Clicking (i) opens overlay with correct title
- Clicking outside or CLOSE dismisses overlay
- Game continues running while overlay is open

Add to Level 2 flow tests:
- Open overlay mid-game, dismiss, verify stats 
  continued decaying

## Task 2 — Implement

Create the help overlay in index.html, js/ui.js, 
and css/style.css.

### Riddle content
The overlay must contain exactly this text 
(formatted as pixel-art style paragraphs, 
all caps, retro tone):

---
DECIPHER ME, HUMAN

I. THE FOUR SACRED RITES
THOU SHALT FEED ME, PLAY WITH ME, AND LET ME REST.
NEGLECT ANY, AND I SHALL MAKE MY DISPLEASURE... KNOWN.
(HINT: I HAVE OPINIONS ABOUT EMPTY FOOD BOWLS.)

II. THE PASSAGE OF TIME
I GROW HUNGRY. I GROW BORED. I GROW TIRED.
EVEN AS YOU READ THIS, THE CLOCK TICKS.
DO NOT TARRY, HUMAN.

III. THE GREAT ASCENSION
KEEP ALL MY NEEDS ABOVE THE HIGH MARK — 
NOT JUST ONCE, BUT CONSISTENTLY.
IT HAPPENS EXACTLY ONCE. FOREVER.
BUT SOME HUMANS HAVE DONE IT... FASTER.

IV. THE ANCIENT POO WISDOM
ONE IS TOLERABLE. TWO IS AN OMEN.
CLEAN THEM, OR FACE THE CONSEQUENCES.
(THE CONSEQUENCES ARE MEDICAL.)

V. THE SECRET LANGUAGE OF BELLIES
WHEN THE TIME IS RIGHT, I SHALL REVEAL MY BELLY.
CHOOSE WISELY. I HAVE CLAWS.

VI. THE TRUST RITUAL
I DO NOT KNOW YOU YET, HUMAN.
EARN MY TRUST — FEED ME, PLAY WITH ME.
THEN... PERHAPS... TRY TOUCHING ME.
PERHAPS.

~ YOUR CAT, PROBABLY
---

### Implementation notes
- Render riddle sections as separate pixel-style 
  paragraphs with spacing between them
- Title "DECIPHER ME, HUMAN" in --accent-yellow
- Section headings (I. II. III. etc) in --accent-cyan
- Body text in --text-primary
- CLOSE button at bottom, pixel style matching 
  existing buttons
- Overlay background: rgba(0, 0, 0, 0.85)
- Overlay box: same border style as game container

After implementation:
- Confirm (i) button works on both screens
- Confirm overlay does not affect game loop
- Run npm test — all tests must still pass
- Commit with message: 
  'feat: add help overlay with cryptic cat riddle'