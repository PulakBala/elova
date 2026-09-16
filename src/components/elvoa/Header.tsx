"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingCart, Menu } from "lucide-react";
import { ElvoaLogo } from "./ElvoaLogo";
import { useShop } from "@/context/ShopContext";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { openCart, totalCartItems, wishlist } = useShop();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Left: Mobile Menu Trigger + Brand Logo & Slogan */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
  
          <ElvoaLogo theme="dark" />
        </div>

        {/* Center: Search Bar (Desktop & Tablet) */}
        <div className="hidden flex-1 max-w-[620px] mx-2 md:block">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full h-10.5 rounded-lg border border-neutral-300 pl-4 pr-12 text-[13.5px] text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1 top-1 bottom-1 flex w-11 items-center justify-center rounded-md bg-[#FF5B37] text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

        {/* Right: Account, Wishlist, Cart Actions */}
        <div className="flex items-center gap-3.5 sm:gap-6 shrink-0">
          {/* Account */}
          <Link
            href="/account"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
          >
            <User className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-neutral-800 shrink-0 stroke-[1.8]" />
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[12.5px] font-bold text-neutral-900">
                Account
              </span>
              <span className="text-[11px] text-neutral-500">Sign in</span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <Heart className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-neutral-800 shrink-0 stroke-[1.8] group-hover:text-[#FF5B37] transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5B37] text-[9px] font-bold text-white shadow-2xs animate-in zoom-in-50 duration-200">
                  {wishlist.length}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[12.5px] font-bold text-neutral-900 group-hover:text-[#FF5B37] transition-colors">
                Wishlist
              </span>
              <span className="text-[11px] text-neutral-500">
                {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
              </span>
            </div>
          </Link>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Open Shopping Cart"
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <div className="relative">
              <ShoppingCart className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-neutral-800 shrink-0 stroke-[1.8] group-hover:text-[#FF5B37] transition-colors" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#FF5B37] text-[9px] font-bold text-white shadow-2xs animate-in zoom-in-50 duration-200">
                  {totalCartItems}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[12.5px] font-bold text-neutral-900 group-hover:text-[#FF5B37] transition-colors">
                Cart
              </span>
              <span className="text-[11px] text-neutral-500">
                {totalCartItems} {totalCartItems === 1 ? "Item" : "Items"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-3 pb-2.5 md:hidden">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands and more..."
            className="w-full h-9.5 rounded-lg border border-neutral-300 pl-3.5 pr-11 text-[13px] text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1 bottom-1 flex w-9 items-center justify-center rounded-md bg-[#FF5B37] text-white cursor-pointer"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
