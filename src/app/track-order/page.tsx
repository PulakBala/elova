import type { Metadata } from "next";
import { TrackOrderContent } from "@/components/footer-pages/TrackOrderContent";

export const metadata: Metadata = {
  title: "Track Your Order | ELVOA Store",
  description:
    "Track your ELVOA shipment status in real-time across Bangladesh. Enter your order number to get live updates.",
};

export default function TrackOrderPage() {
  return <TrackOrderContent />;
}
