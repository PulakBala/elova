import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchProduct, type ApiProduct } from "@/lib/api";
import { allProducts } from "@/data/products";
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
    const mock = allProducts.find((p) => p.id === slug || p.slug === slug);
    if (!mock) {
      return {
        title: "Product Not Found | ELVOA",
      };
    }
    return {
      title: `${mock.title} | ELVOA Store`,
      description: `Buy ${mock.title} online at best prices. Fast nationwide shipping in Bangladesh.`,
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
  let product = await fetchProduct(slug);

  // Fallback to mock product if API is unreachable or item was added by mock ID
  if (!product) {
    const mock = allProducts.find((p) => p.id === slug || p.slug === slug);
    if (mock) {
      product = {
        id: 1,
        title: mock.title,
        slug: mock.slug || mock.id,
        sku: `ELV-${mock.id.toUpperCase()}`,
        badge: mock.badge,
        image: mock.image,
        gallery: [mock.image],
        price: mock.price,
        original_price: mock.originalPrice,
        rating: mock.rating,
        reviews_count: typeof mock.reviewsCount === "string" ? parseInt(mock.reviewsCount) || 12 : mock.reviewsCount,
        sales_count: mock.salesCount || 100,
        in_stock: mock.inStock !== false,
        is_featured: false,
        has_add_to_cart: true,
        colors: mock.colors || [],
        sizes: mock.sizes || [],
        variants: [
          {
            id: 1,
            sku: `ELV-${mock.id.toUpperCase()}-STD`,
            regular_price: mock.originalPrice || mock.price,
            sale_price: mock.price,
            effective_price: mock.price,
            stock_quantity: 50,
            in_stock: true,
            status: "active",
          },
        ],
      };
    }
  }

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

