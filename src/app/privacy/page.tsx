import type { Metadata } from "next";
import { PrivacyContent } from "@/components/footer-pages/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | ELVOA Store",
  description:
    "Learn how ELVOA safeguards and manages your personal data, transaction history, and privacy rights across our online platform in Bangladesh.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
