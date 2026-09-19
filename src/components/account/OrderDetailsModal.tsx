"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Truck,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import type { Order } from "@/data/mock-account";
import { resolveAssetUrl } from "@/lib/api";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && order) {
        onClose();
      }
    };
    if (order) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const handleCopyTracking = () => {
    if (order.courierTrackingCode) {
      navigator.clipboard.writeText(order.courierTrackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const trackingPortalUrl =
    order.courierTrackingUrl ||
    (order.courierTrackingCode
      ? order.courierPartner === "steadfast"
        ? `https://steadfast.com.bd/t/${order.courierTrackingCode}`
        : order.courierPartner === "pathao"
        ? `https://merchant.pathao.com/tracking?consignment_id=${order.courierTrackingCode}`
        : `https://redx.com.bd/track-order?trackingId=${order.courierTrackingCode}`
      : null);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-neutral-200 p-5 sm:p-7 text-neutral-900 scrollbar-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="order-details-title"
                className="text-lg sm:text-xl font-extrabold text-neutral-900"
              >
                Order #{order.orderNumber}
              </h2>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              <span>Placed on {order.date}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dedicated Courier Gateway & Live Tracking Banner */}
        {order.courierTrackingCode && (
          <div className="my-5 rounded-2xl bg-purple-50/70 p-4 border border-purple-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-purple-600 text-white shadow-xs">
                    <Truck className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Dispatched via {order.courierPartner ? order.courierPartner.toUpperCase() : "COURIER"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs text-neutral-600">Tracking Number:</span>
                  <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-purple-200">
                    {order.courierTrackingCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    title="Copy tracking code"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 hover:text-purple-900 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {trackingPortalUrl && (
                <a
                  href={trackingPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Track Package Online</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Live Tracking Timeline */}
        <div className="my-5 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3.5">
            Tracking Progress
          </h3>
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
            {order.tracking.map((step, idx) => (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-6 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 bg-white text-[9px] font-bold ${
                    step.completed
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : step.current
                      ? "border-[#FF5B37] text-[#FF5B37]"
                      : "border-neutral-300 text-neutral-400"
                  }`}
                >
                  {step.completed ? "✓" : idx + 1}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span
                    className={`text-xs font-semibold ${
                      step.completed || step.current
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.date && (
                    <span className="text-[11px] text-neutral-500">
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Itemized Products */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Ordered Items ({order.items.length})
          </h3>
          <div className="space-y-3 divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100">
                  <Image
                    src={resolveAssetUrl(item.image)}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                    {item.title}
                  </h4>
                  {item.variant && (
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {item.variant}
                    </p>
                  )}
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-bold text-neutral-900 shrink-0">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Information Dual Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 pt-4 border-t border-neutral-200 text-xs">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-neutral-200/90 p-4 bg-neutral-50/70">
            <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#FF5B37]" />
              <span>Delivery Address</span>
            </h4>
            <p className="font-medium text-neutral-800">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-neutral-600 mt-1">
              {order.shippingAddress.address}
            </p>
            <p className="text-neutral-600">
              {order.shippingAddress.city} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-neutral-500 mt-1 flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{order.shippingAddress.phone}</span>
            </p>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-neutral-200/90 p-4 bg-neutral-50/70">
            <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#FF5B37]" />
              <span>Payment Info</span>
            </h4>
            <div className="space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-neutral-900">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-emerald-700">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order.shippingFee === 0 ? "FREE" : `৳${order.shippingFee}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Total Paid:</span>
                <span className="text-sm font-extrabold text-[#D92D20]">
                  ৳{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

