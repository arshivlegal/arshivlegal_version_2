export default function AboutHero() {
  return (
    <section className="flex w-full flex-col items-center bg-[var(--background)] pb-[var(--S64)] lg:pb-[120px]">
      
      {/* -------------------- VIDEO WRAPPER -------------------- */}
      {/* 
        MOBILE: h-[85vh] makes it cover nearly the whole screen. rounded-b-[24px] gives the bottom curve.
        DESKTOP (lg:): Resets back to aspect-video (16:9) and removes the rounded corners to stretch edge-to-edge.
      */}
      <div className="relative w-full h-[85vh] lg:h-auto lg:aspect-video overflow-hidden rounded-b-[24px] lg:rounded-none">
        {/* Replace the image placeholder below with your actual <video> tag later */}
        <video
        muted
          autoPlay
          loop
          src="/Images/AboutArshivLegal.mp4" 
          alt="Arshiv Legal Video" 
          className="h-full w-full object-cover"
        />
      </div>

      {/* -------------------- INTRO TEXT AREA -------------------- */}
      <div className="flex w-full max-w-7xl flex-col lg:flex-row items-start justify-between gap-[var(--S40)] lg:gap-[var(--S64)] px-[var(--S24)] md-px-[0px] pt-[var(--S64)] lg:px-[var(--S40)] lg:pt-[var(--S64)]">
        
        {/* Left Heading Block */}
        <div className="flex w-full lg:max-w-[740px] flex-col">
          <h2 className="text-[24px] md:text-[36px] font-secondary font-medium text-[var(--foreground)]">
            <span className="font-primary font-bold text-[var(--accent-main)]">Arshiv Legal</span>
            {" "}is a knowledge and resource platform dedicated to Intellectual Property Rights (IPR) and intellectual property law.
          </h2>
        </div>

        {/* Right Paragraph Block */}
        <div className="flex w-full lg:w-[60%] flex-col lg:mt-2">
          <p className=" text-[16px] md:text-[20px] font-secondary font-normal text-[var(--text-secondary)]">
            We bring together structured resources on Intellectual Property Rights, including trademark, patent, copyright, industrial design, geographical indications, trade secrets, and other areas of intellectual property law.
          </p>
        </div>

      </div>
    </section>
  );
}