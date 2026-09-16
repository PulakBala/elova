import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryListingContent } from "@/components/listing/CategoryListingContent";

export const metadata: Metadata = {
  title: "All Products & Collections | ELVOA",
  description:
    "Explore all products, trending finds, and flash deals at ELVOA. Nationwide delivery across Bangladesh.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF5B37] border-t-transparent" />
        </div>
      }
    >
      <CategoryListingContent
        categorySlug="all"
        customTitle="All Products"
        customDescription="Browse our complete collection of trending essentials, everyday smart finds, and top deals."
      />
    </Suspense>
  );
}

