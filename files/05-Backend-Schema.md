# 05 — Backend Schema

## CubeSolve — Virtual Rubik's Cube Solver

> Note: core solving/scrambling logic runs entirely client-side and needs no backend. The schema below only supports the **optional account layer** (auth + saved history/stats), per the TRD.

### 1. Entity Overview

```
users ──1───────►∞ solves ──1───────►∞ solve_moves
  │
  └──1───────►1 user_stats
```

### 2. Table: `users`

Managed largely by Supabase Auth, but represented logically as:

| Column          | Type           | Notes                     |
| --------------- | -------------- | ------------------------- |
| `id`            | uuid (PK)      | Supplied by Supabase Auth |
| `email`         | text, unique   |                           |
| `display_name`  | text, nullable |                           |
| `auth_provider` | text           | `email` \| `google`       |
| `created_at`    | timestamptz    | default `now()`           |

### 3. Table: `solves`

One row per completed (or in-progress) solve session.

| Column              | Type                  | Notes                                                                                                               |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `id`                | uuid (PK)             |                                                                                                                     |
| `user_id`           | uuid (FK → users.id)  | nullable if we ever allow anonymous-but-synced sessions; for MVP, always non-null (only logged-in solves are saved) |
| `scramble_notation` | text                  | e.g. `"R U2 F' L D2 ..."` — the scramble applied                                                                    |
| `solution_notation` | text                  | full move list of the computed solution                                                                             |
| `move_count`        | integer               | length of solution (for stats/leaderboard-style display)                                                            |
| `solver_used`       | text                  | e.g. `"two-phase"` (future-proofs for alt solvers)                                                                  |
| `completed`         | boolean               | true once user finishes stepping through the full solution                                                          |
| `created_at`        | timestamptz           | default `now()`                                                                                                     |
| `completed_at`      | timestamptz, nullable | set when `completed` flips to true                                                                                  |

### 4. Table: `solve_moves` (optional normalization)

Only needed if you want per-move analytics (e.g., "which move did the user pause longest on"). For MVP this can just be the `solution_notation` text field on `solves`; this table is a **future** option, not required day one.

| Column       | Type                  | Notes                          |
| ------------ | --------------------- | ------------------------------ |
| `id`         | uuid (PK)             |                                |
| `solve_id`   | uuid (FK → solves.id) |                                |
| `move_index` | integer               | position in sequence           |
| `move`       | text                  | e.g. `"R'"`                    |
| `viewed_at`  | timestamptz, nullable | when user stepped to this move |

### 5. Table: `user_stats`

Denormalized rollup table, updated on each completed solve (via a DB trigger or app-level logic) so the Profile/History screens don't need to aggregate on every read.

| Column            | Type                     | Notes                  |
| ----------------- | ------------------------ | ---------------------- |
| `user_id`         | uuid (PK, FK → users.id) |                        |
| `total_solves`    | integer                  | default 0              |
| `avg_move_count`  | numeric                  | rolling average        |
| `best_move_count` | integer, nullable        | shortest solution seen |
| `last_solve_at`   | timestamptz, nullable    |                        |

### 6. Relationships Summary

- `users (1) ──► (many) solves` — a user has many solve records.
- `solves (1) ──► (many) solve_moves` — optional, future granular tracking.
- `users (1) ──► (1) user_stats` — one rollup row per user.

### 7. Auth Flow

1. User signs up via Supabase Auth (email/password or Google OAuth) → row created in `users` (handled by Supabase's auth schema + a lightweight trigger/sync into our app-level `users` table if a separate one is kept, or used directly if `users` = Supabase's own table).
2. Client receives a JWT session token from Supabase, stored client-side (Supabase SDK handles this).
3. All authenticated API calls (save solve, fetch history) include the JWT; backend/Supabase Row Level Security (RLS) policies ensure a user can only read/write their own `solves` and `user_stats` rows.

### 8. Row Level Security (RLS) Policies (Supabase/Postgres)

- `solves`: `SELECT`/`INSERT`/`UPDATE` allowed only where `solves.user_id = auth.uid()`.
- `user_stats`: `SELECT`/`UPDATE` allowed only where `user_stats.user_id = auth.uid()`.

### 9. What Does NOT Need a Backend Table

- Current in-progress cube state — lives entirely in frontend state (Zustand store), never persisted server-side unless the user is logged in and completes a solve.
- Scramble generation — computed client-side, no need to log every scramble attempt, only completed solves.
