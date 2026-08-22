import React from "react";
import TermsOfUse from "@/components/TermsOfUse";
import JsonLd from "@/components/JsonLd";
import { SEO_CONFIG } from "@/lib/seo-config";
import { canonicalize } from "@/utils/canonical";
import {
  getWebPageSchema,
  getBreadcrumbSchema,
  getOrganizationSchema,
} from "@/utils/schema";

//----------------------------------------------------------
// 🔥 SEO METADATA
//----------------------------------------------------------
export const metadata = {
  title: "Terms of Use & Legal Disclaimer | Arshiv Legal",
  description:
    "Read the Terms of Use governing access to Arshiv Legal's Intellectual Property Rights (IPR) platform. Understand user obligations, content copyrights, and legal disclaimers.",
  alternates: {
    canonical: canonicalize("/terms-of-use"),
  },
  keywords: [
    "Arshiv legal terms of use",
    "IPR platform terms and conditions",
    "intellectual property website terms",
    "legal website disclaimer",
    "patent resources disclaimer",
    "trademark guidance terms",
    "user responsibilities IP platform",
  ],
  openGraph: {
    title: "Terms of Use & Legal Disclaimer | Arshiv Legal",
    description:
      "Understand the terms, conditions, and disclaimers applicable to the use of Arshiv Legal's educational IPR resources and services.",
    url: canonicalize("/terms-of-use"),
    siteName: SEO_CONFIG.siteName,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Terms of Use - Arshiv Legal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use & Legal Disclaimer | Arshiv Legal",
    description:
      "Terms and conditions governing the use of the Arshiv Legal website and its IPR content.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default function Page() {
  
  // 1. WebPage Schema
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/terms-of-use"),
    type: "WebPage",
  });

  // 2. BreadcrumbSchema
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Terms of Use", url: canonicalize("/terms-of-use") },
  ]);

  // 3. Organization schema (Crucial for legal websites to build trust)
  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <TermsOfUse />
    </>
  );
}