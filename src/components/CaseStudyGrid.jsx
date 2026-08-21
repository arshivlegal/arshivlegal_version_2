import CaseStudyCard from './ui/CaseStudyCard'

/**
 * CaseStudyGrid — responsive grid wrapper around CaseStudyCard.
 * Pass any number of items; it wraps into new rows automatically.
 * Reusable for Blogs/Articles/Study Material grids too via `columns`.
 *
 * @param {Array<object>} items   - array of CaseStudyCard prop objects
 * @param {2|3|4} columns         - desktop column count, defaults to 2 (matches Figma)
 */
export default function CaseStudyGrid({ items = defaultItems, columns = 2 }) {
  const colsMap = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }

  return (
    <div
      className={`grid w-full grid-cols-1 justify-items-center gap-y-[80px] gap-x-[80px] md:grid-cols-2 ${colsMap[columns] || colsMap[2]}`}
    >
      {items.map((item, i) => (
        <CaseStudyCard key={item.id ?? i} {...item} />
      ))}
    </div>
  )
}

/* Fallback preview data so <CaseStudyGrid /> renders something with no props */
const defaultItems = [
  {
    title: 'Yahoo! Inc. v. Akash Arora',
    description:
      'A landmark passing off case that established protection for domain names under trademark law in India.',
    meta: 'Copyright • Supreme Court',
  },
  {
    title: 'Novartis AG v. Union of India',
    description:
      'A significant patent case defining standards for pharmaceutical patentability.',
    meta: 'Copyright • Supreme Court',
  },
  {
    title: 'Eastern Book Company v. D.B. Modak',
    description: 'A landmark copyright judgment on and legal publishing.',
    meta: 'Copyright • Supreme Court',
  },
  {
    title: 'Eastern Book Company v. D.B. Modak',
    description: 'A landmark copyright judgment on and legal publishing.',
    meta: 'Copyright • Supreme Court',
  },
]

/* ---------------------------------------------------------
   USAGE

   Default (2 columns, homepage "Featured Case Studies"):
   <CaseStudyGrid items={caseStudies} />

   3-column reuse (e.g. blog grid, pass different card data):
   <CaseStudyGrid items={blogPosts} columns={3} />

   items shape — each object matches CaseStudyCard's props:
   {
     id: 'yahoo-vs-akash',        // optional, used as React key
     image: '/images/...',
     imageAlt: '...',
     title: '...',
     titleColor: 'accent' | 'link',
     description: '...',
     meta: '...',
     linkText: 'Read More →',
     href: '/case-studies/...',
   }
--------------------------------------------------------- */