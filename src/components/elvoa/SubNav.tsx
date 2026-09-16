"use client";

import Link from "next/link";
import { Menu, Flame } from "lucide-react";
import { subNavLinks } from "@/data/elvoa-data";

interface SubNavProps {
  onOpenSidebar?: () => void;
}

export function SubNav({ onOpenSidebar }: SubNavProps) {
  return (
    <nav className="w-full bg-white border-b border-neutral-200">
      <div className="mx-auto flex max-w-[1360px] items-center gap-6 px-4 py-2.5 sm:px-6 overflow-x-auto scrollbar-none">
        {/* All Categories Trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex items-center gap-2 text-[13.5px] font-bold text-neutral-900 shrink-0 hover:text-[#FF5B37] transition-colors cursor-pointer group"
        >
          <Menu className="h-4.5 w-4.5 text-neutral-900 group-hover:text-[#FF5B37] transition-colors" />
          <span>All Categories</span>
        </button>

        <div className="h-4 w-[1px] bg-neutral-200 shrink-0 hidden sm:block" />

        {/* Primary Sub Links */}
        <div className="flex items-center gap-5 sm:gap-7 text-[13px] sm:text-[13.5px] font-medium text-neutral-800 shrink-0">
          {subNavLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1.5 transition-colors hover:text-[#FF5B37] ${
                item.isHighlight
                  ? "font-bold text-[#FF5B37]"
                  : "text-neutral-800 hover:text-neutral-950"
              }`}
            >
              {item.isHighlight && (
                <Flame className="h-4 w-4 fill-[#FF5B37] text-[#FF5B37]" />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
