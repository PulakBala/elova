"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  ArrowLeft,
  RotateCcw,
  ShoppingBag,
  HelpCircle,
  AlertTriangle,
  PackageCheck,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "";
  const errorParam = searchParams.get("error") || "";
  const statusParam = searchParams.get("status") || "failed";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const errorMessage =
    errorParam && errorParam !== "payment_failed"
      ? decodeURIComponent(errorParam)
      : "Your transaction could not be authorized or was declined by the payment gateway or bank. If amount was deducted, it will be refunded automatically by your issuing bank.";

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans antialiased text-neutral-800">
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-sm text-center">
          {/* Failed Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60">
            <XCircle className="h-9 w-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            Payment Status: {statusParam.toUpperCase()}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Payment Unsuccessful
          </h1>

          <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            {errorMessage}
          </p>

          {/* Order Reference Badge */}
          {orderNumber && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-2 text-xs">
              <span className="text-neutral-500 font-medium">Order Reference:</span>
              <span className="font-bold text-neutral-900">{orderNumber}</span>
            </div>
          )}

          {/* Helpful Tips Box */}
          <div className="mt-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 text-left text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <HelpCircle className="h-4 w-4 text-amber-700 shrink-0" />
              What you can do:
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1 text-[11.5px]">
              <li>Verify your card balance, limits, and internet banking permissions.</li>
              <li>Retry payment with SSLCommerz choosing a different method (bKash, Nagad, Card).</li>
              <li>Or switch to <strong>Cash on Delivery (COD)</strong> to pay upon delivery at your doorstep.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF5B37] text-white text-xs font-bold hover:bg-[#e04f2e] transition-colors shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Checkout / Choose COD
            </Link>

            <Link
              href="/account?tab=orders"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors"
            >
              <PackageCheck className="h-4 w-4" />
              View Orders
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl text-neutral-600 text-xs font-medium hover:text-neutral-900 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Store Catalog
            </Link>
          </div>
        </div>
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center text-sm text-neutral-500">
          Loading payment status...
        </div>
      }
    >
      <OrderFailedContent />
    </Suspense>
  );
}

