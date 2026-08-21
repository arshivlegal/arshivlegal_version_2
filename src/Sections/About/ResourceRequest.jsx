export default function ResourceRequest() {
  return (
    <section className="w-full">
      
      {/* -------------------- MOBILE / TABLET VIEW (< md) -------------------- */}
      <div className="flex w-full flex-col md:hidden">
        {/* Top Image */}
        <div className="relative w-full aspect-square sm:aspect-video">
          <img
            src="/Images/AboutFullWidth.webp"
            alt="IPR Resources"
            className="h-full w-full object-cover object-[30%_20%]"
          />
        </div>
        
        {/* Text Block using Global Tokens */}
        <div className="flex w-full flex-col items-start gap-[var(--S32)] bg-[var(--accent-main)] px-[var(--S24)] py-[var(--S56)]">
          
          {/* Using fluid heading-h4 instead of hardcoded sizing */}
          <p className="heading-h5 text-white">
            “We will help you locate the IPR resources, legal materials, judgments, research papers, or reference documents you require. If a particular resource is not presently available in our repository, submit a request and we will endeavour to source and include relevant material for the wider IPR community”
          </p>
          
          <button className="flex items-center justify-center rounded-[var(--R8)] bg-[var(--background)] px-[var(--S24)] py-[var(--S8)] font-secondary font-medium tracking-wider text-[var(--primary-main)] uppercase transition-opacity hover:opacity-90">
            Request resource
          </button>
        </div>
      </div>

      {/* -------------------- DESKTOP VIEW (>= md) -------------------- */}
      <div
        className="relative hidden w-full min-h-[450px] flex-col items-center justify-center px-[var(--S40)] py-[var(--S64)] md:flex"
        style={{
          backgroundImage: 'url(/Images/AboutFullWidth.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <div className="relative z-10 flex w-full max-w-[1080px] flex-col items-start gap-[var(--S40)]">
          
          {/* Using fluid heading-h3 instead of hardcoded sizing */}
          <p className="heading-h5 text-white">
            “We will help you locate the IPR resources, legal materials, judgments, research papers, or reference documents you require. If a particular resource is not presently available in our repository, submit a request and we will endeavour to source and include relevant material for the wider IPR community”
          </p>
          
          <button className="flex items-center justify-center rounded-[var(--R8)] bg-[var(--background)] px-[var(--S24)] py-[var(--S8)] font-secondary font-medium text-[var(--primary-main)] shadow-md transition-transform hover:scale-105">
            Request resource
          </button>
        </div>
      </div>

    </section>
  );
}