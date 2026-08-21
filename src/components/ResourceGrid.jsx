import ResourceCard from '@/components/ui/ResourceCard'

/**
 * ResourceGrid — two layouts sharing one card:
 *
 * layout="grid"   → standard responsive grid (1 / 2 / 4 columns).
 * layout="scroll" → Apple-style horizontal scroll.
 *
 * The inset is implemented as PADDING on the scroll container itself —
 * not as separate spacer <div> children. This matters: for a scrolling
 * element, leading padding is visible at rest (scroll position 0) and
 * scrolls out of view the moment you start scrolling; trailing padding
 * stays hidden until you reach the very end of scroll, then appears.
 * That's exactly the "inset → full-bleed → inset" behavior we want, and
 * it's guaranteed by the CSS spec — unlike spacer children, which depend
 * on flex-shrink math that can silently collapse to 0 if anything
 * upstream touches flex sizing.
 */
export default function ResourceGrid({ items = defaultItems, layout = 'grid' }) {
  const isScroll = layout === 'scroll'

  if (!isScroll) {
    return (
      <div className="grid w-full grid-cols-1 justify-items-center gap-[var(--S32)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <ResourceCard key={item.id ?? i} {...item} />
        ))}
      </div>
    )
  }

  // Same three-tier gutter as the header: S24 mobile, S40 tablet, then a
  // calc() beyond max-w-7xl (1280px) that mirrors mx-auto's centering math.
  const gutter =
    'px-[var(--S24)] md:px-[var(--S40)] xl:px-[calc((100vw-1280px)/2+var(--S40))]'
  const scrollGutter =
    'scroll-pl-[var(--S24)] md:scroll-pl-[var(--S40)] xl:scroll-pl-[calc((100vw-1280px)/2+var(--S40))]'

  return (
    <div
      className={`flex w-full snap-x snap-mandatory gap-[var(--S24)] overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${gutter} ${scrollGutter}`}
    >
      {items.map((item, i) => (
        <div key={item.id ?? i} className="w-[240px] shrink-0 snap-start snap-always">
          <ResourceCard {...item} />
        </div>
      ))}
    </div>
  )
}

/* Fallback preview data */
const defaultItems = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  date: 'August 7, 2025',
  title: 'Copyright Protection for Software',
  description:
    'Understand how software is protected under copyright law and common legal issues.',
  buttonText: 'Download PDF',
  href: '#',
}))

/* ---------------------------------------------------------
   USAGE

   Homepage scroll row:
   <ResourceGrid items={resources} layout="scroll" />

   Full resources page grid:
   <ResourceGrid items={resources} layout="grid" />
--------------------------------------------------------- */