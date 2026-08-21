import { useEffect, useRef } from "react";

export default function useInViewAnimation(options = {}) {
  const {
    threshold = 0.2, // 👈 important
    rootMargin = "99% 0px -10% 0px",
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) {
          element.classList.add("in-view");
        } else {
          element.classList.remove("in-view");
        }
      },
      {
        threshold: [0, threshold],
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref };
}
