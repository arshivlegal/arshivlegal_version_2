// useInViewOnce.js
import { useEffect, useRef } from "react";

export default function useInViewOnce(options = {}) {
  const { threshold = 0.25, rootMargin = "0px 0px -15% 0px" } = options;

  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (hasAnimated.current) return;

        if (entry.intersectionRatio >= threshold) {
          el.classList.add("in-view");
          hasAnimated.current = true;
          observer.unobserve(el); // optional but clean
        }
      },
      { threshold: [0, threshold], rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref };
}
