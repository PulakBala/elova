"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Truck,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Building,
  MapPin,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { Footer } from "@/components/elvoa/Footer";
import { checkSellerSlugApi, registerSellerApi, type RegisterSellerPayload } from "@/lib/api";

const AGREEMENT_CLAUSES = [
  {
    title: "1. Introduction and Scope",
    content:
      "This Marketplace Seller Agreement ('Agreement') constitutes a legally binding contract between ELVOA ('Platform', 'we', 'us') and the registered seller ('Seller', 'Vendor', 'you'). By completing the registration and checking the agreement confirmation, you agree to comply with all terms and operational policies governing the ELVOA marketplace ecosystem.",
  },
  {
    title: "2. Seller Eligibility and Account Approval",
    content:
      "Sellers must be at least 18 years of age with a valid National Identity Card (NID) or legal business registration in Bangladesh. All registrations are subject to rigorous verification by ELVOA Administration. ELVOA reserves the absolute right to approve, reject, or request supplementary documentation at its sole discretion.",
  },
  {
    title: "3. Product Listing, Content, and IP Rights",
    content:
      "Sellers are solely responsible for all product information, descriptions, images, and specifications submitted. All listings require administrative approval before becoming publicly visible. You warrant that your listings do not infringe upon any third-party trademark, copyright, or intellectual property rights.",
  },
  {
    title: "4. Prohibited, Counterfeit, and Restricted Goods (Zero Tolerance)",
    content:
      "ELVOA strictly prohibits counterfeit, replica, hazardous, expired, stolen, or illegal products. Violation of this clause results in immediate account termination, forfeiture of pending wallet balances, and potential referral to law enforcement authorities.",
  },
  {
    title: "5. Pricing, Transparency, and Inventory Availability",
    content:
      "Sellers must maintain accurate, honest pricing and real-time stock levels. Artificially inflating prices prior to discount campaigns or listing out-of-stock items is considered an unfair marketplace practice and may incur penalties.",
  },
  {
    title: "6. Order Fulfillment, Packaging, and Pickup SLA",
    content:
      "Upon receiving an order, Seller must confirm, securely pack, and mark the parcel 'Ready for Pickup' within twenty-four (24) hours. Packaging must adhere to ELVOA standards to protect items from transit damage. Delays exceeding forty-eight (48) hours may trigger auto-cancellation and seller demerits.",
  },
  {
    title: "7. Centralized Logistics and Courier Operations",
    content:
      "All order fulfillment, pickup, transit, and delivery must be routed exclusively through ELVOA's Master Courier accounts (Steadfast, Pathao, RedX). Sellers may not use unauthorized personal courier accounts or arrange direct customer handoffs without explicit written authorization.",
  },
  {
    title: "8. Customer Data Privacy, Confidentiality, and Non-Circumvention",
    content:
      "Sellers acknowledge that customer personal data (phone numbers, email addresses, exact home addresses) is strictly confidential. Seller shall never contact customers directly, collect customer databases, or attempt to divert ELVOA customers to off-platform channels. Non-circumvention violations incur immediate account banning and contractual damages.",
  },
  {
    title: "9. Returns, Replacements, and Dispute Resolution",
    content:
      "Sellers agree to comply with ELVOA's 7-Day Customer Return Policy for defective, damaged, or misdescribed products. If a return is verified, the sub-order amount will be deducted from the seller's wallet balance or escrow reserve.",
  },
  {
    title: "10. Marketplace Commission, Fees, and Deductions",
    content:
      "ELVOA charges a transparent platform commission on gross sub-order sales. The applicable commission follows a hierarchical structure: seller custom override rate, category rate, or default marketplace rate (10%). Courier and packaging charges are deducted as transparently outlined in your seller statement.",
  },
  {
    title: "11. Seller Wallet, Escrow Hold, and Payout Schedule",
    content:
      "Net sales proceeds are held in escrow ('pending_balance') during the 7-day customer inspection window. Following clearance, funds automatically transfer to 'available_balance'. Sellers may request withdrawal at any time once available balance meets the minimum payout threshold (৳500.00).",
  },
  {
    title: "12. Chargebacks, Fraud Prevention, and Indemnification",
    content:
      "Seller agrees to indemnify and hold harmless ELVOA, its officers, and affiliates against any third-party claims, legal actions, or consumer losses arising from seller's defective goods, misrepresentations, or breach of contract.",
  },
  {
    title: "13. Seller Rating, Quality Metrics, and Penalties",
    content:
      "ELVOA tracks seller performance metrics including order cancellation rate, fulfillment speed, and customer reviews. High-performing vendors receive '✓ Verified Seller' badges and search priority. Persistent sub-par metrics may result in listing suppression.",
  },
  {
    title: "14. Account Suspension, Deactivation, and Termination",
    content:
      "Either party may terminate this relationship with fourteen (14) days written notice. ELVOA may immediately suspend or terminate any seller account engaging in fraud, customer abuse, counterfeiting, or repetitive SLA defaults.",
  },
  {
    title: "15. Limitation of Liability and Force Majeure",
    content:
      "Neither party shall be liable for fulfillment failures caused by events beyond reasonable control, including natural disasters, nationwide telecommunication outages, governmental lockdowns, or courier strikes.",
  },
  {
    title: "16. Amendments to Terms and Policies",
    content:
      "ELVOA reserves the right to modify marketplace policies or commission rates with reasonable notice provided through the Seller Panel. Continued operation of your store signifies acceptance of amended terms.",
  },
  {
    title: "17. Governing Law, Jurisdiction, and Dispute Settlement",
    content:
      "This Agreement shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.",
  },
];

export function BecomeASellerContent() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    store_name: "",
    slug: "",
    business_type: "individual" as "individual" | "company" | "sole_proprietorship",
    seller_name: "",
    phone: "",
    email: "",
    password: "",
    pickup_address: "",
    pickup_city: "Dhaka",
    pickup_district: "Dhaka",
    return_address: "",
    nid_number: "",
    trade_license_number: "",
    payout_channel: "bkash" as "bkash" | "nagad" | "bank",
    mfs_number: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    bank_branch: "",
    bank_routing_number: "",
    terms_accepted: false,
  });

  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
    suggested?: string;
  }>({ checked: false, available: false, message: "" });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === "store_name" && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleCheckSlug = async () => {
    if (!formData.slug.trim()) return;
    setSlugChecking(true);
    try {
      const res = await checkSellerSlugApi(formData.slug.trim());
      setSlugStatus({
        checked: true,
        available: res.available,
        message: res.message,
        suggested: res.suggested,
      });
    } catch (e: any) {
      setSlugStatus({
        checked: true,
        available: false,
        message: "Could not verify slug availability.",
      });
    } finally {
      setSlugChecking(false);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.store_name.trim()) errs.store_name = "Store name is required.";
      if (!formData.slug.trim()) errs.slug = "Store URL handle is required.";
      else if (!/^[a-z0-9-]+$/.test(formData.slug))
        errs.slug = "Use only lowercase letters, numbers, and hyphens.";
    } else if (currentStep === 2) {
      if (!formData.seller_name.trim()) errs.seller_name = "Owner full name is required.";
      if (!formData.phone.trim() || formData.phone.length < 11)
        errs.phone = "Enter a valid 11-digit phone number.";
      if (!formData.email.trim() || !formData.email.includes("@"))
        errs.email = "Enter a valid email address.";
      if (!formData.password || formData.password.length < 6)
        errs.password = "Password must be at least 6 characters.";
      if (!formData.pickup_address.trim())
        errs.pickup_address = "Store pickup address is required for rider dispatches.";
    } else if (currentStep === 3) {
      if (!formData.nid_number.trim() || formData.nid_number.length < 10)
        errs.nid_number = "Valid National ID (NID) number is required.";
    } else if (currentStep === 4) {
      if (formData.payout_channel === "bkash" || formData.payout_channel === "nagad") {
        if (!formData.mfs_number.trim() || formData.mfs_number.length < 11)
          errs.mfs_number = "Enter your MFS mobile account number.";
      } else {
        if (!formData.bank_name.trim()) errs.bank_name = "Bank name is required.";
        if (!formData.bank_account_number.trim())
          errs.bank_account_number = "Bank account number is required.";
      }
    } else if (currentStep === 5) {
      if (!formData.terms_accepted)
        errs.terms_accepted = "You must accept the ELVOA Marketplace Seller Agreement to continue.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const payload: RegisterSellerPayload = {
        store_name: formData.store_name.trim(),
        slug: formData.slug.trim(),
        seller_name: formData.seller_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        business_type: formData.business_type,
        pickup_address: formData.pickup_address.trim(),
        pickup_city: formData.pickup_city.trim(),
        pickup_district: formData.pickup_district.trim(),
        return_address: formData.return_address.trim() || undefined,
        nid_number: formData.nid_number.trim(),
        trade_license_number: formData.trade_license_number.trim() || undefined,
        mfs_provider: formData.payout_channel !== "bank" ? formData.payout_channel : undefined,
        mfs_number: formData.payout_channel !== "bank" ? formData.mfs_number.trim() : undefined,
        bank_name: formData.payout_channel === "bank" ? formData.bank_name.trim() : undefined,
        bank_account_number:
          formData.payout_channel === "bank" ? formData.bank_account_number.trim() : undefined,
        bank_account_name:
          formData.payout_channel === "bank"
            ? formData.bank_account_name.trim() || formData.store_name.trim()
            : undefined,
        bank_branch: formData.payout_channel === "bank" ? formData.bank_branch.trim() : undefined,
        bank_routing_number:
          formData.payout_channel === "bank" ? formData.bank_routing_number.trim() : undefined,
        terms_accepted: true,
      };

      const res = await registerSellerApi(payload);

      if (res.success) {
        setSuccessData(res.data);
      } else {
        setGeneralError(res.message || "Registration failed. Please check form details.");
        if (res.errors) {
          const formatted: Record<string, string> = {};
          Object.keys(res.errors).forEach((k) => {
            formatted[k] = res.errors![k][0];
          });
          setErrors(formatted);
        }
      }
    } catch (e: any) {
      setGeneralError(e.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans">
      <TopBar />
      <Header />
      <SubNav />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          <span className="text-neutral-900 font-medium">Become a Seller</span>
        </nav>

        {successData ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-3">
              Application Submitted Successfully!
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              Thank you for registering <strong>{successData.store_name}</strong> on ELVOA Marketplace.
              Your 17-clause electronic Seller Agreement has been recorded on{" "}
              <strong>{new Date(successData.terms_accepted_at).toLocaleString()}</strong>.
            </p>

            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-5 mb-8 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Store Handle:</span>
                <span className="font-semibold text-neutral-800">elvoabd.com/store/{successData.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Verification Status:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Pending Admin Review
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Seller Portal:</span>
                <span className="font-semibold text-[#FF5B37]">elvoabd.com/seller</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mb-6">
              Our merchant onboarding team is reviewing your NID and business documentation. You will receive an SMS and email notification once your store is activated.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/seller/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Go to Seller Panel
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors"
              >
                Return to Store
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[#FF5B37] text-xs font-bold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>ELVOA Merchant Onboarding</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
                Sell to Millions Across Bangladesh
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Launch your verified storefront on ELVOA. Benefit from nationwide doorstep courier pickups, automated order management, and secure payouts.
              </p>
            </div>

            {/* Value Pillars */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 text-center">
                <div className="w-9 h-9 bg-orange-50 text-[#FF5B37] rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Store className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Custom Storefront</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Your unique URL</div>
              </div>

              <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 text-center">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Central Logistics</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Rider pickups from door</div>
              </div>

              <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 text-center">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Banknote className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Guaranteed Payouts</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Bank / bKash / Nagad</div>
              </div>

              <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 text-center">
                <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Privacy Protected</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Data privacy guard</div>
              </div>
            </div>

            {/* Wizard Stepper */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
              <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { num: 1, label: "Store Info" },
                  { num: 2, label: "Contact & Pickup" },
                  { num: 3, label: "Identity (KYC)" },
                  { num: 4, label: "Payout Details" },
                  { num: 5, label: "Agreement" },
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          step === s.num
                            ? "bg-[#FF5B37] text-white"
                            : step > s.num
                            ? "bg-emerald-500 text-white"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:inline ${
                          step === s.num ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 4 && (
                      <div
                        className={`h-0.5 w-6 sm:w-12 mx-2 ${
                          step > s.num ? "bg-emerald-500" : "bg-neutral-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {generalError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* STEP 1: Store Basics */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Step 1: Store Profile & URL</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Tell us the public name and URL handle of your shop on ELVOA.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Koldi Fashion House"
                      value={formData.store_name}
                      onChange={(e) => handleInputChange("store_name", e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37] ${
                        errors.store_name ? "border-red-400 bg-red-50/30" : "border-neutral-200"
                      }`}
                    />
                    {errors.store_name && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.store_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Store Web Address (Slug Handle) *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-2.5 text-xs text-neutral-400 select-none">
                          elvoabd.com/store/
                        </span>
                        <input
                          type="text"
                          placeholder="koldi-fashion-house"
                          value={formData.slug}
                          onChange={(e) => {
                            handleInputChange(
                              "slug",
                              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                            );
                            setSlugStatus({ checked: false, available: false, message: "" });
                          }}
                          className={`w-full rounded-xl border pl-[125px] pr-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37] ${
                            errors.slug ? "border-red-400 bg-red-50/30" : "border-neutral-200"
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckSlug}
                        disabled={slugChecking || !formData.slug.trim()}
                        className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                      >
                        {slugChecking ? "Checking..." : "Check"}
                      </button>
                    </div>

                    {slugStatus.checked && (
                      <p
                        className={`text-[11px] mt-1.5 font-medium ${
                          slugStatus.available ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {slugStatus.message}
                        {slugStatus.suggested && (
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange("slug", slugStatus.suggested);
                              setSlugStatus({ checked: true, available: true, message: "Applied alternative!" });
                            }}
                            className="ml-2 underline text-[#FF5B37] font-bold"
                          >
                            Use {slugStatus.suggested}
                          </button>
                        )}
                      </p>
                    )}
                    {errors.slug && <p className="text-[11px] text-red-600 mt-1">{errors.slug}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Business Entity Type *
                    </label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => handleInputChange("business_type", e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                    >
                      <option value="individual">Individual / Sole Proprietor</option>
                      <option value="company">Registered Company / Enterprise</option>
                      <option value="sole_proprietorship">Partnership / Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Contact & Pickup Location */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Step 2: Owner & Pickup Location</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Enter account credentials and registered address where courier riders will pick up parcels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Owner / Manager Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zahid Hasan"
                        value={formData.seller_name}
                        onChange={(e) => handleInputChange("seller_name", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                      {errors.seller_name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.seller_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Phone Number (Login & Rider Contact) *
                      </label>
                      <input
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address (Official Notifications) *
                      </label>
                      <input
                        type="email"
                        placeholder="merchant@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Seller Panel Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                      {errors.password && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Warehouse / Store Pickup Address (Where Courier Rider Collects Parcels) *
                    </label>
                    <textarea
                      placeholder="e.g. House 14, Road 7, Block B, Mirpur-10, Dhaka"
                      rows={2}
                      value={formData.pickup_address}
                      onChange={(e) => handleInputChange("pickup_address", e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                    />
                    {errors.pickup_address && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.pickup_address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Pickup City / Area *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mirpur, Dhaka"
                        value={formData.pickup_city}
                        onChange={(e) => handleInputChange("pickup_city", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Pickup District *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dhaka"
                        value={formData.pickup_district}
                        onChange={(e) => handleInputChange("pickup_district", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Identity & KYC */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Step 3: Identity & Verification (KYC)</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Verified sellers receive a verified badge and higher customer conversion.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      National Identity Card (NID) Number *
                    </label>
                    <input
                      type="text"
                      placeholder="10, 13, or 17 digit NID number"
                      value={formData.nid_number}
                      onChange={(e) => handleInputChange("nid_number", e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                    />
                    {errors.nid_number && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.nid_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Trade License Number (Optional for registered businesses)
                    </label>
                    <input
                      type="text"
                      placeholder="Trade license / incorporation number"
                      value={formData.trade_license_number}
                      onChange={(e) => handleInputChange("trade_license_number", e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Payout Setup */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">Step 4: Payout & Settlement Information</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Where would you like to receive your marketplace sales withdrawals?
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-2">
                      Preferred Payout Channel *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "bkash", name: "bKash" },
                        { id: "nagad", name: "Nagad" },
                        { id: "bank", name: "Bank Transfer" },
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => handleInputChange("payout_channel", ch.id)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-colors ${
                            formData.payout_channel === ch.id
                              ? "border-[#FF5B37] bg-orange-50 text-[#FF5B37]"
                              : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          {ch.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.payout_channel !== "bank" ? (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {formData.payout_channel === "bkash" ? "bKash" : "Nagad"} Account Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={formData.mfs_number}
                        onChange={(e) => handleInputChange("mfs_number", e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                      />
                      {errors.mfs_number && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.mfs_number}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. BRAC Bank Limited"
                            value={formData.bank_name}
                            onChange={(e) => handleInputChange("bank_name", e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                          />
                          {errors.bank_name && (
                            <p className="text-[11px] text-red-600 mt-1">{errors.bank_name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            placeholder="Account number"
                            value={formData.bank_account_number}
                            onChange={(e) => handleInputChange("bank_account_number", e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                          />
                          {errors.bank_account_number && (
                            <p className="text-[11px] text-red-600 mt-1">
                              {errors.bank_account_number}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Account Name
                          </label>
                          <input
                            type="text"
                            placeholder="Name as in bank record"
                            value={formData.bank_account_name}
                            onChange={(e) => handleInputChange("bank_account_name", e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Branch Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Gulshan Branch"
                            value={formData.bank_branch}
                            onChange={(e) => handleInputChange("bank_branch", e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Electronic Agreement (17 Clauses) */}
              {step === 5 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900">
                      Step 5: ELVOA Marketplace Seller Agreement
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Please review the 17-clause official terms and conditions before submitting your application.
                    </p>
                  </div>

                  {/* Scrollable Agreement Box */}
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 max-h-80 overflow-y-auto space-y-4 text-xs text-neutral-700 leading-relaxed scrollbar-thin">
                    <div className="text-center font-bold text-neutral-900 uppercase tracking-wide border-b border-neutral-200 pb-2 mb-3">
                      ELVOA Marketplace Master Seller Terms of Service (17 Clauses)
                    </div>

                    {AGREEMENT_CLAUSES.map((clause, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="font-bold text-neutral-900">{clause.title}</h4>
                        <p className="text-neutral-600 text-[11.5px] leading-relaxed">
                          {clause.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mandatory Checkbox */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.terms_accepted}
                        onChange={(e) => handleInputChange("terms_accepted", e.target.checked)}
                        className="h-4 w-4 rounded border-amber-300 text-[#FF5B37] focus:ring-[#FF5B37] mt-0.5 shrink-0"
                      />
                      <span className="text-xs font-semibold text-neutral-900 leading-snug">
                        I confirm that I am the authorized representative of{" "}
                        <strong>{formData.store_name || "this store"}</strong>. I have thoroughly read, understood, and solemnly agree to comply with all 17 clauses of the ELVOA Marketplace Seller Agreement and operational guidelines.
                      </span>
                    </label>
                    {errors.terms_accepted && (
                      <p className="text-[11px] text-red-600 mt-2 font-medium">
                        {errors.terms_accepted}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#FF5B37] text-white text-xs font-bold hover:bg-[#e04b28] transition-colors shadow-xs"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.terms_accepted}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Sign Agreement & Submit</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
