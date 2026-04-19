Redesign the entire visual style of the app to feel like a 
dark 8-bit arcade / CRT terminal. Do not change any game logic.
CSS and HTML only.

## Palette (use these exact values as CSS custom properties)
--bg: #0a0a0a
--screen-bg: #0d0d1a
--border: #4040ff
--text-primary: #ffffff
--text-dim: #8888aa
--accent-yellow: #ffff00
--accent-magenta: #ff00ff
--accent-cyan: #00ffff
--accent-green: #00ff41
--danger: #ff3131
--btn-feed: #ff6600
--btn-play: #00cc44
--btn-rest: #0066ff

## Typography
- Import 'Press Start 2P' from Google Fonts
- Use it for all text
- Base font size: 8px (the font is wide, it needs to be small)
- Cat name: 16px, --accent-yellow
- Stat labels: 8px, --text-dim
- Stat values: 8px, --text-primary
- Button labels: 8px, --text-primary
- State badge: 8px

## Layout
- Center the app on screen, max-width 420px
- Outer container: 4px solid --border, 
  box-shadow: 0 0 24px --border (glow effect)
- Background: --screen-bg
- Add a subtle scanline effect using a CSS repeating-linear-gradient 
  overlay (2px lines, 10% opacity black, pointer-events: none)

## Stat bars
- Replace smooth bars with segmented blocks: 
  10 blocks per bar, each block 100% / 10 wide, 
  2px gap between blocks
- Filled blocks colour: 
  blocks 8-10 filled → --accent-green
  blocks 4-7 filled → --accent-yellow  
  blocks 1-3 filled → --danger
- Empty blocks: #222233
- No border-radius on blocks

## Buttons
- Square corners (border-radius: 0)
- 2px solid border in button colour
- Hard pixel drop shadow: 3px 3px 0px in button colour (no blur)
- On hover: background becomes button colour, text becomes --bg
- On active/click: shadow disappears (simulates press)

## State badge
- Top right, 2px solid --accent-cyan
- Background: --bg
- Text: --accent-cyan
- No border-radius

## Cat sprite
- Add image-rendering: pixelated to the SVG container
- Scale the SVG to feel chunky, not smooth

## CRT flicker
- Add a very subtle CSS animation: 
  opacity oscillates between 1 and 0.97 every 3 seconds
  on the main screen container (barely noticeable, just alive)