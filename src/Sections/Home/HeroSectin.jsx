"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar"; 

// 1. ADD THE PROP HERE
export default function Hero({ searchSuggestions = [] }) {
  const [supportsWebM, setSupportsWebM] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // 2. FILTER THE LIVE PROP INSTEAD OF THE DUMMY DATA
  const globalSuggestions = searchQuery.trim() === "" 
    ? [] 
    : searchSuggestions.filter((item) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(lowerQuery) || 
          (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
          (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(lowerQuery))) ||
          item.type.toLowerCase().includes(lowerQuery)
        );
      });

  const mobileVideoRef = useRef(null);
  const desktopVideoRef = useRef(null);

  useEffect(() => {
    const video = document.createElement("video");
    const isWebMSupported =
      video.canPlayType('video/webm; codecs="vp9"') ||
      video.canPlayType("video/webm");

    setSupportsWebM(!!isWebMSupported);
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    [mobileVideoRef.current, desktopVideoRef.current].forEach((el) => {
      if (!el) return;
      el.muted = true;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });
  }, [supportsWebM, isSafari]);

  // Handles pressing "Enter" or clicking the Search button
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const showVideo = supportsWebM && !isSafari;

  return (
    <section className="relative w-full bg-[var(--background)]">
      
      {/* -------------------- MOBILE / TABLET VIEW (< 1024px) -------------------- */}
      <div className="flex flex-col items-center lg:hidden w-full pb-16">
        
        {/* IMAGE + GRADIENT */}
        <div className="relative w-full max-w-lg overflow-hidden flex justify-center">
          <div className="relative flex justify-center w-full h-[400px]">
            {showVideo ? (
              <video
                ref={mobileVideoRef}
                autoPlay loop muted playsInline preload="auto"
                className="hero-video h-[400px] scale-[1.35] origin-top translate-y-[110px] md:translate-y-[80px]"
              >
                <source src="/Images/website.webm" type="video/webm" />
              </video>
            ) : (
              <img 
                src="/Images/statue-web.webp" 
                alt="Lady Justice" 
                className="hero-video scale-[1.35] origin-top translate-y-[110px] md:translate-y-[80px]" 
              />
            )}

            {/* GRADIENT OVERLAY */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 translate-y-[130px] md:translate-y-[80px]"
              style={{
                height: "400px",
                background: `linear-gradient(to bottom, rgba(255,250,238,0) 30%, rgba(255,254,249,1) 60%, rgba(255,254,249,1) 100%)`,
              }}
            />
          </div>
        </div>

        {/* TEXT CONTENT & SEARCH */}
        <div className="relative -mt-[80px] md:-mt-[120px] w-full text-center z-20 px-[var(--S24)] md:px-[var(--S40)] flex flex-col items-center gap-[32px]">
          
          <div className="flex flex-col gap-3">
            <h1 className="heading-h1 font-bold text-[var(--primary-main)] leading-[1.1]">
              Your Trusted Resource for Intellectual Property Law
            </h1>
            <p className="font-secondary text-[16px] md:text-[18px] text-[var(--text-main)] leading-[1.6]">
              Explore trademarks, patents, copyrights, industrial designs, landmark case studies, legal news, and study material through reliable and easy to understand legal resources.
            </p>
          </div>

          <div className="w-full flex justify-center">
            {/* THIS REMAINS EXACTLY THE SAME */}
            <SearchBar 
              placeholder="Search trademarks, patents, case studies..." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              suggestions={globalSuggestions} 
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-[12px] md:gap-[20px]">
            <Link href="/blogs" className="font-secondary text-[12px] md:text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Blogs</Link>
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <Link href="/case-studies" className="font-secondary text-[12px] md:text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Case Studies</Link>
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <Link href="/knowledge-hub" className="font-secondary text-[12px] md:text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Study Material</Link>
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <Link href="/articles" className="font-secondary text-[12px] md:text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Articles</Link>
          </div>

        </div>
      </div>

      {/* -------------------- DESKTOP VIEW (>= 1024px) -------------------- */}
      <div className="mx-auto hidden max-w-[1440px] items-center justify-between px-[var(--S40)] py-[80px] lg:flex xl:px-[80px]">
        
        {/* DESKTOP TEXT & SEARCH */}
        <div className="flex w-full max-w-[769px] flex-col items-start gap-[40px] z-10">
          
          <div className="flex flex-col items-start gap-[20px]">
            <h1 className="heading-h1 font-bold text-[var(--primary-main)] leading-[1.1]">
              Your Trusted Resource for Intellectual Property Law
            </h1>
            <p className="max-w-[650px] font-secondary text-[18px] text-black leading-[1.6]">
              Explore trademarks, patents, copyrights, industrial designs, landmark case studies, legal news, and study material through reliable and easy-to-understand legal resources.
            </p>
          </div>

          <div className="w-full max-w-[650px]">
            {/* THIS REMAINS EXACTLY THE SAME */}
            <SearchBar 
              placeholder="Search trademarks, patents, case studies..." 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              suggestions={globalSuggestions}
            />
          </div>

          <div className="flex items-center gap-[20px]">
            <Link href="/blogs" className="font-secondary text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Blogs</Link>
            <div className="h-[8px] w-[8px] shrink-0 rounded-full bg-black" />
            <Link href="/case-studies" className="font-secondary text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Case Studies</Link>
            <div className="h-[8px] w-[8px] shrink-0 rounded-full bg-black" />
            <Link href="/study-materials" className="font-secondary text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">Study Material</Link>
            <div className="h-[8px] w-[8px] shrink-0 rounded-full bg-black" />
            <Link href="/news" className="font-secondary text-[16px] text-black underline underline-offset-4 hover:text-[var(--accent-main)]">News</Link>
          </div>
        </div>

        {/* DESKTOP VIDEO/IMAGE */}
        <div className="relative w-[500px] xl:w-[650px] aspect-[3/4] overflow-hidden shrink-0 z-10">
          {showVideo ? (
            <video ref={desktopVideoRef} autoPlay loop muted playsInline preload="auto" className="hero-video">
              <source src="/Images/website.webm" type="video/webm" />
            </video>
          ) : (
            <img src="/Images/statue-web.webp" className="hero-video" alt="Hero graphic" />
          )}
        </div>
      </div>
    </section>
  );
}

