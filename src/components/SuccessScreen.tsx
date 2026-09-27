'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy, Check, Search, PlusCircle, ShieldCheck } from 'lucide-react';

interface SuccessScreenProps {
  trackingId: string;
  onReset: () => void;
}

export default function SuccessScreen({ trackingId, onReset }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center max-w-2xl mx-auto my-8 space-y-6 animate-in fade-in zoom-in duration-300">
      
      {/* Icon Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Submission Received Successfully
        </h2>
        <p className="text-slate-600 text-sm">
          Your feedback has been securely routed to campus administrators without attached identity logs.
        </p>
      </div>

      {/* Tracking ID Box */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white space-y-3 shadow-lg">
        <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase block">
          Your Unique Tracking ID
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-indigo-400">
            {trackingId}
          </span>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Copy Tracking ID"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm text-left flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-900 mb-0.5">Important Privacy Reminder</span>
          Save this Tracking ID. You can use it later to check the status, progress timeline, and official response to your submission.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/track?id=${trackingId}`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Search className="w-4 h-4" />
          Track Submission
        </Link>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Submit Another
        </button>
      </div>

    </div>
  );
}
