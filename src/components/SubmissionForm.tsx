'use client';

import React, { useState } from 'react';
import { Send, Lock, Paperclip, AlertCircle, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import SuccessScreen from './SuccessScreen';
import { fetchApi } from '@/lib/api';

const TYPES = ['Suggestion', 'Complaint', 'Feedback', 'Concern'];
const CATEGORIES = [
  'Academic',
  'Faculty',
  'Infrastructure',
  'Hostel',
  'Canteen',
  'Transportation',
  'Examination',
  'Library',
  'Student Services',
  'Other'
];
const PRIORITIES = [
  { level: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { level: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-300' },
  { level: 'High', color: 'bg-amber-50 text-amber-700 border-amber-300' }
];

export default function SubmissionForm() {
  const [formData, setFormData] = useState({
    type: 'Complaint',
    category: 'Infrastructure',
    priority: 'Medium',
    title: '',
    description: '',
    attachment: ''
  });

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFormData(prev => ({ ...prev, attachment: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a short title for your submission.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please write your detailed suggestion or complaint description.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetchApi('/submissions', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (res.success && res.trackingId) {
        setSubmittedTrackingId(res.trackingId);
      } else {
        setError(res.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('Connection to server failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      type: 'Complaint',
      category: 'Infrastructure',
      priority: 'Medium',
      title: '',
      description: '',
      attachment: ''
    });
    setFileName('');
    setSubmittedTrackingId(null);
    setError('');
  };

  if (submittedTrackingId) {
    return <SuccessScreen trackingId={submittedTrackingId} onReset={handleReset} />;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl max-w-3xl mx-auto my-8">
      
      {/* Header */}
      <div className="mb-8 border-b border-slate-100 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Encrypted Anonymous Portal
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit Anonymous Feedback
        </h2>
        <p className="text-slate-600 text-sm">
          Please fill out the details below. No personal info or login required.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Submission Type & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Submission Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p.level;
              return (
                <button
                  type="button"
                  key={p.level}
                  onClick={() => setFormData({ ...formData, priority: p.level })}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border text-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.level} Priority
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Title / Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Request for study pods in main library"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Describe your suggestion, complaint or concern in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Optional Attachment Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Optional Attachment
          </label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all">
              <Paperclip className="w-4 h-4 text-indigo-600" />
              <span>{fileName ? 'Change File' : 'Upload Image or Document'}</span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx" />
            </label>
            {fileName && (
              <span className="text-xs text-indigo-600 font-medium truncate max-w-xs">
                📄 {fileName}
              </span>
            )}
          </div>
        </div>

        {/* Anonymous Confirmation Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
          <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-indigo-950 block mb-0.5">Anonymous Confirmation Guarantee</span>
            Your submission will be processed without publicly displaying or storing your identity.
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Anonymous Submission...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Anonymously
            </>
          )}
        </button>

      </form>
    </div>
  );
}
