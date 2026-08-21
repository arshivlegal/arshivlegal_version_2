import Link from "next/link";

export default function ExploreKnowledge() {
  return (
    <section className="flex w-full justify-center bg-[var(--background)] px-[var(--S24)] pt-[100px] pb-[80px] md:px-[var(--S40)] lg:pt-[160px]">
      <div className="flex w-full max-w-7xl flex-col items-start gap-[60px] lg:gap-[100px]">
        
        {/* HEADER */}
        <div className="flex w-full flex-col">
          <h2 className="heading-h1 uppercase text-[var(--primary-main)]">
            Explore the Knowledge
          </h2>
        </div>

        {/* LIST AREA */}
        <div className="flex w-full flex-col gap-[60px] lg:gap-[80px]">
          {knowledgeItems.map((item, index) => {
            // Determine if the item is even or odd to create the Desktop Zig-Zag effect
            const isEven = index % 2 === 0;
            // Check if the item is odd (1st, 3rd, 5th items -> indices 0, 2, 4)
            const isOdd = index % 2 !== 0;

            return (
              <div 
                key={item.id} 
                className={`flex w-full flex-col items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } lg:justify-between gap-0 lg:gap-[80px] group ${
                  isEven ? 'bg-gradient-to-r from-[#FFF5EA] to-[#FFEDD9] p-[var(--S24)] lg:p-[var(--S40)] rounded-[var(--R24)]' : ''
                }`}
              >
                
                {/* 1. IMAGE BLOCK */}
                <div className="w-full lg:w-[400px] shrink-0 overflow-hidden rounded-[var(--R16)] shadow-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="aspect-video lg:aspect-[4/3] w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>

                {/* 2. TEXT BLOCK */}
                <div className="relative z-10 -mt-[48px] mx-[var(--S16)] flex w-[calc(100%-32px)] flex-col gap-[var(--S24)] rounded-[var(--R16)] bg-white p-[var(--S24)] shadow-[0_8px_30px_rgb(0,0,0,0.08)] lg:m-0 lg:w-full lg:max-w-[740px] lg:flex-1 lg:bg-transparent lg:p-0 lg:shadow-none">
                  
                  {/* Title & Button Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
                    <h3 className="font-primary text-[28px] md:text-[36px] font-semibold text-black">
                      {item.title}
                    </h3>
                    
                    <Link 
                      href={item.link}
                      className="inline-flex shrink-0 items-center justify-center rounded-[var(--R8)] border-2 border-[var(--primary-main)] px-[var(--S24)] py-[var(--S8)] font-secondary text-[16px] font-medium text-[var(--primary-main)] transition-colors hover:bg-[var(--primary-main)] hover:text-white"
                    >
                      {item.btnText}
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="font-secondary text-[18px] md:text-[24px] text-black">
                    {item.desc}
                  </p>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   DATA ARRAY
--------------------------------------------------------- */
const knowledgeItems = [
  {
    id: 1,
    title: "Videos",
    desc: "Concise explanations of IPR concepts, legal principles, and important developments.",
    btnText: "View all Videos",
    img: "/Images/AboutVideos.webp",
    link: "/daily-insights",
  },
  {
    id: 2,
    title: "PDF Resources",
    desc: "Downloadable notes, research material, guides, and reference resources.",
    btnText: "View all Resources",
    img: "/Images/AboutResources.webp",
    link: "/knowledge-hub",
  },
  {
    id: 3,
    title: "Article",
    desc: "Focused explanations of important concepts and developments in intellectual property law.",
    btnText: "View all Articles",
    img: "/Images/AboutArticle.webp",
    link: "/articles",
  },
  {
    id: 4,
    title: "Case Study",
    desc: "Analysis of significant IPR disputes, judgments, and legal principles.",
    btnText: "View all Case Study",
    img: "/Images/AboutCaseStudy.webp",
    link: "/case-studies",
  },
  {
    id: 5,
    title: "Blogs",
    desc: "In-depth discussions, legal insights, emerging developments, and perspectives on intellectual property.",
    btnText: "View all Blogs",
    img: "/Images/AboutBlogs.webp",
    link: "/blogs",
  },
];