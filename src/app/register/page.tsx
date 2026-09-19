"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { useAuth } from "@/context/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const { register, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isAuthLoading, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMessage("Please provide at least a phone number or email address.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      if (result.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(
          result.message || "Registration failed. Please check the form."
        );
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-9 shadow-sm">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5B37]/10 px-3 py-1 text-xs font-bold text-[#FF5B37] mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>New Customer Registration</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Join ELVOA for one-click checkout, express courier tracking, and rewards.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-800 animate-in fade-in-50 duration-200">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Full Name <span className="text-[#D92D20]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Tanvir Ahmed"
              className="w-full h-10.5 rounded-xl border border-neutral-300 pl-10 pr-3.5 text-xs text-neutral-900 placeholder-neutral-400 transition-colors focus:border-[#FF5B37] focus:outline-none"
              required
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-[11px] text-[#D92D20]">{fieldErrors.name[0]}</p>
          )}
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Phone Number <span className="text-[#D92D20]">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="017XXXXXXXX"
                className="w-full h-10.5 rounded-xl border border-neutral-300 pl-10 pr-3.5 text-xs text-neutral-900 placeholder-neutral-400 transition-colors focus:border-[#FF5B37] focus:outline-none"
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-[11px] text-[#D92D20]">
                {fieldErrors.phone[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full h-10.5 rounded-xl border border-neutral-300 pl-10 pr-3.5 text-xs text-neutral-900 placeholder-neutral-400 transition-colors focus:border-[#FF5B37] focus:outline-none"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-[11px] text-[#D92D20]">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Password <span className="text-[#D92D20]">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="At least 6 characters"
              className="w-full h-10.5 rounded-xl border border-neutral-300 pl-10 pr-10 text-xs text-neutral-900 placeholder-neutral-400 transition-colors focus:border-[#FF5B37] focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-[11px] text-[#D92D20]">
              {fieldErrors.password[0]}
            </p>
          )}
        </div>

        {/* Password Confirmation */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Confirm Password <span className="text-[#D92D20]">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
              placeholder="Re-enter your password"
              className="w-full h-10.5 rounded-xl border border-neutral-300 pl-10 pr-3.5 text-xs text-neutral-900 placeholder-neutral-400 transition-colors focus:border-[#FF5B37] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-[#FF5B37] font-bold text-xs text-white shadow-sm hover:bg-[#eb4e2a] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
        <p className="text-xs text-neutral-600">
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-[#FF5B37] hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF5B37]" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </main>

      <TrustPillars />
      <Footer />
    </div>
  );
}

