import type { Metadata } from "next";
import { ReturnPolicyContent } from "@/components/footer-pages/ReturnPolicyContent";

export const metadata: Metadata = {
  title: "Return & Refund Policy | ELVOA Store",
  description:
    "Learn about ELVOA's 7-day hassle-free return and refund policy. Easy returns, genuine refunds, and doorstep pickup across Bangladesh.",
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyContent />;
}
