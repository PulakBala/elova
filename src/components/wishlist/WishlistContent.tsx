"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { useShop } from "@/context/ShopContext";
import { resolveAssetUrl } from "@/lib/api";

export function WishlistContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { wishlist, removeFromWishlist, moveToCart, addToCart } = useShop();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item);
      removeFromWishlist(item.id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Global Navigation */}
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Container */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <Link href="/shop" className="hover:text-neutral-900 transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="font-semibold text-neutral-900">
              My Wishlist
            </span>
          </nav>

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-5 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-[#FF5B37] fill-[#FF5B37]" />
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-neutral-900">
                  My Wishlist
                </h1>
                <span className="ml-1 flex h-6 items-center justify-center rounded-full bg-neutral-100 px-2.5 text-xs font-bold text-neutral-700">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                Save your favorite items now, grab them whenever you&apos;re ready!
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Move All to Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Wishlist Grid or Empty State */}
          <div className="pt-6">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {wishlist.map((product) => {
                  const inStock = product.inStock !== false;

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-3 sm:p-4 shadow-2xs hover:border-neutral-300 hover:shadow-md transition-all"
                    >
                      {/* Top Remove Action Button */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label="Remove item"
                        title="Remove from wishlist"
                        className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-400 hover:text-red-500 hover:bg-white shadow-2xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Image Thumbnail */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100/70">
                        <Link
                          href={`/products/${product.slug || product.id}`}
                          className="relative block h-full w-full"
                        >
                          <Image
                            src={resolveAssetUrl(product.image)}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {product.badge && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center rounded-md bg-[#D92D20] px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
                              {product.badge.text}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="mt-3 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Stock Status Tag */}
                          <div className="mb-1.5">
                            {inStock ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>In Stock</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                                <AlertCircle className="h-3 w-3" />
                                <span>Out of Stock</span>
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 hover:text-[#FF5B37] transition-colors">
                            <Link href={`/product/${product.id}`}>
                              {product.title}
                            </Link>
                          </h3>

                          {/* Price */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-sm sm:text-base font-bold text-[#D92D20]">
                              ৳{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-neutral-400 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Move to Cart CTA Button */}
                        <button
                          type="button"
                          onClick={() => moveToCart(product)}
                          disabled={!inStock}
                          className={`mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs ${
                            inStock
                              ? "bg-[#FF5B37] text-white hover:bg-[#eb4e2a] active:scale-[0.98] cursor-pointer"
                              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>{inStock ? "Move to Cart" : "Out of Stock"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Wishlist State */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/70 p-12 sm:p-16 text-center my-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs border border-neutral-200 text-neutral-400 mb-4">
                  <Heart className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Your wishlist is empty
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-sm">
                  Found something you like? Tap the heart icon on any product to save it right here for later!
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF5B37] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Discover Trending Products</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

