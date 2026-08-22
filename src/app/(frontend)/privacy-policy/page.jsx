import PrivacyPolicy from "@/components/privacyPolicy";
import React from "react";
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
  title: "Privacy Policy & Data Protection | Arshiv Legal",
  description:
    "Read the Arshiv Legal Privacy Policy. Learn how we collect, protect, and manage the personal information and intellectual property queries of innovators, researchers, and students.",
  alternates: {
    canonical: canonicalize("/privacy-policy"),
  },
  keywords: [
    "Arshiv legal privacy policy",
    "IPR platform data protection",
    "innovator privacy policy",
    "confidentiality for researchers",
    "patent query data protection",
    "legal compliance privacy",
  ],
  openGraph: {
    title: "Privacy Policy & Data Protection | Arshiv Legal",
    description:
      "Understand how Arshiv Legal safeguards your data, handles intellectual property inquiries, and ensures compliance with privacy standards.",
    url: canonicalize("/privacy-policy"),
    siteName: SEO_CONFIG.siteName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-default.jpg", 
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Arshiv Legal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Protection | Arshiv Legal",
    description:
      "Understand how Arshiv Legal safeguards your data, handles intellectual property inquiries, and ensures compliance with privacy standards.",
    images: ["/og-default.jpg"],
  },
};

//----------------------------------------------------------
// 🎨 MAIN SERVER PAGE
//----------------------------------------------------------
export default function page() {
  
  // 1. WebPage Schema
  const pageSchema = getWebPageSchema({
    title: metadata.title,
    description: metadata.description,
    url: canonicalize("/privacy-policy"),
    type: "WebPage", // WebPage is the safest and most standard schema for policy pages
  });

  // 2. BreadcrumbSchema
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: canonicalize("/") },
    { name: "Privacy Policy", url: canonicalize("/privacy-policy") },
  ]);

  // 3. Organization schema (Crucial for legal websites to build trust)
  const organizationSchema = getOrganizationSchema();

  const ld = [pageSchema, breadcrumbSchema, organizationSchema];

  return (
    <>
      {/* 🔥 Inject Invisible JSON-LD Schemas into the Head */}
      <JsonLd data={ld} />
      
      <PrivacyPolicy />
    </>
  );
}