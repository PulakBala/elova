"use client";

import { useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { FilterSidebar, type FilterState } from "./FilterSidebar";
import type { SubCategory } from "@/data/categories";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subcategories: SubCategory[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  totalProductsCount: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  subcategories,
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  totalProductsCount,
}: FilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 2. Slide-over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Products"
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-[340px] sm:max-w-[380px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3.5 bg-neutral-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#FF5B37]" />
            <h3 className="text-sm font-bold text-neutral-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5B37] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#FF5B37]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-white hover:text-neutral-900"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
          <FilterSidebar
            subcategories={subcategories}
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Drawer Sticky Footer Action */}
        <div className="border-t border-neutral-200 p-4 bg-white shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B37] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#eb4e2a]"
          >
            <span>Apply Filters ({totalProductsCount})</span>
          </button>
        </div>
      </div>
    </>
  );
}

