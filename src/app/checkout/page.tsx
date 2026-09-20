import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Secure Checkout | ELVOA Store",
  description: "Complete your order with instant account creation and fast nationwide delivery.",
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
