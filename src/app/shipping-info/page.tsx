import type { Metadata } from "next";
import { ShippingInfoContent } from "@/components/footer-pages/ShippingInfoContent";

export const metadata: Metadata = {
  title: "Shipping & Delivery Information | ELVOA Store",
  description:
    "Fast and reliable nationwide delivery across all 64 districts of Bangladesh. Learn about delivery times, rates, and cash on delivery policies at ELVOA.",
};

export default function ShippingInfoPage() {
  return <ShippingInfoContent />;
}
