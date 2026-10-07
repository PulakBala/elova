"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const refCode = searchParams.get("ref");
      if (refCode && refCode.trim() !== "") {
        const cleanCode = refCode.trim().toUpperCase();
        // 1. Store in localStorage for client persistence
        localStorage.setItem("elvoa_referral_code", cleanCode);

        // 2. Set 30-day cookie for server/SSR access
        document.cookie = `elvoa_ref=${cleanCode}; path=/; max-age=2592000; SameSite=Lax`;
      }
    } catch (e) {
      // Ignore in non-browser or restricted storage contexts
    }
  }, [searchParams]);

  return null;
}

