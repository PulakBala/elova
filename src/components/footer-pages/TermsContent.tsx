"use client";

import Link from "next/link";
import {
  FileText,
  ChevronRight,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

export function TermsContent() {
  const sections = [
    { id: "intro", title: "1. Introduction & Agreement" },
    { id: "account", title: "2. Account Registration & Security" },
    { id: "pricing", title: "3. Product Listings & Pricing" },
    { id: "orders", title: "4. Order Confirmation & Cancellation" },
    { id: "payments", title: "5. Payment Terms (COD & Online)" },
    { id: "shipping", title: "6. Shipping & Delivery Terms" },
    { id: "returns", title: "7. Return & Refund Obligations" },
    { id: "ip", title: "8. Intellectual Property Rights" },
    { id: "liability", title: "9. Limitation of Liability" },
    { id: "law", title: "10. Governing Law & Jurisdiction" },
    { id: "contact", title: "11. Contacting Legal Support" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "About ELVOA" }, { label: "Terms & Conditions" }]}
      title="Terms & Conditions"
      subtitle="Please review these terms governing your access to and use of the ELVOA digital shopping platform."
      badge="Legal & Policies"
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents on Desktop (4 cols) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <FileText className="h-4 w-4 text-[#FF5B37]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Table of Contents
              </h3>
            </div>
            <nav className="mt-3 space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollTo(sec.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-[#FF5B37] hover:bg-neutral-50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight className="h-3 w-3 text-neutral-400 group-hover:text-[#FF5B37] shrink-0" />
                </button>
              ))}
            </nav>
            <div className="mt-5 pt-3.5 border-t border-neutral-100 text-[11px] text-neutral-500">
              Last updated: October 2024
            </div>
          </div>
        </aside>

        {/* Terms Content Body (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section id="intro" className="scroll-mt-28">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              1. Introduction & Agreement
            </h2>
            <p>
              Welcome to <strong>ELVOA</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated in Bangladesh. By accessing or browsing our website, purchasing products, or using our services, you agree to be bound by these Terms and Conditions and our associated Privacy Policy. If you do not agree to all terms stated here, please discontinue use of the platform immediately.
            </p>
          </section>

          <section id="account" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              2. Account Registration & Security
            </h2>
            <p>
              When creating an account or placing guest orders on ELVOA, you agree to provide true, accurate, current, and complete information regarding your legal name, contact phone number, and physical shipping address in Bangladesh. You are responsible for safeguarding your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section id="pricing" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              3. Product Listings & Pricing
            </h2>
            <p>
              All prices displayed on ELVOA are quoted in <strong>Bangladeshi Taka (BDT / ৳)</strong> and are inclusive of applicable VAT unless specifically designated otherwise. We endeavor to ensure all descriptions, imagery, and pricing are accurate; however, typographical errors or technical glitches may occur. In such rare events, ELVOA reserves the right to cancel affected orders prior to courier handover.
            </p>
          </section>

          <section id="orders" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              4. Order Confirmation & Cancellation
            </h2>
            <p>
              Receipt of an order confirmation SMS or email does not signify our final acceptance of your order. ELVOA reserves the right to decline or cancel any order for reasons including inventory stockout, delivery courier limitations in remote rural zones, or suspected fraudulent activity. You may cancel your order at no penalty before it has been dispatched from our fulfillment center.
            </p>
          </section>

          <section id="payments" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              5. Payment Terms (COD & Online via SSLCOMMERZ)
            </h2>
            <p>
              We support two authorized payment channels:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 pl-2">
              <li>
                <strong>Cash on Delivery (COD):</strong> Full payment in exact Bangladeshi Taka is payable to the courier delivery agent immediately upon receipt of goods.
              </li>
              <li>
                <strong>SSLCOMMERZ Online Gateway:</strong> Secure digital payments via bKash, Nagad, Rocket, Upay, Visa, Mastercard, American Express, or domestic internet banking. All transactions are processed under Bangladesh Bank PSO encryption protocols.
              </li>
            </ul>
          </section>

          <section id="shipping" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              6. Shipping & Delivery Terms
            </h2>
            <p>
              Estimated shipping timelines are 24-48 hours within Dhaka Metro and 48-72 hours for all other 63 districts. Uncontrollable logistics delays caused by extreme weather, national holidays, or transportation strikes may occasionally extend delivery times. Customers are advised to examine external packaging integrity upon delivery.
            </p>
          </section>

          <section id="returns" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              7. Return & Refund Obligations
            </h2>
            <p>
              Returns are governed strictly by our{" "}
              <Link href="/return-policy" className="text-[#FF5B37] font-bold underline">
                Return & Refund Policy
              </Link>
              . Products must be reported within 7 calendar days of receipt along with photographic evidence. Defective or incorrect items will be repaired, replaced, or refunded in accordance with verified inspection results.
            </p>
          </section>

          <section id="ip" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              8. Intellectual Property Rights
            </h2>
            <p>
              All trademarks, logos, photographs, graphics, UI design components, and software code appearing on this site are the exclusive property of ELVOA or its respective content licensors. Any unauthorized copying, reproduction, or redistribution is strictly prohibited under the Copyright Act of Bangladesh.
            </p>
          </section>

          <section id="liability" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              9. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, ELVOA shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from product misuse, delivery courier delays, or server disruptions beyond our reasonable control.
            </p>
          </section>

          <section id="law" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              10. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the <strong>People&apos;s Republic of Bangladesh</strong>. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.
            </p>
          </section>

          <section id="contact" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              11. Contacting Legal Support
            </h2>
            <p>
              If you have any questions or formal notices regarding these terms, please contact our administrative desk at{" "}
              <a href="mailto:support@elvoa.com" className="text-[#FF5B37] font-bold underline">
                support@elvoa.com
              </a>{" "}
              or via mail to: ELVOA Legal Dept, House #12, Road #4, Dhanmondi, Dhaka-1205, Bangladesh.
            </p>
          </section>
        </div>
      </div>
    </FooterPageShell>
  );
}
