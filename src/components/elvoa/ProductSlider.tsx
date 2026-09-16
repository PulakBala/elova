"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Tag,
  Star,
  Trophy,
  Sparkles,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

interface ProductSliderProps {
  title: string;
  subtitle: string;
  iconType: "flame" | "tag" | "star" | "trophy" | "sparkles";
  products: Product[];
  seeAllHref?: string;
}

export function ProductSlider({
  title,
  subtitle,
  iconType,
  products,
  seeAllHref = "/shop",
}: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const renderIcon = () => {
    switch (iconType) {
      case "flame":
        return <Flame className="h-4.5 w-4.5 fill-[#FF5B37] text-[#FF5B37]" />;
      case "tag":
        return <Tag className="h-4.5 w-4.5 fill-[#16A34A] text-[#16A34A]" />;
      case "star":
        return <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />;
      case "trophy":
        return <Trophy className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />;
      case "sparkles":
        return <Sparkles className="h-4.5 w-4.5 fill-[#2563EB] text-[#2563EB]" />;
    }
  };

  return (
    <section className="w-full bg-white py-4 sm:py-5">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-3.5">
          <div className="flex items-start gap-2 sm:gap-2.5">
            <div className="mt-0.5 shrink-0">{renderIcon()}</div>
            <div>
              <h2 className="text-base sm:text-lg lg:text-[19px] font-bold text-neutral-900 leading-tight">
                {title}
              </h2>
              <p className="mt-0.5 text-[11.5px] sm:text-[12.5px] text-neutral-500">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Action: Minimal Cute Slider Buttons + "See All" */}
          <div className="flex items-center gap-3">
            <Link
              href={seeAllHref}
              className="group flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-neutral-800 transition-colors hover:text-[#FF5B37]"
            >
              <span>See All</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Cute Minimal Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-neutral-200">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous items"
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border transition-all ${
                  canScrollLeft
                    ? "border-neutral-300 bg-white text-neutral-800 hover:border-[#FF5B37] hover:text-[#FF5B37] hover:shadow-xs active:scale-95"
                    : "border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next items"
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-full border transition-all ${
                  canScrollRight
                    ? "border-neutral-300 bg-white text-neutral-800 hover:border-[#FF5B37] hover:text-[#FF5B37] hover:shadow-xs active:scale-95"
                    : "border-neutral-200 bg-neutral-100 text-neutral-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(16.666%-12px)] shrink-0 snap-start"
            >
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

