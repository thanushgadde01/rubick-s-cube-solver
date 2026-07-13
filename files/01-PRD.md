# 01 — Product Requirements Document (PRD)

## CubeSolve — Virtual Rubik's Cube Solver

### 1. Product Vision

A web app where users interact with a fully virtual 3D Rubik's Cube — scramble it, then get an optimal, step-by-step solution they can play through move-by-move, like a guided tutorial. No physical cube or camera required; everything happens on-screen.

### 2. Problem Statement

People who own a Rubik's Cube (or just want to mess with one virtually) often get stuck mid-solve and want to see exactly what to do next — without installing an app or learning notation from scratch. Existing solvers are either bare algorithm outputs (a wall of move notation) or bundled inside heavy native apps. There's room for a clean, fast, browser-based tool that solves and _teaches_ at the same time.

### 3. Target Users

| Persona                    | Description                                                  | Need                                                           |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| **Curious Beginner**       | Has a physical cube, doesn't know how to solve it            | Wants a simple, visual, step-by-step guide                     |
| **Puzzle Hobbyist**        | Solves casually, wants to explore scrambles/solutions        | Wants a fast, no-friction virtual cube to play with algorithms |
| **Speedcuber-in-training** | Knows some methods, wants to verify moves or study solutions | Wants accurate notation, move counts, and playback controls    |
| **Student/Educator**       | Uses cube-solving to teach algorithmic thinking              | Wants a shareable, visual demo tool                            |

### 4. Goals

- Let a user scramble a virtual cube (randomly or manually) in under 5 seconds.
- Compute a correct, reasonably short solution near-instantly (client-side, no server round trip needed for solving).
- Present the solution as an animated, step-by-step playback with standard cube notation.
- Make it usable with zero login — accounts are optional, only needed to save history/stats.

### 5. Non-Goals (MVP)

- No camera-based cube scanning (explicitly out of scope for v1).
- No multiplayer/competitive timing features (speedcubing race mode) in MVP.
- No native mobile app (web-first, responsive, works on mobile browsers).
- No support for cube sizes other than the standard 3x3x3 in MVP.

### 6. Core Features (MVP)

1. **3D Interactive Cube** — drag to rotate the view, click/drag a face to turn it.
2. **Scramble** — one-click random scramble (WCA-style scramble notation), or manual move entry.
3. **Solve** — computes a solution using a standard solving algorithm.
4. **Step-by-Step Playback** — play/pause/next/prev/speed controls, current move highlighted on the cube and in a move list, progress indicator (e.g., "Move 12 of 24").
5. **Move Notation Display** — readable list of moves (e.g., R U R' U') with the current step highlighted.
6. **Reset / New Scramble** — quickly start over.

### 7. Post-MVP Features (Future)

- Optional account (email or OAuth) to save solve history and stats (solve count, average move count).
- "Learning mode" — teach a beginner method (layer-by-layer / CFOP) with explanations per stage, not just raw moves.
- Camera-based cube state scanning.
- Support for 2x2, 4x4 cubes.
- Shareable scramble/solution links.
- Timer + personal best tracking (light speedcubing feature).

### 8. Key User Stories

- As a user, I want to scramble the cube with one click so I can immediately try solving it myself or ask for help.
- As a user, I want to hit "Solve" and see the exact sequence of moves animated on the cube so I can follow along with my real cube.
- As a user, I want to step forward/backward through the solution at my own pace so I don't feel rushed.
- As a returning user, I want (optionally) to see my past scrambles and solutions so I can track progress over time.

### 9. Success Metrics

- Time-to-first-solve (from landing on the page to seeing an animated solution) < 15 seconds.
- Solver returns a valid solution 100% of the time for any legal scramble.
- Average solution length within an acceptable range (~20–30 moves using a two-phase algorithm) for a satisfying "efficient" feel.
- % of sessions that use the step-through controls (indicates the teaching aspect is being used, not just a black-box "here's the answer").

### 10. Assumptions & Constraints

- Standard 3x3x3 Rubik's Cube only.
- Web app, desktop and mobile browser support (touch + mouse/drag).
- Solving computation should be fast enough to feel instant (target < 1 second) — this shapes the technical algorithm choice (see TRD).
