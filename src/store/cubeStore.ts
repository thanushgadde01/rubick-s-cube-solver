/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createSolvedCube, solveCube, scrambleCube } from "../cube-engine/cube";
import Cube from "cubejs";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export type SolveRecord = {
  id?: string;
  scramble_notation: string;
  solution_notation: string;
  move_count: number;
  completed: boolean;
  created_at?: string;
};

export type UserStats = {
  total_solves: number;
  avg_move_count: number;
  best_move_count: number | null;
};

export type CubeStoreState = {
  // Cube State
  cubeState: string;
  scramble: string;
  solution: string[];
  currentMoveIndex: number;
  isSolving: boolean;
  scrambledState: string | null;
  solveError: string | null;

  // Playback Control State
  isPlaying: boolean;
  playbackSpeed: number; // Duration per move in ms

  // Auth & Session State
  user: any | null;
  history: SolveRecord[];
  stats: UserStats;

  // Animation helper state
  lastMove: string | null;
  lastMoveTimestamp: number;

  // Actions
  setCubeState: (state: string) => void;
  applyManualMove: (move: string) => void;
  setScramble: (scramble: string, state: string) => void;
  generateRandomScramble: () => void;
  computeSolution: () => void;
  nextMove: () => void;
  prevMove: () => void;
  setMoveIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  resetCube: () => void;
  updateFaceletColor: (index: number, colorChar: string) => void;
  clearSolveError: () => void;

  // Auth actions
  setUser: (user: any) => void;
  loadHistoryAndStats: () => Promise<void>;
  saveSolve: () => Promise<void>;
  signOut: () => Promise<void>;
};

const initialCube = createSolvedCube();

function applyMoveToState(state: string, move: string): string {
  const cube = Cube.fromString(state);
  cube.move(move);
  return cube.asString();
}

function getInverseMove(move: string): string {
  if (!move || typeof move !== "string") return "";
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  } else if (move.endsWith("2")) {
    return move;
  } else {
    return move + "'";
  }
}

export const useCubeStore = create<CubeStoreState>((set, get) => ({
  cubeState: initialCube.asString(),
  scramble: "",
  solution: [],
  currentMoveIndex: 0,
  isSolving: false,
  scrambledState: null,

  isPlaying: false,
  playbackSpeed: 1000,
  solveError: null,

  user: null,
  history: [],
  stats: {
    total_solves: 0,
    avg_move_count: 0,
    best_move_count: null,
  },

  lastMove: null,
  lastMoveTimestamp: 0,

  setCubeState: (state) => {
    set({ cubeState: state });
  },

  applyManualMove: (move) => {
    const { cubeState } = get();
    const nextState = applyMoveToState(cubeState, move);
    set({
      cubeState: nextState,
      isPlaying: false,
      solution: [],
      currentMoveIndex: 0,
      scrambledState: null,
      lastMove: move,
      lastMoveTimestamp: Date.now(),
    });
  },

  setScramble: (scramble, state) => {
    set({
      scramble,
      cubeState: state,
      currentMoveIndex: 0,
      solution: [],
      scrambledState: state,
      isPlaying: false,
    });
  },

  generateRandomScramble: () => {
    const { scramble, state } = scrambleCube();
    set({
      scramble,
      cubeState: state,
      currentMoveIndex: 0,
      solution: [],
      scrambledState: state,
      isPlaying: false,
    });
  },

  computeSolution: () => {
    const { cubeState } = get();
    set({ solveError: null });
    const cube = Cube.fromString(cubeState);
    if (cube.isSolved()) return;

    set({ isSolving: true });
    try {
      const solString = solveCube(cube);
      const solution = solString.split(" ").filter(Boolean);
      set({
        solution,
        currentMoveIndex: 0,
        scrambledState: cubeState,
        isSolving: false,
      });
    } catch (err: any) {
      console.error(err);
      set({
        isSolving: false,
        solveError:
          err?.message ||
          "Unsolvable cube configuration. Please check your painted face colors for errors.",
      });
    }
  },

  nextMove: () => {
    const { currentMoveIndex, solution, cubeState } = get();
    if (solution && currentMoveIndex < solution.length) {
      const move = solution[currentMoveIndex];
      if (move) {
        const nextState = applyMoveToState(cubeState, move);
        const nextIndex = currentMoveIndex + 1;
        set({
          cubeState: nextState,
          currentMoveIndex: nextIndex,
          lastMove: move,
          lastMoveTimestamp: Date.now(),
        });
        // If we finished the solution, save the solve automatically
        if (nextIndex === solution.length) {
          set({ isPlaying: false });
          get().saveSolve();
        }
      }
    }
  },

  prevMove: () => {
    const { currentMoveIndex, solution, cubeState } = get();
    if (solution && currentMoveIndex > 0) {
      const move = solution[currentMoveIndex - 1];
      if (move) {
        const invMove = getInverseMove(move);
        const nextState = applyMoveToState(cubeState, invMove);
        set({
          cubeState: nextState,
          currentMoveIndex: currentMoveIndex - 1,
          lastMove: invMove,
          lastMoveTimestamp: Date.now(),
        });
      }
    }
  },

  setMoveIndex: (index) => {
    const { scrambledState, solution } = get();
    if (!scrambledState || !solution) return;
    let tempState = scrambledState;
    const maxIndex = Math.min(index, solution.length);
    for (let i = 0; i < maxIndex; i++) {
      const move = solution[i];
      if (move) {
        tempState = applyMoveToState(tempState, move);
      }
    }
    set({
      cubeState: tempState,
      currentMoveIndex: maxIndex,
    });
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
  },

  resetCube: () => {
    const freshCube = createSolvedCube();
    set({
      cubeState: freshCube.asString(),
      scramble: "",
      solution: [],
      currentMoveIndex: 0,
      isPlaying: false,
      scrambledState: null,
      solveError: null,
    });
  },

  updateFaceletColor: (index, colorChar) => {
    const { cubeState } = get();
    const stateArr = cubeState.split("");
    stateArr[index] = colorChar;
    const nextState = stateArr.join("");
    set({
      cubeState: nextState,
      solution: [],
      currentMoveIndex: 0,
      scrambledState: null,
      solveError: null,
    });
  },

  clearSolveError: () => {
    set({ solveError: null });
  },

  setUser: (user) => {
    set({ user });
    get().loadHistoryAndStats();
  },

  loadHistoryAndStats: async () => {
    const { user } = get();
    if (user && isSupabaseConfigured && supabase) {
      try {
        const { data: solvesData, error: solvesErr } = await supabase
          .from("solves")
          .select("*")
          .order("created_at", { ascending: false });

        const { data: statsData, error: statsErr } = await supabase
          .from("user_stats")
          .select("*")
          .single();

        if (!solvesErr && solvesData) {
          set({ history: solvesData });
        }
        if (!statsErr && statsData) {
          set({ stats: statsData });
        }
      } catch (err) {
        console.error("Error fetching Supabase data:", err);
      }
    } else {
      // Guest local storage fallback
      const localHistory = localStorage.getItem("cubesolve_history");
      if (localHistory) {
        const parsed = JSON.parse(localHistory);
        set({ history: parsed });
        // Recalculate stats
        const total = parsed.length;
        const avg =
          total > 0
            ? parsed.reduce((sum: number, r: any) => sum + r.move_count, 0) /
              total
            : 0;
        const best =
          total > 0 ? Math.min(...parsed.map((r: any) => r.move_count)) : null;
        set({
          stats: {
            total_solves: total,
            avg_move_count: Math.round(avg * 10) / 10,
            best_move_count: best,
          },
        });
      }
    }
  },

  saveSolve: async () => {
    const { user, scramble, solution } = get();
    if (!scramble || solution.length === 0) return;

    const newRecord: SolveRecord = {
      scramble_notation: scramble,
      solution_notation: solution.join(" "),
      move_count: solution.length,
      completed: true,
    };

    if (user && isSupabaseConfigured && supabase) {
      try {
        const record = {
          ...newRecord,
          user_id: user.id,
          solver_used: "two-phase",
        };
        const { error } = await supabase.from("solves").insert([record]);
        if (error) throw error;

        // stats are typically updated via trigger or custom function, but we can reload
        await get().loadHistoryAndStats();
      } catch (err) {
        console.error("Failed to save solve to Supabase:", err);
      }
    } else {
      // Guest save to local storage
      const localHistory = localStorage.getItem("cubesolve_history");
      const list = localHistory ? JSON.parse(localHistory) : [];
      newRecord.created_at = new Date().toISOString();
      list.unshift(newRecord);
      localStorage.setItem("cubesolve_history", JSON.stringify(list));
      await get().loadHistoryAndStats();
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    set({
      user: null,
      history: [],
      stats: { total_solves: 0, avg_move_count: 0, best_move_count: null },
    });
  },
}));
