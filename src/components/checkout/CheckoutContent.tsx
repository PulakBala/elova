"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  PackageCheck,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  User,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { CheckoutForm, type CheckoutFormData } from "./CheckoutForm";
import { OrderSummary, type AppliedCoupon } from "./OrderSummary";
import { useShop } from "@/context/ShopContext";
import type { Order } from "@/data/mock-account";

export function CheckoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    cart,
    cartSubtotal,
    freeShippingThreshold,
    addOrder,
    clearCart,
    user,
    updateUserProfile,
  } = useShop();

  // Form State initialized with any saved user info
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
    streetAddress: "",
    city: "Dhaka",
    postalCode: "",
    orderNotes: "",
    deliveryMethod: "inside-dhaka",
    paymentMethod: "cod",
    mobileProvider: "bkash",
    mobileNumber: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Delivery calculation
  const deliveryFee = formData.deliveryMethod === "inside-dhaka" ? 60 : 120;
  const effectiveShipping =
    cartSubtotal >= freeShippingThreshold || appliedCoupon?.type === "freeship"
      ? 0
      : deliveryFee;
  const discountAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const grandTotal = Math.max(0, cartSubtotal + effectiveShipping - discountAmount);

  const handleFormChange = (updated: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
    // Clear field-specific error as user types
    const keys = Object.keys(updated);
    if (keys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim() || formData.phone.length < 11) {
      newErrors.phone = "Enter a valid 11-digit phone number (e.g. 017XXXXXXXX)";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters for your account";
    }
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Please provide your complete delivery address";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Please select your city / district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) {
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement delay
    setTimeout(() => {
      const paymentMethodLabel =
        formData.paymentMethod === "cod"
          ? "Cash on Delivery"
          : formData.paymentMethod === "mobile-banking"
          ? `${formData.mobileProvider.toUpperCase()} Mobile Banking`
          : "Credit / Debit Card";

      const newOrder = addOrder({
        items: cart.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          variant: [item.color ? `Color: ${item.color}` : null, item.size ? `Size: ${item.size}` : null]
            .filter(Boolean)
            .join(" | "),
        })),
        subtotal: cartSubtotal,
        shippingFee: effectiveShipping,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod: paymentMethodLabel,
        paymentStatus:
          formData.paymentMethod === "cod" ? "Cash on Delivery" : "Paid",
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode || "N/A",
        },
      });

      // Update user account
      updateUserProfile({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      clearCart();
      setIsSubmitting(false);
      setPlacedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Global Navigation */}
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Checkout Flow */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
          {placedOrder ? (
            /* Order Success State */
            <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm text-center">
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 stroke-[2.2]" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Order #{placedOrder.orderNumber} Confirmed</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Thank You for Your Order!
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                We&apos;ve received your order and are preparing it for delivery. A confirmation has been sent to{" "}
                <strong className="text-neutral-900">{placedOrder.shippingAddress.phone}</strong>.
              </p>

              {/* Instant Account Activated Notice */}
              <div className="mt-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 text-left flex items-start gap-3">
                <User className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Account Created Automatically
                  </h4>
                  <p className="text-[11.5px] text-amber-800 mt-0.5 leading-relaxed">
                    Your ELVOA account has been activated for <strong>{formData.email}</strong> with your chosen password. You can now track your shipment live and view invoice details in your dashboard!
                  </p>
                </div>
              </div>

              {/* Order Tracking Progress Step Bar */}
              <div className="mt-6 pt-6 border-t border-neutral-100 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  Live Order Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {placedOrder.tracking.slice(0, 3).map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-200 p-3 bg-neutral-50/70"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                            t.completed ? "bg-emerald-600" : "bg-neutral-300"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                          {t.title}
                        </span>
                      </div>
                      {t.date && (
                        <p className="mt-1 text-[11px] text-neutral-500 pl-6">
                          {t.date}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary of Placed Order */}
              <div className="mt-6 rounded-2xl border border-neutral-200 p-4 bg-neutral-50 text-left">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200">
                  <span className="text-neutral-500">Shipping To:</span>
                  <span className="font-bold text-neutral-900">
                    {placedOrder.shippingAddress.fullName}, {placedOrder.shippingAddress.city}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-neutral-200">
                  <span className="text-neutral-500">Payment:</span>
                  <span className="font-bold text-neutral-900">
                    {placedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-neutral-500">Total Amount:</span>
                  <span className="text-base font-extrabold text-[#D92D20]">
                    ৳{placedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/account"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <PackageCheck className="h-4 w-4" />
                  <span>View in Account Dashboard</span>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : cart.length > 0 ? (
            /* Standard Dual-Column Checkout Flow */
            <div>
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5">
                <Link href="/" className="hover:text-neutral-900 transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
                <Link href="/shop" className="hover:text-neutral-900 transition-colors">
                  Shop
                </Link>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
                <span className="font-semibold text-neutral-900">
                  Checkout
                </span>
              </nav>

              {/* Checkout Title */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Guest-to-Account Fast Checkout
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                  Complete your shipping details below. An account will be created automatically so you can track your package.
                </p>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                {/* Left Column: Form Sections (7 cols) */}
                <div className="lg:col-span-7">
                  <CheckoutForm
                    formData={formData}
                    onChange={handleFormChange}
                    errors={errors}
                  />
                </div>

                {/* Right Column: Sticky Order Breakdown (5 cols) */}
                <div className="lg:col-span-5">
                  <OrderSummary
                    deliveryFee={deliveryFee}
                    appliedCoupon={appliedCoupon}
                    onApplyCoupon={setAppliedCoupon}
                    onPlaceOrder={handlePlaceOrder}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 sm:p-16 text-center my-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-4">
                <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                Your cart is empty
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-sm">
                You cannot proceed to checkout without any items in your shopping bag. Add some favorites to get started!
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF5B37] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-all cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

