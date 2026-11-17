import type { Metadata } from "next";
import { SellerStorefrontContent } from "@/components/marketplace/SellerStorefrontContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} - Official Storefront | ELVOA Marketplace`,
    description: `Shop authentic products from ${formattedTitle} on ELVOA Marketplace Bangladesh with doorstep delivery and easy returns.`,
  };
}

export default async function StorefrontPage({ params }: PageProps) {
  const { slug } = await params;
  return <SellerStorefrontContent slug={slug} />;
}
