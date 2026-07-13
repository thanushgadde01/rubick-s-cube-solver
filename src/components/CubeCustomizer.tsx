import React, { useState } from "react";
import { useCubeStore } from "../store/cubeStore";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Palette,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface FaceMeta {
  key: string;
  name: string;
  colorName: string;
  defaultColor: string;
  indices: number[];
}

const FACES: FaceMeta[] = [
  {
    key: "U",
    name: "Up Face",
    colorName: "White",
    defaultColor: "#ffffff",
    indices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    key: "L",
    name: "Left Face",
    colorName: "Green",
    defaultColor: "#22c55e",
    indices: [36, 37, 38, 39, 40, 41, 42, 43, 44],
  },
  {
    key: "F",
    name: "Front Face",
    colorName: "Blue",
    defaultColor: "#3b82f6",
    indices: [18, 19, 20, 21, 22, 23, 24, 25, 26],
  },
  {
    key: "R",
    name: "Right Face",
    colorName: "Red",
    defaultColor: "#ef4444",
    indices: [9, 10, 11, 12, 13, 14, 15, 16, 17],
  },
  {
    key: "B",
    name: "Back Face",
    colorName: "Orange",
    defaultColor: "#f97316",
    indices: [45, 46, 47, 48, 49, 50, 51, 52, 53],
  },
  {
    key: "D",
    name: "Down Face",
    colorName: "Yellow",
    defaultColor: "#eab308",
    indices: [27, 28, 29, 30, 31, 32, 33, 34, 35],
  },
];

const COLOR_MAP: Record<string, string> = {
  U: "#ffffff", // White
  R: "#ef4444", // Red
  F: "#3b82f6", // Blue
  D: "#eab308", // Yellow
  L: "#22c55e", // Green
  B: "#f97316", // Orange
};

const COLOR_PALETTE = [
  {
    key: "U",
    name: "White",
    bgClass: "bg-white text-slate-950",
    hex: "#ffffff",
  },
  {
    key: "L",
    name: "Green",
    bgClass: "bg-green-500 text-white",
    hex: "#22c55e",
  },
  {
    key: "R",
    name: "Red",
    bgClass: "bg-red-500 text-white",
    hex: "#ef4444",
  },
  {
    key: "F",
    name: "Blue",
    bgClass: "bg-blue-500 text-white",
    hex: "#3b82f6",
  },
  {
    key: "B",
    name: "Orange",
    bgClass: "bg-orange-500 text-white",
    hex: "#f97316",
  },
  {
    key: "D",
    name: "Yellow",
    bgClass: "bg-yellow-500 text-slate-950",
    hex: "#eab308",
  },
];

const CubeCustomizer: React.FC = () => {
  const { cubeState, updateFaceletColor, resetCube } = useCubeStore();
  const [activeFaceIndex, setActiveFaceIndex] = useState(2); // Start on F Face (Blue)
  const [selectedColor, setSelectedColor] = useState("L"); // Start with Green selected (like reference image)

  const currentFace = FACES[activeFaceIndex] || FACES[0];

  // Navigate faces
  const handlePrevFace = () => {
    setActiveFaceIndex((prev) => (prev === 0 ? FACES.length - 1 : prev - 1));
  };

  const handleNextFace = () => {
    setActiveFaceIndex((prev) => (prev === FACES.length - 1 ? 0 : prev + 1));
  };

  // Get count of a specific color on the CURRENT 3x3 face
  const getFaceColorCount = (colorChar: string) => {
    let count = 0;
    currentFace.indices.forEach((idx) => {
      if (cubeState[idx] === colorChar) {
        count++;
      }
    });
    return count;
  };

  // Get total counts of each color globally on the entire cube
  const getGlobalCounts = () => {
    const counts: Record<string, number> = {
      U: 0,
      R: 0,
      F: 0,
      D: 0,
      L: 0,
      B: 0,
    };
    for (let i = 0; i < cubeState.length; i++) {
      const char = cubeState[i];
      if (counts[char] !== undefined) {
        counts[char]++;
      }
    }
    return counts;
  };

  const globalCounts = getGlobalCounts();
  const isPerfectBalance = Object.values(globalCounts).every(
    (count) => count === 9,
  );

  // Paint a specific square
  const handlePaintSquare = (faceletIndex: number) => {
    updateFaceletColor(faceletIndex, selectedColor);
  };

  // Reset current face back to its solved color state
  const handleResetCurrentFace = () => {
    currentFace.indices.forEach((idx) => {
      updateFaceletColor(idx, currentFace.key);
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Options */}
      <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-indigo-400" />
          <span className="text-sm font-bold tracking-wide text-indigo-300">
            Paint Face Colors
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCurrentFace}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
            title="Reset active face only"
          >
            <RotateCcw size={12} />
            Reset Face
          </button>
          <button
            onClick={resetCube}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400/90 hover:text-rose-300 rounded-xl bg-rose-950/20 border border-rose-900/30 hover:border-rose-900/50 transition-all active:scale-95"
            title="Reset whole cube to solved"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Face swapper and active name */}
      <div className="flex items-center justify-between bg-slate-900/35 border border-slate-800/80 rounded-2xl p-3">
        <button
          onClick={handlePrevFace}
          className="p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Active Face
          </p>
          <p className="text-sm font-extrabold text-white">
            {currentFace.name}{" "}
            <span
              className="inline-block w-2.5 h-2.5 rounded-full ml-1.5 border border-slate-700"
              style={{ backgroundColor: COLOR_MAP[currentFace.key] }}
            />
          </p>
        </div>

        <button
          onClick={handleNextFace}
          className="p-2 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-all active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 2D 3x3 Painting Grid */}
      <div className="flex-1 flex items-center justify-center py-4 bg-slate-950/20 border border-slate-900 rounded-3xl">
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-950 border border-slate-800/60 rounded-3xl shadow-inner max-w-[260px] w-full">
          {currentFace.indices.map((idx) => {
            const val = cubeState[idx] || currentFace.key;
            const hexColor = COLOR_MAP[val] || "#0f172a";
            return (
              <button
                key={idx}
                onClick={() => handlePaintSquare(idx)}
                className="aspect-square w-full rounded-2xl border-2 border-slate-950/40 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer relative group overflow-hidden"
                style={{ backgroundColor: hexColor }}
              >
                {/* Glow ring on hover */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors circular selector palette */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
          Selected Paint Brush Color
        </p>
        <div className="flex items-center justify-center gap-3">
          {COLOR_PALETTE.map((col) => {
            const isSelected = selectedColor === col.key;
            const countOnCurrentFace = getFaceColorCount(col.key);
            return (
              <button
                key={col.key}
                onClick={() => setSelectedColor(col.key)}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[10px] font-black transition-all relative cursor-pointer ${
                  col.bgClass
                } ${
                  isSelected
                    ? "ring-4 ring-offset-2 ring-indigo-500 scale-110 shadow-lg"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                }`}
                title={`${col.name} (Active counts: ${countOnCurrentFace})`}
              >
                {countOnCurrentFace}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Color Checker / Status indicator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            {isPerfectBalance ? (
              <CheckCircle size={14} className="text-emerald-500" />
            ) : (
              <AlertCircle size={14} className="text-amber-500" />
            )}
            <span>Color Counter (Needs 9 of each)</span>
          </div>
          {isPerfectBalance && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              Solvable Count Balanced!
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {COLOR_PALETTE.map((col) => {
            const count = globalCounts[col.key] || 0;
            const isCorrect = count === 9;
            return (
              <div
                key={col.key}
                className={`rounded-xl border p-2 text-center transition-all ${
                  isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                    : "border-slate-800 bg-slate-900/20 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-slate-700/50"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span className="text-[10px] font-bold font-mono">
                    {col.key}
                  </span>
                </div>
                <p className="text-xs font-bold mt-1 font-mono">{count}/9</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CubeCustomizer;
