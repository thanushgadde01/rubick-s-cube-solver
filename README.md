# CubeSolve — Virtual Rubik's Cube Solver & Playback Studio

CubeSolve is a state-of-the-art, client-heavy virtual Rubik's Cube simulation and step-by-step solver built using React, TypeScript, Vite, and Three.js (React Three Fiber). It calculates near-optimal solutions (using Kociemba's Two-Phase Algorithm) entirely in the browser and animates steps with interactive controls.

## Features

- **3D Interactive Workspace**: Fully rotatable 3D scene using `OrbitControls`, displaying 26 individual cubies with accurate sticker colors.
- **Scramble Generator**: One-click WCA-style random scrambler showing official notation.
- **Sub-Second Solver**: Computes solutions instantly client-side without server roundtrips.
- **Step-by-Step Playback Controls**: Rewind, play, pause, advance, and scrub solution progress with custom move speeds.
- **Interactive Move List**: Interactive panel showing the moves; click any move to jump directly to that step.
- **Keyboard Shortcuts**: Full workspace bindings allowing manual cube turns and playback navigation via keyboard.
- **Auth & Solve History (Optional)**: Supabase-based authentication syncing statistics (Total Solves, Avg Move Count, Best Solve) and histories.
- **Offline Guest Fallback**: Graceful fallback storing history in local storage if database keys are not configured.

---

## Installation & Setup

1. **Clone & Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` in the root folder:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase endpoint and API key, or leave them empty to run in **Guest Mode** (stores everything locally in `localStorage`):
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

---

## Running the Project

- **Start Local Development Server**:

  ```bash
  npm run dev
  ```

  Open the URL shown in the console (usually `http://localhost:5173`).

- **Production Build Check**:

  ```bash
  npm run build
  ```

  Generates production-optimized output in the `dist/` directory.

- **Preview Production Build**:

  ```bash
  npm run preview
  ```

- **Run Testing Suite**:
  ```bash
  npm run test
  ```

---

## Interactive Controls

### 3D Navigation

- **Rotate View (Orbit)**: Click and drag empty space around the cube.
- **Zoom**: Scroll wheel or pinch-to-zoom on touch screens.

### Keyboard Shortcuts (Manual Play)

- **Face Turns**:
  - `U` (Up), `D` (Down), `R` (Right), `L` (Left), `F` (Front), `B` (Back)
  - Press **Shift + Key** (e.g. `Shift + R`) to turn counter-clockwise.
- **Playback Navigation**:
  - `Space`: Play / Pause auto-play.
  - `ArrowLeft` / `ArrowRight`: Step backward / forward through solution steps.
