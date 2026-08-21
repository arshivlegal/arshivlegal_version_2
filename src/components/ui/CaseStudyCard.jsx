import Image from 'next/image'
import Link from 'next/link'

/**
 * ContentCard — reusable across Case Studies, Blogs, Articles, Study Material.
 * Pass different props to reuse the same block anywhere; shape maps directly
 * to CMS fields later (image, title, description, meta, link).
 *
 * @param {string} image        - image src (Figma export was a placeholder URL)
 * @param {string} imageAlt     - alt text (required for a11y/SEO — CMS should enforce this)
 * @param {string} title        - card heading
 * @param {'accent'|'link'} titleColor - 'accent' = var(--accent-main) [default],
 *                                       'link'   = var(--Blue-link) variant
 * @param {string} description  - body copy under the title
 * @param {string} meta         - small meta line, e.g. "Copyright • Supreme Court"
 * @param {string} linkText     - CTA text, e.g. "Read More →", "Download PDF"
 * @param {string} href         - link destination
 * @param {'16/9'|'563/241'} aspect - image aspect ratio, defaults to the Figma ratio
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
      className="group flex w-full max-w-[563px] flex-col items-start gap-[var(--S24)]"
    >
      {/* Image Wrapper */}
      <div
        className="relative w-full overflow-hidden rounded-[var(--R16)]"
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

      {/* Content Wrapper */}
      <div className="flex w-full flex-col items-start gap-[var(--S24)]">
        <div className="flex w-full flex-col items-start gap-[var(--S16)]">
          {/* Title with hover color transition */}
          <h3
            className={`heading-h6 px-[var(--S16)] font-semibold self-stretch transition-colors duration-300 group-hover:text-[var(--primary-light)] ${titleColorClass}`}
          >
            {title}
          </h3>
          <p className="body-default px-[var(--S16)] self-stretch text-[var(--text-main)]">
            {description}
          </p>
        </div>

        <div className="flex w-full items-center justify-between pl-[var(--S16)] pr-[var(--S24)]">
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
/* ---------------------------------------------------------
   USAGE EXAMPLES

   Case study (accent title — default):
   <CaseStudyCard
     image="/images/yahoo-vs-akash.jpg"
     imageAlt="Yahoo Inc. v. Akash Arora case study"
     title="Yahoo! Inc. v. Akash Arora"
     description="A landmark passing off case that established protection for domain names under trademark law in India."
     meta="Copyright • Supreme Court"
     linkText="Read More →"
     href="/case-studies/yahoo-vs-akash-arora"
   />

   Study material (Blue-link title variant, different CTA):
   <CaseStudyCard
     image="/images/software-copyright.jpg"
     imageAlt="Copyright protection for software"
     title="Copyright Protection for Software"
     titleColor="link"
     description="Understand how software is protected under copyright law and common legal issues."
     meta="August 7, 2025"
     linkText="Download PDF"
     href="/resources/copyright-software.pdf"
   />

   Grid usage (3 columns, gap matches your spacing scale):
   <div className="grid grid-cols-1 gap-[var(--S32)] md:grid-cols-2 lg:grid-cols-3">
     <CaseStudyCard ... />
     <CaseStudyCard ... />
     <CaseStudyCard ... />
   </div>
--------------------------------------------------------- */