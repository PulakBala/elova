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
  Gift,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { useAuth } from "@/context/AuthContext";
import { BACKEND_BASE_URL } from "@/lib/api";

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
    referral_code: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    const refFromStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("elvoa_referral_code")
        : null;
    const activeRef = (refFromUrl || refFromStorage || "").trim().toUpperCase();
    if (activeRef) {
      setFormData((prev) => ({
        ...prev,
        referral_code: prev.referral_code || activeRef,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isAuthLoading, redirectUrl, router]);

  const handleGoogleSignUp = () => {
    const backend = BACKEND_BASE_URL.replace(/\/+$/, "");
    const target = redirectUrl ? encodeURIComponent(redirectUrl) : "%2Faccount";
    const refParam = formData.referral_code
      ? `&ref=${encodeURIComponent(formData.referral_code)}`
      : "";
    window.location.href = `${backend}/api/v1/auth/google/redirect?redirect=${target}${refParam}`;
  };

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
        referral_code: formData.referral_code.trim() || undefined,
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

      {/* Google Quick Sign-Up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full h-11 rounded-xl border border-neutral-300 bg-white font-bold text-xs text-neutral-700 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Sign up with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-5 flex items-center justify-center">
        <div className="w-full border-t border-neutral-200" />
        <span className="absolute bg-white px-3 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
          Or register with credentials
        </span>
      </div>

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

        {/* Optional Referral Code */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-[#FF5B37]" />
              <span>Referral Code</span>
            </span>
            <span className="text-[11px] font-normal text-neutral-400">Optional</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.referral_code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  referral_code: e.target.value.toUpperCase(),
                })
              }
              placeholder="e.g. ELV8A3B2"
              className="w-full h-10.5 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-900 placeholder-neutral-400 font-mono uppercase tracking-wider transition-colors focus:border-[#FF5B37] focus:outline-none"
            />
          </div>
          {formData.referral_code && (
            <p className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Referral code attached: {formData.referral_code}</span>
            </p>
          )}
          {fieldErrors.referral_code && (
            <p className="mt-1 text-[11px] text-[#D92D20]">
              {fieldErrors.referral_code[0]}
            </p>
          )}
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

