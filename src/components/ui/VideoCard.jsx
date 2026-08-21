import Image from 'next/image'
import Link from 'next/link'

/**
 * VideoCard — Card specifically for video content.
 * Features a dark gradient overlay and a centered play button that scales perfectly on hover.
 *
 * @param {string} image       - thumbnail image src
 * @param {string} imageAlt    - alt text
 * @param {string} title       - video title
 * @param {string} description - video description
 * @param {string} href        - link to the video/page
 */
export default function VideoCard({
  image = '/images/criminal-law.webp',
  imageAlt = 'Video thumbnail',
  title = 'Can Someone Trademark Your Business Name Before You?',
  description = 'Learn what happens when two businesses use similar names, who gets legal priority, and the steps you should take before launching your brand.',
  href = '#',
}) {
  return (
    <Link 
      href={href} 
      className="group flex w-full max-w-[380px] flex-col items-start gap-[var(--S24)]"
    >
      {/* Thumbnail Wrapper: 380x332 aspect ratio */}
      <div 
        className="relative flex w-full items-center justify-center overflow-hidden rounded-[20px]"
        style={{ aspectRatio: '380/332' }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 380px"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/20 transition-opacity duration-300 group-hover:opacity-80" />

        {/* 
          Play Button Wrapper 
          Absolute positioning completely prevents flexbox jitter during the scale animation 
        */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Scaling Button with origin-center forced */}
          <div className="flex h-[72px] w-[72px] origin-center items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 group-hover:scale-110 outline outline-[0.5px] outline-white outline-offset-[-0.5px]">
            {/* Clean SVG Play Icon (shifted slightly right to look optically centered) */}
            <svg className="ml-1 h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="flex w-full flex-col px-2 items-start gap-[20px]">
        {/* line-clamp-2 keeps titles consistent even if they are long */}
        <h3 className="heading-h6 font-semibold text-[var(--accent-main)] transition-colors group-hover:text-[var(--primary-light)] line-clamp-2">
          {title}
        </h3>
        
        {/* line-clamp-3 keeps descriptions consistent */}
        <p className="body-default text-[var(--text-main)] line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  )
}