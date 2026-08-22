"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Landmark, Scale, ArrowLeft, Lightbulb, Share2, CheckCircle2 } from "lucide-react";
import ContactModal from "@/components/ContactModal"; // 🔥 Import your new modal!

export default function CaseStudyContentClient({ caseStudy, formattedDate }) {
  const [showCopied, setShowCopied] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // 🔥 Modal State

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/case-studies/${caseStudy.slug || caseStudy._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: caseStudy.title,
          text: caseStudy.overview,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 pb-24">
      {/* 1. HERO SECTION & METADATA */}
      <section className="bg-white border-b border-gray-200 pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          
          <Link 
            href="/case-studies" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[var(--accent-main)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all Case Studies
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-[var(--accent-main)]/10 text-[var(--accent-main)] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              {caseStudy.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[var(--primary-main)] leading-tight mb-8">
            {caseStudy.title}
          </h1>

          {/* Legal Meta Data Bar + Share Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-gray-600 border-t border-b border-gray-100 py-4">
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[var(--accent-main)]" />
                <span className="font-semibold">{caseStudy.court}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--accent-main)]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--accent-main)]" />
                <span>Final Judgment</span>
              </div>
            </div>

            {/* 🔥 Share Button */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 p-2 px-4 text-[var(--accent-main)] hover:bg-[var(--accent-main)]/10 transition-colors rounded-lg font-medium border border-[var(--accent-main)]/20"
            >
              {showCopied ? (
                <><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="text-green-600">Copied!</span></>
              ) : (
                <><Share2 className="w-4 h-4" /> Share Case</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section className="max-w-5xl mx-auto px-6 mt-12">
        
        {/* Hero Image */}
        {caseStudy.heroImage && (
          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-12 relative">
            <img 
              src={caseStudy.heroImage} 
              alt={caseStudy.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT/MAIN COLUMN (The Text) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* The Executive Brief (Overview) */}
            <div className="text-xl md:text-2xl text-gray-600 font-serif leading-relaxed italic border-l-4 border-gray-300 pl-6">
              "{caseStudy.overview}"
            </div>

            {/* The Key Takeaway (The Verdict Box) */}
            <div className="bg-[var(--accent-main)]/5 border border-[var(--accent-main)]/20 rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-[var(--accent-main)]" />
                <h3 className="text-lg font-bold text-[var(--primary-main)] uppercase tracking-wider">
                  Key Takeaway
                </h3>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed">
                {caseStudy.keyTakeaway}
              </p>
            </div>

            {/* The Full Judgment */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary-main)] mb-6 border-b pb-2">
                Judgment Details
              </h2>
              {/* 🔥 FIXED STYLING AND HYDRATION */}
              <section 
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h4 className="text-lg font-bold text-[var(--primary-main)] mb-4">
                Need Legal Assistance?
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                If you are facing a similar situation regarding {caseStudy.category.toLowerCase()} law, our expert team is here to help.
              </p>
              
              {/* 🔥 Opens the Contact Modal directly instead of leaving the page! */}
              <button 
                onClick={() => setShowContactModal(true)}
                className="block w-full text-center bg-[var(--accent-main)] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Consult Our Lawyers
              </button>
            </div>
          </aside>

        </div>
      </section>

      {/* 🔥 Render the Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </main>
  );
}