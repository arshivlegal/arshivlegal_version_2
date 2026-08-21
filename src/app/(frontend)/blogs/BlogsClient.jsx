"use client";

import { useState } from "react";
import BlogGrid from "@/components/BlogGrid";
import FAQSection from "@/components/FAQSection";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilters from "@/components/ui/CategoryFilters";

export default function BlogsClient({ initialData }) {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = initialData.filter((blog) => {
    const matchesTag = activeTag === "All" || (Array.isArray(blog.tags) ? blog.tags.includes(activeTag) : blog.tag === activeTag);
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = !lowerQuery || 
      blog.title.toLowerCase().includes(lowerQuery) || 
      blog.description.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(blog.tags) ? blog.tags.some(t => t.toLowerCase().includes(lowerQuery)) : blog.tag?.toLowerCase().includes(lowerQuery));

    return matchesTag && matchesSearch;
  });

  return (
    <main className="flex w-full flex-col items-center bg-white">
      
      <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px]">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px]">
            <h1 className="heading-h1 font-bold text-[var(--primary-main)]">Blogs</h1>
            
            {/* Added the `suggestions` prop here! */}
            <SearchBar 
              placeholder="Search blogs related to IPR." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={searchQuery ? filteredBlogs : []} 
            />
          </div>
        </div>
      </section>

      {/* Rest of the page remains identical... */}
      <section id="results-section" className="flex w-full justify-center px-[var(--S24)] md:px-[var(--S40)] pb-16 md:pb-[120px]">
        <div className="flex w-full max-w-7xl flex-col items-start gap-[50px]">
          <div className="w-full">
            <CategoryFilters activeCategory={activeTag} onCategoryChange={setActiveTag} />
          </div>
          <div className="w-full">
            {filteredBlogs.length > 0 ? (
              <BlogGrid items={filteredBlogs} columns={3} />
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="font-secondary text-[18px] text-gray-500">
                  No blogs found {searchQuery ? `for "${searchQuery}"` : ""} {activeTag !== "All" ? `in ${activeTag}` : ""}.
                </p>
                <button onClick={() => { setActiveTag("All"); setSearchQuery(""); }} className="font-secondary text-[var(--accent-main)] underline underline-offset-4">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <FAQSection />
    </main>
  );
}