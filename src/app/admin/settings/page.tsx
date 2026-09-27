'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ShieldCheck, Lock, Bell, User, Save, Check } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminSettingsPage() {
  const router = useRouter();

  const [adminProfile, setAdminProfile] = useState({
    name: 'System Administrator',
    email: 'admin@college.edu'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    highPriorityAlerts: true,
    weeklyDigest: true,
    duplicateIssuesDetected: true
  });

  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('asp_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    const userStr = localStorage.getItem('asp_admin_user');
    if (userStr) {
      try {
        setAdminProfile(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('asp_admin_user', JSON.stringify(adminProfile));
    setSavedMsg('Settings & Profile updated successfully!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />

        <main className="p-6 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              System Settings & Profile
            </h1>
            <p className="text-xs text-slate-500">
              Manage administrator authentication credentials, security preferences, and notification defaults
            </p>
          </div>

          {savedMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{savedMsg}</span>
            </div>
          )}

          {/* Profile Settings Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Security */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Immediate High-Priority Emergency Alerts</span>
                <input
                  type="checkbox"
                  checked={notifications.highPriorityAlerts}
                  onChange={(e) => setNotifications({ ...notifications, highPriorityAlerts: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Automated Common Issue Detection Alerts</span>
                <input
                  type="checkbox"
                  checked={notifications.duplicateIssuesDetected}
                  onChange={(e) => setNotifications({ ...notifications, duplicateIssuesDetected: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Weekly Analytics Digest</span>
                <input
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Institutional Privacy Policy Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-indigo-900 text-indigo-100 text-xs flex items-start gap-3 border border-indigo-800">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-white block mb-0.5">System Security & Privacy Compliance</span>
              The system strictly enforces zero student identity retention. Administrator actions are logged for audit transparency while keeping student identity completely confidential.
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
