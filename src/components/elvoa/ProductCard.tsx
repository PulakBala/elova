"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const isWishlisted = isInWishlist(product.id);
  const isDiscount = product.badge?.type === "discount";
  const isNew = product.badge?.type === "new";
  const isHot = product.badge?.type === "hot";

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-white p-2 sm:p-2.5 transition-all duration-300 hover:border-neutral-300 hover:shadow-md ${className}`}
    >
      <div>
        {/* Product Image Box with Badge & Wishlist Action */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-lg bg-neutral-100/70">
          <Link href={`/product/${product.id}`} className="block h-full w-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-106"
            />
          </Link>

          {/* Badge (Top-Left) */}
          {product.badge && (
            <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
              <span
                className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-white shadow-xs tracking-tight ${
                  isDiscount
                    ? "bg-[#D92D20]"
                    : isNew
                    ? "bg-[#079455]"
                    : isHot
                    ? "bg-[#FF5B37]"
                    : "bg-neutral-800"
                }`}
              >
                {product.badge.text}
              </span>
            </div>
          )}

          {/* Wishlist Toggle Button (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-1.5 right-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-xs transition-transform active:scale-90 cursor-pointer shadow-xs ${
              isWishlisted
                ? "bg-white text-[#FF5B37]"
                : "bg-white/85 text-neutral-600 hover:text-[#FF5B37] hover:bg-white"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                isWishlisted ? "fill-[#FF5B37] text-[#FF5B37]" : ""
              }`}
            />
          </button>
        </div>

        {/* Product Title */}
        <h3 className="mt-2 text-[11.5px] sm:text-[12.5px] font-medium leading-snug text-neutral-900 line-clamp-2 group-hover:text-[#FF5B37] transition-colors min-h-[32px]">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h3>

        {/* Rating and Reviews */}
        <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-[11.5px]">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-bold text-neutral-800">{product.rating}</span>
          <span className="text-neutral-400">({product.reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[13.5px] sm:text-[14.5px] font-bold text-[#D92D20]">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] sm:text-[12px] text-neutral-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* "Add to Cart" Button */}
      <button
        type="button"
        onClick={() => addToCart(product)}
        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FF5B37] py-1.5 px-3 text-[11.5px] sm:text-[12px] font-bold text-white shadow-xs transition-all hover:bg-[#eb4e2a] hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B37] cursor-pointer active:scale-[0.98]"
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
