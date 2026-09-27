'use client';

import React from 'react';
import { PenTool, ShieldAlert, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Write Your Concern',
      desc: 'Select the category, specify priority, and clearly describe your suggestion or complaint.',
      icon: PenTool,
    },
    {
      num: '02',
      title: 'Submit Anonymously',
      desc: 'Send your message with a single click. Your identity is automatically stripped from the record.',
      icon: ShieldAlert,
    },
    {
      num: '03',
      title: 'Receive Tracking ID',
      desc: 'Instantly get a unique ASP tracking code (e.g., ASP-2026-8F42K) to safely save.',
      icon: KeyRound,
    },
    {
      num: '04',
      title: 'Track Resolution',
      desc: 'Check live status updates, assigned department progress, and direct administrator replies.',
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 text-base">
            From submission to resolution — transparent, fast, and completely anonymous.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-indigo-600/30 group-hover:text-indigo-600 transition-colors font-mono">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-indigo-600 group-hover:text-white text-slate-700 border border-slate-200 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.desc}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
