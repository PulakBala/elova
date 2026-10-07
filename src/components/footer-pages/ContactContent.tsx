"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { FooterPageShell } from "./FooterPageShell";
import { submitContactMessageApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function ContactContent() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto pre-fill if customer is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, phone number, and message.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitContactMessageApi({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim(),
      });

      if (response && response.success) {
        setSubmitted(true);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          subject: "Order Inquiry",
          message: "",
        });
      } else {
        setErrorMessage(response?.message || "Failed to submit your message. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting contact inquiry:", err);
      setErrorMessage(
        err?.message || "Unable to send your inquiry right now. Please call or WhatsApp us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Customer Support Hotline",
      details: "+880 9610-000000",
      subtext: "Available Sat – Thu (9:00 AM – 9:00 PM)",
      href: "tel:+8809610000000",
      action: "Call Now",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat Support",
      details: "+880 1700-000000",
      subtext: "Fastest response for order issues",
      href: "https://wa.me/8801700000000",
      action: "Chat on WhatsApp",
    },
    {
      icon: Mail,
      title: "Email Support Desk",
      details: "support@elvoa.com",
      subtext: "Responses within 2 to 4 business hours",
      href: "mailto:support@elvoa.com",
      action: "Send Email",
    },
    {
      icon: MapPin,
      title: "Fulfillment Hub & Office",
      details: "House #12, Road #4, Dhanmondi",
      subtext: "Dhaka-1205, Bangladesh",
      href: "#",
      action: "View Map",
    },
  ];

  return (
    <FooterPageShell
      breadcrumbs={[{ label: "Customer Care" }, { label: "Contact Us" }]}
      title="Contact Customer Support"
      subtitle="Have questions about an order or product? We are always here to assist you."
      badge="Direct Support"
      maxWidth="wide"
    >
      <div className="space-y-10">
        {/* 1. Quick Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#FF5B37] flex items-center justify-center mb-3.5">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">{c.title}</h3>
                  <p className="text-xs font-semibold text-neutral-800 mt-1">{c.details}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{c.subtext}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-xs font-bold text-[#FF5B37] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{c.action}</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Main Contact Form & Working Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
              Send us a Message
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Fill out the form below and our team will get back to you shortly.
            </p>

            {errorMessage && (
              <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Unable to send message</p>
                  <p className="mt-0.5 text-rose-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in-95">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-emerald-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 mt-1 max-w-md mx-auto">
                  Thank you for reaching out. Your inquiry has been forwarded to our support desk. One of our support representatives will contact you via phone or email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tanvir@example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-neutral-300 text-xs sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37]"
                    >
                      <option value="Order Inquiry">Order Status & Tracking</option>
                      <option value="Return Request">Return or Exchange Request</option>
                      <option value="Product Question">Product Specification & Stock</option>
                      <option value="Payment Issue">Payment & Billing Query</option>
                      <option value="Corporate / Bulk">Wholesale / Corporate Bulk Order</option>
                      <option value="Other">Other Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    How can we help? <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query or mention your Order Number..."
                    className="w-full p-3.5 rounded-xl border border-neutral-300 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B37]/30 focus:border-[#FF5B37] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-[#FF5B37] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#eb4e2a] transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Operational Details & Location (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Operational Schedule */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-neutral-100">
                <Clock className="h-5 w-5 text-[#FF5B37]" />
                <h3 className="text-base font-bold text-neutral-900">
                  Operating Hours
                </h3>
              </div>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-neutral-700">
                <li className="flex justify-between pb-2 border-b border-neutral-100">
                  <span className="font-semibold text-neutral-900">Saturday – Thursday:</span>
                  <span>9:00 AM – 9:00 PM</span>
                </li>
                <li className="flex justify-between pb-2 border-b border-neutral-100">
                  <span className="font-semibold text-neutral-900">Friday:</span>
                  <span>2:00 PM – 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-neutral-900">Online Store:</span>
                  <span className="text-emerald-600 font-bold">24/7 Always Open</span>
                </li>
              </ul>
            </div>

            {/* Quick Resolution Tips */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3.5 border-b border-neutral-100">
                <HelpCircle className="h-5 w-5 text-[#FF5B37]" />
                <h3 className="text-base font-bold text-neutral-900">
                  Quick Resolution Tips
                </h3>
              </div>
              <div className="mt-4 space-y-2.5 text-xs text-neutral-600">
                <p>
                  <strong>Looking for your parcel?</strong> Use our{" "}
                  <Link href="/track-order" className="text-[#FF5B37] font-bold underline">
                    Track Order page
                  </Link>{" "}
                  for live real-time status without having to wait on the phone.
                </p>
                <p className="pt-2 border-t border-neutral-100">
                  <strong>Need to return an item?</strong> Review our{" "}
                  <Link href="/return-policy" className="text-[#FF5B37] font-bold underline">
                    Return Policy
                  </Link>{" "}
                  for required photos and instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FooterPageShell>
  );
}
