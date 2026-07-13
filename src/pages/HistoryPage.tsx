import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCubeStore } from "../store/cubeStore";
import Navbar from "../components/Navbar";
import TutorialOverlay from "../components/TutorialOverlay";
import { Trophy, Clock, Hash, Play, Trash2 } from "lucide-react";
import Cube from "cubejs";

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, stats, loadHistoryAndStats, setScramble } = useCubeStore();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    loadHistoryAndStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplay = (scramble: string, solutionStr: string) => {
    // Determine the state from scramble
    const cube = new Cube();
    cube.move(scramble);
    const state = cube.asString();

    setScramble(scramble, state);
    useCubeStore.setState({
      solution: solutionStr.split(" ").filter(Boolean),
      currentMoveIndex: 0,
      scrambledState: state,
    });
    navigate("/");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local history?")) {
      localStorage.removeItem("cubesolve_history");
      loadHistoryAndStats();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <TutorialOverlay
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Solve History & Stats
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review your stats and replay past solves.
            </p>
          </div>
          {history.length > 0 && !useCubeStore.getState().user && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 rounded-2xl border border-red-900/50 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-all"
            >
              <Trash2 size={14} />
              Clear Local History
            </button>
          )}
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
              <Hash size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Solves
              </p>
              <h2 className="text-2xl font-bold mt-0.5 text-white">
                {stats.total_solves}
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avg Solution Length
              </p>
              <h2 className="text-2xl font-bold mt-0.5 text-white">
                {stats.avg_move_count}{" "}
                <span className="text-sm font-normal text-slate-500">
                  moves
                </span>
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 flex items-center gap-4">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Best Solve
              </p>
              <h2 className="text-2xl font-bold mt-0.5 text-white">
                {stats.best_move_count
                  ? `${stats.best_move_count} moves`
                  : "--"}
              </h2>
            </div>
          </div>
        </section>

        {/* History List */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/20 p-6">
          <h2 className="text-lg font-bold mb-4">Past Sessions</h2>
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No solves recorded yet.</p>
              <p className="text-xs mt-1">
                Start by scrambling and solving a cube in the workspace!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {record.move_count} moves
                      </span>
                      {record.created_at && (
                        <span className="text-[11px] text-slate-500">
                          {new Date(record.created_at).toLocaleDateString()} at{" "}
                          {new Date(record.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-400 truncate max-w-md">
                      <span className="text-slate-600 font-sans font-semibold mr-1">
                        Scramble:
                      </span>
                      {record.scramble_notation}
                    </p>
                    <p className="text-xs font-mono text-indigo-300 truncate max-w-md">
                      <span className="text-slate-600 font-sans font-semibold mr-1">
                        Solution:
                      </span>
                      {record.solution_notation}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleReplay(
                        record.scramble_notation,
                        record.solution_notation,
                      )
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all self-start md:self-auto"
                  >
                    <Play size={12} fill="currentColor" />
                    Replay Solve
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HistoryPage;
