'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Search, ShieldCheck, Lock, Sparkles, MessageSquareHeart, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              100% Anonymous & Secure Campus Feedback
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Your Voice. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-400 bg-clip-text text-transparent">
                Your Privacy.
              </span> <br className="hidden sm:inline" />
              Your Campus.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Share suggestions, concerns and complaints safely and anonymously. Help us build a better educational environment.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-4 h-4" />
                Submit Anonymous Feedback
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-base transition-all hover:border-slate-600"
              >
                <Search className="w-4 h-4 text-indigo-400" />
                Track Submission
              </Link>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Login Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Unique Tracking ID</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Direct Admin Response</span>
              </div>
            </div>

          </div>

          {/* Right Column Visual Illustration Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Graphic Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <MessageSquareHeart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Real-time Student Voice</h3>
                    <p className="text-slate-400 text-xs">Direct to Department Heads</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                  Active System
                </span>
              </div>

              {/* Sample Card Item 1 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-400 font-semibold">ASP-2026-8F42K</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-medium">
                    In Progress
                  </span>
                </div>
                <h4 className="text-white text-sm font-medium">Canteen Food Quality Inspection</h4>
                <p className="text-slate-400 text-xs line-clamp-2">
                  "Health committee initiated immediate audit following student concern..."
                </p>
              </div>

              {/* Sample Card Item 2 */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-400 font-semibold">ASP-2026-7P20Q</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-medium">
                    Under Review
                  </span>
                </div>
                <h4 className="text-white text-sm font-medium">Library Study Spaces & Outlets</h4>
                <p className="text-slate-400 text-xs line-clamp-2">
                  "Evaluating proposal for 24 extra study pods on 2nd floor..."
                </p>
              </div>

              <div className="text-center pt-1">
                <span className="text-slate-400 text-xs flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Your privacy is 100% protected by institutional policy.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
