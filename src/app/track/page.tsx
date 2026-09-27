'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ShieldCheck, CheckCircle2, Clock, FileText, MessageSquare, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

function TrackContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inputTrackingId, setInputTrackingId] = useState(queryId);
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (idToSearch?: string) => {
    const targetId = (idToSearch || inputTrackingId).trim();
    if (!targetId) {
      setError('Please enter a valid Tracking ID.');
      return;
    }

    setLoading(true);
    setError('');
    setSubmission(null);

    try {
      const res = await fetchApi(`/submissions/track/${encodeURIComponent(targetId)}`);
      if (res.success && res.data) {
        setSubmission(res.data);
      } else {
        setError(res.message || 'No submission found with this Tracking ID.');
      }
    } catch (err) {
      setError('Failed to reach server. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      handleTrack(queryId);
    }
  }, [queryId]);

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            Public Anonymous Lookup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Submission Status
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Enter your unique Tracking ID (e.g., ASP-2026-8F42K) to check real-time resolution progress and administrator responses.
          </p>
        </div>

        {/* Input Bar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. ASP-2026-8F42K)"
                value={inputTrackingId}
                onChange={(e) => setInputTrackingId(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Check Status'
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Submission Details & Timeline Display */}
        {submission && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-300">
            
            {/* Meta Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider">
                  {submission.trackingId}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {submission.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {submission.type}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {submission.category}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resolution Timeline Progress
              </h3>

              <div className="grid grid-cols-5 gap-2 relative">
                {STATUS_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(submission.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110'
                            : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:block ${
                          isCurrent ? 'text-indigo-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content & History Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              
              {/* Description */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Submission Description
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {submission.description}
                </p>
                <div className="pt-2 text-[11px] text-slate-400">
                  Submitted on: {new Date(submission.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                </div>
              </div>

              {/* Admin Official Response */}
              <div className="space-y-3 bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Institutional Admin Response
                </div>
                {submission.adminResponse ? (
                  <p className="text-sm text-indigo-950 leading-relaxed bg-white p-4 rounded-xl border border-indigo-100 shadow-sm font-medium">
                    "{submission.adminResponse}"
                  </p>
                ) : (
                  <div className="text-xs text-indigo-700 italic bg-white/70 p-4 rounded-xl border border-indigo-100">
                    No administrator response published yet. Check back soon for official updates.
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Tracking Portal...</div>}>
      <TrackContent />
    </Suspense>
  );
}
