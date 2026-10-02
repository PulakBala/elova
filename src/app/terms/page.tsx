import type { Metadata } from "next";
import { TermsContent } from "@/components/footer-pages/TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions | ELVOA Store",
  description:
    "Read the terms and conditions governing the use of ELVOA's online marketplace, order placement, payments, and delivery across Bangladesh.",
};

export default function TermsPage() {
  return <TermsContent />;
}
