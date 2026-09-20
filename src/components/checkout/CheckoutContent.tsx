"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  PackageCheck,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  User,
  AlertCircle,
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
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/data/mock-account";
import { submitCheckoutOrder, type CheckoutOrderItem } from "@/lib/api";

export function CheckoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const statusParam = searchParams.get("status");

    if (statusParam === "cancelled" || errorParam === "payment_cancelled") {
      setCheckoutError(
        "Online payment checkout was cancelled. You may retry payment or select Cash on Delivery."
      );
    } else if (statusParam === "failed" || errorParam === "payment_failed") {
      setCheckoutError(
        "Your online payment could not be processed by the bank or gateway. Please try again or choose Cash on Delivery."
      );
    } else if (errorParam) {
      setCheckoutError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const {
    cart,
    cartSubtotal,
    freeShippingThreshold,
    addOrder,
    clearCart,
    user: fallbackUser,
  } = useShop();

  const { user: authUser, isAuthenticated, setAuthSession } = useAuth();

  // Form State initialized with any saved user info
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: authUser?.name || fallbackUser?.name || "",
    email: authUser?.email || fallbackUser?.email || "",
    phone: authUser?.phone || fallbackUser?.phone || "",
    password: "",
    streetAddress: "",
    city: "Dhaka",
    postalCode: "",
    orderNotes: "",
    deliveryMethod: "inside-dhaka",
    paymentMethod: "cod",
  });

  // Pre-fill form details when authenticated user or default address is available
  useEffect(() => {
    if (authUser) {
      const defaultAddr =
        authUser.default_address || (authUser.addresses && authUser.addresses[0]);
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.name || "",
        email: prev.email || authUser.email || "",
        phone: prev.phone || authUser.phone || "",
        streetAddress:
          prev.streetAddress ||
          defaultAddr?.address_line ||
          defaultAddr?.address ||
          "",
        city:
          prev.city === "Dhaka" && defaultAddr?.district
            ? defaultAddr.district
            : prev.city,
        postalCode: prev.postalCode || defaultAddr?.postal_code || "",
      }));
    }
  }, [authUser]);

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
    // Only require password for guests creating a new account
    if (!isAuthenticated) {
      if (!formData.password || formData.password.length < 6) {
        newErrors.password =
          "Password must be at least 6 characters for your account";
      }
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

  const handlePlaceOrder = async () => {
    if (!validate()) {
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      // Strictly cod or sslcommerz
      const apiPaymentMethod: "cod" | "sslcommerz" =
        formData.paymentMethod === "sslcommerz" ? "sslcommerz" : "cod";

      // Map cart items into payload
      const defaultVariantMap: Record<number, number> = {
        1: 1,
        2: 4,
        3: 6,
        4: 7,
        5: 9,
        6: 11,
        7: 12,
        8: 13,
        9: 15,
        10: 17,
      };

      const orderItems: CheckoutOrderItem[] = cart.map((item) => {
        let prodId =
          typeof item.productId === "number"
            ? item.productId
            : parseInt(String(item.productId));
        if (isNaN(prodId) || prodId <= 0) {
          const str = String(item.productId).toLowerCase();
          if (str.includes("chop")) prodId = 1;
          else if (str.includes("earbud")) prodId = 2;
          else if (str.includes("lamp")) prodId = 3;
          else if (str.includes("car")) prodId = 4;
          else if (str.includes("water") || str.includes("bottle")) prodId = 5;
          else if (str.includes("stor")) prodId = 6;
          else if (str.includes("uten")) prodId = 7;
          else if (str.includes("cabl")) prodId = 8;
          else if (str.includes("stand")) prodId = 9;
          else if (str.includes("blend")) prodId = 10;
          else prodId = 1;
        }

        let varId = item.variantId;
        if (!varId) {
          varId = defaultVariantMap[prodId] || 1;
        }

        return {
          product_id: prodId,
          product_variant_id: varId,
          quantity: item.quantity,
        };
      });

      const response = await submitCheckoutOrder({
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim() || undefined,
        password: !isAuthenticated
          ? formData.password || undefined
          : undefined,
        shipping_district: formData.city.trim(),
        shipping_address: formData.streetAddress.trim(),
        postal_code: formData.postalCode?.trim() || undefined,
        delivery_method: formData.deliveryMethod,
        payment_method: apiPaymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        customer_notes: formData.orderNotes?.trim() || undefined,
        items: orderItems,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to place order.");
      }

      if (response.auth?.token && response.auth?.user) {
        setAuthSession(response.auth.token, response.auth.user);
      }

      // If online payment gateway returned hosted checkout URL (e.g. SSLCommerz)
      if (response.redirect_url) {
        clearCart();
        window.location.href = response.redirect_url;
        return;
      }

      const paymentMethodLabel =
        formData.paymentMethod === "cod"
          ? "Cash on Delivery"
          : "Online Payment (SSLCommerz)";

      const createdOrderNumber =
        response.data?.order_number ||
        `ELV-${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder = addOrder({
        items: cart.map((item) => ({
          productId: String(item.productId),
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          variant: [
            item.color ? `Color: ${item.color}` : null,
            item.size ? `Size: ${item.size}` : null,
          ]
            .filter(Boolean)
            .join(" | "),
        })),
        subtotal: response.data?.subtotal || cartSubtotal,
        shippingFee:
          response.data?.delivery_charge !== undefined
            ? response.data.delivery_charge
            : effectiveShipping,
        discount:
          response.data?.discount !== undefined
            ? response.data.discount
            : discountAmount,
        total: response.data?.grand_total || grandTotal,
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

      newOrder.orderNumber = createdOrderNumber;

      clearCart();
      setPlacedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Order placement error:", err);
      setCheckoutError(
        err.message ||
          "Could not complete order. Please check your inventory or input details."
      );
      window.scrollTo({ top: 120, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
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
                We&apos;ve received your order and are preparing it for delivery.
                A confirmation has been sent to{" "}
                <strong className="text-neutral-900">
                  {placedOrder.shippingAddress.phone}
                </strong>
                .
              </p>

              {/* Account Status Notice */}
              <div className="mt-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 text-left flex items-start gap-3">
                <User className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {isAuthenticated
                      ? "Linked to Your Account"
                      : "Account Created Automatically"}
                  </h4>
                  <p className="text-[11.5px] text-amber-800 mt-0.5 leading-relaxed">
                    {isAuthenticated ? (
                      <>
                        This order has been linked to your account (
                        <strong>
                          {authUser?.email || authUser?.phone || formData.email}
                        </strong>
                        ). You can monitor courier tracking and receipts in your
                        dashboard!
                      </>
                    ) : (
                      <>
                        Your ELVOA account has been activated for{" "}
                        <strong>{formData.email || formData.phone}</strong> with
                        your chosen password. You are now logged in and can
                        track this order anytime!
                      </>
                    )}
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
                      <span className="mt-1 block text-[11px] text-neutral-500">
                        {t.date || "Scheduled"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placed Order Summary Card */}
              <div className="mt-6 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 sm:p-6 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-xs text-neutral-500 block">
                      Total Paid
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-[#D92D20]">
                      ৳{placedOrder.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">
                      Payment Method
                    </span>
                    <span className="text-xs font-bold text-neutral-900">
                      {placedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
                  <div>
                    <span className="font-semibold text-neutral-800 block">
                      Delivery Destination:
                    </span>
                    <p>
                      {placedOrder.shippingAddress.address},{" "}
                      {placedOrder.shippingAddress.city}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-800 block">
                      Recipient Contact:
                    </span>
                    <p>
                      {placedOrder.shippingAddress.fullName} (
                      {placedOrder.shippingAddress.phone})
                    </p>
                  </div>
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
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5"
              >
                <Link href="/" className="hover:text-neutral-900 transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
                <Link
                  href="/shop"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Shop
                </Link>
                <ChevronRight className="h-3 w-3 text-neutral-400" />
                <span className="font-semibold text-neutral-900">Checkout</span>
              </nav>

              {/* Checkout Title */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Guest-to-Account Fast Checkout
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                  Complete your shipping details below. An account will be
                  created automatically so you can track your package.
                </p>
              </div>

              {/* Real-Time Checkout Error Banner */}
              {checkoutError && (
                <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 flex items-center gap-2.5 shadow-xs animate-in fade-in-50 duration-200">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Two-Column Form and Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Guest-to-Account Checkout Form */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <CheckoutForm
                    formData={formData}
                    onChange={handleFormChange}
                    errors={errors}
                    isAuthenticated={isAuthenticated}
                    currentUser={authUser}
                  />
                </div>

                {/* Right Column: Order Summary & Place Order CTA */}
                <div className="lg:col-span-5 xl:col-span-4">
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
            <div className="mx-auto max-w-md text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                Your Bag is Empty
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500">
                You don&apos;t have any items in your cart to checkout. Explore
                our trending products and deals today!
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF5B37] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-colors cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
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
