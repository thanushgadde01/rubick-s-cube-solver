import React, { useState, useEffect } from "react";
import { useCubeStore } from "../store/cubeStore";
import Navbar from "../components/Navbar";
import CubeScene from "../components/CubeScene";
import CubeCustomizer from "../components/CubeCustomizer";
import TutorialOverlay from "../components/TutorialOverlay";
import { AnimatePresence, motion } from "motion/react";
import {
  Shuffle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Eye,
  Palette,
  AlertCircle,
} from "lucide-react";

const HomePage: React.FC = () => {
  const {
    cubeState,
    scramble,
    solution,
    currentMoveIndex,
    isSolving,
    isPlaying,
    playbackSpeed,
    generateRandomScramble,
    computeSolution,
    nextMove,
    prevMove,
    setMoveIndex,
    setIsPlaying,
    setPlaybackSpeed,
    resetCube,
    applyManualMove,
    solveError,
    clearSolveError,
  } = useCubeStore();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Initialize first visit tutorial
  useEffect(() => {
    const hasVisited = localStorage.getItem("cubesolve_visited");
    if (!hasVisited) {
      setIsHelpOpen(true);
      localStorage.setItem("cubesolve_visited", "true");
    }
  }, []);

  // Manage auto-playback timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPlaying && currentMoveIndex < solution.length) {
      intervalId = setInterval(() => {
        nextMove();
      }, playbackSpeed);
    } else if (isPlaying && currentMoveIndex >= solution.length) {
      setIsPlaying(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isPlaying,
    currentMoveIndex,
    solution,
    playbackSpeed,
    nextMove,
    setIsPlaying,
  ]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const shift = e.shiftKey;

      // Manual turn keys
      if (["u", "d", "r", "l", "f", "b"].includes(key)) {
        e.preventDefault();
        const face = key.toUpperCase();
        const move = shift ? `${face}'` : face;
        applyManualMove(move);
        triggerNotification(`Manual turn: ${move}`);
      }

      // Playback shortcuts
      if (e.key === " ") {
        e.preventDefault();
        if (solution.length > 0) {
          setIsPlaying(!isPlaying);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMove();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMove();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, solution, applyManualMove, prevMove, nextMove, setIsPlaying]);

  const [notificationText, setNotificationText] = useState("");
  const triggerNotification = (text: string) => {
    setNotificationText(text);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      const t = setTimeout(() => setShowNotification(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showNotification]);

  // Is the cube currently fully solved?
  // standard solved string: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
  const isCurrentlySolved =
    cubeState === "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

  const isPlaythroughComplete =
    solution.length > 0 && currentMoveIndex === solution.length;

  const handleScramble = () => {
    generateRandomScramble();
    triggerNotification("Cube Scrambled!");
  };

  const handleReset = () => {
    resetCube();
    triggerNotification("Workspace Reset!");
  };

  const manualMovesList = [
    "U",
    "U'",
    "D",
    "D'",
    "R",
    "R'",
    "L",
    "L'",
    "F",
    "F'",
    "B",
    "B'",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <TutorialOverlay
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Floating Key Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/90 border border-slate-800 px-4 py-2 text-xs font-medium text-indigo-400 shadow-xl backdrop-blur-md"
          >
            {notificationText}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Workspace Column: 3D Scene or Paint Editor */}
        <section className="lg:col-span-7 flex flex-col rounded-3xl border border-slate-800 bg-slate-900/10 shadow-2xl overflow-hidden min-h-[450px] lg:min-h-0 relative">
          {/* Card Header Tab Switcher */}
          <div className="border-b border-slate-800 bg-slate-950/40 p-4 flex items-center justify-between gap-4 backdrop-blur-sm z-10">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              {isCustomizing ? (
                <Palette size={13} className="text-indigo-400" />
              ) : (
                <Eye size={13} className="text-indigo-400" />
              )}
              {isCustomizing ? "Paint Color Editor" : "Interactive 3D View"}
            </span>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => {
                  setIsCustomizing(false);
                  clearSolveError();
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isCustomizing
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eye size={11} />
                3D View
              </button>
              <button
                onClick={() => {
                  setIsCustomizing(true);
                  clearSolveError();
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isCustomizing
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Palette size={11} />
                Paint Editor
              </button>
            </div>
          </div>

          {isCustomizing ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <CubeCustomizer />
            </div>
          ) : (
            <>
              <div className="absolute top-18 left-4 z-10 flex gap-2">
                <span className="rounded-full bg-slate-950/80 border border-slate-800 px-3 py-1 text-xs text-slate-400 flex items-center gap-1.5 backdrop-blur-md">
                  <Eye size={12} />
                  Drag to rotate camera
                </span>
              </div>

              <div className="flex-1 w-full h-full min-h-[320px] md:min-h-[400px]">
                <CubeScene cubeState={cubeState} />
              </div>

              {/* Quick Manual Rotations Drawer */}
              <div className="border-t border-slate-800/60 bg-slate-950/40 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center sm:text-left">
                  Manual Face Rotations
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {manualMovesList.map((m) => (
                    <button
                      key={m}
                      onClick={() => applyManualMove(m)}
                      className="rounded-xl border border-slate-800 bg-slate-900/30 py-2 text-xs font-semibold hover:border-indigo-500/50 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-300 transition-all font-mono cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Workspace Controls Section */}
        <section className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Main Scramble / Solve Actions Container */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/25 p-6 flex flex-col gap-6 backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Cube Solve Control Center
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Scramble your virtual Rubik&apos;s cube then solve it with
                optimal moves.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleScramble}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 py-3.5 text-sm font-semibold text-white shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Shuffle size={16} className="text-indigo-400" />
                Scramble
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 py-3.5 text-sm font-semibold text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw size={16} />
                Reset solved
              </button>
            </div>

            {/* Error Display Card */}
            {solveError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-rose-900/40 bg-rose-950/15 p-4 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle
                    size={16}
                    className="text-rose-400 shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Unsolvable Configuration
                    </h4>
                    <p className="text-xs text-rose-300/90 leading-relaxed mt-1">
                      {solveError}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsCustomizing(true);
                      clearSolveError();
                    }}
                    className="rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 transition-all cursor-pointer"
                  >
                    Adjust Painted Colors
                  </button>
                  <button
                    onClick={clearSolveError}
                    className="rounded-xl hover:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}

            {/* Scramble Display Card */}
            {scramble && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-indigo-900/30 bg-indigo-950/10 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Current Scramble
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {scramble.split(" ").filter(Boolean).length} moves
                  </span>
                </div>
                <p className="text-sm font-mono text-slate-300 leading-relaxed tracking-wide select-all">
                  {scramble}
                </p>
              </motion.div>
            )}

            {/* Solve Trigger */}
            {!isCurrentlySolved && solution.length === 0 && (
              <button
                onClick={computeSolution}
                disabled={isSolving}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-4 text-sm font-bold text-white hover:from-indigo-400 hover:to-cyan-400 disabled:opacity-50 shadow-lg shadow-indigo-950/20 transition-all active:scale-[0.99] cursor-pointer"
              >
                {isSolving ? (
                  <>
                    <span className="animate-spin border-2 border-white/20 border-t-white h-4 w-4 rounded-full" />
                    <span>Computing Optimal Path...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Solve Cube (Sub-Second)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Playback & Move List Container (Visible when solution computed) */}
          <AnimatePresence mode="popLayout">
            {solution.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/25 p-6 gap-6 backdrop-blur-sm"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800/50 pb-4">
                  <div>
                    <h3 className="font-bold text-white">Solution Steps</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Completed step {currentMoveIndex} of {solution.length}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                    <CheckCircle2 size={12} />
                    {solution.length} moves
                  </span>
                </div>

                {/* Move Scrubber / Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Scrambled</span>
                    <span>Solved</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={solution.length}
                    value={currentMoveIndex}
                    onChange={(e) => setMoveIndex(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Main Playback Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-slate-800/40">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={prevMove}
                      disabled={currentMoveIndex === 0}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                      title="Previous Move"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
                        isPlaying
                          ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                          : "bg-indigo-500 text-white hover:bg-indigo-400 shadow-md shadow-indigo-950/20"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={14} fill="currentColor" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={14} fill="currentColor" />
                          Auto Play
                        </>
                      )}
                    </button>

                    <button
                      onClick={nextMove}
                      disabled={currentMoveIndex === solution.length}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                      title="Next Move"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Speed selector */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <Sliders size={12} className="text-slate-500" />
                    <span className="text-slate-400">Speed:</span>
                    {[2000, 1000, 500, 250].map((speed, i) => {
                      const labels = ["0.5x", "1x", "2x", "4x"];
                      return (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-2 py-1 rounded-md font-medium transition-all ${
                            playbackSpeed === speed
                              ? "bg-slate-800 text-white border border-slate-700"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {labels[i]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Move list representation */}
                <div className="flex-1 min-h-[120px] max-h-[180px] overflow-y-auto rounded-2xl bg-slate-950/40 border border-slate-800/80 p-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {solution.map((move, idx) => {
                      const isPast = idx < currentMoveIndex;
                      const isCurrent = idx === currentMoveIndex - 1;

                      return (
                        <button
                          key={idx}
                          onClick={() => setMoveIndex(idx + 1)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            isCurrent
                              ? "bg-indigo-500 text-white scale-105 shadow-md shadow-indigo-950/40 border border-indigo-400"
                              : isPast
                                ? "bg-indigo-950/30 border border-indigo-900/30 text-indigo-400/80"
                                : "bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {move}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solved / Playthrough Celebrations */}
          <AnimatePresence>
            {isPlaythroughComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-3xl border border-emerald-900/30 bg-emerald-950/10 p-6 text-center space-y-3 backdrop-blur-sm"
              >
                <div className="inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Congratulations!
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    You have successfully solved the Rubik&apos;s cube in{" "}
                    <span className="text-emerald-400 font-bold">
                      {solution.length}
                    </span>{" "}
                    moves!
                  </p>
                </div>
                <button
                  onClick={handleScramble}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-md transition-all inline-flex items-center gap-1"
                >
                  <Shuffle size={12} />
                  Scramble Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple Guide card if no active scramble */}
          {!scramble && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/10 p-6 flex items-start gap-4 backdrop-blur-sm">
              <div className="rounded-2xl bg-slate-800/50 p-2.5 text-slate-400 shrink-0 mt-0.5">
                <HelpCircle size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-white text-sm">
                  Quick Pro-Tip
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You can use keyboard shortcuts like{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-[10px]">
                    U
                  </kbd>
                  ,{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-[10px]">
                    D
                  </kbd>
                  ,{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-[10px]">
                    R
                  </kbd>
                  , or{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-[10px]">
                    L
                  </kbd>{" "}
                  to rotate faces. Press{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-800 text-white font-mono text-[10px]">
                    Shift
                  </kbd>{" "}
                  to rotate counter-clockwise.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
