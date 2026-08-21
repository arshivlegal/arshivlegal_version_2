import ArticleCard from '@/components/ui/ArticleCard'

/**
 * ArticleList — Vertical list wrapper for ArticleCards.
 * Uses a large gap (80px - 100px) as per Figma design.
 *
 * @param {Array<object>} items - array of ArticleCard prop objects
 */
export default function ArticleList({ items = defaultItems }) {
  return (
    <div className="flex w-full flex-col gap-[60px] lg:gap-[100px]">
      {items.map((item, i) => (
        <ArticleCard key={item.id ?? i} {...item} />
      ))}
    </div>
  )
}
