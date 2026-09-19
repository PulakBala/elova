"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Building,
  CreditCard,
  Banknote,
  Smartphone,
  Info,
} from "lucide-react";

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  orderNotes: string;
  deliveryMethod: "inside-dhaka" | "outside-dhaka";
  paymentMethod: "cod" | "mobile-banking" | "card";
  mobileProvider: "bkash" | "nagad" | "rocket";
  mobileNumber: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (updated: Partial<CheckoutFormData>) => void;
  errors: Record<string, string>;
  isAuthenticated?: boolean;
  currentUser?: any;
}

const DISTRICT_CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
  "Jessore",
  "Faridpur",
];

export function CheckoutForm({
  formData,
  onChange,
  errors,
  isAuthenticated,
  currentUser,
}: CheckoutFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Optional Guest Sign In Banner */}
      {!isAuthenticated && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-amber-50/70 p-3.5 sm:p-4 text-xs text-neutral-800">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#FF5B37] shrink-0" />
            <span>Already have an ELVOA account?</span>
          </div>
          <Link
            href="/login?redirect=/checkout"
            className="font-bold text-[#FF5B37] hover:underline shrink-0"
          >
            Sign in to pre-fill
          </Link>
        </div>
      )}

      {/* 1. Customer Details & Instant Account Creation */}
      <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5B37]/10 text-[#FF5B37] font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              {isAuthenticated
                ? "Customer Contact Details"
                : "Customer Details & Instant Account Creation"}
            </h3>
            <p className="text-[11.5px] text-neutral-500">
              {isAuthenticated && currentUser ? (
                <span className="text-emerald-700 font-medium">
                  Logged in as {currentUser.name} (
                  {currentUser.phone || currentUser.email})
                </span>
              ) : (
                "No prior registration needed — your account will be created seamlessly upon order."
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Full Name <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="e.g. Tanvir Ahmed"
                value={formData.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                className={`w-full h-10.5 rounded-xl border pl-10 pr-3.5 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none ${
                  errors.fullName
                    ? "border-[#D92D20] bg-red-50/20"
                    : "border-neutral-300 focus:border-[#FF5B37]"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Email Address <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className={`w-full h-10.5 rounded-xl border pl-10 pr-3.5 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none ${
                  errors.email
                    ? "border-[#D92D20] bg-red-50/20"
                    : "border-neutral-300 focus:border-[#FF5B37]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Phone Number <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                value={formData.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className={`w-full h-10.5 rounded-xl border pl-10 pr-3.5 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none ${
                  errors.phone
                    ? "border-[#D92D20] bg-red-50/20"
                    : "border-neutral-300 focus:border-[#FF5B37]"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Required Create Account Password for Guests */}
          {!isAuthenticated && (
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <span>Create Account Password</span>
                  <span className="text-[#D92D20]">*</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  Instant Account Activation
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => onChange({ password: e.target.value })}
                  className={`w-full h-10.5 rounded-xl border pl-10 pr-11 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none ${
                    errors.password
                      ? "border-[#D92D20] bg-red-50/20"
                      : "border-neutral-300 focus:border-[#FF5B37]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                  {errors.password}
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-neutral-500 flex items-center gap-1">
                  <Info className="h-3 w-3 text-neutral-400 shrink-0" />
                  <span>
                    This password creates your permanent account so you can
                    track this order in your dashboard.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. Shipping & Delivery Address */}
      <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5B37]/10 text-[#FF5B37] font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              Delivery Address
            </h3>
            <p className="text-[11.5px] text-neutral-500">
              Where should we deliver your order?
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Delivery Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Full Delivery Address <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
              <textarea
                rows={2}
                placeholder="House / Apartment no., Road name, Sector / Area"
                value={formData.streetAddress}
                onChange={(e) => onChange({ streetAddress: e.target.value })}
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 transition-colors focus:outline-none resize-none ${
                  errors.streetAddress
                    ? "border-[#D92D20] bg-red-50/20"
                    : "border-neutral-300 focus:border-[#FF5B37]"
                }`}
              />
            </div>
            {errors.streetAddress && (
              <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                {errors.streetAddress}
              </p>
            )}
          </div>

          {/* District / City Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              District / City <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              <select
                value={formData.city}
                onChange={(e) => {
                  const newCity = e.target.value;
                  onChange({
                    city: newCity,
                    deliveryMethod:
                      newCity.toLowerCase() === "dhaka"
                        ? "inside-dhaka"
                        : "outside-dhaka",
                  });
                }}
                className={`w-full h-10.5 rounded-xl border pl-10 pr-3.5 text-xs text-neutral-800 focus:outline-none cursor-pointer bg-white ${
                  errors.city
                    ? "border-[#D92D20] bg-red-50/20"
                    : "border-neutral-300 focus:border-[#FF5B37]"
                }`}
              >
                <option value="">Select District</option>
                {DISTRICT_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {errors.city && (
              <p className="mt-1 text-[11px] text-[#D92D20] font-medium">
                {errors.city}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Postal Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 1212"
              value={formData.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              className="w-full h-10.5 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
            />
          </div>

          {/* Order Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Special Delivery Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Leave with guard, or call before arriving"
              value={formData.orderNotes}
              onChange={(e) => onChange({ orderNotes: e.target.value })}
              className="w-full h-10.5 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Delivery Method Selector */}
      <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5B37]/10 text-[#FF5B37] font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              Delivery Method
            </h3>
            <p className="text-[11.5px] text-neutral-500">
              Select shipping speed and area.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Inside Dhaka */}
          <label
            className={`flex items-start justify-between rounded-xl border p-4 cursor-pointer transition-all ${
              formData.deliveryMethod === "inside-dhaka"
                ? "border-[#FF5B37] bg-[#FFF8F6] ring-1 ring-[#FF5B37]"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="deliveryMethod"
                value="inside-dhaka"
                checked={formData.deliveryMethod === "inside-dhaka"}
                onChange={() => onChange({ deliveryMethod: "inside-dhaka" })}
                className="mt-0.5 h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <div>
                <span className="block text-xs font-bold text-neutral-900">
                  Inside Dhaka
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Delivered in 24–48 hours
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-900">৳60</span>
          </label>

          {/* Outside Dhaka */}
          <label
            className={`flex items-start justify-between rounded-xl border p-4 cursor-pointer transition-all ${
              formData.deliveryMethod === "outside-dhaka"
                ? "border-[#FF5B37] bg-[#FFF8F6] ring-1 ring-[#FF5B37]"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="deliveryMethod"
                value="outside-dhaka"
                checked={formData.deliveryMethod === "outside-dhaka"}
                onChange={() => onChange({ deliveryMethod: "outside-dhaka" })}
                className="mt-0.5 h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <div>
                <span className="block text-xs font-bold text-neutral-900">
                  Outside Dhaka
                </span>
                <span className="block text-[11px] text-neutral-500 mt-0.5">
                  Delivered in 2–4 business days
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-900">৳120</span>
          </label>
        </div>
      </section>

      {/* 4. Payment Method Selector */}
      <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5B37]/10 text-[#FF5B37] font-bold text-xs">
            4
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              Payment Method
            </h3>
            <p className="text-[11.5px] text-neutral-500">
              Choose your preferred payment method.
            </p>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="mt-4 space-y-3">
          {/* Option A: Cash on Delivery */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              formData.paymentMethod === "cod"
                ? "border-[#FF5B37] bg-[#FFF8F6] ring-1 ring-[#FF5B37]"
                : "border-neutral-200 hover:border-neutral-300 bg-white"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={() => onChange({ paymentMethod: "cod" })}
                className="h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <Banknote className="h-4.5 w-4.5 text-emerald-600" />
              <div className="flex-1">
                <span className="text-xs font-bold text-neutral-900 block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Pay securely with cash upon receiving package at your door.
                </span>
              </div>
            </label>
          </div>

          {/* Option B: Mobile Banking (bKash / Nagad / Rocket) */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              formData.paymentMethod === "mobile-banking"
                ? "border-[#FF5B37] bg-[#FFF8F6] ring-1 ring-[#FF5B37]"
                : "border-neutral-200 hover:border-neutral-300 bg-white"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile-banking"
                checked={formData.paymentMethod === "mobile-banking"}
                onChange={() => onChange({ paymentMethod: "mobile-banking" })}
                className="h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <Smartphone className="h-4.5 w-4.5 text-pink-600" />
              <div className="flex-1">
                <span className="text-xs font-bold text-neutral-900 block">
                  Mobile Banking (bKash / Nagad / Rocket)
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Instant mobile wallet checkout.
                </span>
              </div>
            </label>

            {/* Mobile Banking Sub-Form */}
            {formData.paymentMethod === "mobile-banking" && (
              <div className="mt-3.5 pt-3.5 border-t border-neutral-200/80 space-y-3">
                <div className="flex gap-2">
                  {[
                    {
                      id: "bkash",
                      name: "bKash",
                      color: "text-pink-600 border-pink-300",
                    },
                    {
                      id: "nagad",
                      name: "Nagad",
                      color: "text-orange-600 border-orange-300",
                    },
                    {
                      id: "rocket",
                      name: "Rocket",
                      color: "text-purple-600 border-purple-300",
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onChange({ mobileProvider: p.id as any })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        formData.mobileProvider === p.id
                          ? "bg-white shadow-xs border-[#FF5B37] text-[#FF5B37]"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-white"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Your {formData.mobileProvider.toUpperCase()} Account Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      onChange({ mobileNumber: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white"
                  />
                  <p className="mt-1 text-[10.5px] text-neutral-500">
                    You will receive an automated OTP prompt after placing your
                    order.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Option C: Credit / Debit Card */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              formData.paymentMethod === "card"
                ? "border-[#FF5B37] bg-[#FFF8F6] ring-1 ring-[#FF5B37]"
                : "border-neutral-200 hover:border-neutral-300 bg-white"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={() => onChange({ paymentMethod: "card" })}
                className="h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <CreditCard className="h-4.5 w-4.5 text-blue-600" />
              <div className="flex-1">
                <span className="text-xs font-bold text-neutral-900 block">
                  Credit / Debit Card (Visa, MasterCard, Amex)
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Fast, encrypted card payment gateway.
                </span>
              </div>
            </label>

            {/* Card Sub-Form */}
            {formData.paymentMethod === "card" && (
              <div className="mt-3.5 pt-3.5 border-t border-neutral-200/80 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.cardName}
                    onChange={(e) => onChange({ cardName: e.target.value })}
                    className="w-full h-9 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      onChange({ cardNumber: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={formData.cardExpiry}
                      onChange={(e) =>
                        onChange({ cardExpiry: e.target.value })
                      }
                      className="w-full h-9 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={formData.cardCvv}
                      onChange={(e) =>
                        onChange({ cardCvv: e.target.value })
                      }
                      className="w-full h-9 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
