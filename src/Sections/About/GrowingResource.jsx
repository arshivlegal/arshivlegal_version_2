export default function GrowingResource() {
  return (
    <section className="flex w-full flex-col items-center bg-[var(--background)] pt-[var(--S64)] lg:pt-[100px]">
      
      {/* -------------------- HEADER TITLE -------------------- */}
      <div className="mb-[var(--S40)] px-[var(--S24)] text-center lg:mb-[var(--S64)]">
        <h2 className="heading-h1 text-[var(--primary-main)]">
          A Growing IPR Resource
        </h2>
      </div>

      {/* -------------------- MAIN CONTENT AREA -------------------- */}
      {/* Notice: No more max-w constraint here! It will stretch edge-to-edge */}
      <div className="relative flex w-full flex-col items-center">
        
        {/* MOBILE: Part 1 of the "Narrative Sandwich" */}
        <div className="flex w-full justify-center px-[var(--S24)] pb-[var(--S40)] lg:hidden">
          <p className="max-w-[600px] text-center font-secondary text-[16px] sm:text-[18px] font-semibold leading-relaxed text-[var(--text-secondary)]">
            Arshiv Legal is continuously expanding its repository of IPR articles, case studies, legal explainers, videos, research material, and downloadable resources—with the aim of making intellectual property knowledge increasingly comprehensive and accessible.
          </p>
        </div>

        {/* SUPREME COURT IMAGE (Edge-to-Edge) */}
        <div className="relative w-full">
          <img 
            src="/Images/SupremeCourt.webp" // Swap with your Supreme Court image
            alt="Supreme Court of India" 
            className="block h-auto w-full object-cover" 
          />

          {/* 
            DESKTOP ONLY: FLOATING TEXT
            FIX: Changed px-[0%] to lg:px-[var(--S40)]. This gives it a safe 
            margin on iPads so it doesn't bleed off the screen, but justify-between 
            keeps it anchored to the edges.
          */}
          <div className="absolute inset-0 z-10 hidden w-full items-start justify-between lg:px-[var(--S40)] xl:px-[5%] 2xl:px-[7%] lg:flex pointer-events-none pt-[12%] xl:pt-[15%]">
            
            {/* Left Floating Text */}
            <div className="w-full max-w-[300px] xl:max-w-[340px] 2xl:max-w-[380px] pointer-events-auto">
              <p className="font-secondary text-[16px] xl:text-[18px] font-semibold leading-relaxed text-[var(--text-secondary)]">
                Arshiv Legal is continuously expanding its repository of IPR articles, case studies, legal explainers, videos, research material, and downloadable resources—with the aim of making intellectual property knowledge increasingly comprehensive and accessible.
              </p>
            </div>

            {/* Right Floating Text */}
            <div className="w-full max-w-[300px] xl:max-w-[340px] 2xl:max-w-[380px] pointer-events-auto">
              <p className="font-secondary text-[16px] xl:text-[18px] font-semibold leading-relaxed text-[var(--text-secondary)]">
                As this repository grows, our ambition is clear: to make Arshiv Legal a name synonymous with Intellectual Property Rights—a place where IPR knowledge can be found, understood, and explored.
              </p>
            </div>

          </div>
        </div>

        {/* MOBILE: Part 2 of the "Narrative Sandwich" */}
        <div className="flex w-full justify-center px-[var(--S24)] pt-[var(--S40)] pb-[var(--S64)] lg:hidden">
          <p className="max-w-[600px] text-center font-secondary text-[16px] sm:text-[18px] font-semibold leading-relaxed text-[var(--text-secondary)]">
            As this repository grows, our ambition is clear: to make Arshiv Legal a name synonymous with Intellectual Property Rights—a place where IPR knowledge can be found, understood, and explored.
          </p>
        </div>

      </div>

    </section>
  );
}