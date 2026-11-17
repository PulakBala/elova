"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Star,
  Package,
  ShoppingBag,
  MapPin,
  Clock,
  RotateCcw,
  Truck,
  MessageSquare,
  ChevronRight,
  Filter,
  CheckCircle,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { Footer } from "@/components/elvoa/Footer";
import {
  fetchStoreDetailsApi,
  fetchStoreProductsApi,
  fetchStoreReviewsApi,
  resolveAssetUrl,
  type ApiStoreDetails,
  type ApiProduct,
  type PaginationMeta,
  type ApiSellerReviewItem,
} from "@/lib/api";
import { useShop } from "@/context/ShopContext";

interface Props {
  slug: string;
}

export function SellerStorefrontContent({ slug }: Props) {
  const [store, setStore] = useState<ApiStoreDetails | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 16,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">("products");
  const [reviews, setReviews] = useState<ApiSellerReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { addToCart } = useShop();

  // Load reviews when reviews tab is active
  useEffect(() => {
    if (activeTab === "reviews" && reviews.length === 0) {
      setReviewsLoading(true);
      fetchStoreReviewsApi(slug).then((res) => {
        setReviews(res.reviews);
        setReviewsLoading(false);
      });
    }
  }, [activeTab, slug, reviews.length]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchStoreDetailsApi(slug),
      fetchStoreProductsApi(slug, { page, sort: selectedSort }),
    ]).then(([storeData, prodData]) => {
      if (isMounted) {
        setStore(storeData);
        setProducts(prodData.products);
        setMeta(prodData.meta);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, page, selectedSort]);

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPage(1);
  };

  if (isLoading && !store) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans">
        <TopBar />
        <Header />
        <SubNav />
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-neutral-500">
          Loading merchant storefront...
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans">
        <TopBar />
        <Header />
        <SubNav />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
            <Store className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Store Not Found</h2>
          <p className="text-xs text-neutral-500 mb-6">
            The merchant store you are looking for is either inactive, under administrative review, or does not exist.
          </p>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl bg-[#FF5B37] text-white text-xs font-bold hover:bg-[#e04b28] transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col font-sans">
      <TopBar />
      <Header />
      <SubNav />

      <main className="flex-1 pb-16">
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-64 w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FF5B37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-6xl mx-auto px-4 h-full flex items-end pb-4">
            <nav className="flex items-center gap-1.5 text-xs text-neutral-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-neutral-400" />
              <Link href="/shop" className="hover:text-white transition-colors">
                Marketplace
              </Link>
              <ChevronRight className="h-3 w-3 text-neutral-400" />
              <span className="text-white font-medium">{store.store_name}</span>
            </nav>
          </div>
        </div>

        {/* Store Profile Card Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10 mb-8">
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Logo & Identity */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-neutral-200 shadow-sm overflow-hidden shrink-0 flex items-center justify-center relative">
                  {store.logo_url && !store.logo_url.includes("placeholder") ? (
                    <Image
                      src={resolveAssetUrl(store.logo_url)}
                      alt={store.store_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Store className="h-10 w-10 text-neutral-400" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                      {store.store_name}
                    </h1>
                    {store.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified Seller</span>
                      </span>
                    )}
                    {store.is_official && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5B37] border border-orange-200">
                        <span>Official Flagship</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 mt-1 max-w-xl line-clamp-2">
                    {store.headline}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-neutral-900">{store.rating_avg.toFixed(1)}</span>
                      <span className="text-neutral-400">({store.rating_count} reviews)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Package className="h-3.5 w-3.5 text-neutral-400" />
                      <span><strong>{store.total_products_count}</strong> Products</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5 text-neutral-400" />
                      <span><strong>{store.total_orders_count}</strong> Orders Delivered</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{store.location.district}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <Link
                  href={`/contact?store=${encodeURIComponent(store.store_name)}`}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Contact Store via ELVOA</span>
                </Link>
              </div>
            </div>

            {/* Store Guarantees Strip */}
            <div className="mt-6 pt-5 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-600">
                <Truck className="h-4 w-4 text-[#FF5B37] shrink-0" />
                <span>Nationwide delivery via <strong>ELVOA Master Courier</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-600">
                <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>7-Day Returns</strong> with 100% money back</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-600">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Customer privacy & buyer protection guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-2 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "products"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Products ({meta.total})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Customer Reviews ({store.rating_count || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("about")}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "about"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Store className="h-4 w-4" />
              <span>About & Policies</span>
            </button>
          </div>
        </div>

        {/* Tab Content: Products */}
        {activeTab === "products" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  All Products ({meta.total})
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Authentic merchandise fulfilled directly by {store.store_name}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-neutral-400 font-medium">Sort by:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
                >
                  <option value="featured">Featured</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center">
                <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-neutral-800">No active products found</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  This store has not published approved product listings yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => {
                  const primaryImg = product.image || "/images/products/placeholder.jpg";
                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative block aspect-square bg-neutral-100 overflow-hidden"
                        >
                          <Image
                            src={resolveAssetUrl(primaryImg)}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.badge && (
                            <span
                              className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs ${
                                product.badge.type === "discount" ? "bg-[#FF5B37]" : "bg-neutral-900"
                              }`}
                            >
                              {product.badge.text}
                            </span>
                          )}
                        </Link>

                        {/* Content */}
                        <div className="p-3.5">
                          <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mb-1">
                            {product.category?.name || "Marketplace"}
                          </div>
                          <h3 className="text-xs sm:text-[13px] font-semibold text-neutral-900 line-clamp-2 hover:text-[#FF5B37] transition-colors leading-snug">
                            <Link href={`/products/${product.slug}`}>{product.title}</Link>
                          </h3>

                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex items-center text-amber-400 text-[11px]">
                              <Star className="h-3 w-3 fill-amber-400" />
                              <span className="font-bold text-neutral-800 ml-0.5">
                                {product.rating?.toFixed(1) || "4.8"}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-400">
                              ({product.reviews_count || 0})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="p-3.5 pt-0">
                        <div className="flex items-baseline justify-between mb-2.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-neutral-900">
                              ৳{product.price.toLocaleString()}
                            </span>
                            {product.original_price && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ৳{product.original_price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart(product, {
                              sellerId: store.id,
                              sellerName: store.store_name,
                              sellerSlug: store.slug,
                            })
                          }
                          className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-[#FF5B37] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-neutral-500 font-medium">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button
                  type="button"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Customer Reviews */}
        {activeTab === "reviews" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-100">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-extrabold text-neutral-900">
                    {store.rating_avg.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= Math.round(store.rating_avg)
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">
                    Based on {store.rating_count} verified buyer ratings
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-50 rounded-2xl p-4">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Product Quality</span>
                    <strong className="text-neutral-800 text-sm">4.9 / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Shipping Speed</span>
                    <strong className="text-neutral-800 text-sm">4.8 / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Merchant Service</span>
                    <strong className="text-neutral-800 text-sm">5.0 / 5.0</strong>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="mt-6 divide-y divide-neutral-100">
                {reviewsLoading ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    Loading customer feedback...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-xs text-neutral-500">
                      No customer reviews yet. Be the first to order and review {store.store_name}!
                    </p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="py-4.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-800">
                            {rev.user?.name || "Verified Customer"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Verified Purchase
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {new Date(rev.created_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                      {rev.review_text && (
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {rev.review_text}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: About & Policies */}
        {activeTab === "about" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">About {store.store_name}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {store.description ||
                    `${store.store_name} is a verified independent seller partner on ELVOA Bangladesh, committed to providing original lifestyle and fashion goods.`}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <h4 className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-[#FF5B37]" />
                    <span>Shipping & Dispatch SLA</span>
                  </h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Parcels are prepared and handed over to ELVOA Master Logistics within 24 to 48 hours from {store.location.district}.
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <h4 className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                    <RotateCcw className="h-4 w-4 text-emerald-600" />
                    <span>7-Day Return Guarantee</span>
                  </h4>
                  <p className="text-neutral-600 leading-relaxed">
                    Eligible for 7-day hassle-free return and refund through ELVOA Customer Support if damaged or incorrect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
