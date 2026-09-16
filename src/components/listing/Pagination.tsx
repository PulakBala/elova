import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-neutral-200 mt-8">
      {/* Results Summary */}
      <p className="text-xs text-neutral-500 order-2 sm:order-1">
        Showing <span className="font-bold text-neutral-900">{startItem}</span>–
        <span className="font-bold text-neutral-900">{endItem}</span> of{" "}
        <span className="font-bold text-neutral-900">{totalItems}</span> products
      </p>

      {/* Page Navigation Buttons */}
      <nav aria-label="Pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold transition-colors ${
            currentPage === 1
              ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
              : "border-neutral-300 text-neutral-700 hover:border-[#FF5B37] hover:text-[#FF5B37] bg-white cursor-pointer"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Numbered Page Buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-xs text-neutral-400 font-bold"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FF5B37] text-white shadow-xs"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-semibold transition-colors ${
            currentPage === totalPages
              ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
              : "border-neutral-300 text-neutral-700 hover:border-[#FF5B37] hover:text-[#FF5B37] bg-white cursor-pointer"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}

