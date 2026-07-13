# 02 — Technical Requirements Document (TRD)

## CubeSolve — Virtual Rubik's Cube Solver

### 1. Architecture Overview

CubeSolve is a **client-heavy web app**. Cube state, rendering, and solving all happen in the browser — no server round trip is needed to compute a solution, which keeps it fast and lets the app work fully offline after first load. A lightweight backend exists only for optional accounts, saved history, and stats.

```
┌─────────────────────────────┐
│         Browser (SPA)        │
│  React + Three.js + Solver   │◄──── all core functionality
│   (runs 100% client-side)    │
└──────────────┬───────────────┘
               │ optional (only if logged in)
               ▼
┌─────────────────────────────┐
│     Backend API (thin)       │
│  Auth + Save/Load History     │
└──────────────┬───────────────┘
               ▼
┌─────────────────────────────┐
│        Database (Postgres)   │
└─────────────────────────────┘
```

### 2. Frontend Stack

| Layer            | Choice                                                         | Why                                                                            |
| ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Framework        | **React 18 + TypeScript**, bundled with **Vite**               | Fast dev loop, huge ecosystem, typed cube-state logic reduces bugs             |
| 3D Rendering     | **Three.js** via **react-three-fiber** + **@react-three/drei** | Declarative 3D in React; drei gives gesture/camera helpers out of the box      |
| Styling          | **Tailwind CSS**                                               | Fast, consistent styling, easy responsive design                               |
| State Management | **Zustand**                                                    | Lightweight, ideal for cube state + solve-step state without Redux boilerplate |
| Animation        | **@react-spring/three** or Three.js built-in tweening          | Smooth face-turn animations synced to playback controls                        |
| Routing          | **React Router**                                               | Home / History / Auth pages                                                    |

### 3. Cube Logic & Solving Algorithm

This is the technical core of the product.

- **Cube state representation**: standard 54-sticker facelet string (Kociemba format) or a cubie-based permutation/orientation model.
- **Move engine**: a pure-JS/TS module that applies moves (U, U', U2, R, R', etc.) to the state — this is shared by the 3D renderer (visual turns) and the solver (logical turns).
- **Solver algorithm — recommended: Kociemba's Two-Phase Algorithm**
  - Use the well-tested **`cubejs`** library (a JS/WASM port of the two-phase algorithm) or an equivalent implementation.
  - Produces near-optimal solutions (typically 20–25 moves) in well under a second, entirely client-side.
  - Alternative considered: implement a beginner's layer-by-layer solver — simpler to implement and easier to explain step-by-step for the "Learning Mode" (post-MVP), but longer/less efficient solutions (~60-100 moves). **Decision:** ship two-phase for MVP (fast, short solutions); add layer-by-layer as an alternate "teach me" solve mode later.
- **Scramble generator**: generate a random sequence of 20-25 legal moves (WCA-style) applied to a solved state; ensures every scramble is solvable by construction.
- **Validation**: since scrambles are generated from a solved state via legal moves, no illegal-state validation is needed for MVP (this only becomes necessary if manual facelet-color entry is added later).

### 4. Backend Stack (thin, optional-auth layer)

| Layer    | Choice                                                                 | Why                                                 |
| -------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| Runtime  | **Node.js + Express** (or serverless functions, e.g. Vercel Functions) | Minimal API surface — auth + CRUD for history       |
| Database | **PostgreSQL** (via **Supabase**)                                      | Managed Postgres + built-in Auth reduces build time |
| Auth     | **Supabase Auth** (email/password + Google OAuth)                      | Avoids building auth from scratch                   |
| ORM      | **Prisma** (if self-hosting Postgres) or Supabase JS client            | Type-safe queries matching the schema doc           |

### 5. Hosting & DevOps

- **Frontend hosting**: Vercel or Netlify (static SPA build + CDN).
- **Backend hosting**: Supabase (managed) — no separate server to maintain for MVP.
- **CI/CD**: GitHub Actions — lint, type-check, unit test, build, deploy on merge to `main`.
- **Environments**: `local` → `staging` → `production`.

### 6. Testing Strategy

- **Unit tests** (Vitest): move engine correctness (every move + inverse returns to prior state), scramble generator legality, solver output validity (applying the solution to the scrambled state always yields solved state).
- **Component tests** (React Testing Library): controls, step navigation, move list sync.
- **E2E tests** (Playwright): full flow — load app → scramble → solve → step through → reset.

### 7. Performance Requirements

- Initial load (first paint of 3D cube) under 2s on a typical broadband connection.
- Solve computation under 1s on mid-range hardware (two-phase algorithm easily meets this).
- 60fps target for cube rotation/animation.

### 8. Browser/Device Support

- Latest 2 versions of Chrome, Firefox, Safari, Edge.
- Responsive down to mobile widths (~375px), touch-drag support for cube rotation via drei's gesture controls.

### 9. Security & Privacy

- No personal data required for core functionality (guest use fully supported).
- If account created: standard hashed-password/OAuth via Supabase Auth, HTTPS everywhere, no sensitive data stored beyond email + solve history.

### 10. Third-Party Dependencies Summary

| Package                                            | Purpose                    |
| -------------------------------------------------- | -------------------------- |
| `three`, `@react-three/fiber`, `@react-three/drei` | 3D rendering & interaction |
| `cubejs` (or equivalent two-phase solver port)     | Cube solving algorithm     |
| `zustand`                                          | State management           |
| `tailwindcss`                                      | Styling                    |
| `@supabase/supabase-js`                            | Auth + DB client           |
| `vitest`, `@testing-library/react`, `playwright`   | Testing                    |
