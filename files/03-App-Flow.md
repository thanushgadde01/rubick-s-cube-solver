# 03 — App Flow

## CubeSolve — Virtual Rubik's Cube Solver

### 1. Screen Inventory

| #   | Screen               | Purpose                                                  | Auth required? |
| --- | -------------------- | -------------------------------------------------------- | -------------- |
| 1   | **Home / Workspace** | Main screen: 3D cube, scramble, solve, playback controls | No             |
| 2   | **Tutorial Overlay** | First-visit walkthrough of controls                      | No             |
| 3   | **Sign Up**          | Create optional account                                  | No             |
| 4   | **Log In**           | Access existing account                                  | No             |
| 5   | **History**          | List of past scrambles/solves (only if logged in)        | Yes            |
| 6   | **Solve Detail**     | Replay a specific past solve                             | Yes            |
| 7   | **Profile/Settings** | Basic account settings, sign out                         | Yes            |

### 2. Primary Flow — Guest User (no login)

```
Land on Home/Workspace
        │
        ▼
[First visit?] ──Yes──► Show Tutorial Overlay ──► Dismiss ──┐
        │No                                                 │
        ▼◄────────────────────────────────────────────────┘
Solved cube shown by default
        │
        ├─► Click "Scramble" ──► Cube animates through random scramble moves
        │                                 │
        │                                 ▼
        │                         Scrambled cube state shown
        │                                 │
        │            ┌────────────────────┼───────────────────────┐
        │            ▼                                            ▼
        │    User manually rotates faces                 Click "Solve"
        │    (free play / try it themselves)                      │
        │            │                                            ▼
        │            │                                Solver computes solution
        │            │                                (near-instant, client-side)
        │            │                                            │
        │            │                                            ▼
        │            │                             Step-by-step panel appears:
        │            │                             move list + playback controls
        │            │                                            │
        │            │                    ┌───────────────────────┼─────────────────┐
        │            │                    ▼                       ▼                 ▼
        │            │              Click "Play"           Click "Next"/"Prev"   Drag progress bar
        │            │              (auto-advance)          (manual step)        (jump to move N)
        │            │                    │                       │                 │
        │            │                    └───────────► Cube animates move, highlights
        │            │                                  current move in list
        │            │                                            │
        │            │                                            ▼
        │            │                                  Reaches solved state
        │            │                                  ("Solved! 24 moves" message)
        │            │                                            │
        └────────────┴────────────────────────────────────────────┘
                                    │
                                    ▼
                        Click "New Scramble" ──► loop back to Scramble step
```

### 3. Secondary Flow — Account Creation & History

```
Home/Workspace ──► Click "Sign In" (nav bar) ──► Login screen
                                                       │
                                            ┌──────────┴──────────┐
                                            ▼                     ▼
                                     Existing account       "Create account" link
                                     enters credentials              │
                                            │                        ▼
                                            │                 Sign Up screen
                                            │                 (email + password
                                            │                  or Google OAuth)
                                            │                        │
                                            └───────────┬────────────┘
                                                         ▼
                                              Redirected to Home/Workspace
                                              (now shows logged-in state)
                                                         │
                                                         ▼
                                          Every completed solve is now
                                          auto-saved to History (silently)
                                                         │
                                                         ▼
                                          Click "History" in nav ──► History screen
                                                         │
                                                         ▼
                                          List of past scrambles/solves,
                                          sorted by date, with move count
                                                         │
                                                         ▼
                                          Click an entry ──► Solve Detail screen
                                                         │
                                                         ▼
                                          Replays that exact scramble + solution
                                          using the same playback controls
```

### 4. Navigation Structure (persistent nav bar)

- **Logo / Home** → always returns to Workspace.
- **History** → visible only when logged in.
- **Sign In / Profile** → shows "Sign In" when guest, shows avatar/menu (Profile, Sign Out) when logged in.
- **Help (?)** → re-opens Tutorial Overlay at any time.

### 5. Edge Cases & States

- **Solve clicked with no scramble applied** → button disabled/no-op ("Cube is already solved").
- **User manually turns faces mid-playback** → playback pauses automatically; a "Resume/Re-solve from here" prompt appears.
- **Network unavailable** (backend down) → guest workspace still fully functional; only Sign In/History show a "temporarily unavailable" state.
- **Small screen / mobile** → controls panel collapses under the cube; touch-drag replaces mouse-drag for both cube view and face turns.
