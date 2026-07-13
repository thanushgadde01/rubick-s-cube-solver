import React from "react";
import {
  X,
  HelpCircle,
  CornerDownRight,
  Keyboard,
  Compass,
} from "lucide-react";

type TutorialOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="text-indigo-400" size={24} />
          <h2 className="text-xl font-bold">Welcome to CubeSolve!</h2>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <p>
            CubeSolve is a state-of-the-art virtual Rubik&apos;s Cube workspace.
            You can practice, scramble, and get step-by-step optimal solutions.
          </p>

          <div className="border border-slate-800 rounded-2xl bg-slate-950/50 p-4 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Compass size={16} className="text-cyan-400" />
              Controls & Interaction
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>
                <strong>Orbit Cube</strong>: Click and drag empty space around
                the cube to rotate your view.
              </li>
              <li>
                <strong>Zoom</strong>: Use your mouse scroll wheel or pinch on
                touch screens to zoom.
              </li>
              <li>
                <strong>Scramble</strong>: Generates a random state and displays
                the official notation.
              </li>
              <li>
                <strong>Solve</strong>: Computes a near-optimal solution
                (typically 20-25 moves) in sub-seconds.
              </li>
            </ul>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-slate-950/50 p-4 space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Keyboard size={16} className="text-indigo-400" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  U
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  D
                </kbd>
                <span>Up / Down turns</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  R
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  L
                </kbd>
                <span>Right / Left turns</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  F
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  B
                </kbd>
                <span>Front / Back turns</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  Shift
                </kbd>
                <span>Counter-clockwise modifier</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 border-t border-slate-800/80 pt-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  Space
                </kbd>
                <span>Play / Pause solution</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  ←
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">
                  →
                </kbd>
                <span>Step backward / forward</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white hover:bg-indigo-400 shadow-lg shadow-indigo-950/20 transition-all"
        >
          <span>Get Started</span>
          <CornerDownRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TutorialOverlay;
