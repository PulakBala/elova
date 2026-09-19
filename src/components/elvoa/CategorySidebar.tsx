"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { mainCategories, type CategoryItem } from "@/data/categories";
import { useShop } from "@/context/ShopContext";
import { ElvoaLogo } from "./ElvoaLogo";

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryItem[];
}

export function CategorySidebar({ isOpen, onClose, categories: propCategories }: CategorySidebarProps) {
  const { categories: contextCategories } = useShop();
  const categoriesList = propCategories || contextCategories || mainCategories;

  // State tracking which category is currently expanded
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(() => {
    return categoriesList[0]?.id || "home-kitchen";
  });

  // Toggle category accordion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  // Close on Escape key press and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Slide-In Sidebar Drawer */}
      <aside
        aria-label="Category Navigation"
        aria-modal="true"
        role="dialog"
        className={`fixed top-0 left-0 bottom-0 z-50 flex w-full max-w-[340px] sm:max-w-[380px] flex-col bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <ElvoaLogo theme="dark" showSubtitle={false} />
            <span className="h-4 w-[1px] bg-neutral-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Categories
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Categories List Container */}
        <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-none">
          <div className="space-y-1">
            {categoriesList.map((cat: CategoryItem) => {
              const isExpanded = expandedCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="overflow-hidden rounded-xl border border-transparent transition-colors hover:border-neutral-200/80"
                >
                  {/* Main Category Row (Clickable Accordion Trigger) */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                      isExpanded
                        ? "bg-neutral-100/90 text-[#FF5B37]"
                        : "text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-neutral-200/70 p-1 shrink-0 shadow-2xs">
                        <Image
                          src={cat.iconImage}
                          alt=""
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="font-semibold text-[13.5px]">{cat.name}</span>
                      {cat.badge && (
                        <span className="inline-flex items-center rounded-full bg-[#FF5B37]/10 px-2 py-0.5 text-[10px] font-bold text-[#FF5B37]">
                          {cat.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-neutral-400">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-[#FF5B37] transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      )}
                    </div>
                  </button>

                  {/* Subcategories Accordion Content */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 py-1.5 px-3 bg-neutral-50/60"
                        : "grid-rows-[0fr] opacity-0 py-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-0.5 pl-9 border-l-2 border-neutral-200/80 my-1">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/category/${cat.slug}?sub=${sub.slug}`}
                              onClick={onClose}
                              className="group flex items-center justify-between py-1.5 px-2 text-xs font-medium text-neutral-600 rounded-md hover:bg-white hover:text-[#FF5B37] hover:shadow-2xs transition-colors"
                            >
                              <span>{sub.name}</span>
                              {sub.itemCount && (
                                <span className="text-[10.5px] text-neutral-400 font-normal group-hover:text-neutral-500">
                                  {sub.itemCount}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1 py-1.5 px-2 text-xs font-bold text-[#FF5B37] hover:underline"
                          >
                            <span>Explore all {cat.name}</span>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Bottom Quick Action */}
        <div className="border-t border-neutral-200 p-4 bg-neutral-50">
          <Link
            href="/shop?tag=under-499"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111827] py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-neutral-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>View All Flash Deals Under ৳499</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
