# 04 — UI/UX Design Brief

## CubeSolve — Virtual Rubik's Cube Solver

### 1. Design Principles

1. **The cube is the star.** Everything else (controls, panels, nav) is secondary and visually quiet, so the 3D cube always has the most visual weight and contrast on screen.
2. **Clarity over density.** One primary action visible at a time (Scramble → Solve → Play). Avoid cluttering the screen with every option at once.
3. **Feels tactile.** Rotations, drags, and move animations should feel smooth and physical — this is a "toy" people want to fidget with, not a data dashboard.
4. **Zero-friction entry.** No login wall. The cube is interactive within one second of page load.

### 2. Visual Style

- **Theme**: dark mode by default (deep charcoal/near-black background, `#111318`-ish) — makes the cube's saturated sticker colors pop, reduces eye strain, feels modern/technical.
- **Cube colors**: standard Rubik's Cube palette (white, yellow, red, orange, blue, green) rendered at full saturation — the one place the UI is deliberately vibrant.
- **Accent color**: a single accent (e.g., electric blue or amber) used sparingly for primary buttons, the active-move highlight, and progress indicators.
- **Typography**: a clean geometric sans-serif (e.g., Inter or similar) — highly legible for move notation (R, U', F2, etc.), which must be unambiguous at small sizes.
- **Iconography**: simple line icons for playback controls (play/pause/next/prev/speed) — instantly recognizable, borrowed from familiar media-player conventions.

### 3. Layout (Desktop)

```
┌───────────────────────────────────────────────────────────┐
│  Logo        CubeSolve                    History  Sign In │  ← nav bar
├───────────────────────────────────────────────────────────┤
│                                                             │
│                                             ┌─────────────┐│
│                                             │ Move 12/24  ││
│              [ 3D CUBE — large,            │ R U R' U'   ││ ← side panel
│                center-stage,               │ F2 ...      ││   (move list,
│                draggable to orbit ]        │ (scrollable)││   current move
│                                             └─────────────┘│   highlighted)
│                                                             │
├───────────────────────────────────────────────────────────┤
│   [Scramble]     [Solve]     ◀◀  ▶  ▶▶     [Speed ▾]      │  ← control bar
└───────────────────────────────────────────────────────────┘
```

- Cube occupies ~65% of viewport width, always centered, never obstructed by panels.
- Move-list panel is collapsible on smaller desktop widths.
- Control bar is a persistent bottom strip — big, thumb-friendly targets even on desktop (anticipates touch/tablet use).

### 4. Layout (Mobile)

- Cube fills the top ~55% of the screen.
- Control bar (Scramble / Solve / playback) sits directly below the cube, always visible without scrolling.
- Move list becomes a collapsible drawer (swipe up) rather than a fixed side panel, so it doesn't compete with the cube for space.

### 5. Key Interactions

| Interaction                     | Behavior                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drag on empty space around cube | Orbits the camera (view rotation only, no effect on cube state)                                                                                                             |
| Drag directly on a cube face    | Turns that face/layer (with a subtle snap-to-90° magnetic feel)                                                                                                             |
| Click "Scramble"                | Cube animates through the scramble moves one after another (~0.15s per move) so the user visually sees it happen, not an instant jump-cut                                   |
| Click "Solve"                   | Brief "thinking" micro-animation (a few hundred ms) even though computation is near-instant — gives a sense of the solver "working," then the move list populates           |
| Click "Play"                    | Auto-advances through solution moves at the selected speed, current move glows/highlights on both the cube (subtle face glow) and the move list (bold + scrolled into view) |
| Drag progress bar               | Scrubs to any point in the solution instantly; cube state jumps to match                                                                                                    |
| Manual face turn mid-solve      | Playback pauses; a small toast offers "Re-solve from current state"                                                                                                         |

### 6. Feedback & Micro-copy

- Solved state: a short celebratory but understated animation (a soft flash/glow across the cube, not confetti) + "Solved in 24 moves."
- Errors are rare by design (scrambles are always solvable) — the one message needed is a network-error toast for History/Auth features only.
- Tooltips on first hover of each control (dismiss permanently after first interaction).

### 7. Accessibility

- All controls reachable via keyboard (space = play/pause, arrow keys = next/prev step).
- Sufficient color contrast for all non-cube UI text against the dark background (WCAG AA minimum).
- Move notation text never relies on color alone — always paired with text (e.g., "R" not just a colored icon).
- Respect `prefers-reduced-motion` — offer instant-step mode instead of animated turns.

### 8. Responsive Breakpoints

- **Desktop** (≥1024px): side panel layout as shown above.
- **Tablet** (768–1023px): side panel collapses to a toggleable drawer.
- **Mobile** (<768px): stacked layout, bottom drawer for move list.
