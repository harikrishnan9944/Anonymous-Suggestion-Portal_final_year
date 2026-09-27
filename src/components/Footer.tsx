'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Lock, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Anonymous Suggestion Portal
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering students to share honest suggestions, academic concerns, and campus complaints safely without compromising their identity.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero Identity Logging Enabled
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home Portal</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit Suggestion</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Submission</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Administrator Login</Link></li>
            </ul>
          </div>

          {/* Trust Assurances */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Privacy & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                No personal data collected
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Encrypted Tracking IDs
              </p>
              <p className="mt-2 text-slate-500">
                Designed for educational institution transparency and continuous feedback loops.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 Anonymous Student Suggestion & Complaint Management System. Final Year Project.</p>
          <p className="flex items-center gap-1">
            Built for Educational Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
