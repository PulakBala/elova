"use client";

import { useState } from "react";
import {
  ChevronDown,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import type { SubCategory } from "@/data/categories";

export interface FilterState {
  selectedSubcategories: string[];
  priceMin: string;
  priceMax: string;
  selectedSizes: string[];
  selectedColors: string[];
  inStockOnly: boolean;
  minRating: number | null;
}

interface FilterSidebarProps {
  subcategories: SubCategory[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Standard"];

const AVAILABLE_COLORS = [
  { label: "Black", value: "black", bg: "bg-neutral-900", border: "border-neutral-900" },
  { label: "White", value: "white", bg: "bg-white", border: "border-neutral-300" },
  { label: "Coral / Red", value: "coral", bg: "bg-[#FF5B37]", border: "border-[#FF5B37]" },
  { label: "Blue / Navy", value: "blue", bg: "bg-blue-600", border: "border-blue-600" },
  { label: "Green", value: "green", bg: "bg-emerald-600", border: "border-emerald-600" },
  { label: "Pink", value: "pink", bg: "bg-pink-400", border: "border-pink-400" },
  { label: "Silver / Gray", value: "silver", bg: "bg-neutral-400", border: "border-neutral-400" },
];

const PRICE_PRESETS = [
  { label: "Under ৳500", min: "", max: "500" },
  { label: "৳500 - ৳1,000", min: "500", max: "1000" },
  { label: "৳1,000 - ৳2,000", min: "1000", max: "2000" },
  { label: "Above ৳2,000", min: "2000", max: "" },
];

export function FilterSidebar({
  subcategories,
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: FilterSidebarProps) {
  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    subcategories: true,
    price: true,
    sizes: true,
    colors: true,
    availability: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubcategoryToggle = (slug: string) => {
    const updated = filters.selectedSubcategories.includes(slug)
      ? filters.selectedSubcategories.filter((s) => s !== slug)
      : [...filters.selectedSubcategories, slug];
    onFilterChange({ ...filters, selectedSubcategories: updated });
  };

  const handleSizeToggle = (size: string) => {
    const updated = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onFilterChange({ ...filters, selectedSizes: updated });
  };

  const handleColorToggle = (color: string) => {
    const updated = filters.selectedColors.includes(color)
      ? filters.selectedColors.filter((c) => c !== color)
      : [...filters.selectedColors, color];
    onFilterChange({ ...filters, selectedColors: updated });
  };

  const handlePricePreset = (min: string, max: string) => {
    onFilterChange({ ...filters, priceMin: min, priceMax: max });
  };

  return (
    <aside className="w-full rounded-2xl border border-neutral-200/90 bg-white p-4.5 sm:p-5 shadow-xs">
      {/* Sidebar Header: Title + Clear All */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-neutral-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5B37] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF5B37] transition-opacity hover:opacity-80 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-4 divide-y divide-neutral-200/80">
        {/* 1. Subcategories Accordion */}
        {subcategories.length > 0 && (
          <div className="pt-2 first:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("subcategories")}
              className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
            >
              <span>Subcategories</span>
              <ChevronDown
                className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                  openSections.subcategories ? "rotate-180" : ""
                }`}
              />
            </button>

            {openSections.subcategories && (
              <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-none">
                {subcategories.map((sub) => {
                  const isChecked = filters.selectedSubcategories.includes(sub.slug);
                  return (
                    <label
                      key={sub.id}
                      className="flex items-center justify-between text-xs text-neutral-700 hover:text-neutral-950 cursor-pointer group py-0.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubcategoryToggle(sub.slug)}
                          className="h-4 w-4 rounded border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] cursor-pointer accent-[#FF5B37]"
                        />
                        <span className={isChecked ? "font-bold text-neutral-900" : ""}>
                          {sub.name}
                        </span>
                      </div>
                      {sub.itemCount && (
                        <span className="text-[11px] text-neutral-400 font-normal group-hover:text-neutral-500">
                          ({sub.itemCount})
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. Price Range Accordion */}
        <div className="pt-3.5">
          <button
            type="button"
            onClick={() => toggleSection("price")}
            className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
          >
            <span>Price Range</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                openSections.price ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.price && (
            <div className="mt-2 space-y-3">
              {/* Dual Min-Max Inputs */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) =>
                      onFilterChange({ ...filters, priceMin: e.target.value })
                    }
                    className="w-full h-8.5 rounded-lg border border-neutral-300 pl-6 pr-2 text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
                  />
                </div>
                <span className="text-neutral-400 text-xs font-bold">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) =>
                      onFilterChange({ ...filters, priceMax: e.target.value })
                    }
                    className="w-full h-8.5 rounded-lg border border-neutral-300 pl-6 pr-2 text-xs text-neutral-800 placeholder-neutral-400 focus:border-[#FF5B37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRICE_PRESETS.map((preset) => {
                  const isActive =
                    filters.priceMin === preset.min && filters.priceMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePricePreset(preset.min, preset.max)}
                      className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#FF5B37] text-white font-bold"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Sizes Accordion */}
        <div className="pt-3.5">
          <button
            type="button"
            onClick={() => toggleSection("sizes")}
            className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
          >
            <span>Sizes</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                openSections.sizes ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.sizes && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = filters.selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`min-w-9 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#FF5B37] bg-[#FF5B37] text-white shadow-2xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Colors Accordion */}
        <div className="pt-3.5">
          <button
            type="button"
            onClick={() => toggleSection("colors")}
            className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
          >
            <span>Colors</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                openSections.colors ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.colors && (
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((col) => {
                const isSelected = filters.selectedColors.includes(col.value);
                return (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => handleColorToggle(col.value)}
                    title={col.label}
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shadow-2xs ${col.bg} ${
                      isSelected
                        ? "ring-2 ring-[#FF5B37] ring-offset-2 scale-105"
                        : col.border
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`h-3.5 w-3.5 stroke-[2.5] ${
                          col.value === "white" ? "text-neutral-900" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. In-Stock Availability Filter */}
        <div className="pt-3.5">
          <button
            type="button"
            onClick={() => toggleSection("availability")}
            className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
          >
            <span>Availability</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                openSections.availability ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.availability && (
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    onFilterChange({ ...filters, inStockOnly: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] cursor-pointer accent-[#FF5B37]"
                />
                <span className={filters.inStockOnly ? "font-bold text-neutral-900" : ""}>
                  In Stock Only
                </span>
              </label>
            </div>
          )}
        </div>

        {/* 6. Customer Ratings Filter */}
        <div className="pt-3.5">
          <button
            type="button"
            onClick={() => toggleSection("rating")}
            className="flex w-full items-center justify-between py-2 text-left text-[13.5px] font-bold text-neutral-900 transition-colors hover:text-[#FF5B37] cursor-pointer"
          >
            <span>Customer Rating</span>
            <ChevronDown
              className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                openSections.rating ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.rating && (
            <div className="mt-2 space-y-2">
              {[4, 3].map((stars) => {
                const isChecked = filters.minRating === stars;
                return (
                  <label
                    key={stars}
                    className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-950 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={isChecked}
                      onChange={() =>
                        onFilterChange({
                          ...filters,
                          minRating: isChecked ? null : stars,
                        })
                      }
                      className="h-4 w-4 border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] cursor-pointer accent-[#FF5B37]"
                    />
                    <div className="flex items-center gap-1">
                      <span className="flex items-center text-amber-400">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                      <span className="text-neutral-600 font-medium">
                        & above
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

