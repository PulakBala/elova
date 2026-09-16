import Link from "next/link";
import { ArrowRight, Flame, Tag, Star } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { ElvoaProduct } from "@/data/elvoa-data";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  iconType: "flame" | "tag" | "star";
  products: ElvoaProduct[];
  seeAllHref?: string;
}

export function ProductSection({
  title,
  subtitle,
  iconType,
  products,
  seeAllHref = "/shop",
}: ProductSectionProps) {
  const renderIcon = () => {
    switch (iconType) {
      case "flame":
        return <Flame className="h-4.5 w-4.5 fill-[#FF5B37] text-[#FF5B37]" />;
      case "tag":
        return <Tag className="h-4.5 w-4.5 fill-[#16A34A] text-[#16A34A]" />;
      case "star":
        return <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />;
    }
  };

  return (
    <section className="w-full bg-white py-4 sm:py-5">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-3.5">
          <div className="flex items-start gap-2 sm:gap-2.5">
            <div className="mt-0.5 shrink-0">{renderIcon()}</div>
            <div>
              <h2 className="text-base sm:text-lg lg:text-[19px] font-bold text-neutral-900 leading-tight">
                {title}
              </h2>
              <p className="mt-0.5 text-[11.5px] sm:text-[12.5px] text-neutral-500">
                {subtitle}
              </p>
            </div>
          </div>

          <Link
            href={seeAllHref}
            className="group flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-neutral-800 transition-colors hover:text-[#FF5B37]"
          >
            <span>See All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3.5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

