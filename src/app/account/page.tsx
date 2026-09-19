import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountContent } from "@/components/account/AccountContent";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account Dashboard | ELVOA Store",
  description: "Manage your profile, view order history, and edit saved delivery addresses.",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF5B37]" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
