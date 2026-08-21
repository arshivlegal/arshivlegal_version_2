import Image from 'next/image'
import Link from 'next/link'

/**
 * ArticleCard — Horizontal layout card for in-depth articles.
 * Stacks vertically on mobile, sits side-by-side on tablet/desktop.
 * Text is clamped to ensure it never exceeds the image height.
 *
 * @param {string} image       - image src
 * @param {string} imageAlt    - alt text for accessibility
 * @param {string} title       - article title
 * @param {string} date        - publish date
 * @param {string} description - excerpt or summary
 * @param {string} href        - destination URL
 */
export default function ArticleCard({
  image = '/images/criminal-law.webp',
  imageAlt = 'Article thumbnail',
  title = 'Understanding Trademark Infringement: Key Legal Principles Under Indian Law',
  date = '',
  description = 'Trademark infringement occurs when an unauthorized party uses a mark that is identical or deceptively similar to a registered trademark, causing confusion among consumers. Indian trademark law protects brand identity, reputation, and goodwill by providing legal remedies against unauthorized use and unfair competition.',
  href = '#',
}) {
  return (
    <Link 
      href={href} 
      // md:items-start ensures they align at the top instead of center
      className="group flex w-full flex-col items-start gap-[var(--S24)] md:flex-row md:items-start"
    >
      {/* Image Wrapper: Fixed width & height on tablet/desktop */}
      <div className="relative w-full shrink-0 overflow-hidden rounded-[var(--R16)] md:h-[250px] md:w-[400px]">
        {/* Aspect ratio fallback for mobile screens */}
        <div className="md:hidden pb-[62.5%] w-full"></div> 
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Content Wrapper: Forced to 250px height to match image exactly */}
      <div className="flex flex-1 flex-col items-start gap-4 md:h-[250px] md:justify-between md:py-2 px-2">
        
        {/* Group Title, Date, and Description together at the top */}
        <div className="flex w-full flex-col gap-[15px]">
          {/* Title: Clamped to 2 lines max */}
          <h3 className="heading-h6 font-semibold text-[var(--accent-main)] transition-colors group-hover:text-[var(--primary-light)] line-clamp-2">
            {title}
          </h3>
          
          <span className="watermark text-[var(--text-secondary)]">
            {date}
          </span>
          
          {/* Description: Clamped to 3 lines on iPad, 4 lines on Desktop. Adds the ... automatically */}
          <p className="body-default text-[var(--text-main)] line-clamp-3 xl:line-clamp-4">
            {description}
          </p>
        </div>
        
        {/* Read More: Pinned to the bottom because of md:justify-between */}
        <span className="font-secondary body-default font-medium text-[var(--text-main)] underline-offset-4 group-hover:underline mt-auto">
          Read More →
        </span>

      </div>
    </Link>
  )
}