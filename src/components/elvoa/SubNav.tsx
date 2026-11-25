"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Flame, Store } from "lucide-react";
import { subNavLinks } from "@/data/elvoa-data";

interface SubNavProps {
  onOpenSidebar?: () => void;
}

export function SubNav({ onOpenSidebar }: SubNavProps) {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-neutral-200">
      <div className="mx-auto flex max-w-[1360px] items-center gap-6 px-4 py-2 sm:px-6 overflow-x-auto scrollbar-none">
        {/* All Categories Trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex items-center gap-2 text-[13.5px] font-bold text-neutral-900 shrink-0 hover:text-[#FF5B37] transition-colors cursor-pointer group py-1"
        >
          <Menu className="h-4.5 w-4.5 text-neutral-900 group-hover:text-[#FF5B37] transition-colors" />
          <span>All Categories</span>
        </button>

        <div className="h-4 w-[1px] bg-neutral-200 shrink-0 hidden sm:block" />

        {/* Primary Sub Links */}
        <div className="flex items-center gap-5 sm:gap-7 text-[13px] sm:text-[13.5px] font-medium shrink-0">
          {subNavLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-1.5 py-1 transition-all ${
                  isActive
                    ? "font-bold text-[#FF5B37]"
                    : item.isHighlight
                    ? "font-semibold text-[#FF5B37] hover:text-[#e04825]"
                    : "text-neutral-700 hover:text-[#FF5B37]"
                }`}
              >
                {item.isHighlight && (
                  <Flame className="h-4 w-4 fill-[#FF5B37] text-[#FF5B37]" />
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#FF5B37] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Become a Seller — SubNav CTA */}
        <a
          href={process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || "https://seller.elvoabd.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 shrink-0 px-3.5 py-1 rounded-full border-2 border-[#FF5B37] text-[#FF5B37] font-bold text-[12px] hover:bg-[#FF5B37] hover:text-white transition-all duration-200 hover:shadow-md hover:shadow-[#FF5B37]/30 group"
        >
          <Store className="h-3.5 w-3.5 group-hover:scale-110 transition-transform shrink-0" />
          <span className="whitespace-nowrap">Become a Seller</span>
        </a>
      </div>
    </nav>
  );
}
