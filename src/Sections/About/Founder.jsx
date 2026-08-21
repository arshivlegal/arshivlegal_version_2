export default function Founder() {
  return (
    <section className="flex w-full justify-center px-[var(--S24)] py-16 md:px-[var(--S40)] md:py-[120px] bg-white">
      {/* 
        NEW OUTER WRAPPER: 
        Stacks the 2-column layout and the bottom quote vertically 
      */}
      <div className="flex w-full max-w-7xl flex-col items-center gap-[60px] md:gap-[80px]">
        
        {/* -------------------- TOP SPLIT AREA -------------------- */}
        {/* FIX: Reduced the gap on lg to 60px, pushed the 104px gap to xl screens */}
        <div className="flex w-full flex-col lg:flex-row items-center gap-[60px] xl:gap-[104px]">
          
          {/* LEFT: Founder Image */}
          {/* FIX: Removed shrink-0 and max-w-[536px]. Used percentage w-[45%] for lg, capped at 536px on xl */}
          <div className="w-full lg:w-[45%] xl:w-[40%] xl:max-w-[536px]">
            {/* FIX: Removed lg:h-[750px] so the aspect-[3/4] ratio scales perfectly on iPads */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[20px] shadow-sm">
              <img 
                src="/Images/AboutFounder.webp" 
                alt="Mr. Aryan Pandey - Founder of Arshiv Legal" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT: Text Content */}
          {/* Because the left is 45%, flex-1 smoothly takes the remaining ~55% space */}
          <div className="flex w-full flex-1 flex-col items-start gap-[30px] lg:gap-[40px]">
            
            <div className="flex w-full max-w-[740px] flex-col items-start gap-[12px]">
              <span className="font-secondary text-[14px] font-normal uppercase tracking-wider text-black/75">
                Why Arshiv Legal Was Formed
              </span>
              <h2 className="font-primary text-[28px] md:text-[32px] font-medium leading-[1.2] text-[var(--primary-main)]">
                Where the Search for IPR Knowledge Ends.
              </h2>
            </div>

            <div className="flex w-full max-w-[740px] flex-col items-start">
              <p className="text-justify font-secondary text-[18px] md:text-[24px] font-light leading-relaxed text-black/75">
                When I began studying Intellectual Property Rights, I found that the challenge was not a lack of information, but the difficulty of finding it in a structured, reliable, and accessible form. Provisions, judgments, academic material, research papers, and educational resources were often scattered across different sources, making IPR research unnecessarily fragmented.
              </p>
            </div>

            <div className="flex w-full max-w-[740px] flex-col items-start">
              <h3 className="font-primary text-[24px] md:text-[30px] font-normal leading-[1.3] text-[var(--primary-main)]">
                Arshiv Legal was founded to address that gap
              </h3>
            </div>

            <div className="flex w-full max-w-[740px] flex-col items-start">
              <p className="text-justify font-secondary text-[18px] md:text-[24px] font-light leading-relaxed text-black/75">
                The platform brings together source-backed and carefully structured resources covering the laws, principles, developments, and jurisprudence of intellectual property. Whether for students, researchers, innovators, creators, or businesses, Arshiv Legal aims to make credible IPR knowledge easier to discover, understand, and use.
              </p>
            </div>

            <div className="flex w-full max-w-[740px] flex-col items-start pt-[10px]">
              <span className="font-primary text-[20px] md:text-[24px] font-semibold text-[var(--accent-main)]">
                -Mr. Aryan Pandey
              </span>
            </div>

          </div>
        </div>

        {/* -------------------- BOTTOM QUOTE AREA -------------------- */}
        <div className="flex w-full max-w-[585px] flex-col items-center justify-center text-center">
          <p className="font-primary text-[14px] md:text-[16px] font-semibold leading-relaxed text-[#737171]">
            The purpose of Arshiv Legal is to make credible IPR knowledge easier to discover, understand, and use.
          </p>
        </div>

      </div>
    </section>
  );
}