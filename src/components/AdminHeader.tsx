'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, AlertTriangle, UserCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AdminHeader({ onSearch }: { onSearch?: (query: string) => void }) {
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('asp_admin_user');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {}
    }

    // Fetch high priority count for alert bell
    fetchApi('/analytics/high-priority')
      .then(res => {
        if (res.success && res.count !== undefined) {
          setHighPriorityCount(res.count);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Search Input */}
      <div className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Tracking ID, keywords..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        
        {/* High Priority Alerts Button */}
        <Link
          href="/admin/duplicates"
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="High Priority Alerts"
        >
          <Bell className="w-4 h-4" />
          {highPriorityCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {highPriorityCount}
            </span>
          )}
        </Link>

        {/* View Public Portal Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Student Portal
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-900 text-indigo-200 font-bold text-xs flex items-center justify-center border border-indigo-700">
            {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 block">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {adminUser?.email || 'admin@college.edu'}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}
