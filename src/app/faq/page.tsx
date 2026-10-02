import type { Metadata } from "next";
import { FaqContent } from "@/components/footer-pages/FaqContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | ELVOA Store",
  description:
    "Find fast answers to frequently asked questions about orders, payments (bKash/Nagad/Cards), nationwide shipping, returns, and account support on ELVOA.",
};

export default function FaqPage() {
  return <FaqContent />;
}
