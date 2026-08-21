"use client";

import { useRef, useState, useEffect } from "react";

export default function CategoryFilters({
  categories = ["All", "Trademark", "Patent", "Copyright", "Industrial Design", "Geographical Indications", "Trade Secrets"],
  activeCategory = "All",
  onCategoryChange
}) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setIsScrollable(true);
        setScrollProgress((scrollLeft / maxScroll) * 100);
      } else {
        setIsScrollable(false);
      }
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  return (
    <div className="flex w-full flex-col gap-[16px]">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory gap-[10px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`shrink-0 snap-start flex items-center justify-center rounded-full px-4 py-1.5 font-secondary text-[14px] transition-colors ${
              category === activeCategory
                ? "bg-[var(--primary-main)] text-white"
                : "border border-black text-black hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isScrollable && (
        <div className="relative h-[2px] w-full max-w-[200px] rounded-full bg-gray-200">
          <div
            className="absolute top-1/2 h-[6px] w-[30px] -translate-y-1/2 rounded-full bg-[var(--primary-main)] transition-all duration-75 ease-out"
            style={{ left: `${scrollProgress}%`, transform: `translate(-${scrollProgress}%, -50%)` }}
          />
        </div>
      )}
    </div>
  );
}