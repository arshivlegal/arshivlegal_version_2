"use client";

import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import FounderVision from "@/components/FounderVision";
import VideoGrid from "@/components/VideoGrid"; // Adjust path if needed
import SearchBar from "@/components/ui/SearchBar";

export default function DailyInsightsClient({ initialData }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Instant Client-Side Filtering (Searches Title, Description, and Tags)
  const filteredInsights = initialData.filter((item) => {
    const lowerQuery = searchQuery.toLowerCase();
    
    if (!lowerQuery) return true; // If search is empty, show all

    return (
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(item.tags) 
        ? item.tags.some(t => t.toLowerCase().includes(lowerQuery)) 
        : item.tag?.toLowerCase().includes(lowerQuery))
    );
  });

  return (
    <main className="flex w-full flex-col items-center bg-white">
      
      {/* -------------------- SUBPAGE HERO -------------------- */}
      <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px]">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px]">
            
            <h1 className="heading-h1 font-bold text-[var(--primary-main)]">
              Daily Insights
            </h1>

            {/* Controlled Search Bar with Live Suggestions */}
            <SearchBar 
              placeholder="Search daily insights related to IPR." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={searchQuery ? filteredInsights : []}
            />

          </div>
        </div>
      </section>

      {/* -------------------- VIDEO GRID AREA -------------------- */}
      <section id="results-section" className="flex w-full justify-center px-[var(--S24)] md:px-[var(--S40)] pb-16 md:pb-[120px]">
        <div className="flex w-full max-w-7xl flex-col items-start">
          
          {filteredInsights.length > 0 ? (
            <VideoGrid items={filteredInsights} columns={3} />
          ) : (
            <div className="flex flex-col items-start gap-4">
              <p className="font-secondary text-[18px] text-gray-500">
                No insights found for "{searchQuery}".
              </p>
              <button 
                onClick={() => setSearchQuery("")} 
                className="font-secondary text-[var(--accent-main)] underline underline-offset-4"
              >
                Clear search
              </button>
            </div>
          )}
          
        </div>
      </section>

      {/* -------------------- REUSABLE COMPONENTS -------------------- */}
      <FounderVision />
      <FAQSection />

    </main>
  );
}