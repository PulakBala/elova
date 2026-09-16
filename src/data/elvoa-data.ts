export interface ElvoaProduct {
  id: string;
  title: string;
  badge?: {
    text: string;
    type: "discount" | "new";
  };
  image: string;
  rating: number;
  reviewsCount: string;
  price: number;
  originalPrice?: number;
  hasAddToCart?: boolean;
}

export interface ElvoaCategory {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const elvoaCategories: ElvoaCategory[] = [
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    image: "/images/elvoa/cat-home-kitchen.png",
    slug: "home-kitchen",
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "/images/elvoa/cat-electronics.png",
    slug: "electronics",
  },
  {
    id: "kids-toys",
    name: "Kids & Toys",
    image: "/images/elvoa/cat-kids-toys.png",
    slug: "kids-toys",
  },
  {
    id: "fashion",
    name: "Fashion",
    image: "/images/elvoa/cat-fashion.png",
    slug: "fashion",
  },
  {
    id: "beauty-care",
    name: "Beauty & Care",
    image: "/images/elvoa/cat-beauty-care.png",
    slug: "beauty-care",
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    image: "/images/elvoa/cat-sports-fitness.png",
    slug: "sports-fitness",
  },
  {
    id: "automotive",
    name: "Automotive",
    image: "/images/elvoa/cat-automotive.png",
    slug: "automotive",
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    image: "/images/elvoa/cat-pet-supplies.png",
    slug: "pet-supplies",
  },
  {
    id: "office-stationery",
    name: "Office & Stationery",
    image: "/images/elvoa/cat-office-stationery.png",
    slug: "office-stationery",
  },
  {
    id: "more-categories",
    name: "More Categories",
    image: "/images/elvoa/cat-more-categories.png",
    slug: "more-categories",
  },
];

export const trendingProducts: ElvoaProduct[] = [
  {
    id: "chopper",
    title: "Mini Electric Food Chopper 250ml",
    badge: { text: "-32%", type: "discount" },
    image: "/images/elvoa/trend-chopper.png",
    rating: 4.8,
    reviewsCount: "1.2k",
    price: 499,
    originalPrice: 729,
    hasAddToCart: true,
  },
  {
    id: "earbuds",
    title: "TWS Wireless Earbuds (ANC)",
    badge: { text: "-26%", type: "discount" },
    image: "/images/elvoa/trend-earbuds.png",
    rating: 4.6,
    reviewsCount: "856",
    price: 1099,
    originalPrice: 1499,
    hasAddToCart: true,
  },
  {
    id: "lamp",
    title: "LED Rechargeable Desk Lamp",
    badge: { text: "-40%", type: "discount" },
    image: "/images/elvoa/trend-lamp.png",
    rating: 4.7,
    reviewsCount: "642",
    price: 599,
    originalPrice: 999,
    hasAddToCart: true,
  },
  {
    id: "stuntcar",
    title: "Remote Control Stunt Car",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/trend-stuntcar.png",
    rating: 4.5,
    reviewsCount: "320",
    price: 899,
    hasAddToCart: true,
  },
  {
    id: "waterbottle",
    title: "Motivational Water Bottle 1 Liter",
    badge: { text: "-25%", type: "discount" },
    image: "/images/elvoa/trend-waterbottle.png",
    rating: 4.8,
    reviewsCount: "1.1k",
    price: 449,
    originalPrice: 599,
    hasAddToCart: true,
  },
  {
    id: "storagebox",
    title: "Multi-Layer Storage Box (3 Layer)",
    badge: { text: "-30%", type: "discount" },
    image: "/images/elvoa/trend-storagebox.png",
    rating: 4.7,
    reviewsCount: "410",
    price: 699,
    originalPrice: 999,
    hasAddToCart: true,
  },
];

export const dealsUnder499: ElvoaProduct[] = [
  {
    id: "utensils",
    title: "Silicone Kitchen Utensil Set",
    badge: { text: "-50%", type: "discount" },
    image: "/images/elvoa/deal-utensils.png",
    rating: 4.6,
    reviewsCount: "325",
    price: 299,
    originalPrice: 599,
  },
  {
    id: "cable",
    title: "3 in 1 Charging Cable",
    badge: { text: "-40%", type: "discount" },
    image: "/images/elvoa/deal-cable.png",
    rating: 4.5,
    reviewsCount: "890",
    price: 299,
    originalPrice: 499,
  },
  {
    id: "phonestand",
    title: "Foldable Phone Stand",
    badge: { text: "-33%", type: "discount" },
    image: "/images/elvoa/deal-phonestand.png",
    rating: 4.6,
    reviewsCount: "712",
    price: 199,
    originalPrice: 299,
  },
  {
    id: "ledstrip",
    title: "LED Light Strip 5 Meter",
    badge: { text: "-38%", type: "discount" },
    image: "/images/elvoa/deal-ledstrip.png",
    rating: 4.4,
    reviewsCount: "620",
    price: 399,
    originalPrice: 649,
  },
  {
    id: "lunchbox",
    title: "Stainless Steel Lunch Box",
    badge: { text: "-28%", type: "discount" },
    image: "/images/elvoa/deal-lunchbox.png",
    rating: 4.7,
    reviewsCount: "401",
    price: 499,
    originalPrice: 699,
  },
  {
    id: "wallhooks",
    title: "Self Adhesive Wall Hooks (10 pcs)",
    badge: { text: "-45%", type: "discount" },
    image: "/images/elvoa/deal-wallhooks.png",
    rating: 4.5,
    reviewsCount: "360",
    price: 199,
    originalPrice: 359,
  },
];

export const newArrivals: ElvoaProduct[] = [
  {
    id: "blender",
    title: "Portable Blender 400ml",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-blender.png",
    rating: 4.8,
    reviewsCount: "220",
    price: 899,
  },
  {
    id: "drawingtablet",
    title: "Kids Drawing Tablet 10 Inch",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-drawingtablet.png",
    rating: 4.5,
    reviewsCount: "540",
    price: 699,
  },
  {
    id: "carholder",
    title: "Car Phone Holder 360° Rotation",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-carholder.png",
    rating: 4.5,
    reviewsCount: "310",
    price: 599,
  },
  {
    id: "makeupbox",
    title: "Makeup Organizer Box",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-makeupbox.png",
    rating: 4.7,
    reviewsCount: "280",
    price: 999,
  },
  {
    id: "soapdispenser",
    title: "Automatic Soap Dispenser",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-soapdispenser.png",
    rating: 4.6,
    reviewsCount: "199",
    price: 799,
  },
  {
    id: "massagegun",
    title: "Massage Gun (4 Heads)",
    badge: { text: "New", type: "new" },
    image: "/images/elvoa/new-massagegun.png",
    rating: 4.8,
    reviewsCount: "450",
    price: 1499,
  },
];

export const subNavLinks = [
  { label: "Deals", href: "/deals", isHighlight: true },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Under ৳499", href: "/under-499" },
  { label: "Gift Ideas", href: "/gift-ideas" },
];

export const trustPillars = [
  {
    title: "Nationwide Delivery",
    subtitle: "Across Bangladesh",
    icon: "truck",
  },
  {
    title: "Secure Payment",
    subtitle: "bKash, Nagad, Cards",
    icon: "shield",
  },
  {
    title: "Easy Returns",
    subtitle: "Within 7 Days",
    icon: "refresh",
  },
  {
    title: "Customer Support",
    subtitle: "We're Here to Help",
    icon: "headset",
  },
];

