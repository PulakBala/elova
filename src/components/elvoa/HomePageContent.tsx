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
import {
  trendingProducts as defaultTrending,
  dealsUnder499 as defaultDeals,
  newArrivals as defaultNew,
  bestSellers as defaultBestSellers,
  featuredProducts as defaultFeatured,
} from "@/data/products";
import { fetchProducts } from "@/lib/api";

export function HomePageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic slider states initialized with immediate mock fallback for zero hydration lag
  const [trending, setTrending] = useState<any[]>(defaultTrending);
  const [deals, setDeals] = useState<any[]>(defaultDeals);
  const [newProds, setNewProds] = useState<any[]>(defaultNew);
  const [bestSellersList, setBestSellersList] = useState<any[]>(defaultBestSellers);
  const [featuredList, setFeaturedList] = useState<any[]>(defaultFeatured);

  useEffect(() => {
    // 1. Trending / Hot Products from Database
    fetchProducts({ is_featured: true, per_page: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) setTrending(res.products);
      })
      .catch(() => {});

    // 2. Deals Under 499 from Database
    fetchProducts({ max_price: 499, per_page: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) setDeals(res.products);
      })
      .catch(() => {});

    // 3. New Arrivals from Database
    fetchProducts({ sort: "newest", per_page: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) setNewProds(res.products);
      })
      .catch(() => {});

    // 4. Best Sellers from Database
    fetchProducts({ sort: "best-selling", per_page: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) setBestSellersList(res.products);
      })
      .catch(() => {});

    // 5. Featured Catalog from Database
    fetchProducts({ sort: "featured", per_page: 8 })
      .then((res) => {
        if (res.products && res.products.length > 0) setFeaturedList(res.products);
      })
      .catch(() => {});
  }, []);

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
        <HeroSlider />

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
