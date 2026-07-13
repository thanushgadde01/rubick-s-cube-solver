import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCubeStore } from "../store/cubeStore";
import { supabase, isSupabaseConfigured } from "../store/supabaseClient";
import { ShieldAlert, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useCubeStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg("Auth is unavailable: Supabase keys are not configured.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          alert(
            "Sign up successful! Please check your email for confirmation.",
          );
          navigate("/");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          navigate("/");
        }
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setErrorMsg(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to workspace
      </button>

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {isSignUp ? "Create your Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isSignUp
              ? "Unlock solving history, detailed stats, and cross-device sync."
              : "Sign in to sync your solver history."}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 text-amber-400 flex items-start gap-3 text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Local Demo Mode Only</p>
              <p>
                Supabase credentials are not configured in your environment. You
                can still use all core cube solving capabilities, and history
                will be saved locally in this browser.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-3.5 text-slate-500"
              />
              <input
                type="email"
                required
                disabled={!isSupabaseConfigured}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-3.5 text-slate-500"
              />
              <input
                type="password"
                required
                disabled={!isSupabaseConfigured}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs mt-2 text-center font-medium">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50 shadow-lg shadow-indigo-950/20 transition-all mt-6"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-indigo-400 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
