import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchProduct, type ApiProduct } from "@/lib/api";
import { ProductDetailContent } from "@/components/product/ProductDetailContent";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | ELVOA",
    };
  }

  return {
    title: `${product.title} | ELVOA Store`,
    description:
      product.short_description ||
      `Buy ${product.title} online at best prices. Fast nationwide shipping across Bangladesh.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
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
      <ProductDetailContent product={product} />
    </Suspense>
  );
}

