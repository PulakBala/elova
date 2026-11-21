import { redirect } from "next/navigation";

export default function BecomeASellerPage() {
  const sellerUrl = process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || "https://seller.elvoabd.com";
  redirect(sellerUrl);
}
