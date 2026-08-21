import Button from '@/components/ui/Button'
import VideoGrid from '@/components/VideoGrid'

/**
 * DailyLegalContentSection — Full homepage section for Videos.
 * Prop-driven for easy CMS integration.
 *
 * @param {string} title        - section heading
 * @param {string} subtitle     - description under the header
 * @param {string} viewAllText  - CTA button label
 * @param {string} viewAllHref  - CTA button destination
 * @param {Array}  items        - passed straight through to VideoGrid
 */
export default function DailyLegalContentSection({
  title = 'Daily Legal Content',
  subtitle = 'Stay informed with expert articles, legal insights, case analysis, and educational resources covering Intellectual Property Law.',
  viewAllText = 'View all Videos',
  viewAllHref = '/videos',
  items,
}) {
  return (
    <section className="flex w-full flex-col items-center overflow-hidden px-[var(--S24)] py-16 md:px-[var(--S40)] md:pt-[120px]  md:pb-[60px] bg-[var(--background)]">
      
      {/* 7XL Container (1280px) */}
      <div className="flex w-full max-w-7xl flex-col items-start gap-[80px]">
        
        {/* Header Area */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-center justify-between gap-[var(--S16)]">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              {title}
            </h2>
            
            {/* Desktop Button */}
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
          
          <p className="max-w-[896px] text-[18px] font-normal text-[var(--text-main)] font-secondary leading-[1.6]">
            {subtitle}
          </p>
        </div>

        {/* Grid Container */}
        <div className="flex w-full flex-col gap-10">
          
          {/* Video Grid defaults to 3 columns */}
          <VideoGrid items={items} />
          
          {/* Mobile Button */}
          <div className="flex w-full justify-center lg:hidden mt-4">
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