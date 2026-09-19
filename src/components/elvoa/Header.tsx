"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  Package,
  MapPin,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { ElvoaLogo } from "./ElvoaLogo";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const { openCart, totalCartItems, wishlist } = useShop();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Customer";

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Left: Mobile Menu Trigger + Brand Logo & Slogan */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenSidebar && (
            <button
              type="button"
              onClick={onOpenSidebar}
              aria-label="Open Categories"
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
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
          {/* Dynamic Account Section */}
          {isAuthenticated && user ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 group hover:opacity-90 transition-opacity cursor-pointer text-left"
                aria-expanded={accountDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5B37]/10 text-[#FF5B37] font-extrabold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-tight">
                  <span className="text-[12.5px] font-bold text-neutral-900 group-hover:text-[#FF5B37] transition-colors flex items-center gap-1">
                    <span>Hi, {firstName}</span>
                    <ChevronDown
                      className={`h-3 w-3 text-neutral-400 transition-transform ${
                        accountDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <span className="text-[11px] text-neutral-500">My Account</span>
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-neutral-100">
                    <p className="text-xs font-extrabold text-neutral-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {user.phone || user.email}
                    </p>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <Link
                      href="/account"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-[#FF5B37] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/account?tab=orders"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-[#FF5B37] transition-colors"
                    >
                      <Package className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/account?tab=addresses"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-[#FF5B37] transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Saved Addresses</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={async () => {
                        setAccountDropdownOpen(false);
                        await logout();
                        window.location.href = "/";
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            >
              <User className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-neutral-800 shrink-0 stroke-[1.8]" />
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[12.5px] font-bold text-neutral-900 group-hover:text-[#FF5B37] transition-colors">
                  Account
                </span>
                <span className="text-[11px] text-neutral-500">Sign in / Register</span>
              </div>
            </Link>
          )}

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
