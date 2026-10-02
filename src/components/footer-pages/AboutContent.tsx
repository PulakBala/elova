"use client";

import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

export function AboutContent() {
  const stats = [
    { value: "50,000+", label: "Happy Customers", sub: "Across all 64 districts" },
    { value: "64", label: "Districts Covered", sub: "Doorstep delivery nationwide" },
    { value: "10,000+", label: "Curated Products", sub: "Strict quality checked" },
    { value: "99.2%", label: "Satisfaction Rate", sub: "Verified customer reviews" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "100% Authenticity Guaranteed",
      desc: "We work directly with certified suppliers, manufacturers, and authorized distributors so you never receive counterfeit products.",
    },
    {
      icon: Truck,
      title: "Speed-First Nationwide Logistics",
      desc: "Operating from our modern Dhaka fulfillment facility, we partner with premier courier networks to deliver your orders in record time.",
    },
    {
      icon: Award,
      title: "Fair & Transparent Pricing",
      desc: "Great quality should never mean unreasonable markups. We ensure everyday fair prices and verified discounts across all categories.",
    },
    {
      icon: HeartHandshake,
      title: "Customer-First Guarantee",
      desc: "From 7-day hassle-free returns to friendly phone and WhatsApp support, your shopping satisfaction is our highest commitment.",
    },
  ];

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "About ELVOA" }, { label: "Our Story" }]}
      title="About ELVOA"
      subtitle="Everything You Need, One Place. Discover how we are redefining online shopping in Bangladesh."
      badge="Our Story & Vision"
      maxWidth="wide"
    >
      <div className="space-y-12">
        {/* 1. Hero Brand Narrative */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B37]">
              The ELVOA Promise
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 leading-tight">
              Shop Better. Live Smarter. Everyday Essentials Delivered With Trust.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              At ELVOA, we believe that modern shopping in Bangladesh should be effortless, delightful, and uncompromising in quality. Founded with the mission to eliminate misleading product photos, slow deliveries, and difficult returns, ELVOA provides a trusted digital marketplace where every item is individually vetted before dispatch.
            </p>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              From trending gadgets and home essentials to beauty, kitchenware, and lifestyle goods, we curate products that bring genuine value and comfort to your daily life.
            </p>
          </div>
        </div>

        {/* 2. Key Stats Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st) => (
            <div
              key={st.label}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 text-center shadow-xs"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FF5B37]">
                {st.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm font-bold text-neutral-900">
                {st.label}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-500">{st.sub}</div>
            </div>
          ))}
        </div>

        {/* 3. Core Values Grid */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-900">
              Why Thousands Trust ELVOA
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500">
              Built on uncompromising standards of integrity, transparency, and service excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#FF5B37] flex items-center justify-center shrink-0 shadow-2xs">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-white/10 text-[#FF5B37] flex items-center justify-center mb-4">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                To democratize convenient e-commerce for all Bangladeshi citizens by delivering authentic, high-value everyday products to every doorstep with unparalleled speed and trust.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="h-4 w-4 text-[#FF5B37]" />
              <span>Customer-first, every single day</span>
            </div>
          </div>

          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                To become the most reliable and loved digital retail destination in Bangladesh, setting the benchmark for product curation, courier integrity, and customer happiness.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Innovating Bangladesh e-commerce</span>
            </div>
          </div>
        </div>

        {/* 5. Shop Now Banner */}
        <div className="rounded-2xl bg-[#FF5B37] text-white p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              Ready to Experience Better Shopping?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-white/90 max-w-xl">
              Explore thousands of curated products with nationwide Cash on Delivery and 7-day hassle-free returns.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4 text-[#FF5B37]" />
          </Link>
        </div>
      </div>
    </FooterPageShell>
  );
}
