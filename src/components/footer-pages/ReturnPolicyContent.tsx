"use client";

import Link from "next/link";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  FileText,
  Mail,
  ArrowRight,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

export function ReturnPolicyContent() {
  const steps = [
    {
      num: "01",
      title: "Initiate Request",
      desc: "Contact customer support within 7 days of receiving your package with your order number and unboxing photos.",
      icon: FileText,
    },
    {
      num: "02",
      title: "Courier Pickup",
      desc: "Our partner courier picks up the product from your address, or you can drop it at a local courier point.",
      icon: Truck,
    },
    {
      num: "03",
      title: "Quality Check",
      desc: "Our warehouse team inspects the item within 24-48 hours of arrival to verify the reported condition.",
      icon: RotateCcw,
    },
    {
      num: "04",
      title: "Refund / Replacement",
      desc: "Get an immediate replacement dispatched or a full refund issued to your preferred payment method.",
      icon: CreditCard,
    },
  ];

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "Customer Care" }, { label: "Return Policy" }]}
      title="Return & Refund Policy"
      subtitle="Shop with absolute confidence. Enjoy our hassle-free 7-day return guarantee across Bangladesh."
      badge="Customer Protection"
      maxWidth="wide"
    >
      <div className="space-y-10">
        {/* 1. Policy Overview Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-[#FF5B37] flex items-center justify-center shrink-0">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">7-Day Free Returns</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                From the moment you receive your parcel
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">100% Genuine Refund</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Original amount refunded with no deductions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Doorstep Pickup</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Convenient courier return pickup service
              </p>
            </div>
          </div>
        </div>

        {/* 2. Step-by-Step Return Process */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              How the Return Process Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              4 simple steps to return any eligible item and receive your replacement or money back
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.num} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[#FF5B37] shadow-xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {st.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">{st.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Eligibility Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligible Conditions */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Eligible for Returns & Exchanges
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-neutral-600">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Defective or Damaged Products:</strong> If the product arrives physically broken, malfunctioning, or unsealed.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Wrong Item Received:</strong> If the item delivered does not match the product ordered (color, size, model).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Missing Accessories:</strong> If essential parts, cables, or accessories mentioned in the listing are absent.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Unused in Original Box:</strong> Items in complete original packaging with all tags, labels, and warranty cards intact.
                </span>
              </li>
            </ul>
          </div>

          {/* Ineligible Conditions */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Non-Returnable Items & Conditions
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-neutral-600">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong>Beyond 7 Calendar Days:</strong> Requests initiated after the 7-day delivery confirmation window has passed.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong>Opened Personal Care & Hygiene:</strong> Innerwear, cosmetics, fragrances, and hygiene items once their seal is broken.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong>Customer-Induced Physical Damage:</strong> Drops, water spills, power surges, or unauthorized repair attempts.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>
                  <strong>Missing Original Packaging:</strong> Products returned without their original manufacturer box, barcodes, or serial numbers.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Refund Methods & Timelines */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">
            Refund Channels & Processing Timelines
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="pb-3 pr-4">Original Payment Method</th>
                  <th className="pb-3 px-4">Refund Destination</th>
                  <th className="pb-3 px-4">Estimated Processing Time</th>
                  <th className="pb-3 pl-4">Transfer Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-neutral-900">Cash on Delivery (COD)</td>
                  <td className="py-3.5 px-4">bKash, Nagad, or Bank Transfer</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-600">2 to 3 Business Days</td>
                  <td className="py-3.5 pl-4 text-emerald-600 font-bold">Free (0%)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-neutral-900">bKash / Nagad Online</td>
                  <td className="py-3.5 px-4">Direct reverse to source wallet</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-600">1 to 2 Business Days</td>
                  <td className="py-3.5 pl-4 text-emerald-600 font-bold">Free (0%)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-neutral-900">Visa / Mastercard / Amex</td>
                  <td className="py-3.5 px-4">Original Card Issuer / Bank Account</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-600">5 to 7 Bank Working Days</td>
                  <td className="py-3.5 pl-4 text-emerald-600 font-bold">Free (0%)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-semibold text-neutral-900">ELVOA Store Credit / Voucher</td>
                  <td className="py-3.5 px-4">Account Credit Code</td>
                  <td className="py-3.5 px-4 font-medium text-[#FF5B37] font-bold">Instant (Within 1 Hour)</td>
                  <td className="py-3.5 pl-4 text-emerald-600 font-bold">Free (0%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Initiate Return Action Card */}
        <div className="rounded-2xl bg-neutral-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Need to Start a Return?</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl">
              Have your Order Number ready and reach out to our dedicated resolution desk. We will arrange everything for you swiftly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF5B37] text-white text-xs sm:text-sm font-bold hover:bg-[#eb4e2a] transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Return Desk</span>
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 text-neutral-200 text-xs sm:text-sm font-bold hover:bg-neutral-700 transition-all"
            >
              <span>Check Order Status</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </FooterPageShell>
  );
}
