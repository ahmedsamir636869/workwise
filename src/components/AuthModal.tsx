"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#0A111F] rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-white tracking-tight font-serif mb-2">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h3>
            <p className="text-sm text-[#94A3B8]">
              {mode === "login"
                ? "Sign in to access your jobs and saved listings"
                : "Join thousands of job seekers and top employers"}
            </p>
          </div>

          {/* Success Message */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                ✓
              </div>
              <h4 className="text-lg font-bold text-white">
                {mode === "login" ? "Logged in successfully!" : "Account created!"}
              </h4>
              <p className="text-xs text-[#94A3B8]">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mariam Ahmed"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141E33] border border-white/10 text-white text-sm placeholder-slate-500 focus:bg-[#1A2742] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141E33] border border-white/10 text-white text-sm placeholder-slate-500 focus:bg-[#1A2742] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141E33] border border-white/10 text-white text-sm placeholder-slate-500 focus:bg-[#1A2742] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0958A7] hover:bg-[#074787] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0A111F] px-3 text-xs text-slate-400 uppercase font-bold absolute">
                  or
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#94A3B8]">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="font-bold text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    {mode === "login" ? "Sign up now" : "Log in"}
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
