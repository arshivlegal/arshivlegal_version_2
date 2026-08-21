"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * FounderVision — Static component for the founder's message.
 * Features a parallax scroll effect on the person's image while the frame stays fixed.
 * 
 * Note: Requires framer-motion (`npm install framer-motion`)
 */
export default function FounderVision() {
  const containerRef = useRef(null);
  
  // Track the scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // Triggers while the section is in the viewport
  });

  // Maps the scroll progress (0 to 1) to vertical movement (from +30px to -30px)
  const y = useTransform(scrollYProgress, [0, .4], [60, 0]);

  return (
    <section
      ref={containerRef}
      className="flex w-full flex-col items-center overflow-hidden px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px] bg-[var(--background)]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-[60px] lg:flex-row lg:gap-[100px]">
        
        {/* TEXT CONTENT */}
        <div className="flex w-full flex-1 flex-col items-start gap-[30px]">
          <div className="flex flex-col gap-[20px] md:gap-[60px]">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              The Founder&apos;s Vision
            </h2>
            <p className="font-secondary text-[18px] md:text-[20px] leading-[1.6] text-[var(--text-main)]">
              &quot;When I started practicing <strong className="font-semibold">Intellectual Property law</strong>, I realized reliable legal knowledge was difficult to access. This platform exists to <strong className="font-semibold">simplify IP law</strong> for businesses, innovators, researchers, and students.&quot;
            </p>
          </div>
          <span className="font-primary text-[20px] font-semibold text-[var(--accent-main)]">
            -Mr. Aryan Pandey
          </span>
        </div>

        {/* IMAGE CONTENT - Reusing your exact frame structure */}
        <figure
          className="
            relative
            w-full
            max-w-[280px]
            sm:max-w-[340px]
            md:max-w-[380px]
            lg:max-w-[420px]
            aspect-[420/427]
            rounded-[var(--R16)]
            mx-auto
            shrink-0
          "
        >
          {/* FRAME BACKGROUND (Static) */}
          <div
            className="
              absolute
              inset-0
              bg-[url('/Images/frame.svg')]
              bg-no-repeat
              bg-center
              bg-contain
              z-0
            "
          />

          {/* PERSON IMAGE (Animated Parallax) */}
          <motion.div
            style={{ y }} // Applies the scroll transformation
            className="
              absolute
              left-1/2
              -translate-x-1/2
              /* vertical positioning */
              -top-[35px]
              xs:-top-[30px]
              sm:-top-[36px]
              md:-top-[25px]
              lg:-top-[51px]
              /* responsive width */
              w-[65%]
              sm:w-[60%]
              md:w-[55%]
              lg:w-[85%]
              h-full
              z-10
            "
          >
            <Image
              src="/Images/Group 1.png"
              alt="Mr. Aryan Pandey"
              fill
              className="object-contain scale-110"
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 260px"
              priority
            />
          </motion.div>
        </figure>
      </div>
    </section>
  );
}