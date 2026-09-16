"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tag,
  Check,
  X,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";
import { useShop, type CartItem } from "@/context/ShopContext";

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed" | "freeship";
  amount: number;
}

interface OrderSummaryProps {
  deliveryFee: number;
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (coupon: AppliedCoupon | null) => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

export function OrderSummary({
  deliveryFee,
  appliedCoupon,
  onApplyCoupon,
  onPlaceOrder,
  isSubmitting,
}: OrderSummaryProps) {
  const { cart, cartSubtotal, totalCartItems, freeShippingThreshold } = useShop();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "ELVOA10") {
      const discount = Math.round(cartSubtotal * 0.1);
      onApplyCoupon({ code, type: "percentage", amount: discount });
      setCouponSuccess("10% discount applied successfully!");
      setCouponInput("");
    } else if (code === "WELCOME50") {
      onApplyCoupon({ code, type: "fixed", amount: 50 });
      setCouponSuccess("৳50 discount applied successfully!");
      setCouponInput("");
    } else if (code === "FREESHIP") {
      onApplyCoupon({ code, type: "freeship", amount: deliveryFee });
      setCouponSuccess("Free Shipping promo applied!");
      setCouponInput("");
    } else {
      setCouponError("Invalid promo code. Try 'ELVOA10' or 'WELCOME50'.");
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponSuccess("");
    setCouponError("");
  };

  // Discount calculation
  const discountAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const effectiveShipping =
    cartSubtotal >= freeShippingThreshold || appliedCoupon?.type === "freeship"
      ? 0
      : deliveryFee;
  const grandTotal = Math.max(0, cartSubtotal + effectiveShipping - discountAmount);

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs sticky top-24">
      {/* Summary Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
        <h2 className="text-base font-bold text-neutral-900">
          Order Summary
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          {totalCartItems} {totalCartItems === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Condensed Item List */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-none divide-y divide-neutral-100">
        {cart.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white shadow-xs">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-neutral-900 truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-neutral-400">
                {item.color && `Color: ${item.color}`}
                {item.color && item.size && " | "}
                {item.size && `Size: ${item.size}`}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-neutral-900">
                ৳{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div className="mt-4 pt-4 border-t border-neutral-200/80">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Tag className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Coupon <strong>{appliedCoupon.code}</strong> applied (-৳{discountAmount.toLocaleString()})
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Promo Code (e.g. ELVOA10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full h-9 rounded-xl border border-neutral-300 pl-9 pr-3 text-xs uppercase placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-neutral-900 px-4 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}

        {couponError && (
          <p className="mt-1 text-[11px] text-rose-600 font-medium">
            {couponError}
          </p>
        )}
        {couponSuccess && (
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">
            {couponSuccess}
          </p>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="mt-4 space-y-2 pt-3 border-t border-neutral-200/80 text-xs">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="font-semibold text-neutral-900">
            ৳{cartSubtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Shipping Fee</span>
          <span>
            {effectiveShipping === 0 ? (
              <span className="font-bold text-[#079455]">FREE</span>
            ) : (
              <span className="font-semibold text-neutral-900">
                ৳{effectiveShipping}
              </span>
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Discount ({appliedCoupon?.code})</span>
            <span>-৳{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-baseline justify-between pt-2 border-t border-neutral-200">
          <span className="text-sm font-bold text-neutral-900">Grand Total</span>
          <span className="text-xl font-extrabold text-[#D92D20]">
            ৳{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Place Order CTA Button */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || cart.length === 0}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B37] py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-[#eb4e2a] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <Lock className="h-4 w-4" />
        <span>
          {isSubmitting ? "Processing Order..." : `Place Order • ৳${grandTotal.toLocaleString()}`}
        </span>
      </button>

      {/* Security & Trust Badges */}
      <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[10.5px] text-neutral-500">
        <div className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-[#FF5B37] shrink-0" />
          <span>Fast Nationwide Shipping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>7 Days Easy Return</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-neutral-100 text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
          <span>Bank-Grade 256-bit SSL Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
}

