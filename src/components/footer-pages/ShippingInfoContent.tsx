"use client";

import Link from "next/link";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Package,
  AlertCircle,
  PhoneCall,
  Search,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

export function ShippingInfoContent() {
  const deliveryZones = [
    {
      title: "Inside Dhaka Metro",
      time: "24 – 48 Hours",
      cost: "৳60",
      description: "Fast daily dispatch covering all major areas in Dhaka metropolitan.",
      badge: "Standard Delivery",
      highlight: true,
    },
    {
      title: "Dhaka Suburbs",
      time: "24 – 48 Hours",
      cost: "৳100",
      description: "Gazipur, Savar, Ashulia, Keraniganj, Narayanganj and surrounding zones.",
      badge: "Suburban",
      highlight: false,
    },
    {
      title: "Outside Dhaka (Nationwide)",
      time: "48 – 72 Hours",
      cost: "৳120",
      description: "Complete door-to-door coverage across all remaining 63 districts of Bangladesh.",
      badge: "Nationwide",
      highlight: false,
    },
  ];

  const divisions = [
    { name: "Dhaka Division", time: "24 – 48 Hours", rate: "৳60 – ৳100" },
    { name: "Chittagong Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Sylhet Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Rajshahi Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Khulna Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Barisal Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Rangpur Division", time: "48 – 72 Hours", rate: "৳120" },
    { name: "Mymensingh Division", time: "48 – 72 Hours", rate: "৳120" },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Tamper-Proof Packaging",
      desc: "Every item is checked and packed inside an ELVOA tamper-evident bubble mailer or heavy-duty box.",
    },
    {
      icon: PhoneCall,
      title: "Pre-Delivery Phone Call",
      desc: "The assigned delivery rider will call your phone prior to reaching your delivery address.",
    },
    {
      icon: Truck,
      title: "Tier-1 Courier Partners",
      desc: "Partnered with Steadfast, Pathao, and RedX for automated tracking and professional handling.",
    },
    {
      icon: Package,
      title: "Cash on Delivery (COD)",
      desc: "Order online and pay cash right to the delivery rider once your parcel arrives at your hands.",
    },
  ];

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "Customer Care" }, { label: "Shipping Info" }]}
      title="Shipping & Delivery Information"
      subtitle="Transparent rates, speedy fulfillment, and trusted door-to-door delivery across Bangladesh."
      badge="Nationwide Logistics"
      maxWidth="wide"
    >
      <div className="space-y-10">
        {/* 1. Main Delivery Zones & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryZones.map((zone) => (
            <div
              key={zone.title}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-xs ${
                zone.highlight
                  ? "bg-white border-[#FF5B37] ring-1 ring-[#FF5B37]"
                  : "bg-white border-neutral-200/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      zone.highlight
                        ? "bg-orange-50 text-[#FF5B37]"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {zone.badge}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900">
                    {zone.cost}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  {zone.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                  {zone.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <Clock className="h-4 w-4 text-[#FF5B37]" />
                  <span>Est. Time: {zone.time}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Cash on Delivery Available</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Key Logistics Features */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          <div className="max-w-xl mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              Our Delivery Standards
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              We ensure every shipment is handled with utmost care from warehouse dispatch to your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4.5 flex flex-col"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200 text-[#FF5B37] flex items-center justify-center mb-3 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">{f.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Divisional Breakdown Table */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                Delivery Schedule by Division
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Coverage across all 8 administrative divisions of Bangladesh
              </p>
            </div>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B37] hover:underline"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Track an Existing Order</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="pb-3 pr-4">Division</th>
                  <th className="pb-3 px-4">Estimated Transit Time</th>
                  <th className="pb-3 px-4">Standard Shipping Rate</th>
                  <th className="pb-3 pl-4">Delivery Partner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {divisions.map((div) => (
                  <tr key={div.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-neutral-900 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{div.name}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{div.time}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{div.rate}</td>
                    <td className="py-3 pl-4 text-neutral-500">Steadfast / Pathao / RedX</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Important Delivery Guidelines Alert */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 text-amber-900 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Important Delivery Notes</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800/90 text-xs leading-relaxed pl-1">
            <li>
              Delivery times begin after order verification. During peak festive seasons (Eid, Puja), transit times may extend slightly.
            </li>
            <li>
              Please verify your contact phone number during checkout so the delivery rider can connect on the first attempt.
            </li>
            <li>
              If you are not available at your delivery location, you may designate a family member or building reception to accept the parcel on your behalf.
            </li>
          </ul>
        </div>
      </div>
    </FooterPageShell>
  );
}
