import type { Metadata } from "next";
import { HomePageContent } from "@/components/elvoa/HomePageContent";

export const metadata: Metadata = {
  title: "ELVOA | Everything You Need, One Place",
  description:
    "Discover smart finds, trending products, daily deals under ৳499, and new arrivals with fast nationwide delivery across Bangladesh. Quality products. Great prices. Only at ELVOA.",
};

export default function HomePage() {
  return <HomePageContent />;
}
