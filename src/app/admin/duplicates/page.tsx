'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import DuplicateDetector from '@/components/DuplicateDetector';
import { fetchApi } from '@/lib/api';

export default function CommonIssuesPage() {
  const router = useRouter();
  const [clusters, setClusters] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('asp_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchApi('/analytics/duplicates')
      .then(res => {
        if (res.success) setClusters(res.clusters || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />
        <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Common Issue & Duplicate Clustering
            </h1>
            <p className="text-xs text-slate-500">
              Automated text similarity detection groups related student complaints to help solve widespread campus issues faster
            </p>
          </div>

          <DuplicateDetector clusters={clusters} />
        </main>
      </div>
    </div>
  );
}
