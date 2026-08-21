import BlogCard from '@/components/ui/BlogCard'

/**
 * BlogGrid — Responsive grid wrapper for BlogCards.
 * Defaults to 3 columns on large screens as per your design specs.
 *
 * @param {Array<object>} items - array of BlogCard prop objects
 * @param {number} columns      - desktop column count (defaults to 3)
 */
export default function BlogGrid({ items = defaultItems, columns = 3 }) {
  const colsMap = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }

  return (
    <div
      // 1 col on mobile, 2 on tablet, and 3 on desktop. 
      // Gap adjusts from 40px to 64px on larger screens to let the cards breathe.
      className={`grid w-full grid-cols-1 justify-items-center gap-y-[60px] gap-x-[40px] md:grid-cols-2 ${colsMap[columns] || colsMap[3]}`}
    >
      {items.map((item, i) => (
        <BlogCard key={item.id ?? i} {...item} />
      ))}
    </div>
  )
}

/* Fallback preview data */
const defaultItems = [
  {
    id: 1,
    title: 'Understanding Trademark Infringement in India',
    description: 'Learn how trademark infringement occurs, legal remedies available, and recent cases.',
    meta: 'Trademark • 8 min read',
    image: '/images/criminal-law.webp',
    href: '/blog/trademark-infringement',
  },
  {
    id: 2,
    title: 'Copyright Laws for Digital Content Creators',
    description: 'A comprehensive guide on protecting your digital assets and managing copyright claims effectively.',
    meta: 'Copyright • 5 min read',
    image: '/images/criminal-law.webp',
    href: '/blog/copyright-digital-content',
  },
  {
    id: 3,
    title: 'Patent Filing Process Simplified',
    description: 'Step-by-step instructions on how to file a patent in India and secure your intellectual property.',
    meta: 'Patents • 12 min read',
    image: '/images/criminal-law.webp',
    href: '/blog/patent-filing-simplified',
  },
]