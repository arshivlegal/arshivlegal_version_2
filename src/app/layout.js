import { Source_Sans_3, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SEO_CONFIG } from "@/lib/seo-config";
import JsonLd from "@/components/JsonLd";
import { getOrganizationSchema } from "@/utils/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DisclaimerGate from "@/components/Disclaimer";

// --------------------------------SEO----------------------------------------

// 🔥 GLOBAL METADATA DEFAULTS (Inherited by all pages unless overridden)
export const metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: `${SEO_CONFIG.siteName} | Intellectual Property Rights (IPR) Experts`,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.description,
  keywords: [
    "Arshiv Legal",
    "Intellectual Property Rights India",
    "IPR experts Kanpur",
    "Patent registration",
    "Trademark lawyers",
    "Copyright protection",
    "IP resources for innovators",
  ],
  // Removed global canonical to prevent inheritance issues.
  // Each page will define its own canonical URL explicitly.
  openGraph: {
    siteName: SEO_CONFIG.siteName,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${SEO_CONFIG.siteName} - IPR Experts`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
  },
};

//-------------------------------SEO END ----------------------------------

const Primary = Playfair_Display({
  variable: "--font-Playfair_Display-Serif",
  subsets: ["latin"],
  display: "swap",
});

const Secondary = Source_Sans_3({
  variable: "--font-Source_Sans_3-sans-serif",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={`${Primary.variable} ${Secondary.variable} antialiased`}>
        
        {/* 🔥 Global Organization Schema - Appears on every page to build massive Google Authority */}
        <JsonLd data={getOrganizationSchema()} />
        
        <DisclaimerGate />
        <Navbar />
        {children}
        <Footer />
        
      </body>
    </html>
  );
}