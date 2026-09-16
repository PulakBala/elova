import Link from "next/link";
import { Truck, RotateCcw, Headphones, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="w-full bg-[#111827] text-white text-[11px] sm:text-[11.5px] border-b border-neutral-800">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-3 sm:px-6 py-1.5">
        {/* Left Announcements with separators */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
            <span>Free delivery on orders over ৳999</span>
          </div>

          <span className="hidden sm:inline text-neutral-600">|</span>

          <div className="hidden sm:flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
            <span>Easy returns within 7 days</span>
          </div>

          <span className="hidden md:inline text-neutral-600">|</span>

          <div className="hidden md:flex items-center gap-1.5">
            <Headphones className="h-3.5 w-3.5 text-neutral-300 shrink-0" />
            <span>24/7 Customer Support</span>
          </div>
        </div>

        {/* Right Utility: Track Order */}
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="hidden sm:inline text-neutral-600">|</span>
          <Link
            href="/track-order"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-neutral-300" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

