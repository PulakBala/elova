import { redirect } from "next/navigation";

export default function BecomeASellerPage() {
  const sellerUrl = process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || "http://127.0.0.1:8000/sell";
  redirect(sellerUrl);
}
