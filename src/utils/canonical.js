import { SEO_CONFIG } from "@/lib/seo-config";

export function canonicalize(path = "") {
  const baseUrl = SEO_CONFIG.siteUrl.replace(/\/+$/, ""); // Remove trailing slash from base
  const cleanPath = path.replace(/^\/+/, ""); // Remove leading slash from path
  return `${baseUrl}/${cleanPath}`;
}