'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import KPICard from '@/components/KPICard';
import HighPriorityAlerts from '@/components/HighPriorityAlerts';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import DuplicateDetector from '@/components/DuplicateDetector';
import SubmissionTable from '@/components/SubmissionTable';
import { fetchApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0
  });

  const [chartsData, setChartsData] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [highPriorityAlerts, setHighPriorityAlerts] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewRes, chartsRes, subsRes, deptsRes, alertsRes, dupesRes] = await Promise.all([
        fetchApi('/analytics/overview'),
        fetchApi('/analytics/charts'),
        fetchApi('/submissions?limit=50'),
        fetchApi('/departments'),
        fetchApi('/analytics/high-priority'),
        fetchApi('/analytics/duplicates')
      ]);

      if (overviewRes.success) setStats(overviewRes.stats);
      if (chartsRes.success) setChartsData(chartsRes.charts);
      if (subsRes.success) setSubmissions(subsRes.data || []);
      if (deptsRes.success) setDepartments(deptsRes.data || []);
      if (alertsRes.success) setHighPriorityAlerts(alertsRes.alerts || []);
      if (dupesRes.success) setClusters(dupesRes.clusters || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('asp_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, []);

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission record?')) return;
    try {
      const res = await fetchApi(`/submissions/${id}`, { method: 'DELETE' });
      if (res.success) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />

        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-500">
                Institutional feedback statistics & real-time complaint resolution activity
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Section 11: Statistics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard title="Total Submissions" count={stats.total} type="total" trendText="+12% this mo" />
            <KPICard title="Pending Review" count={stats.pending} type="pending" trendText="Requires Action" />
            <KPICard title="In Progress" count={stats.inProgress} type="inProgress" trendText="Assigned" />
            <KPICard title="Resolved" count={stats.resolved} type="resolved" trendText="Completed" />
            <KPICard title="High Priority" count={stats.highPriority} type="highPriority" trendText="Urgent" />
          </div>

          {/* Section 18: High Priority Alerts Banner */}
          {highPriorityAlerts.length > 0 && (
            <HighPriorityAlerts alerts={highPriorityAlerts} />
          )}

          {/* Section 16: Common Issue & Duplicate Detector */}
          <DuplicateDetector clusters={clusters} />

          {/* Section 12: Analytics Charts */}
          {chartsData && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Analytics Summary</h2>
              <AnalyticsCharts data={chartsData} />
            </div>
          )}

          {/* Section 13: Submissions Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Submissions</h2>
            </div>
            <SubmissionTable
              submissions={submissions}
              departments={departments}
              onRefresh={loadData}
              onDelete={handleDeleteSubmission}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
