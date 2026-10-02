import type { Metadata } from "next";
import { AboutContent } from "@/components/footer-pages/AboutContent";

export const metadata: Metadata = {
  title: "About Us | ELVOA Store",
  description:
    "Discover the ELVOA story. We deliver authentic everyday essentials, gadgets, and lifestyle products nationwide across Bangladesh with speed and trust.",
};

export default function AboutPage() {
  return <AboutContent />;
}
