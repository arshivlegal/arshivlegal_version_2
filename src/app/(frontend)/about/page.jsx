import React from "react";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getPersonSchema,
  getOrganizationSchema,
} from "@/utils/schema";

// --- UI Components ---
import AboutHero from "@/Sections/About/AboutHero";
import Founder from "@/Sections/About/Founder";
import ResourceRequest from "@/Sections/About/ResourceRequest";
import ExploreKnowledge from "@/Sections/About/ExploreKnowledge";
import GrowingResource from "@/Sections/About/GrowingResource";
import FAQSection from "@/components/FAQSection";

//----------------------------------------------------------
// 🔥 SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "About Us | Arshiv Legal — IPR & Legal Experts",
  description:
    "Arshiv Legal is an Intellectual Property Rights (IPR) knowledge platform. We empower researchers, students, and innovators with expert resources on patents, trademarks, and copyright law.",
  alternates: {
    canonical: canonicalize("/about"),
  },
  keywords: [
    "about arshiv legal",
    "IPR law firm kanpur",
    "intellectual property resources",
    "patent registration guidance",
    "trademark experts kanpur",
    "IP support for researchers",
    "copyright law education",
  ],
  openGraph: {
    title: "About Us | Arshiv Legal — IPR & Legal Experts",
    description:
      "Empowering innovators and researchers with structured legal guidance on Intellectual Property Rights, patents, and trademarks.",
    url: canonicalize("/about"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", // Ensure you have this image in your public folder
        width: 1200,
        height: 630,
        alt: "Arshiv Legal – IPR Law Experts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Arshiv Legal — IPR & Legal Experts",
    description:
      "Empowering innovators and researchers with structured legal guidance on Intellectual Property Rights.",
    images: ["/og-default.jpg"],
  },
};

//----------------------------------------------------------
// 🎨 MAIN PAGE COMPONENT
//----------------------------------------------------------
export default function AboutPage() {
  
  // 1. Page Schema
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/about"),
    type: "AboutPage",
  });

  // 2. Breadcrumbs
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "About Us", url: canonicalize("/about") },
  ]);

  // 3. Organization Schema (Inherits from your global setup)
  const organizationSchema = getOrganizationSchema();

  // 4. Person Schema (Tells Google who the Founder is to build E-E-A-T authority)
  const personSchema = getPersonSchema({
    name: "Aryan Pandey",
    jobTitle: "Principal Legal Professional & Founder",
    image: `${SEO_CONFIG.siteUrl}/Images/AboutFounder.webp`,
    url: canonicalize("/about"),
    description:
      "Aryan Pandey is the founder of Arshiv Legal, dedicated to providing structured Intellectual Property Rights (IPR) guidance for students, researchers, and innovators.",
    sameAs: [SEO_CONFIG.social.LinkedIn].filter(Boolean),
  });

  // Combine all schemas
  const ld = [pageSchema, breadcrumbSchema, organizationSchema, personSchema];

  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden bg-[var(--background)]">
      
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
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