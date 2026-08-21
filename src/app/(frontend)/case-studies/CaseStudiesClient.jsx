"use client";

import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import CaseStudyCard from "@/components/ui/CaseStudyCard"; 
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilters from "@/components/ui/CategoryFilters";

export default function CaseStudiesClient({ initialData }) {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Instant Client-Side Filtering
  const filteredStudies = initialData.filter((study) => {
    // 1. Check Tag
    const matchesTag = 
      activeTag === "All" || 
      (Array.isArray(study.tags) ? study.tags.includes(activeTag) : study.tag === activeTag);
    
    // 2. Check Search Query
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      !lowerQuery || 
      study.title.toLowerCase().includes(lowerQuery) || 
      study.description.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(study.tags) ? study.tags.some(t => t.toLowerCase().includes(lowerQuery)) : study.tag?.toLowerCase().includes(lowerQuery));

    return matchesTag && matchesSearch;
  });

  return (
    <main className="flex w-full flex-col items-center bg-white">
      
      {/* -------------------- SUBPAGE HERO -------------------- */}
      <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px]">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px]">
            
            <h1 className="heading-h1 font-bold text-[var(--primary-main)]">
              Case Study
            </h1>

            {/* Controlled Search Bar with Live Suggestions */}
            <SearchBar 
              placeholder="Search case studies related to IPR." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={searchQuery ? filteredStudies : []}
            />

          </div>
        </div>
      </section>

      {/* -------------------- CASE STUDIES GRID AREA -------------------- */}
      <section id="results-section" className="flex w-full justify-center px-[var(--S24)] md:px-[var(--S40)] pb-16 md:pb-[120px]">
        <div className="flex w-full max-w-7xl flex-col items-start gap-[50px] md:gap-[80px]">
          
          {/* Controlled Category Filters */}
          <div className="w-full">
            <CategoryFilters 
              activeCategory={activeTag}
              onCategoryChange={setActiveTag}
            />
          </div>

          {/* 2-COLUMN GRID OR EMPTY STATE */}
          <div className="w-full">
            {filteredStudies.length > 0 ? (
              <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-x-[40px] lg:gap-x-[80px] gap-y-[60px] lg:gap-y-[80px]">
                {filteredStudies.map((study) => (
                  <CaseStudyCard 
                    key={study.id} 
                    {...study} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="font-secondary text-[18px] text-gray-500">
                  No case studies found {searchQuery ? `for "${searchQuery}"` : ""} {activeTag !== "All" ? `in ${activeTag}` : ""}.
                </p>
                <button 
                  onClick={() => { setActiveTag("All"); setSearchQuery(""); }} 
                  className="font-secondary text-[var(--accent-main)] underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* -------------------- FAQ SECTION -------------------- */}
      <FAQSection />

    </main>
  );
}