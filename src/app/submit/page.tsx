'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubmissionForm from '@/components/SubmissionForm';

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <SubmissionForm />
      </main>
      <Footer />
    </div>
  );
}
