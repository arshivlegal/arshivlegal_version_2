import { SEO_CONFIG } from '@/lib/seo-config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // 🔥 Block Google from indexing your secure CMS routes
        disallow: ['/dashboard/', '/api/', '/login'],
      },
    ],
    // Point to the sitemap that Next.js generates
    sitemap: `${SEO_CONFIG.siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}