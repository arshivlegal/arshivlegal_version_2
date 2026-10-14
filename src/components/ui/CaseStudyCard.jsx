import Image from 'next/image'
import Link from 'next/link'

/**
 * CaseStudyCard — reusable across Case Studies, Blogs, Articles, Study Material.
 * Description is clamped to a maximum of 5 lines with an ellipsis (...).
 */
export default function CaseStudyCard({
  image = '/images/criminal-law.webp',
  imageAlt = 'Case study image',
  title = 'Case Study Title',
  titleColor = 'accent',
  description = 'A short summary of the case study goes here — one to two sentences on what it covers and why it matters.',
  meta = 'Category • Court',
  linkText = 'Read More →',
  href = '#',
  aspect = '563/241',
}) {
  // Use Tailwind classes instead of inline styles so hover utilities can override them
  const titleColorClass =
    titleColor === 'link' ? 'text-[var(--Blue-link)]' : 'text-[var(--accent-main)]'

  return (
    <Link 
      href={href} 
      className="group flex h-full w-full max-w-[563px] flex-col items-start gap-[var(--S24)]"
    >
      {/* Image Wrapper */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-[var(--R16)]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 563px"
        />
      </div>

      {/* Content Wrapper: flex-1 + justify-between keeps cards equal height in a grid */}
      <div className="flex w-full flex-1 flex-col items-start justify-between gap-[var(--S24)]">
        <div className="flex w-full flex-col items-start gap-[var(--S16)]">
          {/* Title with hover color transition (clamped to 2 lines for clean grid alignment) */}
          <h3
            className={`heading-h6 self-stretch px-[var(--S16)] font-semibold transition-colors duration-300 group-hover:text-[var(--primary-light)] line-clamp-2 ${titleColorClass}`}
          >
            {title}
          </h3>

          {/* 🔥 Description: Strictly clamped to 5 lines max with ... */}
          <p 
            className="body-default self-stretch px-[var(--S16)] text-[var(--text-main)] line-clamp-5"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer Meta & CTA pinned cleanly to the bottom */}
        <div className="mt-auto flex w-full items-center justify-between pl-[var(--S16)] pr-[var(--S24)]">
          {meta && (
            <span className="watermark flex-1 text-[var(--text-secondary)]">
              {meta}
            </span>
          )}
          {/* Changed from <Link> to <span> to avoid invalid nested anchor tags */}
          <span
            className="body-default font-medium text-[var(--text-main)] underline-offset-4 group-hover:underline"
          >
            {linkText}
          </span>
        </div>
      </div>
    </Link>
  )
}