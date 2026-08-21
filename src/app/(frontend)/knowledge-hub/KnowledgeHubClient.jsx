"use client";

import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import FounderVision from "@/components/FounderVision";
import ResourceGrid from "@/components/ResourceGrid";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilters from "@/components/ui/CategoryFilters";
import PdfModal from "@/components/ui/PdfModal"; // 🔥 Import your modal

export default function KnowledgeHubClient({ initialData }) {
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🔥 State to control the popup modal
  const [activePdf, setActivePdf] = useState(null);

  // Instant Client-Side Filtering
  const filteredResources = initialData.filter((resource) => {
    const matchesTag = 
      activeTag === "All" || 
      (Array.isArray(resource.tags) ? resource.tags.includes(activeTag) : resource.tag === activeTag);
    
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      !lowerQuery || 
      resource.title.toLowerCase().includes(lowerQuery) || 
      resource.description.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(resource.tags) ? resource.tags.some(t => t.toLowerCase().includes(lowerQuery)) : resource.tag?.toLowerCase().includes(lowerQuery));

    return matchesTag && matchesSearch;
  });

  // Inject the modal trigger into the resource items before passing them to the grid
  const resourcesWithModal = filteredResources.map(item => ({
    ...item,
    onOpenPdf: (pdfData) => setActivePdf(pdfData) // Wires up the card button to open the modal
  }));

  return (
    <main className="flex w-full flex-col items-center bg-white">
      
      {/* -------------------- SUBPAGE HERO -------------------- */}
      <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px]">
        <div className="flex w-full max-w-7xl items-center justify-between">
          <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px]">
            <h1 className="heading-h1 font-bold text-[var(--primary-main)]">
              Knowledge Hub
            </h1>
            <SearchBar 
              placeholder="Search study materials, notes, or PDFs..." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              suggestions={searchQuery ? filteredResources : []}
              baseRoute="/knowledge-hub" 
            />
          </div>
        </div>
      </section>

      {/* -------------------- RESOURCE GRID AREA -------------------- */}
      <section id="results-section" className="flex w-full justify-center px-[var(--S24)] md:px-[var(--S40)] pb-16 md:pb-[120px]">
        <div className="flex w-full max-w-7xl flex-col items-start gap-[50px] md:gap-[80px]">
          
          <div className="w-full">
            <CategoryFilters 
              activeCategory={activeTag}
              onCategoryChange={setActiveTag}
            />
          </div>

          <div className="w-full">
            {resourcesWithModal.length > 0 ? (
              <ResourceGrid items={resourcesWithModal} layout="grid" />
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="font-secondary text-[18px] text-gray-500">
                  No resources found.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* 🔥 THE POPUP PDF MODAL VIEWER */}
      <PdfModal 
        isOpen={!!activePdf} 
        onClose={() => setActivePdf(null)} 
        material={activePdf} 
      />

      <FounderVision />
      <FAQSection />

    </main>
  );
}