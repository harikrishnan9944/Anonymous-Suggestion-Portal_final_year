'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import KPICard from '@/components/KPICard';
import { fetchApi } from '@/lib/api';

export default function AnalyticsPage() {
  const router = useRouter();
  const [chartsData, setChartsData] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, highPriority: 0 });

  useEffect(() => {
    const token = localStorage.getItem('asp_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      fetchApi('/analytics/charts'),
      fetchApi('/analytics/overview')
    ]).then(([cRes, oRes]) => {
      if (cRes.success) setChartsData(cRes.charts);
      if (oRes.success) setStats(oRes.stats);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />
        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Institutional Analytics & Insights
            </h1>
            <p className="text-xs text-slate-500">
              Interactive visualizations of submission volume, category distribution, resolution speed, and priority trends
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard title="Total" count={stats.total} type="total" />
            <KPICard title="Pending" count={stats.pending} type="pending" />
            <KPICard title="In Progress" count={stats.inProgress} type="inProgress" />
            <KPICard title="Resolved" count={stats.resolved} type="resolved" />
            <KPICard title="High Priority" count={stats.highPriority} type="highPriority" />
          </div>

          {chartsData && <AnalyticsCharts data={chartsData} />}
        </main>
      </div>
    </div>
  );
}
