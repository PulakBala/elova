import type { Metadata } from "next";
import { BecomeASellerContent } from "@/components/marketplace/BecomeASellerContent";

export const metadata: Metadata = {
  title: "Become a Seller | ELVOA Marketplace Bangladesh",
  description:
    "Join ELVOA Marketplace as a verified seller. Sell to thousands of customers nationwide with automated courier pickups, dedicated storefronts, and guaranteed weekly payouts.",
};

export default function BecomeASellerPage() {
  return <BecomeASellerContent />;
}
