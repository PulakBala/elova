"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { useShop } from "@/context/ShopContext";
import { fetchCheckoutOrder } from "@/lib/api";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "";
  const bankTranId = searchParams.get("tran_id") || "";
  const paymentParam = searchParams.get("status") || "paid";

  const { clearCart } = useShop();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);

  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  useEffect(() => {
    if (orderNumber) {
      fetchCheckoutOrder(orderNumber)
        .then((res) => {
          if (res.success && res.data) {
            setOrderData(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order details:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [orderNumber]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans antialiased text-neutral-800">
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Success Header Card */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Payment Verified via SSLCommerz
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="mt-2 text-sm text-neutral-500 max-w-lg mx-auto">
            Your payment has been successfully authorized and confirmed by the bank. We are preparing your package for immediate dispatch.
          </p>

          {/* Reference Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {orderNumber && (
              <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs">
                <span className="text-neutral-500 font-medium">Order #:</span>
                <span className="font-bold text-neutral-900">{orderNumber}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(orderNumber)}
                  className="text-neutral-400 hover:text-neutral-600 cursor-pointer ml-1"
                  title="Copy Order #"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}

            {bankTranId && (
              <div className="flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2 text-xs">
                <span className="text-neutral-500 font-medium">Bank Txn ID:</span>
                <span className="font-mono font-bold text-neutral-900">{bankTranId}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Payment Status: {orderData?.status?.payment_status ? String(orderData.status.payment_status).toUpperCase() : "PAID"}
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            <Clock className="h-6 w-6 animate-spin mx-auto mb-2 text-[#FF5B37]" />
            Loading order summary and item details...
          </div>
        ) : orderData ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Items Card */}
            <div className="md:col-span-2 rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-[#FF5B37]" />
                  Order Summary
                </h2>
                <span className="text-xs text-neutral-500">
                  {orderData.items?.length || 0} item(s)
                </span>
              </div>

              <div className="divide-y divide-neutral-100 mt-3">
                {orderData.items?.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {item.product_name}
                      </p>
                      {item.variant_details && (
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {item.variant_details}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Qty: {item.quantity} × ৳{item.unit_price}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 shrink-0">
                      ৳{item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="mt-5 pt-4 border-t border-neutral-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">৳{orderData.pricing?.subtotal || 0}</span>
                </div>
                {orderData.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-৳{orderData.pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-neutral-900">
                    {orderData.pricing?.delivery_charge === 0 ? "FREE" : `৳${orderData.pricing?.delivery_charge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Paid (SSLCommerz)</span>
                  <span className="text-[#FF5B37]">৳{orderData.pricing?.grand_total || 0}</span>
                </div>
              </div>
            </div>

            {/* Delivery & Customer Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs text-xs space-y-3">
                <h3 className="font-bold text-neutral-900 flex items-center gap-1.5 pb-2 border-b border-neutral-100">
                  <MapPin className="h-4 w-4 text-[#FF5B37]" />
                  Delivery Information
                </h3>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Recipient</span>
                  <p className="font-bold text-neutral-800">{orderData.customer?.name}</p>
                  <p className="text-neutral-600">{orderData.customer?.phone}</p>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Shipping Address</span>
                  <p className="text-neutral-800 leading-relaxed">
                    {orderData.shipping?.address}, {orderData.shipping?.district}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Fulfillment Status</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {String(orderData.status?.order_status || "confirmed").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  href="/account?tab=orders"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[#FF5B37] text-white text-xs font-bold hover:bg-[#e04f2e] transition-colors shadow-xs"
                >
                  <PackageCheck className="h-4 w-4" />
                  View All Orders in Account
                </Link>

                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-neutral-500 text-xs font-medium hover:text-neutral-800 cursor-pointer transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <Link
              href="/account?tab=orders"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF5B37] text-white text-xs font-bold hover:bg-[#e04f2e]"
            >
              View Order History
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center text-sm text-neutral-500">
          Loading order receipt...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

