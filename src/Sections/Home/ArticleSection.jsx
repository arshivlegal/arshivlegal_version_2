import Button from '@/components/ui/Button'
import ArticleList from '@/components/ArticleList'

/**
 * ArticleSection — Full homepage section for Articles.
 *
 * @param {string} title        - section heading
 * @param {string} subtitle     - description under the header
 * @param {string} viewAllText  - CTA button label
 * @param {string} viewAllHref  - CTA button destination
 * @param {Array}  items        - passed straight through to ArticleList
 */
export default function ArticleSection({
  title = 'Articles',
  subtitle = 'Stay informed with expert articles, legal insights, case analysis, and educational resources covering Intellectual Property Law.',
  viewAllText = 'View all Articles',
  viewAllHref = '/articles',
  items,
}) {
  return (
    <section className="flex w-full flex-col items-center overflow-hidden px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px] bg-[var(--background)]"
     style={{ background: 'linear-gradient(179deg, white 0%, #F9F9F9 100%)' }}>
      
      {/* 7XL Container */}
      <div className="flex w-full max-w-7xl flex-col items-start gap-[80px] lg:gap-[100px]">
        
        {/* Header Area */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full items-center justify-between gap-[var(--S16)]">
            <h2 className="heading-h2 font-bold text-[var(--primary-main)]">
              {title}
            </h2>
            
            {/* Desktop Button: Hides on tablet/mobile */}
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

        {/* List Container */}
        <div className="flex w-full flex-col gap-10">
          
          <ArticleList items={items} />
          
          {/* Tablet/Mobile Button: Hides on desktop, centers on mobile */}
          <div className="flex w-full justify-center lg:hidden mt-8">
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