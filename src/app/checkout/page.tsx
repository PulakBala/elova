import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Secure Checkout | ELVOA Store",
  description: "Complete your order with fast nationwide delivery across Bangladesh.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center text-sm text-neutral-500">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
