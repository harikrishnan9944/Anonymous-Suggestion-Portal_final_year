'use client';

import React from 'react';
import { Layers, AlertTriangle, ArrowRight, Tag, Eye } from 'lucide-react';

interface DuplicateCluster {
  issueTitle: string;
  category: string;
  count: number;
  sampleTrackingIds: string[];
  highestPriority: string;
}

export default function DuplicateDetector({ clusters, onViewCluster }: { clusters: DuplicateCluster[]; onViewCluster?: (title: string) => void }) {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <Layers className="w-8 h-8 text-slate-400 mx-auto" />
        <h4 className="text-base font-bold text-slate-900">No Common Issue Clusters Detected</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The similarity engine has not found any duplicate or repeating student complaints at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Common Issues Detected</h3>
            <p className="text-xs text-slate-500">Automated NLP text similarity & category clustering</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          {clusters.length} Possible Common Issues
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                <Tag className="w-3 h-3" />
                {item.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-xs">
                {item.count} Related Submissions
              </span>
            </div>

            <div>
              <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">
                Possible Common Issue
              </span>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                {item.issueTitle}
              </h4>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">IDs: {item.sampleTrackingIds.join(', ')}</span>
              {onViewCluster && (
                <button
                  onClick={() => onViewCluster(item.issueTitle)}
                  className="flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View All
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
