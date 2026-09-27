'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Trash2, Edit2, Check, X, ShieldCheck } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { fetchApi } from '@/lib/api';

export default function DepartmentManagementPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '', headName: '' });

  const loadData = async () => {
    try {
      const res = await fetchApi('/departments');
      if (res.success) setDepartments(res.data || []);
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) return;

    try {
      const res = await fetchApi('/departments', {
        method: 'POST',
        body: JSON.stringify(newDept)
      });
      if (res.success) {
        setNewDept({ name: '', description: '', headName: '' });
        setShowAddForm(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetchApi(`/departments/${id}`, { method: 'DELETE' });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Department Management
              </h1>
              <p className="text-xs text-slate-500">
                Organize institutional administrative units and assign suggestion routing heads
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>

          {/* Add Department Form */}
          {showAddForm && (
            <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-md space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900">Add New Campus Department</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Examination Cell"
                    value={newDept.name}
                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department Head Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Smith"
                    value={newDept.headName}
                    onChange={(e) => setNewDept({ ...newDept, headName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Brief scope of responsibility"
                    value={newDept.description}
                    onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          )}

          {/* Department Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id || dept._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleDelete(dept.id || dept._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{dept.description || 'No description provided.'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Head: {dept.headName || 'Not Assigned'}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
