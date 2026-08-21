import VideoCard from '@/components/ui/VideoCard'

/**
 * VideoGrid — Responsive 3-column grid wrapper for VideoCards.
 *
 * @param {Array<object>} items - array of VideoCard prop objects
 * @param {number} columns      - desktop column count (defaults to 3)
 */
export default function VideoGrid({ items = defaultItems, columns = 3 }) {
  const colsMap = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }

  return (
    <div
      className={`grid w-full grid-cols-1 justify-items-center gap-y-[60px] gap-x-[40px] md:grid-cols-2 ${colsMap[columns] || colsMap[3]}`}
    >
      {items.map((item, i) => (
        <VideoCard key={item.id ?? i} {...item} />
      ))}
    </div>
  )
}

/* Fallback preview data matching Figma */
const defaultItems = [
  {
    id: 1,
    title: 'Can Someone Trademark Your Business Name Before You?',
    description: 'Learn what happens when two businesses use similar names, who gets legal priority, and the steps you should take before launching your brand.',
    image: '/images/criminal-law.webp',
  },
  {
    id: 2,
    title: 'How to Respond to a Legal Notice',
    description: "Receiving a legal notice doesn't always mean you're in trouble. Understand what it means, what to avoid, and how to respond appropriately.",
    image: '/images/criminal-law.webp',
  },
  {
    id: 3,
    title: 'Intellectual Property Every Startup Should Protect',
    description: 'From trademarks and patents to copyrights and trade secrets, discover which intellectual property assets every growing business should secure.',
    image: '/images/criminal-law.webp',
  },
]