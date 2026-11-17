import type { Metadata } from "next";
import { HomePageContent } from "@/components/elvoa/HomePageContent";
import { fetchProducts, fetchBannersApi, type ApiProduct, type ApiBanner } from "@/lib/api";

// Incremental Static Regeneration (revalidate cache every 60 seconds)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "ELVOA | Everything You Need, One Place",
  description:
    "Discover smart finds, trending products, daily deals under ৳499, and new arrivals with fast nationwide delivery across Bangladesh. Quality products. Great prices. Only at ELVOA.",
};

export default async function HomePage() {
  let trending: ApiProduct[] = [];
  let deals: ApiProduct[] = [];
  let newArrivals: ApiProduct[] = [];
  let bestSellers: ApiProduct[] = [];
  let featured: ApiProduct[] = [];
  let banners: ApiBanner[] = [];

  try {
    const [trendRes, dealsRes, newRes, bestRes, featRes, bannersRes] = await Promise.all([
      fetchProducts({ is_featured: true, per_page: 8 }),
      fetchProducts({ max_price: 499, per_page: 8 }),
      fetchProducts({ sort: "newest", per_page: 8 }),
      fetchProducts({ sort: "best-selling", per_page: 8 }),
      fetchProducts({ sort: "featured", per_page: 8 }),
      fetchBannersApi("hero_slider"),
    ]);

    trending = trendRes?.products || [];
    deals = dealsRes?.products || [];
    newArrivals = newRes?.products || [];
    bestSellers = bestRes?.products || [];
    featured = featRes?.products || [];
    banners = bannersRes || [];
  } catch (err) {
    console.warn("HomePage server-side fetch failed, client fallback will activate:", err);
  }

  return (
    <HomePageContent
      initialTrending={trending}
      initialDeals={deals}
      initialNewArrivals={newArrivals}
      initialBestSellers={bestSellers}
      initialFeatured={featured}
      initialBanners={banners}
    />
  );
}
