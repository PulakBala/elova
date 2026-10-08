"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { setStoredToken, fetchUserProfileApi } from "@/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const redirectUrl = searchParams.get("redirect") || "/account";
    const error = searchParams.get("error");

    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setTimeout(() => {
        router.replace(`/login?error=${encodeURIComponent(error)}`);
      }, 2500);
      return;
    }

    if (!token) {
      setErrorMessage("Authentication token was not provided by Google.");
      setTimeout(() => {
        router.replace("/login");
      }, 2500);
      return;
    }

    // Persist token and load customer profile
    const completeAuthentication = async () => {
      try {
        setStoredToken(token);
        const profileRes = await fetchUserProfileApi();

        if (profileRes.success && profileRes.data) {
          setAuthSession(token, profileRes.data);
          // Redirect to target destination (e.g. /account or /checkout)
          router.replace(redirectUrl.startsWith("/") ? redirectUrl : "/account");
        } else {
          setErrorMessage("Failed to retrieve your account profile. Please try logging in again.");
          setTimeout(() => {
            router.replace("/login");
          }, 2500);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setErrorMessage(err?.message || "Could not complete Google sign-in.");
        setTimeout(() => {
          router.replace("/login");
        }, 2500);
      }
    };

    completeAuthentication();
  }, [searchParams, router, setAuthSession]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border border-neutral-200/90 bg-white p-8 text-center shadow-sm">
        {errorMessage ? (
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Authentication Notice
            </h2>
            <p className="text-xs text-rose-600 leading-relaxed font-medium">
              {errorMessage}
            </p>
            <p className="text-[11px] text-neutral-400">
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-orange-50 text-[#FF5B37] flex items-center justify-center mx-auto">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Authenticating with Google
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Please wait a moment while we set up your secure session...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5B37]" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

