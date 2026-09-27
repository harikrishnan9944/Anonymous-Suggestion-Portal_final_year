'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, ChevronLeft, ChevronRight, Tag, Clock, ArrowUpDown } from 'lucide-react';
import SubmissionDetailModal from './SubmissionDetailModal';

interface SubmissionTableProps {
  submissions: any[];
  departments: any[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

export default function SubmissionTable({
  submissions,
  departments,
  onRefresh,
  onDelete
}: SubmissionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalItem, setActiveModalItem] = useState<any>(null);

  const itemsPerPage = 8;

  // Filter Submissions
  const filtered = submissions.filter((sub) => {
    const matchesSearch =
      !searchTerm ||
      sub.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = !selectedCategory || sub.category === selectedCategory;
    const matchesStatus = !selectedStatus || sub.status === selectedStatus;
    const matchesPriority = !selectedPriority || sub.priority === selectedPriority;

    return matchesSearch && matchesCat && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'In Progress':
      case 'Under Review':
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
      
      {/* Table Filters Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
          >
            <option value="">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Faculty">Faculty</option>
            <option value="Hostel">Hostel</option>
            <option value="Canteen">Canteen</option>
            <option value="Transportation">Transportation</option>
            <option value="Library">Library</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => { setSelectedPriority(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-6">Tracking ID</th>
              <th className="py-3.5 px-4">Title & Description</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No submissions found matching filters.
                </td>
              </tr>
            ) : (
              paginated.map((sub) => (
                <tr key={sub._id || sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                    {sub.trackingId}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <span className="font-bold text-slate-900 block truncate">{sub.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{sub.description}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {sub.category}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getPriorityBadge(sub.priority)}`}>
                      {sub.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setActiveModalItem(sub)}
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="View & Update Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(sub._id || sub.id)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Delete Submission"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing Page {currentPage} of {totalPages} ({filtered.length} Total Records)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <SubmissionDetailModal
          submission={activeModalItem}
          departments={departments}
          onClose={() => setActiveModalItem(null)}
          onUpdate={() => {
            onRefresh();
            setActiveModalItem(null);
          }}
        />
      )}

    </div>
  );
}
