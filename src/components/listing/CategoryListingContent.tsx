"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  PackageSearch,
  RotateCcw,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { ProductCard } from "@/components/elvoa/ProductCard";
import { FilterSidebar, type FilterState } from "./FilterSidebar";
import { FilterDrawer } from "./FilterDrawer";
import { ListingHeader, type SortOption } from "./ListingHeader";
import { Pagination } from "./Pagination";
import { mainCategories } from "@/data/categories";
import { allProducts } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { fetchProducts, type ApiProduct, type PaginationMeta } from "@/lib/api";

interface CategoryListingContentProps {
  categorySlug?: string;
  customTitle?: string;
  customDescription?: string;
}

const PAGE_SIZE = 12;

export function CategoryListingContent({
  categorySlug,
  customTitle,
  customDescription,
}: CategoryListingContentProps) {
  const { categories } = useShop();
  const searchParams = useSearchParams();
  const subQuery = searchParams.get("sub");
  const minQuery = searchParams.get("min");
  const maxQuery =
    searchParams.get("max") || (searchParams.get("tag") === "under-499" ? "499" : "");
  const sortQuery = searchParams.get("sort");

  // Global category navigation sidebar state
  const [globalSidebarOpen, setGlobalSidebarOpen] = useState(false);

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Grid layout columns on desktop (3 or 4)
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Sorting state
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (
      sortQuery &&
      ["price-low", "price-high", "newest", "best-selling", "rating", "featured"].includes(
        sortQuery
      )
    ) {
      return sortQuery as SortOption;
    }
    return "featured";
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // API Data State
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: PAGE_SIZE,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Category list resolution
  const categoriesList = categories && categories.length > 0 ? categories : mainCategories;

  // Lookup current category object
  const currentCategory = useMemo(() => {
    if (!categorySlug || categorySlug === "all" || categorySlug === "shop") {
      return null;
    }
    return categoriesList.find((c) => c.slug === categorySlug) || null;
  }, [categorySlug, categoriesList]);

  // Subcategories available for this category (or pooled if shop)
  const availableSubcategories = useMemo(() => {
    if (currentCategory) {
      return currentCategory.subcategories;
    }
    return categoriesList.flatMap((c) => c.subcategories);
  }, [currentCategory, categoriesList]);

  // Comprehensive filter state
  const [filters, setFilters] = useState<FilterState>({
    selectedSubcategories: subQuery ? [subQuery] : [],
    priceMin: minQuery || "",
    priceMax: maxQuery || "",
    selectedSizes: [],
    selectedColors: [],
    inStockOnly: false,
    minRating: null,
  });

  // Keep filters and sort in sync with query parameter if it changes
  useEffect(() => {
    const sub = searchParams.get("sub");
    const min = searchParams.get("min");
    const max =
      searchParams.get("max") || (searchParams.get("tag") === "under-499" ? "499" : "");
    const sort = searchParams.get("sort");

    if (
      sort &&
      ["price-low", "price-high", "newest", "best-selling", "rating", "featured"].includes(sort)
    ) {
      setSortOption(sort as SortOption);
    }

    setFilters((prev) => ({
      ...prev,
      selectedSubcategories: sub
        ? prev.selectedSubcategories.includes(sub)
          ? prev.selectedSubcategories
          : [...prev.selectedSubcategories, sub]
        : prev.selectedSubcategories,
      priceMin: min !== null ? min : prev.priceMin,
      priceMax: max ? max : prev.priceMax,
    }));
  }, [searchParams]);

  // Fetch products from Laravel API
  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const isUnder499 = searchParams.get("tag") === "under-499";
      const searchKeyword = searchParams.get("search") || searchParams.get("q") || undefined;
      const res = await fetchProducts({
        category_slug:
          categorySlug !== "all" && categorySlug !== "shop" ? categorySlug : undefined,
        sub:
          filters.selectedSubcategories.length > 0
            ? filters.selectedSubcategories
            : undefined,
        min_price: filters.priceMin || undefined,
        max_price: filters.priceMax || (isUnder499 ? 499 : undefined),
        sizes: filters.selectedSizes.length > 0 ? filters.selectedSizes : undefined,
        colors: filters.selectedColors.length > 0 ? filters.selectedColors : undefined,
        in_stock: filters.inStockOnly || undefined,
        sort: sortOption,
        search: searchKeyword,
        page: currentPage,
        per_page: PAGE_SIZE,
      });

      setApiProducts(res.products);
      setPaginationMeta(res.meta);
    } catch (err: any) {
      console.warn("API products fetch failed, falling back to client-filtered catalog:", err);
      // Client-side fallback if backend API is offline
      let fallback = [...allProducts];

      if (categorySlug && categorySlug !== "all" && categorySlug !== "shop") {
        fallback = fallback.filter(
          (p) => p.categorySlug?.toLowerCase() === categorySlug.toLowerCase()
        );
      }
      if (filters.selectedSubcategories.length > 0) {
        fallback = fallback.filter(
          (p) =>
            p.subCategorySlug &&
            filters.selectedSubcategories.includes(p.subCategorySlug)
        );
      }
      if (filters.priceMin) {
        const min = parseFloat(filters.priceMin);
        if (!isNaN(min)) fallback = fallback.filter((p) => p.price >= min);
      }
      if (filters.priceMax) {
        const max = parseFloat(filters.priceMax);
        if (!isNaN(max)) fallback = fallback.filter((p) => p.price <= max);
      }
      if (filters.inStockOnly) {
        fallback = fallback.filter((p) => p.inStock === true);
      }

      setApiProducts(fallback as unknown as ApiProduct[]);
      setPaginationMeta({
        current_page: currentPage,
        last_page: Math.ceil(fallback.length / PAGE_SIZE) || 1,
        per_page: PAGE_SIZE,
        total: fallback.length,
      });
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, filters, sortOption, currentPage, searchParams]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      selectedSubcategories: [],
      priceMin: "",
      priceMax: "",
      selectedSizes: [],
      selectedColors: [],
      inStockOnly: false,
      minRating: null,
    });
    setCurrentPage(1);
  };

  // Calculate active filter count for badges
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.selectedSubcategories.length;
    if (filters.priceMin || filters.priceMax) count += 1;
    count += filters.selectedSizes.length;
    count += filters.selectedColors.length;
    if (filters.inStockOnly) count += 1;
    if (filters.minRating) count += 1;
    return count;
  }, [filters]);

  const totalItems = paginationMeta.total;
  const totalPages = paginationMeta.last_page;

  // Page title and description
  const pageTitle =
    customTitle ||
    currentCategory?.name ||
    (categorySlug ? categorySlug.replace(/-/g, " ") : "All Products");

  const pageDescription =
    customDescription ||
    `Explore premium, trending ${pageTitle} at unbeatable prices with fast nationwide delivery.`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Global Announcement & Navigation Bars */}
      <TopBar />
      <Header onOpenSidebar={() => setGlobalSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setGlobalSidebarOpen(true)} />

      {/* 2. Global Category Drawer */}
      <CategorySidebar
        isOpen={globalSidebarOpen}
        onClose={() => setGlobalSidebarOpen(false)}
        categories={categoriesList}
      />

      {/* 3. Mobile Slide-Over Filter Drawer */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        subcategories={availableSubcategories}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
        totalProductsCount={totalItems}
      />

      {/* 4. Main Two-Column Listing Layout */}
      <main className="flex-1 py-4 sm:py-6">
        <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
          {/* Listing Top Header & Controls */}
          <ListingHeader
            categoryTitle={pageTitle}
            categoryDescription={pageDescription}
            subcategories={availableSubcategories}
            totalProductsCount={totalItems}
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            sortOption={sortOption}
            onSortChange={(option) => {
              setSortOption(option);
              setCurrentPage(1);
            }}
            gridCols={gridCols}
            onGridColsChange={setGridCols}
            onOpenMobileFilter={() => setMobileFilterOpen(true)}
          />

          {/* Two-Column Grid: Left Filter Sidebar + Right Product Grid */}
          <div className="flex items-start gap-6 lg:gap-8">
            {/* Left Column: Desktop Sticky Filter Sidebar */}
            <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-20">
              <FilterSidebar
                subcategories={availableSubcategories}
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setCurrentPage(1);
                }}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            {/* Right Column: Product Grid & Pagination */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                /* Loading Skeleton Grid */
                <div
                  className={`grid grid-cols-2 gap-2.5 sm:gap-3.5 ${
                    gridCols === 4
                      ? "md:grid-cols-3 xl:grid-cols-4"
                      : "md:grid-cols-3 xl:grid-cols-3"
                  }`}
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-2 sm:p-2.5 animate-pulse"
                    >
                      <div>
                        <div className="aspect-[4/3] sm:aspect-square w-full rounded-lg bg-neutral-200" />
                        <div className="mt-2.5 h-3.5 w-3/4 rounded bg-neutral-200" />
                        <div className="mt-1.5 h-3 w-1/2 rounded bg-neutral-200" />
                        <div className="mt-2 flex gap-2">
                          <div className="h-4 w-14 rounded bg-neutral-200" />
                          <div className="h-4 w-10 rounded bg-neutral-200" />
                        </div>
                      </div>
                      <div className="mt-3 h-8 w-full rounded-lg bg-neutral-200" />
                    </div>
                  ))}
                </div>
              ) : apiProducts.length > 0 ? (
                <>
                  {/* Responsive Product Grid */}
                  <div
                    className={`grid grid-cols-2 gap-2.5 sm:gap-3.5 ${
                      gridCols === 4
                        ? "md:grid-cols-3 xl:grid-cols-4"
                        : "md:grid-cols-3 xl:grid-cols-3"
                    }`}
                  >
                    {apiProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        className="h-full"
                      />
                    ))}
                  </div>

                  {/* Accessible Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      pageSize={PAGE_SIZE}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  )}
                </>
              ) : (
                /* Empty State when no products match filters */
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 p-12 text-center my-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-500 mb-4">
                    <PackageSearch className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">
                    No products found
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    We couldn&apos;t find any items matching your selected criteria. Try resetting your filters to see more results.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF5B37] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#eb4e2a] cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 5. Floating Mobile Filter Pill Button */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#111827] text-white px-5 py-2.5 text-xs font-bold shadow-xl border border-neutral-700/60 transition-transform active:scale-95 cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#FF5B37]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5B37] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 6. Guarantee Pillars & Footer */}
      <TrustPillars />
      <Footer />
    </div>
  );
}
