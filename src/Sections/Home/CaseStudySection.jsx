import Button from '@/components/ui/Button'
import CaseStudyGrid from '@/components/CaseStudyGrid'

/**
 * CaseStudySection — full homepage section: heading + "View all" CTA + subtitle + grid.
 * Fully prop-driven so it can be reused (e.g. a "Latest Blogs" section) just by
 * passing different title/items/href — same layout, different content/CMS query.
 *
 * @param {string} title        - section heading
 * @param {string} subtitle     - description under the header row
 * @param {string} viewAllText  - CTA button label
 * @param {string} viewAllHref  - CTA button destination
 * @param {Array}  items        - passed straight through to CaseStudyGrid
 * @param {2|3|4}  columns      - passed straight through to CaseStudyGrid
 */
export default function CaseStudySection({
  title = 'Featured Case Studies',
  subtitle = 'Explore landmark judgments and recent Intellectual Property disputes that continue to shape IP law and legal practice.',
  viewAllText = 'View all Case Studies',
  viewAllHref = '/case-studies',
  items,
  columns = 2,
}) {
  return (
    <section
      className="flex w-full flex-col items-center overflow-hidden px-[var(--S24)] py-16 md:px-[var(--S40)] md:pt-[10px]  md:pb-[80px]"
      style={{ background: 'linear-gradient(179deg, white 0%, #F9F9F9 100%)' }}
    >
      <div className="flex w-full max-w-7xl flex-col items-start gap-[80px]">
        {/* Header */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-center justify-between gap-[var(--S16)]">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              {title}
            </h2>
            
            {/* Desktop Button: Wrapper guarantees it hides on tablet/mobile */}
            <div className="hidden shrink-0 lg:block">
              <Button 
                as="link" 
                href={viewAllHref} 
                variant="outliner" 
              >
                {viewAllText}
              </Button>
            </div>
            
          </div>
          <p className="max-w-[896px] text-lg font-normal text-[var(--text-main)] font-secondary">
            {subtitle}
          </p>
        </div>

        {/* Grid Container */}
        <div className="flex w-full flex-col gap-10">
          <CaseStudyGrid items={items} columns={columns} />
          
          {/* Tablet/Mobile Button: Wrapper guarantees it hides on desktop and centers content */}
          <div className="flex w-full justify-center lg:hidden">
            <Button 
              as="link" 
              href={viewAllHref} 
              variant="outliner"
              className="w-[240px] justify-center text-center"
            >
              {viewAllText}
            </Button>
          </div>
        </div>
        
      </div>
    </section>
  )
}
/* ---------------------------------------------------------
   USAGE

   Homepage default:
   <CaseStudySection />

   With real CMS data:
   <CaseStudySection
     title="Featured Case Studies"
     items={caseStudiesFromCMS}
   />

   Reused for a different content type on another page:
   <CaseStudySection
     title="Latest Blogs"
     subtitle="Stay informed with expert articles and legal insights."
     viewAllText="View All Blogs"
     viewAllHref="/blogs"
     items={blogPosts}
     columns={3}
   />
--------------------------------------------------------- */