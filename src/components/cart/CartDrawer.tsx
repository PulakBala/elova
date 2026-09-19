"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { resolveAssetUrl } from "@/lib/api";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    totalCartItems,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
  } = useShop();

  // Escape key closes drawer & disable body scroll while open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const hasFreeShipping = cartSubtotal >= freeShippingThreshold;

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Slide-Over Cart Drawer */}
      <aside
        aria-label="Shopping Cart Drawer"
        aria-modal="true"
        role="dialog"
        className={`fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[400px] flex-col bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#FF5B37]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Your Bag
            </h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5B37] text-[11px] font-bold text-white">
              {totalCartItems}
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 hover:shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="border-b border-neutral-100 bg-neutral-50/50 px-5 py-3">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            {hasFreeShipping ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>You unlocked FREE Nationwide Delivery!</span>
              </span>
            ) : (
              <span className="text-neutral-600">
                Add <strong>৳{amountNeededForFreeShipping.toLocaleString()}</strong> more for{" "}
                <span className="text-[#FF5B37]">FREE delivery</span>
              </span>
            )}
            <span className="text-[11px] text-neutral-400 font-bold">
              {freeShippingProgress}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                hasFreeShipping ? "bg-emerald-500" : "bg-[#FF5B37]"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-none">
          {cart.length > 0 ? (
            <div className="space-y-4 divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* Item Image Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100">
                    <Image
                      src={resolveAssetUrl(item.image)}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Item Content Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs sm:text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 hover:text-[#FF5B37] transition-colors">
                          <Link href={`/products/${item.productId}`} onClick={closeCart}>
                            {item.title}
                          </Link>
                        </h3>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                        {item.color && (
                          <span className="capitalize">Color: {item.color}</span>
                        )}
                        {item.color && item.size && <span>•</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>

                    {/* Pricing & Quantity Controls */}
                    <div className="mt-2.5 flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-[13.5px] font-bold text-neutral-900">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10.5px] text-neutral-400">
                            (৳{item.price} each)
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50/70 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-white hover:text-neutral-900 hover:shadow-2xs transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
                <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Your cart is empty
              </h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-xs">
                Looks like you haven&apos;t added anything to your cart yet. Explore our top trending products.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#FF5B37] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-all cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer / Checkout Bar */}
        {cart.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50/90 p-4 sm:p-5 shrink-0 space-y-3 shadow-inner">
            {/* Subtotal */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs sm:text-sm font-semibold text-neutral-600">
                Subtotal
              </span>
              <span className="text-base sm:text-lg font-extrabold text-neutral-900">
                ৳{cartSubtotal.toLocaleString()}
              </span>
            </div>

            {/* Estimated Delivery Notice */}
            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>
                Estimated delivery: <strong>24–48h</strong> in Dhaka, <strong>2–4 days</strong> nationwide.
              </span>
            </p>

            {/* Sticky "Proceed to Checkout" Action Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B37] py-3 px-4 text-xs sm:text-[13.5px] font-bold text-white shadow-md hover:bg-[#eb4e2a] active:scale-[0.99] transition-all cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* View full bag / Continue Shopping */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={closeCart}
                className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Safe & Secure</span>
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
