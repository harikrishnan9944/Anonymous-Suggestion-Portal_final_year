'use client';

import React from 'react';
import { Inbox, Clock, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface KPICardProps {
  title: string;
  count: number;
  type: 'total' | 'pending' | 'inProgress' | 'resolved' | 'highPriority';
  trendText?: string;
}

export default function KPICard({ title, count, type, trendText }: KPICardProps) {
  const configs = {
    total: {
      icon: Inbox,
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    pending: {
      icon: Clock,
      bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    inProgress: {
      icon: RefreshCw,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    resolved: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    highPriority: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50 text-red-600 border-red-200',
      badgeColor: 'bg-red-100 text-red-800'
    }
  };

  const config = configs[type] || configs.total;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${config.bgColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
          {count}
        </span>
        {trendText && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.badgeColor}`}>
            <TrendingUp className="w-3 h-3" />
            {trendText}
          </span>
        )}
      </div>
    </div>
  );
}
