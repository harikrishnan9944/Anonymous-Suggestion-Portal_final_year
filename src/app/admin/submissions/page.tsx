'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import SubmissionTable from '@/components/SubmissionTable';
import { fetchApi } from '@/lib/api';

export default function SubmissionsManagementPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [subsRes, deptsRes] = await Promise.all([
        fetchApi('/submissions?limit=100'),
        fetchApi('/departments')
      ]);
      if (subsRes.success) setSubmissions(subsRes.data || []);
      if (deptsRes.success) setDepartments(deptsRes.data || []);
    } catch (e) {
      console.error(e);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission record?')) return;
    try {
      const res = await fetchApi(`/submissions/${id}`, { method: 'DELETE' });
      if (res.success) loadData();
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
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Submissions Management
            </h1>
            <p className="text-xs text-slate-500">
              Filter, triage, review, assign departments, and respond to anonymous student feedback
            </p>
          </div>

          <SubmissionTable
            submissions={submissions}
            departments={departments}
            onRefresh={loadData}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}
