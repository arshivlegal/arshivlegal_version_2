import AboutHero from "@/Sections/About/AboutHero";
import Founder from "@/Sections/About/Founder";
import ResourceRequest from "@/Sections/About/ResourceRequest";
import ExploreKnowledge from "@/Sections/About/ExploreKnowledge";
import GrowingResource from "@/Sections/About/GrowingResource";
import FAQSection from "@/components/FAQSection"; // Assuming it is in your components folder

export const metadata = {
  title: "About Us | Arshiv Legal",
  description: "Arshiv Legal is a knowledge and resource platform dedicated to Intellectual Property Rights (IPR) and intellectual property law.",
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden bg-[var(--background)]">
      
      {/* 1. Video & Intro Text */}
      <AboutHero />
      
      {/* 2. Founder Story Section */}
      <Founder />
      
      {/* 3. Brown Banner / Request Resource */}
      <ResourceRequest />
      
      {/* 4. Zig-Zag Editorial Content (Videos, PDFs, Articles) */}
      <ExploreKnowledge />
      
      {/* 5. Edge-to-Edge Supreme Court Image */}
      <GrowingResource />
      
      {/* 6. Frequently Asked Questions (Interactive Global Component) */}
      <FAQSection />

    </main>
  );
}