import SearchClient from "./SearchClient";
import { getGlobalSearchData } from "@/lib/homeFetchers"; // 🔥 IMPORT YOUR MASTER FETCHER!

export const metadata = {
  title: "Search Results | Arshiv Legal",
  robots: "noindex, nofollow",
};

export const revalidate = 0; // Ensures search always checks for the newest uploads

export default async function GlobalSearchPage() {
  // 🔥 FETCH FROM ALL 5 DATABASES INSTANTLY
  const searchData = await getGlobalSearchData();
  
  return <SearchClient initialData={searchData} />;
}