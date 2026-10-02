"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";
import { fetchCheckoutOrder } from "@/lib/api";

interface OrderData {
  id: number;
  order_number: string;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
  };
  shipping: {
    district: string;
    address: string;
    delivery_charge: number;
  };
  pricing: {
    subtotal: number;
    discount: number;
    delivery_charge: number;
    grand_total: number;
  };
  status: {
    order_status: string;
    payment_status: string;
    payment_method: string;
  };
  courier_partner?: string | null;
  courier_tracking_code?: string | null;
  courier_tracking_url?: string | null;
  items: Array<{
    id: number;
    product_id: number;
    product_variant_id?: number;
    product_name: string;
    variant_details?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  created_at?: string;
}

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get("order") || "";

  const [orderNumber, setOrderNumber] = useState(queryOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (queryOrder) {
      handleTrack(queryOrder);
    }
  }, [queryOrder]);

  const handleTrack = async (targetOrderNum?: string) => {
    const num = (targetOrderNum || orderNumber).trim();
    if (!num) {
      setError("Please enter your Order Number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchCheckoutOrder(num);
      if (res.success && res.data) {
        setOrder(res.data as OrderData);
      } else {
        setOrder(null);
        setError(res.message || "Order not found. Please verify your order number and try again.");
      }
    } catch {
      setOrder(null);
      setError("Unable to connect to order tracking service. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s === "cancelled" || s === "returned" || s === "failed") return -1;
    if (s === "delivered" || s === "completed") return 4;
    if (s === "out_for_delivery" || s === "out for delivery") return 3;
    if (s === "shipped" || s === "in_transit" || s === "in transit") return 2;
    if (s === "confirmed" || s === "processing" || s === "packaging") return 1;
    return 0;
  };

  const currentStep = order ? getStepIndex(order.status.order_status) : 0;
  const isCancelled = order ? ["cancelled", "failed", "returned"].includes(order.status.order_status.toLowerCase()) : false;

  const steps = [
    { title: "Order Placed", desc: "Received in our system" },
    { title: "Processing", desc: "Packed & quality checked" },
    { title: "In Transit", desc: "Handed over to courier" },
    { title: "Out for Delivery", desc: "Rider arriving today" },
    { title: "Delivered", desc: "Successfully received" },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Track Order Input Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-8 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              Track Your Package
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
              Enter the Order Number sent via SMS or Email during checkout
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. ELV-202410-0012 or 1004"
                className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37] transition-all uppercase"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-[#FF5B37] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#eb4e2a] transition-all shadow-sm shrink-0 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Tracking Notice</p>
                <p className="mt-0.5 text-rose-600">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 2. Order Tracking Result Display */}
      {order && (
        <div className="space-y-6">
          {/* Status Header Banner */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Order Number
                  </span>
                  <span className="text-base sm:text-lg font-black text-neutral-900">
                    #{order.order_number}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      isCancelled
                        ? "bg-rose-100 text-rose-800"
                        : order.status.order_status.toLowerCase() === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status.order_status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Placed on{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently"}
                </p>
              </div>

              {/* Payment Status Pill */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-neutral-500">Payment Status</p>
                  <p className="text-xs font-bold uppercase text-neutral-900">
                    {order.status.payment_method} &bull; {order.status.payment_status}
                  </p>
                </div>
                <div
                  className={`h-9 px-3 rounded-lg flex items-center justify-center text-xs font-bold uppercase ${
                    order.status.payment_status.toLowerCase() === "paid"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {order.status.payment_status}
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {!isCancelled ? (
              <div className="pt-8 pb-4">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-0 w-full h-1 bg-neutral-200 -z-0">
                    <div
                      className="h-full bg-[#FF5B37] transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, (currentStep / (steps.length - 1)) * 100))}%`,
                      }}
                    />
                  </div>

                  {/* Step Nodes */}
                  <div className="relative z-10 flex items-start justify-between">
                    {steps.map((st, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={st.title}
                          className="flex flex-col items-center text-center max-w-[70px] sm:max-w-[110px]"
                        >
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCompleted
                                ? "bg-[#FF5B37] text-white"
                                : "bg-white border-2 border-neutral-300 text-neutral-400"
                            } ${isCurrent ? "ring-4 ring-[#FF5B37]/20" : ""}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`mt-2 text-[11px] sm:text-xs font-bold leading-tight ${
                              isCompleted ? "text-neutral-900" : "text-neutral-400"
                            }`}
                          >
                            {st.title}
                          </span>
                          <span className="hidden sm:block mt-0.5 text-[10px] text-neutral-400">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>
                    This order has been marked as <strong>{order.status.order_status}</strong>. If you require assistance, please contact our support desk.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details Grid: Courier & Shipping + Items Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Customer & Delivery Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Courier Card */}
              {order.courier_partner && (
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#FF5B37]" />
                      <h3 className="text-sm font-bold text-neutral-900">
                        Courier Partner Details
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase">
                      {order.courier_partner}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2 text-xs">
                    {order.courier_tracking_code && (
                      <div className="flex justify-between py-1">
                        <span className="text-neutral-500">Tracking Code:</span>
                        <span className="font-mono font-bold text-neutral-900">
                          {order.courier_tracking_code}
                        </span>
                      </div>
                    )}
                    {order.courier_tracking_url && (
                      <div className="pt-2">
                        <a
                          href={order.courier_tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                        >
                          <span>Track on {order.courier_partner} Portal</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3.5 border-b border-neutral-100">
                  <MapPin className="h-4 w-4 text-[#FF5B37]" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Delivery Destination
                  </h3>
                </div>
                <div className="mt-3.5 space-y-2.5 text-xs text-neutral-700">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="font-bold text-neutral-900">
                      {order.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1 border-t border-neutral-100">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-800">
                        {order.shipping.address}
                      </p>
                      <p className="text-neutral-500 mt-0.5">
                        {order.shipping.district}, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Ordered Items & Pricing (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#FF5B37]" />
                    <h3 className="text-sm font-bold text-neutral-900">
                      Ordered Products ({order.items.length})
                    </h3>
                  </div>
                </div>

                <div className="divide-y divide-neutral-100 mt-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden relative shrink-0 flex items-center justify-center">
                          <Package className="h-5 w-5 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">
                            {item.product_name}
                          </p>
                          {item.variant_details && (
                            <p className="text-[11px] text-neutral-500">
                              {item.variant_details}
                            </p>
                          )}
                          <p className="text-neutral-500 mt-0.5">
                            Qty: {item.quantity} &times; ৳{item.unit_price}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900 shrink-0">
                        ৳{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>৳{order.pricing.subtotal.toFixed(2)}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-৳{order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charge</span>
                  <span>৳{order.pricing.delivery_charge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Payable</span>
                  <span className="text-[#FF5B37]">
                    ৳{order.pricing.grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tracking Guidance & Help */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-xs">
          <div className="h-8 w-8 rounded-lg bg-orange-50 text-[#FF5B37] flex items-center justify-center mb-2.5">
            <Clock className="h-4 w-4" />
          </div>
          <h4 className="font-bold text-neutral-900 text-[13px]">
            Delivery Timelines
          </h4>
          <p className="text-neutral-500 mt-1 leading-relaxed">
            Dhaka City orders arrive within 24-48 hours. Orders across other districts arrive in 48-72 hours.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-xs">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
            <Truck className="h-4 w-4" />
          </div>
          <h4 className="font-bold text-neutral-900 text-[13px]">
            SMS & Rider Calling
          </h4>
          <p className="text-neutral-500 mt-1 leading-relaxed">
            Our delivery rider will call your registered phone number prior to arrival. Please keep your phone reachable.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-xs">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h4 className="font-bold text-neutral-900 text-[13px]">
            Need Assistance?
          </h4>
          <p className="text-neutral-500 mt-1 leading-relaxed">
            Having trouble finding your order? Reach our customer care team anytime at{" "}
            <Link href="/contact" className="text-[#FF5B37] font-bold underline">
              support@elvoa.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrackOrderContent() {
  return (
    <FooterPageShell
      breadcrumbs={[{ label: "Customer Care" }, { label: "Track Order" }]}
      title="Track Your Order"
      subtitle="Follow your package's live journey from our warehouse directly to your doorstep."
      badge="Order Tracking"
      maxWidth="wide"
    >
      <Suspense
        fallback={
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Loading order tracking portal...
          </div>
        }
      >
        <TrackOrderInner />
      </Suspense>
    </FooterPageShell>
  );
}
