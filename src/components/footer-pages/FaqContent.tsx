"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  User,
  MessageCircle,
  Mail,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";

interface FaqItem {
  id: string;
  category: "orders" | "shipping" | "payments" | "returns" | "account";
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  // Orders
  {
    id: "ord-1",
    category: "orders",
    question: "How do I place an order on ELVOA?",
    answer:
      "Placing an order is simple! Browse our catalog, select your desired variant (size/color), and click 'Add to Cart' or 'Buy Now'. When ready, proceed to the Checkout page, fill in your delivery details, select your preferred payment method (Cash on Delivery or Online Payment via SSLCOMMERZ), and click 'Place Order'. You will receive an immediate confirmation SMS and email.",
  },
  {
    id: "ord-2",
    category: "orders",
    question: "Do I need an account to place an order?",
    answer:
      "No, you can place orders as a guest! During checkout, if you provide an email and password, an account is automatically created for your convenience so you can track order history and save delivery addresses.",
  },
  {
    id: "ord-3",
    category: "orders",
    question: "Can I cancel or modify my order after placing it?",
    answer:
      "You can modify or cancel your order as long as it has not been marked as 'Dispatched' or 'In Transit'. Please contact our customer support hotline or WhatsApp with your order number as quickly as possible.",
  },
  {
    id: "ord-4",
    category: "orders",
    question: "How do I track my order status?",
    answer:
      "You can visit our Track Order page at any time and enter your Order Number (e.g. ELV-202410-0012) to see live progress, including warehouse packaging and courier tracking codes.",
  },

  // Shipping
  {
    id: "shp-1",
    category: "shipping",
    question: "What are the shipping charges?",
    answer:
      "Our standard delivery rates are: ৳60 for deliveries inside Dhaka Metro, ৳100 for Dhaka Suburbs (Savar, Gazipur, Narayanganj), and ৳120 for nationwide deliveries across all other 63 districts of Bangladesh.",
  },
  {
    id: "shp-2",
    category: "shipping",
    question: "How long will delivery take?",
    answer:
      "Orders inside Dhaka Metro are delivered within 24 to 48 hours. Orders to all other districts across Bangladesh are delivered within 48 to 72 hours via our partner couriers (Steadfast, Pathao, RedX).",
  },
  {
    id: "shp-3",
    category: "shipping",
    question: "Will the delivery rider call me before delivery?",
    answer:
      "Yes! Our courier partners will send you an SMS alert on the morning of delivery, and the assigned delivery agent will call your phone prior to arriving at your address.",
  },

  // Payments
  {
    id: "pay-1",
    category: "payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept: 1. Cash on Delivery (COD) nationwide, and 2. Online Payment via SSLCOMMERZ, which securely supports bKash, Nagad, Rocket, Upay, Visa, Mastercard, American Express, and internet banking from all major Bangladeshi banks.",
  },
  {
    id: "pay-2",
    category: "payments",
    question: "Is it safe to pay online on ELVOA?",
    answer:
      "Yes, completely safe. Online transactions are encrypted with 256-bit TLS security and handled natively by SSLCOMMERZ, a Bangladesh Bank-licensed Payment System Operator (PSO). ELVOA never stores your card PINs or passwords.",
  },
  {
    id: "pay-3",
    category: "payments",
    question: "How do I apply a discount coupon code?",
    answer:
      "During checkout, look for the 'Apply Coupon' box on the right order summary sidebar. Enter your promo code and click 'Apply'. The discounted amount will instantly reflect on your total payable.",
  },

  // Returns
  {
    id: "ret-1",
    category: "returns",
    question: "What is your return policy?",
    answer:
      "We offer a 7-day hassle-free return policy. If your product is damaged, defective, wrong, or missing parts, contact our support team within 7 days of delivery. We will arrange courier pickup and provide a replacement or full refund.",
  },
  {
    id: "ret-2",
    category: "returns",
    question: "How long does a refund take?",
    answer:
      "Once our warehouse inspects the returned item, MFS refunds (bKash/Nagad) take 2-3 business days, bank card refunds take 5-7 working days, and ELVOA store credit vouchers are issued instantly within 1 hour.",
  },
  {
    id: "ret-3",
    category: "returns",
    question: "Can I check the parcel before paying the delivery rider?",
    answer:
      "You are encouraged to inspect the outer packaging in front of the rider. If the outer package is visibly torn or opened, you may refuse delivery immediately and notify our customer service.",
  },

  // Account
  {
    id: "acc-1",
    category: "account",
    question: "How do I update my shipping address or profile?",
    answer:
      "Log into your ELVOA account, navigate to the 'My Account' or 'Addresses' section from the top profile menu, where you can add, edit, or set default delivery addresses.",
  },
  {
    id: "acc-2",
    category: "account",
    question: "What should I do if I forget my password?",
    answer:
      "Click on the 'Login' button in the top navigation, then select 'Forgot Password?'. Enter your registered email to receive an instant password reset link.",
  },
];

export function FaqContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "ord-1": true });

  const categories = [
    { key: "all", label: "All Questions", icon: HelpCircle },
    { key: "orders", label: "Orders & Cart", icon: Package },
    { key: "shipping", label: "Shipping & Delivery", icon: Truck },
    { key: "payments", label: "Payments & COD", icon: CreditCard },
    { key: "returns", label: "Returns & Refunds", icon: RotateCcw },
    { key: "account", label: "Account & Profile", icon: User },
  ];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "Customer Care" }, { label: "FAQ" }]}
      title="Frequently Asked Questions"
      subtitle="Quick answers to everything you need to know about shopping, shipping, and payments on ELVOA."
      badge="Help & Knowledge Base"
      maxWidth="wide"
    >
      <div className="space-y-8">
        {/* 1. Search Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-6 shadow-xs">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. delivery time, bKash, refund, return)..."
              className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-neutral-50/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[#FF5B37]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <HelpCircle className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-800">
                No matching questions found
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching with different terms or check our contact channels below.
              </p>
            </div>
          )}
        </div>

        {/* 4. Still Need Help Contact Banner */}
        <div className="rounded-2xl bg-neutral-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Did not find your answer?</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 max-w-xl">
              Our customer happiness team is available Saturday through Thursday (9:00 AM – 9:00 PM) to help you directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF5B37] text-white text-xs sm:text-sm font-bold hover:bg-[#eb4e2a] transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </FooterPageShell>
  );
}
