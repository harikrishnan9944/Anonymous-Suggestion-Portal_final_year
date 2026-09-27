'use client';

import React from 'react';
import { UserX, ShieldCheck, SearchCheck, Lock, EyeOff } from 'lucide-react';

export default function PrivacySection() {
  const cards = [
    {
      icon: UserX,
      title: 'Anonymous Submission',
      description: 'Your personal identity is not displayed or recorded with your submission. Express your true feedback with full confidence.',
      badge: 'Zero Identity Disclosure',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Processing',
      description: 'Submissions are securely stored and handled exclusively by authorized department administrators and decision makers.',
      badge: 'Encrypted & Controlled',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: SearchCheck,
      title: 'Transparent Tracking',
      description: 'Track the progress of your submission anytime using your unique tracking ID without logging into any personal account.',
      badge: 'Public Progress Timeline',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            Built On Complete Confidentiality
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Identity Stays Private
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            We believe that honest feedback builds a stronger educational institution. Here is how we guarantee your privacy at every step.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      0{idx + 1} Pillar
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {card.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Visual Assurance Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Privacy Commitment Guarantee</h4>
              <p className="text-xs text-slate-500 max-w-xl">
                No IP logs, student registration numbers, or personal emails are required or attached to suggestion records.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              Institutional Privacy Standard Compliant
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
