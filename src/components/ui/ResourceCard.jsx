import Button from '@/components/ui/Button'

/**
 * ResourceCard — bordered card for downloadable PDFs / study material.
 * Content-driven height (no fixed max-h) so longer CMS titles/descriptions
 * don't get silently clipped.
 */
export default function ResourceCard({
  date = 'August 7, 2025',
  title = 'Copyright Protection for Software',
  description = 'Understand how software is protected under copyright law and common legal issues.',
  buttonText = 'View PDF', // Default changed to "View" since it opens the modal first
  href = '#',
  pdfUrl,
  category = 'Resource', // Added to pass to the modal
  onOpenPdf, // 🔥 Optional handler for popup modal
}) {
  
  // If an interactive modal handler is passed, render a button that opens the popup
  if (onOpenPdf) {
    return (
      <div className="flex h-full w-full max-w-[240px] flex-col justify-between gap-[var(--S24)] rounded-[12px] border border-[#FFE0BC] bg-[#FFFEF9] p-[20px] transition-shadow duration-300 hover:shadow-md">
        <div className="flex w-full flex-col items-start gap-[var(--S24)]">
          <span className="watermark font-normal text-[var(--text-secondary)]">
            {date}
          </span>

          <div className="flex w-full flex-col gap-3">
            <h3 className="heading-h6 font-semibold text-[var(--accent-main)]">
              {title}
            </h3>
            <p className="body-default font-normal text-[var(--text-main)]">
              {description}
            </p>
          </div>
        </div>

        {/* 🔥 THE FIX: Removed the nested <button>. Added onClick directly here! */}
        <Button
          onClick={() => onOpenPdf({ title, pdfUrl, date, category })}
          variant="ctaAccent"
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  // Fallback default behavior (Standard link for external use)
  return (
    <div className="flex h-full w-full max-w-[240px] flex-col justify-between gap-[var(--S24)] rounded-[12px] border border-[#FFE0BC] bg-[#FFFEF9] p-[20px] transition-shadow duration-300 hover:shadow-md">
      <div className="flex w-full flex-col items-start gap-[var(--S24)]">
        <span className="watermark font-normal text-[var(--text-secondary)]">
          {date}
        </span>

        <div className="flex w-full flex-col gap-3">
          <h3 className="heading-h6 font-semibold text-[var(--accent-main)]">
            {title}
          </h3>
          <p className="body-default font-normal text-[var(--text-main)]">
            {description}
          </p>
        </div>
      </div>

      <Button as="link" href={href} variant="ctaAccent" className="w-full">
        {buttonText}
      </Button>
    </div>
  )
}