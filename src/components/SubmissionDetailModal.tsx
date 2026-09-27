'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Building2, 
  MessageSquare, 
  ShieldAlert, 
  Check, 
  Loader2,
  Paperclip,
  Tag
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface SubmissionDetailModalProps {
  submission: any;
  departments: Array<{ name: string }>;
  onClose: () => void;
  onUpdate: () => void;
}

export default function SubmissionDetailModal({
  submission,
  departments,
  onClose,
  onUpdate
}: SubmissionDetailModalProps) {
  const [status, setStatus] = useState(submission.status || 'Pending');
  const [department, setDepartment] = useState(submission.department || 'General Administration');
  const [priority, setPriority] = useState(submission.priority || 'Medium');
  const [adminResponse, setAdminResponse] = useState(submission.adminResponse || '');
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetchApi(`/submissions/${submission._id || submission.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          department,
          priority,
          adminResponse,
          statusNote
        })
      });

      if (res.success) {
        setSuccessMsg('Submission updated successfully!');
        onUpdate();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Negative': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-indigo-400">
                {submission.trackingId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getSentimentBadge(submission.sentiment)}`}>
                Sentiment: {submission.sentiment || 'Neutral'}
              </span>
            </div>
            <h3 className="text-xl font-bold">{submission.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Key Details Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Type</span>
              <span className="font-bold text-slate-800">{submission.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Category</span>
              <span className="font-bold text-slate-800">{submission.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Submitted Date</span>
              <span className="font-bold text-slate-800">{new Date(submission.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Current Status</span>
              <span className="font-bold text-indigo-600">{submission.status}</span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Student Description
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {submission.description}
            </div>
            {submission.attachment && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-indigo-600">
                <Paperclip className="w-3.5 h-3.5" />
                Attachment: {submission.attachment}
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status History Timeline
            </h4>
            <div className="space-y-3 pl-2 border-l-2 border-indigo-200">
              {submission.statusHistory?.map((hist: any, idx: number) => (
                <div key={idx} className="relative pl-4 space-y-0.5">
                  <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>{hist.status}</span>
                    <span className="text-slate-400 font-mono font-normal">
                      {new Date(hist.date).toLocaleString()}
                    </span>
                  </div>
                  {hist.note && (
                    <p className="text-xs text-slate-500">{hist.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Admin Management Controls Form */}
          <form onSubmit={handleSave} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Administrator Management Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Admin Official Response Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Write Official Response (Visible to Student on Tracking)
              </label>
              <textarea
                rows={3}
                placeholder="Write resolution details or update response for student..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Save Updates & Send Response
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
