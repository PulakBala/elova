import type { Metadata } from "next";
import { WishlistContent } from "@/components/wishlist/WishlistContent";

export const metadata: Metadata = {
  title: "My Wishlist | ELVOA Store",
  description: "View and manage your saved items and favorite products on ELVOA.",
};

export default function WishlistPage() {
  return <WishlistContent />;
}

