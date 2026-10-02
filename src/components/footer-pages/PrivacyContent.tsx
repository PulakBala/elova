"use client";

import {
  Lock,
  ChevronRight,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

export function PrivacyContent() {
  const sections = [
    { id: "collect", title: "1. Information We Collect" },
    { id: "use", title: "2. How We Use Your Data" },
    { id: "share", title: "3. Sharing With Third Parties" },
    { id: "security", title: "4. Data Security & Storage" },
    { id: "cookies", title: "5. Cookies & Local Storage" },
    { id: "rights", title: "6. Your Privacy Rights" },
    { id: "updates", title: "7. Policy Updates" },
    { id: "contact", title: "8. Data Protection Inquiries" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "About ELVOA" }, { label: "Privacy Policy" }]}
      title="Privacy Policy"
      subtitle="How we collect, protect, and respect your personal information while you shop on ELVOA."
      badge="Data Protection & Privacy"
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents on Desktop (4 cols) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Lock className="h-4 w-4 text-[#FF5B37]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Privacy Sections
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

        {/* Privacy Policy Content Body (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <section id="collect" className="scroll-mt-28">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              1. Information We Collect
            </h2>
            <p>
              When you visit or place an order on ELVOA, we collect specific details necessary to fulfill your purchases and ensure smooth operation:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2 text-neutral-600">
              <li>
                <strong>Contact Details:</strong> Your full name, mobile telephone number, and email address.
              </li>
              <li>
                <strong>Delivery Destination:</strong> Complete physical shipping address, city/district, and any special delivery instructions.
              </li>
              <li>
                <strong>Transaction & Order Logs:</strong> Products ordered, pricing, payment method chosen, and invoice history.
              </li>
              <li>
                <strong>Device & Technical Signals:</strong> IP address, browser type, device resolution, and referral URLs to detect fraudulent bots and optimize responsive rendering.
              </li>
            </ul>
          </section>

          <section id="use" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              2. How We Use Your Data
            </h2>
            <p>
              We process your personal information strictly for legitimate commercial and operational purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2 text-neutral-600">
              <li>To prepare, dispatch, track, and deliver physical products to your address.</li>
              <li>To send automated SMS notifications and delivery updates regarding order confirmation and rider arrival.</li>
              <li>To provide customer support and facilitate returns or warranty exchanges.</li>
              <li>To prevent fraudulent payments, account takeover, or duplicate coupon abuse.</li>
            </ul>
          </section>

          <section id="share" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              3. Sharing With Third Parties
            </h2>
            <p className="font-semibold text-neutral-900">
              ELVOA does NOT sell, rent, or trade your personal data to advertisers or third-party marketing brokers.
            </p>
            <p className="mt-2">
              We only share necessary operational data with verified service partners under strict confidentiality:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2 text-neutral-600">
              <li>
                <strong>Courier & Logistics Partners (Steadfast, Pathao, RedX):</strong> We transmit recipient name, phone, address, and order total for delivery and COD collection.
              </li>
              <li>
                <strong>Payment Gateways (SSLCOMMERZ):</strong> For digital transactions, payment data is passed directly through encrypted SSL tunnels to banking switches. ELVOA never holds or views your card CVV or mobile banking PIN.
              </li>
              <li>
                <strong>Legal Compliance:</strong> If mandated by official judicial subpoenas or regulatory authorities under the laws of Bangladesh.
              </li>
            </ul>
          </section>

          <section id="security" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              4. Data Security & Storage
            </h2>
            <p>
              We employ enterprise-grade security standards including HTTPS/TLS 1.3 encryption, isolated database credentials, and tokenized session authentication (Laravel Sanctum). Access to sensitive customer data is restricted to authorized fulfillment and support personnel on a strict need-to-know basis.
            </p>
          </section>

          <section id="cookies" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              5. Cookies & Local Storage
            </h2>
            <p>
              ELVOA utilizes browser cookies and browser <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800">localStorage</code> to maintain your shopping cart items, keep your wishlist intact across visits, and remember your authenticated user session. You may choose to disable cookies through your browser settings, though certain checkout features may become unavailable.
            </p>
          </section>

          <section id="rights" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              6. Your Privacy Rights
            </h2>
            <p>
              As an ELVOA customer, you have full rights to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2 text-neutral-600">
              <li>Access and review all personal contact data stored in your account profile.</li>
              <li>Correct or update inaccurate addresses or phone numbers via your dashboard.</li>
              <li>Request full account deactivation and anonymization of historical records (subject to statutory tax retention guidelines).</li>
              <li>Opt out of marketing promotional SMS or email broadcasts at any time.</li>
            </ul>
          </section>

          <section id="updates" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              7. Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect operational enhancements or changes in regulatory standards. The revised version will always be posted on this page with an updated timestamp at the top.
            </p>
          </section>

          <section id="contact" className="scroll-mt-28 border-t border-neutral-100 pt-6">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
              8. Data Protection Inquiries
            </h2>
            <p>
              For any questions regarding our data practices or to exercise your privacy rights, please contact our Data Protection Officer at:
            </p>
            <div className="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
              <p className="font-bold text-neutral-900">ELVOA Data Privacy Desk</p>
              <p className="text-neutral-600 mt-0.5">Email: privacy@elvoa.com / support@elvoa.com</p>
              <p className="text-neutral-600">House #12, Road #4, Dhanmondi, Dhaka-1205, Bangladesh</p>
            </div>
          </section>
        </div>
      </div>
    </FooterPageShell>
  );
}
