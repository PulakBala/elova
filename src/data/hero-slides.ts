export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    tag: "SMART HOME & LIVING",
    title: "Smart Finds for a Better Everyday",
    subtitle: "Quality products. Great prices. Only at ELVOA.",
    buttonText: "Shop Now",
    buttonHref: "/shop?category=home-kitchen",
    image: "/images/hero/hero-slide-1.jpg",
    imageAlt: "Modern home lifestyle and everyday essentials",
    accentColor: "#FF5B37",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
    badgeText: "Spring Collection 2026",
  },
  {
    id: "slide-2",
    tag: "NEXT-GEN ELECTRONICS",
    title: "Crisp Audio & Smart Desk Gear",
    subtitle: "Premium ANC earbuds, wireless tech, and rechargeable lighting designed for peak productivity.",
    buttonText: "Explore Tech",
    buttonHref: "/shop?category=electronics",
    image: "/images/hero/hero-slide-2.jpg",
    imageAlt: "Premium audio headphones and smart tech gear",
    accentColor: "#2563EB",
    badgeBg: "bg-blue-100 text-blue-900 border-blue-200",
    badgeText: "Up to 40% Off",
  },
  {
    id: "slide-3",
    tag: "MODERN ESSENTIALS",
    title: "Curated Fashion & Lifestyle Drops",
    subtitle: "Minimalist fashion crafted for everyday comfort, confidence, and effortless style.",
    buttonText: "View Collection",
    buttonHref: "/shop?category=fashion",
    image: "/images/hero/hero-slide-3.jpg",
    imageAlt: "Curated lifestyle apparel and luxury fashion",
    accentColor: "#D97706",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-200",
    badgeText: "New Season Arrivals",
  },
];

