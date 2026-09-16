"use client";

import { useState } from "react";
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
  trendingProducts,
  dealsUnder499,
  newArrivals,
  bestSellers,
  featuredProducts,
} from "@/data/products";

export function HomePageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        {/* 5. Category Icons Strip */}
        <CategoryIcons />

        {/* 6. Multi-Slide Hero Carousel */}
        <HeroSlider />

        {/* 7. Section 1: Trending Products Slider */}
        <ProductSlider
          title="Trending Products"
          subtitle="Most loved products right now"
          iconType="flame"
          products={trendingProducts}
          seeAllHref="/trending"
        />

        {/* 8. Section 2: Deals Under ৳499 Slider */}
        <ProductSlider
          title="Deals Under ৳499"
          subtitle="Great products. Even better prices."
          iconType="tag"
          products={dealsUnder499}
          seeAllHref="/under-499"
        />

        {/* 9. Section 3: New Arrivals Slider */}
        <ProductSlider
          title="New Arrivals"
          subtitle="Be the first to explore our latest products"
          iconType="star"
          products={newArrivals}
          seeAllHref="/new-arrivals"
        />

        {/* 10. Section 4: Best Sellers Slider */}
        <ProductSlider
          title="Best Sellers"
          subtitle="Customer favorites with top-rated reviews"
          iconType="trophy"
          products={bestSellers}
          seeAllHref="/best-sellers"
        />

        {/* 11. Section 5: Featured Products Slider */}
        <ProductSlider
          title="Featured Products"
          subtitle="Handpicked smart gadgets and daily essentials"
          iconType="sparkles"
          products={featuredProducts}
          seeAllHref="/featured"
        />

        {/* 12. Trust & Guarantee Pillars */}
        <TrustPillars />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}

