"use client";

import { useState } from "react";
import ArticleList from "@/components/ArticleList"; // Adjust path if needed
import FAQSection from "@/components/FAQSection";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilters from "@/components/ui/CategoryFilters";

export default function ArticlesClient({ initialData }) {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Instant Client-Side Filtering
  const filteredArticles = initialData.filter((article) => {
    // 1. Check Tag
    const matchesTag = 
      activeTag === "All" || 
      (Array.isArray(article.tags) ? article.tags.includes(activeTag) : article.tag === activeTag);
    
    // 2. Check Search Query
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      !lowerQuery || 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.description.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(article.tags) ? article.tags.some(t => t.toLowerCase().includes(lowerQuery)) : article.tag?.toLowerCase().includes(lowerQuery));

    return matchesTag && matchesSearch;
  });

  return (
    <main className="flex w-full flex-col items-center bg-white">
      
      {/* -------------------- SUBPAGE HERO -------------------- */}
      <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px]">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px]">
            
            <h1 className="heading-h1 font-bold text-[var(--primary-main)]">
              Articles
            </h1>

            {/* Controlled Search Bar with Suggestions */}
            <SearchBar 
              placeholder="Search articles related to IPR." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={searchQuery ? filteredArticles : []} 
            />

          </div>
        </div>
      </section>

      {/* -------------------- ARTICLES LIST AREA -------------------- */}
      <section id="results-section" className="flex w-full justify-center px-[var(--S24)] md:px-[var(--S40)] pb-16 md:pb-[120px]">
        <div className="flex w-full max-w-7xl flex-col items-start gap-[50px] md:gap-[100px]">
          
          {/* Controlled Category Filters */}
          <div className="w-full">
            <CategoryFilters 
              activeCategory={activeTag}
              onCategoryChange={setActiveTag}
            />
          </div>

          {/* HORIZONTAL ARTICLE LIST COMPONENT */}
          <div className="w-full">
            {filteredArticles.length > 0 ? (
              <ArticleList items={filteredArticles} />
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="font-secondary text-[18px] text-gray-500">
                  No articles found {searchQuery ? `for "${searchQuery}"` : ""} {activeTag !== "All" ? `in ${activeTag}` : ""}.
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