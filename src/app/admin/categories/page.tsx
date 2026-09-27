'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tags, Plus, Trash2, Check, X } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { fetchApi } from '@/lib/api';

export default function CategoryManagementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '', color: '#4f46e5' });

  const loadData = async () => {
    try {
      const res = await fetchApi('/categories');
      if (res.success) setCategories(res.data || []);
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
    if (!newCat.name.trim()) return;

    try {
      const res = await fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify(newCat)
      });
      if (res.success) {
        setNewCat({ name: '', description: '', color: '#4f46e5' });
        setShowAddForm(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetchApi(`/categories/${id}`, { method: 'DELETE' });
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
                Category Management
              </h1>
              <p className="text-xs text-slate-500">
                Configure submission categories available for student feedback selection
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {/* Add Category Form */}
          {showAddForm && (
            <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-md space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-900">Add New Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sports Facilities"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Color</label>
                  <input
                    type="color"
                    value={newCat.color}
                    onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer p-1"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Category description"
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
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
                  Save Category
                </button>
              </div>
            </form>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id || cat._id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: cat.color || '#4f46e5' }}
                  >
                    <Tags className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description || 'Active domain'}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id || cat._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
