"use client";

import { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { SubNav } from "./SubNav";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryIcons } from "./CategoryIcons";
import { HeroSlider } from "./HeroSlider";
import { ProductSlider } from "./ProductSlider";
import { TrustPillars } from "./TrustPillars";
import { Footer } from "./Footer";
import { fetchProducts, type ApiProduct, type ApiBanner } from "@/lib/api";

export interface HomePageContentProps {
  initialTrending?: ApiProduct[];
  initialDeals?: ApiProduct[];
  initialNewArrivals?: ApiProduct[];
  initialBestSellers?: ApiProduct[];
  initialFeatured?: ApiProduct[];
  initialBanners?: ApiBanner[];
}

export function HomePageContent({
  initialTrending = [],
  initialDeals = [],
  initialNewArrivals = [],
  initialBestSellers = [],
  initialFeatured = [],
  initialBanners = [],
}: HomePageContentProps = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic slider states initialized with server-fetched products (Instant 0ms display!)
  const [trending, setTrending] = useState<ApiProduct[]>(initialTrending);
  const [deals, setDeals] = useState<ApiProduct[]>(initialDeals);
  const [newProds, setNewProds] = useState<ApiProduct[]>(initialNewArrivals);
  const [bestSellersList, setBestSellersList] = useState<ApiProduct[]>(initialBestSellers);
  const [featuredList, setFeaturedList] = useState<ApiProduct[]>(initialFeatured);

  // If server-side fetch was empty (e.g. cold start / fallback), load from client on mount
  useEffect(() => {
    const hasInitialData =
      initialTrending.length > 0 ||
      initialDeals.length > 0 ||
      initialNewArrivals.length > 0 ||
      initialBestSellers.length > 0 ||
      initialFeatured.length > 0;

    if (hasInitialData) {
      return;
    }

    let isMounted = true;

    // 1. Trending / Hot Products from Database
    fetchProducts({ is_featured: true, per_page: 8 })
      .then((res) => {
        if (isMounted && res.products) setTrending(res.products);
      })
      .catch(() => {});

    // 2. Deals Under 499 from Database
    fetchProducts({ max_price: 499, per_page: 8 })
      .then((res) => {
        if (isMounted && res.products) setDeals(res.products);
      })
      .catch(() => {});

    // 3. New Arrivals from Database
    fetchProducts({ sort: "newest", per_page: 8 })
      .then((res) => {
        if (isMounted && res.products) setNewProds(res.products);
      })
      .catch(() => {});

    // 4. Best Sellers from Database
    fetchProducts({ sort: "best-selling", per_page: 8 })
      .then((res) => {
        if (isMounted && res.products) setBestSellersList(res.products);
      })
      .catch(() => {});

    // 5. Featured Catalog from Database
    fetchProducts({ sort: "featured", per_page: 8 })
      .then((res) => {
        if (isMounted && res.products) setFeaturedList(res.products);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [initialTrending, initialDeals, initialNewArrivals, initialBestSellers, initialFeatured]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Top Announcement Bar */}
      <TopBar />

      {/* 2. Main Sticky Header with Menu Trigger */}
      <Header onOpenSidebar={() => setSidebarOpen(true)} />

      {/* 3. Secondary Navigation */}
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      {/* 4. Interactive Category Sidebar Drawer */}
      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 5. Category Icons Strip (Dynamic from DB) */}
        <CategoryIcons />

        {/* 6. Multi-Slide Hero Carousel */}
        <HeroSlider initialBanners={initialBanners} />

        {/* 7. Section 1: Trending Products Slider (Dynamic from DB) */}
        <ProductSlider
          title="Trending Products"
          subtitle="Most loved products right now"
          iconType="flame"
          products={trending}
          seeAllHref="/shop?sort=featured"
        />

        {/* 8. Section 2: Deals Under ৳499 Slider (Dynamic from DB) */}
        <ProductSlider
          title="Deals Under ৳499"
          subtitle="Great products. Even better prices."
          iconType="tag"
          products={deals}
          seeAllHref="/shop?max=499&tag=under-499"
        />

        {/* 9. Section 3: New Arrivals Slider (Dynamic from DB) */}
        <ProductSlider
          title="New Arrivals"
          subtitle="Be the first to explore our latest products"
          iconType="star"
          products={newProds}
          seeAllHref="/shop?sort=newest"
        />

        {/* 10. Section 4: Best Sellers Slider (Dynamic from DB) */}
        <ProductSlider
          title="Best Sellers"
          subtitle="Customer favorites with top-rated reviews"
          iconType="trophy"
          products={bestSellersList}
          seeAllHref="/shop?sort=best-selling"
        />

        {/* 11. Section 5: Featured Products Slider (Dynamic from DB) */}
        <ProductSlider
          title="Featured Products"
          subtitle="Handpicked smart gadgets and daily essentials"
          iconType="sparkles"
          products={featuredList}
          seeAllHref="/shop"
        />

        {/* 12. Trust & Guarantee Pillars */}
        <TrustPillars />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}
