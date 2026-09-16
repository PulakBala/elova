"use client";

import Link from "next/link";
import {
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Grid3X3,
  X,
  RotateCcw,
} from "lucide-react";
import type { FilterState } from "./FilterSidebar";
import type { SubCategory } from "@/data/categories";

export type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "newest"
  | "best-selling"
  | "rating";

interface ListingHeaderProps {
  categoryTitle: string;
  categoryDescription?: string;
  subcategories: SubCategory[];
  totalProductsCount: number;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  gridCols: 3 | 4;
  onGridColsChange: (cols: 3 | 4) => void;
  onOpenMobileFilter: () => void;
}

export function ListingHeader({
  categoryTitle,
  categoryDescription,
  subcategories,
  totalProductsCount,
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
  sortOption,
  onSortChange,
  gridCols,
  onGridColsChange,
  onOpenMobileFilter,
}: ListingHeaderProps) {
  // Helper to remove individual filter tags
  const removeSubcategory = (slug: string) => {
    onFilterChange({
      ...filters,
      selectedSubcategories: filters.selectedSubcategories.filter((s) => s !== slug),
    });
  };

  const removePrice = () => {
    onFilterChange({ ...filters, priceMin: "", priceMax: "" });
  };

  const removeSize = (size: string) => {
    onFilterChange({
      ...filters,
      selectedSizes: filters.selectedSizes.filter((s) => s !== size),
    });
  };

  const removeColor = (color: string) => {
    onFilterChange({
      ...filters,
      selectedColors: filters.selectedColors.filter((c) => c !== color),
    });
  };

  const removeInStock = () => {
    onFilterChange({ ...filters, inStockOnly: false });
  };

  const removeRating = () => {
    onFilterChange({ ...filters, minRating: null });
  };

  return (
    <div className="w-full mb-5">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 py-2">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <Link href="/shop" className="hover:text-neutral-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-400" />
        <span className="font-semibold text-neutral-900 capitalize">
          {categoryTitle}
        </span>
      </nav>

      {/* 2. Category Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pt-1 pb-3 border-b border-neutral-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-neutral-900 capitalize">
            {categoryTitle}
          </h1>
          {categoryDescription && (
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-xl">
              {categoryDescription}
            </p>
          )}
        </div>

        <span className="mt-2 sm:mt-0 text-xs text-neutral-500 font-medium">
          Showing <span className="font-bold text-neutral-900">{totalProductsCount}</span> products
        </span>
      </div>

      {/* 3. Utility Bar: Mobile Filter Button + Sorting + View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 pb-2">
        {/* Left Side: Mobile Filter Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="flex items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-2 text-xs font-bold text-neutral-800 shadow-2xs hover:border-neutral-300 hover:bg-neutral-50 transition-colors lg:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#FF5B37]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#FF5B37] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Side: Sorting Dropdown & Desktop Grid Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span className="hidden sm:inline font-medium">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 rounded-xl border border-neutral-200/90 bg-white px-3 text-xs font-semibold text-neutral-800 focus:border-[#FF5B37] focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="best-selling">Best Selling</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          {/* Desktop Grid Switcher (3 vs 4 columns) */}
          <div className="hidden xl:flex items-center rounded-xl border border-neutral-200/90 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onGridColsChange(3)}
              aria-label="3 columns grid"
              className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                gridCols === 3
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onGridColsChange(4)}
              aria-label="4 columns grid"
              className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                gridCols === 4
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-400 hover:text-neutral-800"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Filter Tags / Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-[11px] font-semibold text-neutral-500 mr-1">
            Active Filters:
          </span>

          {/* Subcategory chips */}
          {filters.selectedSubcategories.map((slug) => {
            const subObj = subcategories.find((s) => s.slug === slug);
            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800"
              >
                <span>{subObj ? subObj.name : slug}</span>
                <button
                  type="button"
                  onClick={() => removeSubcategory(slug)}
                  className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          {/* Price Range Chip */}
          {(filters.priceMin || filters.priceMax) && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800">
              <span>
                Price: {filters.priceMin ? `৳${filters.priceMin}` : "৳0"} -{" "}
                {filters.priceMax ? `৳${filters.priceMax}` : "Any"}
              </span>
              <button
                type="button"
                onClick={removePrice}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Sizes chips */}
          {filters.selectedSizes.map((size) => (
            <span
              key={size}
              className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800"
            >
              <span>Size: {size}</span>
              <button
                type="button"
                onClick={() => removeSize(size)}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Colors chips */}
          {filters.selectedColors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800 capitalize"
            >
              <span>Color: {color}</span>
              <button
                type="button"
                onClick={() => removeColor(color)}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* In Stock chip */}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={removeInStock}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Rating chip */}
          {filters.minRating && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-800">
              <span>{filters.minRating}★ & Above</span>
              <button
                type="button"
                onClick={removeRating}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Clear All button */}
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-[#FF5B37] hover:underline ml-1 cursor-pointer"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
}

