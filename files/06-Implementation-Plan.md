# 06 — Implementation Plan

## CubeSolve — Virtual Rubik's Cube Solver

Phased so that **the core value (virtual cube + solve + playback) is working and demoable before any backend/auth work begins.**

---

### Phase 0 — Project Setup (0.5–1 day)

- Scaffold React + TypeScript + Vite project.
- Install core deps: `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `tailwindcss`.
- Set up ESLint/Prettier, Vitest, basic CI (GitHub Actions: lint + test + build on push).
- Set up folder structure: `/cube-engine` (pure logic), `/components` (UI), `/store` (Zustand), `/scenes` (3D).

### Phase 1 — Cube Logic Engine (2–3 days)

_Build this before any 3D rendering — it's pure, testable logic._

- Implement cube state model (facelet or cubie representation).
- Implement move engine: apply any of the 18 basic moves (U, U', U2, D, D', D2, ... B2) to a state.
- Unit test: applying a move then its inverse returns to original state; applying a move 4 times returns to original state.
- Implement scramble generator (random legal move sequence from solved state, WCA-style length ~20-25).
- Unit test: generated scrambles are always valid/solvable by construction.

### Phase 2 — Solver Integration (2–3 days)

- Integrate `cubejs` (or equivalent two-phase algorithm implementation) against the internal state representation (write an adapter to convert between internal format and the library's expected facelet format).
- Unit test: for many random scrambles, solver output applied to the scrambled state always yields the solved state.
- Benchmark solve time; confirm sub-1-second performance on target hardware.

### Phase 3 — 3D Cube Rendering (3–4 days)

- Build the 3D cube scene with react-three-fiber: 26 cubie meshes (no interior piece needed), correct sticker coloring per facelet.
- Camera orbit controls (drei's `OrbitControls`) for free rotation of the view.
- Face-turn interaction: drag detection on a face → determine which layer/direction → trigger a move in the logic engine → animate the corresponding cubies rotating 90°.
- Sync 3D visual state to the Zustand cube-state store (single source of truth).

### Phase 4 — Scramble & Solve UI (2 days)

- "Scramble" button → generates scramble, animates each move on the cube sequentially.
- "Solve" button → runs solver on current state, stores resulting move list in state.
- Move-list panel: renders the solution notation, scrollable.

### Phase 5 — Playback Controls (2–3 days)

- Play/Pause/Next/Prev/Speed controls wired to a "current step index" in the store.
- Auto-advance timer for "Play" mode (respecting selected speed).
- Highlight current move in both the 3D cube (animate the specific turn) and the move-list panel (scroll into view + bold).
- Progress bar / scrubber to jump to an arbitrary step (recompute cube state at that step from the base scrambled state + moves so far, or cache intermediate states).
- Handle manual face-turn interruption during playback (pause + prompt to re-solve from current state).

### Phase 6 — Polish, Responsive & Accessibility Pass (2 days)

- Responsive layout for tablet/mobile (per UI/UX brief).
- Keyboard controls (space, arrow keys).
- `prefers-reduced-motion` handling.
- Tutorial overlay for first-time visitors.
- Solved-state celebration animation + move-count summary.

**→ MVP checkpoint: fully working guest experience, no backend needed, deployable to Vercel/Netlify as a static app.**

---

### Phase 7 — Backend & Auth (3–4 days)

- Set up Supabase project; configure Auth (email/password + Google OAuth).
- Create `solves` and `user_stats` tables per Backend Schema doc; apply RLS policies.
- Build thin API layer (or direct Supabase client calls from frontend) for: save completed solve, fetch history list, fetch single solve detail.
- Wire up Sign Up / Log In screens and persistent auth state (Zustand or React Context synced with Supabase session).

### Phase 8 — History & Profile Screens (2 days)

- History screen: list of past solves (date, move count), sorted newest first.
- Solve Detail screen: reload a past scramble/solution into the same playback UI (read-only replay).
- Profile screen: display `user_stats` (total solves, avg/best move count), sign-out action.

### Phase 9 — Testing & QA Pass (2 days)

- E2E tests (Playwright): guest flow (scramble → solve → play through → reset), auth flow (sign up → solve → appears in history).
- Cross-browser check (Chrome, Firefox, Safari, Edge) + mobile device check (iOS Safari, Android Chrome).
- Performance audit (Lighthouse): load time, animation frame rate.

### Phase 10 — Launch (1 day)

- Final deploy to production hosting.
- Set up basic analytics (page views, scramble/solve counts) if desired.
- Post-launch monitoring for errors (e.g., Sentry).

---

### Estimated Total Timeline

| Phase                 | Duration  | Cumulative         |
| --------------------- | --------- | ------------------ |
| 0 — Setup             | 0.5–1 day | ~1 day             |
| 1 — Cube Engine       | 2–3 days  | ~4 days            |
| 2 — Solver            | 2–3 days  | ~7 days            |
| 3 — 3D Rendering      | 3–4 days  | ~11 days           |
| 4 — Scramble/Solve UI | 2 days    | ~13 days           |
| 5 — Playback Controls | 2–3 days  | ~16 days           |
| 6 — Polish/Responsive | 2 days    | **~18 days → MVP** |
| 7 — Backend/Auth      | 3–4 days  | ~22 days           |
| 8 — History/Profile   | 2 days    | ~24 days           |
| 9 — Testing/QA        | 2 days    | ~26 days           |
| 10 — Launch           | 1 day     | **~27 days total** |

_(Assumes one full-time developer; parallelize Phase 1–2 with early Phase 3 scaffolding if working with 2 people.)_
