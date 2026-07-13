import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCubeStore } from "../store/cubeStore";
import { HelpCircle, History, User, LogOut, LayoutGrid } from "lucide-react";

type NavbarProps = {
  onOpenHelp: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onOpenHelp }) => {
  const { user, signOut } = useCubeStore();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
            >
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                CubeSolve
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Workspace</span>
            </Link>

            <Link
              to="/history"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <History size={16} />
              <span className="hidden sm:inline">History</span>
            </Link>

            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Help</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-800" />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-slate-400">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-1.5 text-sm font-semibold text-white hover:from-indigo-400 hover:to-cyan-400 shadow-md shadow-indigo-950/20 transition-all"
              >
                <User size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
