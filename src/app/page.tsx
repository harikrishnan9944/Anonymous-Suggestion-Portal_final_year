'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PrivacySection from '@/components/PrivacySection';
import HowItWorks from '@/components/HowItWorks';
import SubmissionForm from '@/components/SubmissionForm';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Section 3: Hero Section */}
        <Hero />

        {/* Section 4: Privacy & Trust Section */}
        <PrivacySection />

        {/* Section 5: How It Works */}
        <HowItWorks />

        {/* Section 6: Student Submission Form Section */}
        <section id="submit-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <SubmissionForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
