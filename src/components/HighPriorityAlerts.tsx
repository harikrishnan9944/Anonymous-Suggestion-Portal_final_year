'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Eye, Clock } from 'lucide-react';

interface HighPriorityAlertsProps {
  alerts: any[];
  onViewItem?: (item: any) => void;
}

export default function HighPriorityAlerts({ alerts, onViewItem }: HighPriorityAlertsProps) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-red-950/90 text-white rounded-2xl p-6 border border-red-800/80 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">High Priority & Safety Alerts</h3>
            <p className="text-xs text-red-300">
              {alerts.length} critical submission(s) require immediate campus attention
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase">
          Action Needed
        </span>
      </div>

      <div className="space-y-2">
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert._id || alert.id}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-red-400">{alert.trackingId}</span>
                <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-200 text-[10px] font-bold border border-red-700/50">
                  {alert.category}
                </span>
                <span className="text-slate-400 text-[10px]">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="font-bold text-white text-sm line-clamp-1">{alert.title}</p>
            </div>

            {onViewItem && (
              <button
                onClick={() => onViewItem(alert)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
