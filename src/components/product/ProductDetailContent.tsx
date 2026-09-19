"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  Check,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { ProductCard } from "@/components/elvoa/ProductCard";
import { useShop } from "@/context/ShopContext";
import { resolveAssetUrl, type ApiProduct, type ApiProductVariant } from "@/lib/api";

interface ProductDetailContentProps {
  product: ApiProduct;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Gallery Images
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.gallery && product.gallery.length > 0) {
      product.gallery.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    if (product.variants) {
      product.variants.forEach((v) => {
        if (v.image && !list.includes(v.image)) list.push(v.image);
      });
    }
    return list.length > 0 ? list : ["/images/products/placeholder.jpg"];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variants list
  const variants = product.variants || [];

  // Currently selected variant (defaults to first or default_variant_id)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(() => {
    if (product.default_variant_id) return product.default_variant_id;
    if (variants.length > 0) return variants[0].id;
    return null;
  });

  const selectedVariant = useMemo<ApiProductVariant | null>(() => {
    if (!selectedVariantId || variants.length === 0) {
      return variants[0] || null;
    }
    return variants.find((v) => v.id === selectedVariantId) || variants[0] || null;
  }, [selectedVariantId, variants]);

  // Selected Color and Size filters for variant matrix
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return selectedVariant?.color || product.colors?.[0] || "Standard";
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return selectedVariant?.size || product.sizes?.[0] || "Standard";
  });

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // When user clicks a color swatch, switch to variant with that color
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const match = variants.find(
      (v) =>
        v.color?.toLowerCase() === color.toLowerCase() &&
        (!selectedSize || v.size?.toLowerCase() === selectedSize.toLowerCase())
    ) || variants.find((v) => v.color?.toLowerCase() === color.toLowerCase());

    if (match) {
      setSelectedVariantId(match.id);
      if (match.image) {
        const imgIdx = galleryImages.findIndex((img) => img === match.image);
        if (imgIdx !== -1) setActiveImageIndex(imgIdx);
      }
    }
  };

  // When user clicks a size pill, switch to variant with that size
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const match = variants.find(
      (v) =>
        v.size?.toLowerCase() === size.toLowerCase() &&
        (!selectedColor || v.color?.toLowerCase() === selectedColor.toLowerCase())
    ) || variants.find((v) => v.size?.toLowerCase() === size.toLowerCase());

    if (match) {
      setSelectedVariantId(match.id);
    }
  };

  // Effective price & stock calculations
  const effectivePrice = selectedVariant?.effective_price ?? product.price;
  const regularPrice = selectedVariant?.regular_price ?? product.original_price ?? null;
  const stockQuantity = selectedVariant?.stock_quantity ?? product.total_stock ?? 10;
  const isInStock = selectedVariant ? selectedVariant.in_stock : product.in_stock;
  const isWishlisted = isInWishlist(String(product.id));

  // Discount percentage
  const discountPercent =
    regularPrice && regularPrice > effectivePrice
      ? Math.round(((regularPrice - effectivePrice) / regularPrice) * 100)
      : null;

  // Active Tab
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const handleAddToCart = () => {
    if (!isInStock) return;
    addToCart(product, {
      size: selectedVariant?.size || selectedSize,
      color: selectedVariant?.color || selectedColor,
      quantity,
      variantId: selectedVariant?.id,
      price: effectivePrice,
      image: galleryImages[activeImageIndex] || product.image,
    });
  };

  const handleBuyNow = () => {
    if (!isInStock) return;
    addToCart(product, {
      size: selectedVariant?.size || selectedSize,
      color: selectedVariant?.color || selectedColor,
      quantity,
      variantId: selectedVariant?.id,
      price: effectivePrice,
      image: galleryImages[activeImageIndex] || product.image,
    });
    router.push("/checkout");
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

      {/* 2. Main Product Content */}
      <main className="flex-1 py-4 sm:py-8">
        <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <Link href="/shop" className="hover:text-neutral-900 transition-colors">
              Shop
            </Link>
            {product.category && (
              <>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="font-semibold text-neutral-900 truncate max-w-xs">
              {product.title}
            </span>
          </nav>

          {/* Product Primary Grid: Gallery (Left) + Details (Right) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Left Column: Image Gallery (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Main Featured Image Box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-xs">
                <Image
                  src={resolveAssetUrl(galleryImages[activeImageIndex])}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-all duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {discountPercent && (
                    <span className="rounded-lg bg-[#D92D20] px-2.5 py-1 text-xs font-extrabold text-white shadow-xs">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="rounded-lg bg-[#FF5B37] px-2.5 py-1 text-xs font-extrabold text-white shadow-xs">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product as any)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xs transition-all active:scale-90 cursor-pointer shadow-md ${
                    isWishlisted
                      ? "bg-white text-[#FF5B37]"
                      : "bg-white/90 text-neutral-600 hover:text-[#FF5B37] hover:bg-white"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isWishlisted ? "fill-[#FF5B37] text-[#FF5B37]" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnail Selector Strip */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-50 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#FF5B37] shadow-xs"
                          : "border-neutral-200/80 hover:border-neutral-300"
                      }`}
                    >
                      <Image
                        src={resolveAssetUrl(img)}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Pricing, Variants, Actions (6 cols) */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Brand & Category Label */}
              {product.brand && (
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B37]">
                  {product.brand.name}
                </span>
              )}

              {/* Product Title */}
              <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Ratings and Review Summary */}
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-neutral-200 text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-900 ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-500 font-medium">
                  {product.reviews_count} {product.reviews_count === 1 ? "Review" : "Reviews"}
                </span>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs text-neutral-500 font-medium">
                  {product.sales_count}+ Sold
                </span>
              </div>

              {/* Live Pricing Breakdown */}
              <div className="mt-4 flex items-baseline gap-3 border-y border-neutral-100 py-3.5 bg-neutral-50/50 px-4 rounded-xl">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#D92D20]">
                  ৳{effectivePrice.toLocaleString()}
                </span>
                {regularPrice && regularPrice > effectivePrice && (
                  <span className="text-base text-neutral-400 line-through">
                    ৳{regularPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent && (
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    Save ৳{((regularPrice || 0) - effectivePrice).toLocaleString()} ({discountPercent}%)
                  </span>
                )}
              </div>

              {/* Stock Status & SKU */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full ${
                      isInStock ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className="font-semibold text-neutral-800">
                    {isInStock ? (
                      stockQuantity <= 5 ? (
                        <strong className="text-amber-600">
                          Low Stock: Only {stockQuantity} items left!
                        </strong>
                      ) : (
                        <strong className="text-emerald-700">In Stock ({stockQuantity} available)</strong>
                      )
                    ) : (
                      <strong className="text-rose-600">Out of Stock</strong>
                    )}
                  </span>
                </div>
                <span className="text-neutral-400">
                  SKU: <strong className="text-neutral-600">{selectedVariant?.sku || product.sku}</strong>
                </span>
              </div>

              {/* Color Swatches / Picker */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <label className="text-xs font-bold text-neutral-900 block mb-2">
                    Color: <span className="font-normal capitalize text-neutral-600">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#FF5B37] bg-[#FF5B37]/10 text-[#FF5B37] shadow-xs font-bold ring-1 ring-[#FF5B37]"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Pills / Picker */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-neutral-900 block mb-2">
                    Size / Variant: <span className="font-normal text-neutral-600">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize.toLowerCase() === size.toLowerCase();
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeSelect(size)}
                          className={`rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#FF5B37] bg-[#FF5B37]/10 text-[#FF5B37] shadow-xs font-bold ring-1 ring-[#FF5B37]"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold text-neutral-900">Quantity:</span>
                <div className="flex items-center rounded-xl border border-neutral-300 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || !isInStock}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
                    disabled={quantity >= stockQuantity || !isInStock}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {stockQuantity > 0 && (
                  <span className="text-[11px] text-neutral-400">
                    Max: {stockQuantity} per order
                  </span>
                )}
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1 w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF5B37] py-3 px-6 text-sm font-bold text-white shadow-md hover:bg-[#eb4e2a] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <ShoppingCart className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isInStock}
                  className="flex-1 w-full flex items-center justify-center gap-2 rounded-xl bg-[#111827] py-3 px-6 text-sm font-bold text-white shadow-md hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Value Propositions & Delivery Strip */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#FF5B37] shrink-0" />
                  <span>
                    <strong>24–48h Delivery</strong> inside Dhaka, 2–4 days nationwide.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>7 Days Easy Return</strong> if damaged or not as described.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>100% Original</strong> guaranteed products.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Cash on Delivery</strong> available nationwide.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description, Specs & Reviews Tabs */}
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <div className="flex items-center gap-6 border-b border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                  activeTab === "description"
                    ? "border-[#FF5B37] text-[#FF5B37]"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Product Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`pb-3 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                  activeTab === "specs"
                    ? "border-[#FF5B37] text-[#FF5B37]"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-sm font-bold transition-all cursor-pointer border-b-2 ${
                  activeTab === "reviews"
                    ? "border-[#FF5B37] text-[#FF5B37]"
                    : "border-transparent text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Customer Reviews ({product.reviews_count})
              </button>
            </div>

            <div className="py-6">
              {activeTab === "description" && (
                <div className="prose prose-sm max-w-none text-neutral-700 leading-relaxed space-y-4">
                  <p>{product.description || product.short_description || "No description provided."}</p>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="max-w-xl rounded-xl border border-neutral-200 divide-y divide-neutral-100 text-xs">
                  <div className="flex justify-between p-3">
                    <span className="font-semibold text-neutral-500">Base SKU</span>
                    <span className="font-bold text-neutral-900">{product.sku}</span>
                  </div>
                  {product.category && (
                    <div className="flex justify-between p-3">
                      <span className="font-semibold text-neutral-500">Category</span>
                      <span className="font-bold text-neutral-900">{product.category.name}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between p-3">
                      <span className="font-semibold text-neutral-500">Brand</span>
                      <span className="font-bold text-neutral-900">{product.brand.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="font-semibold text-neutral-500">Total Variants</span>
                    <span className="font-bold text-neutral-900">{variants.length} available</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4 max-w-3xl">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-900">
                              {rev.user_name}
                            </span>
                            {rev.is_verified_purchase && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                <Check className="h-3 w-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1 flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                          ))}
                        </div>
                        {rev.title && (
                          <h4 className="mt-2 text-xs font-bold text-neutral-900">
                            {rev.title}
                          </h4>
                        )}
                        <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                          {rev.review_text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-500">
                      No customer reviews yet. Be the first to order and leave a review!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products Carousel / Grid */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-12 border-t border-neutral-200 pt-8">
              <h2 className="text-lg font-bold text-neutral-900 mb-5">
                Related Products in {product.category?.name || "this collection"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {product.related_products.map((rel) => (
                  <ProductCard key={rel.id} product={rel} className="h-full" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

