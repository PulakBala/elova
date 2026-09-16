import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mainCategories } from "@/data/categories";
import { CategoryListingContent } from "@/components/listing/CategoryListingContent";

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
  const category = mainCategories.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found | ELVOA",
    };
  }

  return {
    title: `${category.name} | ELVOA Store`,
    description: `Shop trending ${category.name} with fast delivery and great deals. Quality products. Great prices. Only at ELVOA.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = mainCategories.find((c) => c.slug === slug);

  // If category does not exist in master list, check if it's general or 404
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

