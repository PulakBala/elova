import type { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Secure Checkout | ELVOA Store",
  description: "Complete your order with instant account creation and fast nationwide delivery.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}

