"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ResourceGrid from "@/components/ResourceGrid";
import PdfModal from "@/components/ui/PdfModal"; // 🔥 Import the popup modal

/**
 * StudyMaterialSection — full homepage section: heading + subtitle + view-all CTA
 * + a horizontally-scrolling resource row (Apple-style).
 */
export default function StudyMaterialSection({
  title = "Study Material",
  subtitle =
    "Learn Intellectual Property Law with curated notes, guides, reference materials, and other educational resources designed for students, researchers, and aspiring legal professionals.",
  viewAllText = "View All Resources",
  viewAllHref = "/knowledge-hub", // 🔥 Updated to match your actual route
  items = [],
}) {
  // 🔥 State to control the popup modal on the homepage
  const [activePdf, setActivePdf] = useState(null);

  // 🔥 Inject the modal trigger into the items before passing them to the grid
  const interactiveItems = items.map((item) => ({
    ...item,
    buttonText: "View PDF", // Force it to say View PDF
    onOpenPdf: (pdfData) => setActivePdf(pdfData), // Wires up the card button to open the modal
  }));

  return (
    <section className="flex w-full flex-col overflow-hidden bg-[var(--background)] py-16 md:py-[60px]">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start px-[var(--S24)] md:px-[var(--S40)]">
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-center justify-between gap-[var(--S16)]">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              {title}
            </h2>
            <div className="hidden shrink-0 lg:block">
              <Button as="link" href={viewAllHref} variant="outliner">
                {viewAllText}
              </Button>
            </div>
          </div>
          <p className="max-w-[896px] font-secondary text-[18px] font-normal leading-[1.6] text-[var(--text-main)]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Full-bleed scroll row - now passing interactiveItems instead of raw items! */}
      <div className="mt-10 flex w-full lg:mt-[80px]">
        <ResourceGrid items={interactiveItems} layout="scroll" />
      </div>

      {/* Mobile-only CTA */}
      <div className="mx-auto mt-10 flex w-full max-w-7xl justify-center px-[var(--S24)] md:px-[var(--S40)] lg:hidden">
        <Button
          as="link"
          href={viewAllHref}
          variant="outliner"
          className="w-[240px] justify-center text-center"
        >
          {viewAllText}
        </Button>
      </div>

      {/* 🔥 THE POPUP PDF MODAL VIEWER */}
      <PdfModal
        isOpen={!!activePdf}
        onClose={() => setActivePdf(null)}
        material={activePdf}
      />
    </section>
  );
}