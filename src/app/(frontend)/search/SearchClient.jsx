"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import SearchBar from "@/components/ui/SearchBar";

function SearchResults({ initialData }) {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.toLowerCase();

  // Filter the global data
  const results = query 
    ? initialData.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(query))) ||
          item.type.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <main className="flex w-full flex-col items-center bg-white min-h-[70vh]">
      
      {/* HEADER SECTION */}
      <section className="flex w-full justify-center px-[var(--S24)] py-12 md:px-[var(--S40)] md:py-20 bg-gray-50 border-b border-gray-200">
        <div className="flex w-full max-w-7xl flex-col items-center text-center gap-6">
          <h1 className="heading-h1 font-bold text-[var(--primary-main)]">
            Search Results
          </h1>
          <p className="font-secondary text-[18px] text-gray-600">
            {query ? `Showing results for "${rawQuery}"` : "Enter a search term above."}
          </p>
        </div>
      </section>

      {/* RESULTS LIST SECTION */}
      <section className="flex w-full justify-center px-[var(--S24)] py-12 md:px-[var(--S40)]">
        <div className="flex w-full max-w-4xl flex-col gap-6">
          
          {results.length > 0 ? (
            results.map((item) => (
              <Link 
                key={item.id} 
                href={item.href}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-[16px] border border-gray-200 hover:border-[var(--primary-main)] hover:shadow-lg transition-all bg-white"
              >
                {/* Thumbnail */}
                <div className="relative h-[80px] w-[120px] shrink-0 overflow-hidden rounded-[8px] bg-gray-200">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  )}
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#FFF5EA] text-[#804012] font-secondary text-[12px] font-bold rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-primary text-[20px] font-bold text-black group-hover:text-[var(--primary-main)] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="font-secondary text-[16px] text-gray-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            
            // EMPTY STATE (Handles your "not available" request)
            <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-primary text-[24px] font-bold text-black">
                No results found
              </h3>
              <p className="font-secondary text-[16px] text-gray-500 max-w-[400px]">
                We couldn't find anything matching "{rawQuery}". Try checking for typos or searching with different keywords.
              </p>
              <Link 
                href="/"
                className="mt-4 rounded-[8px] bg-[var(--accent-main)] px-8 py-3 font-secondary text-[16px] text-white transition-opacity hover:opacity-90"
              >
                Return to Homepage
              </Link>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}

export default function SearchClient(props) {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading search results...</div>}>
      <SearchResults {...props} />
    </Suspense>
  );
}