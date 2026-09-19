import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mainCategories } from "@/data/categories";
import { CategoryListingContent } from "@/components/listing/CategoryListingContent";
import { fetchCategory } from "@/lib/api";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return mainCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let categoryName = mainCategories.find((c) => c.slug === slug)?.name;

  if (!categoryName) {
    const apiCat = await fetchCategory(slug);
    if (apiCat) {
      categoryName = apiCat.name;
    }
  }

  if (!categoryName) {
    return {
      title: "Category Not Found | ELVOA",
    };
  }

  return {
    title: `${categoryName} | ELVOA Store`,
    description: `Shop trending ${categoryName} with fast delivery and great deals. Quality products. Great prices. Only at ELVOA.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  let category = mainCategories.find((c) => c.slug === slug);

  if (!category) {
    const apiCat = await fetchCategory(slug);
    if (apiCat) {
      category = {
        id: String(apiCat.id),
        name: apiCat.name,
        slug: apiCat.slug,
        iconImage: apiCat.icon_image,
        subcategories: (apiCat.subcategories || []).map((s) => ({
          id: String(s.id),
          name: s.name,
          slug: s.slug,
          itemCount: s.products_count,
        })),
      };
    }
  }

  if (!category) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF5B37] border-t-transparent" />
        </div>
      }
    >
      <CategoryListingContent
        categorySlug={slug}
        customTitle={category.name}
      />
    </Suspense>
  );
}
