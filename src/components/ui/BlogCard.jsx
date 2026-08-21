import Image from 'next/image'
import Link from 'next/link'

/**
 * BlogCard — Reusable card for Blog and Knowledge Hub articles.
 * The entire card is wrapped in a Link for better UX, with a subtle hover zoom on the image.
 *
 * @param {string} image       - image src
 * @param {string} imageAlt    - alt text for accessibility
 * @param {string} title       - article title
 * @param {string} description - excerpt or summary
 * @param {string} meta        - category and read time (e.g., "Trademark • 8 min read")
 * @param {string} href        - destination URL
 */
export default function BlogCard({
  image = '/images/criminal-law.webp',
  imageAlt = 'Blog thumbnail',
  title = 'Understanding Trademark Infringement in India',
  description = 'Learn how trademark infringement occurs, legal remedies available, and recent cases.',
  meta = 'Trademark • 8 min read',
  href = '#',
}) {
  return (
    <Link 
      href={href} 
      // 'group' allows us to trigger effects on children (like the image) when the card is hovered
      className="group flex w-full max-w-[380px] flex-col items-start gap-[var(--S24)]"
    >
      {/* Image Wrapper */}
      <div 
        className="relative w-full overflow-hidden rounded-[var(--R16)]"
        style={{ aspectRatio: '380/241' }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 380px"
        />
      </div>

      {/* Content Wrapper */}
      <div className="flex w-full px-[var(--S16)] flex-col items-start gap-[var(--S16)]">
        <h3 className="heading-h6 font-semibold text-[var(--accent-main)] transition-colors group-hover:text-[var(--primary-light)]">
          {title}
        </h3>
        {/* line-clamp-2 ensures the description never breaks the layout if the CMS text is too long */}
        <p className="body-default text-[var(--text-main)] line-clamp-2">
          {description}
        </p>
        <span className="watermark text-[var(--text-secondary)]">
          {meta}
        </span>
      </div>
    </Link>
  )
}