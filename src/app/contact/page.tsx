import type { Metadata } from "next";
import { ContactContent } from "@/components/footer-pages/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | ELVOA Store",
  description:
    "Contact ELVOA customer care in Dhaka, Bangladesh. Reach out via phone hotline, WhatsApp, email, or our online inquiry desk for fast support.",
};

export default function ContactPage() {
  return <ContactContent />;
}
