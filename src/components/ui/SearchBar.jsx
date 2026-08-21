"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar({ 
  placeholder = "Search...", 
  searchQuery = "", 
  onSearchChange,
  onSubmit, 
  suggestions = [] 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchAction = (e) => {
    if (e) e.preventDefault();
    setIsFocused(false); 
    
    // 1. Force the mobile keyboard to close so it stops interrupting the scroll
    if (document.activeElement) {
      document.activeElement.blur();
    }

    if (onSubmit) {
      onSubmit(e);
    } else {
      // 2. Wait just 150ms for the keyboard to slide away and the DOM to settle
      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          // Now the math will be 100% accurate because the page stopped shifting!
          const y = resultsSection.getBoundingClientRect().top + window.scrollY - 20; 
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <form 
      onSubmit={handleSearchAction} 
      className="flex w-full flex-col sm:flex-row items-center gap-[16px] max-w-[600px]"
    >
      <div ref={wrapperRef} className="relative flex w-full flex-1">
        
        <div className="flex w-full items-center gap-2 rounded-full border border-black bg-white px-5 py-3 relative z-20">
          <svg className="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full bg-transparent font-secondary text-[16px] text-black outline-none placeholder:text-[#898989]"
          />
        </div>

        {isFocused && searchQuery.length > 0 && suggestions.length > 0 && (
          <div className="absolute top-[56px] left-0 w-full bg-white rounded-[16px] shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col">
            
           {suggestions.slice(0, 4).map((item) => (
              <Link 
                key={item.id} 
                href={item.href || "#"} // 🔥 THE FIX: Fallback to "#" if href is missing
                onClick={(e) => {
                  if (!item.href) e.preventDefault(); // 🔥 Prevents jumping to top of page if it's just a popup item
                  setIsFocused(false);
                }}
                className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
              >
                <div className="relative h-[48px] w-[64px] shrink-0 overflow-hidden rounded-[8px] bg-gray-200">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19h16v-14h-16v14zm0-16h16c1.1 0-2-.9-2-2v-14c0-1.1.9-2 2-2zm10 9l3 4h-14l4-5 3 4z"/></svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-secondary text-[15px] font-medium text-black line-clamp-1 group-hover:text-[var(--primary-main)] transition-colors">
                    {item.title}
                  </span>
                  <span className="font-secondary text-[13px] text-gray-500">
                    {Array.isArray(item.tags) ? item.tags.join(', ') : item.tag}
                  </span>
                </div>
              </Link>
            ))}
            
            <div 
              onClick={handleSearchAction} 
              className="p-3 text-center bg-gray-50 text-[14px] font-secondary text-[var(--accent-main)] cursor-pointer hover:bg-gray-100 transition-colors"
            >
              See all results for "{searchQuery}"
            </div>
            
          </div>
        )}
      </div>
      
      <button 
        type="submit"
        className="w-full sm:w-auto shrink-0 rounded-[8px] bg-[var(--accent-main)] px-8 py-3 font-secondary text-[16px] text-white shadow-[0px_3px_6px_1px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90 z-20"
      >
        Search
      </button>
    </form>
  );
}