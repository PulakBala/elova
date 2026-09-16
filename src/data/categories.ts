export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  itemCount?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconImage: string;
  badge?: string;
  subcategories: SubCategory[];
}

export const mainCategories: CategoryItem[] = [
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    iconImage: "/images/categories/home-kitchen.svg",
    subcategories: [
      { id: "cookware", name: "Cookware & Bakeware", slug: "cookware", itemCount: 42 },
      { id: "utensils", name: "Kitchen Tools & Utensils", slug: "kitchen-tools", itemCount: 58 },
      { id: "storage-org", name: "Storage & Organizers", slug: "storage-organizers", itemCount: 64 },
      { id: "small-appliances", name: "Small Appliances", slug: "small-appliances", itemCount: 31 },
      { id: "dining", name: "Dining & Tableware", slug: "dining-tableware", itemCount: 27 },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    iconImage: "/images/categories/electronics.svg",
    badge: "Popular",
    subcategories: [
      { id: "audio", name: "Audio & Headphones", slug: "audio-headphones", itemCount: 48 },
      { id: "mobile-acc", name: "Mobile Accessories & Stands", slug: "mobile-accessories", itemCount: 75 },
      { id: "lighting", name: "Desk Lamps & LED Strips", slug: "smart-lighting", itemCount: 36 },
      { id: "cables-chargers", name: "Cables & Fast Chargers", slug: "cables-chargers", itemCount: 52 },
      { id: "computer-acc", name: "Computer & Laptop Gear", slug: "computer-accessories", itemCount: 39 },
    ],
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    slug: "fashion",
    iconImage: "/images/categories/fashion.svg",
    subcategories: [
      { id: "mens-apparel", name: "Men's Collection", slug: "mens-collection", itemCount: 85 },
      { id: "womens-apparel", name: "Women's Collection", slug: "womens-collection", itemCount: 92 },
      { id: "bags-wallets", name: "Bags & Wallets", slug: "bags-wallets", itemCount: 34 },
      { id: "footwear", name: "Shoes & Footwear", slug: "footwear", itemCount: 41 },
      { id: "eyewear", name: "Watches & Sunglasses", slug: "watches-eyewear", itemCount: 29 },
    ],
  },
  {
    id: "kids-toys",
    name: "Kids & Toys",
    slug: "kids-toys",
    iconImage: "/images/categories/kids-toys.svg",
    subcategories: [
      { id: "rc-action", name: "RC Cars & Action Toys", slug: "rc-cars", itemCount: 38 },
      { id: "educational", name: "Educational & Tablets", slug: "educational-toys", itemCount: 44 },
      { id: "drawing-crafts", name: "Drawing & Creative Pads", slug: "drawing-pads", itemCount: 26 },
      { id: "puzzles", name: "Board Games & Puzzles", slug: "board-games", itemCount: 22 },
      { id: "baby-gear", name: "Baby & Toddler Care", slug: "baby-care", itemCount: 19 },
    ],
  },
  {
    id: "beauty-care",
    name: "Beauty & Care",
    slug: "beauty-care",
    iconImage: "/images/categories/beauty-care.svg",
    subcategories: [
      { id: "makeup-org", name: "Makeup Organizers & Boxes", slug: "makeup-organizers", itemCount: 33 },
      { id: "skincare", name: "Skincare Tools & Rollers", slug: "skincare-tools", itemCount: 46 },
      { id: "hair-care", name: "Hair Styling & Brushes", slug: "hair-styling", itemCount: 28 },
      { id: "dispensers", name: "Automatic Soap Dispensers", slug: "soap-dispensers", itemCount: 15 },
      { id: "personal-grooming", name: "Personal Grooming", slug: "grooming", itemCount: 37 },
    ],
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    iconImage: "/images/categories/sports-fitness.svg",
    subcategories: [
      { id: "water-bottles", name: "Motivational Water Bottles", slug: "water-bottles", itemCount: 29 },
      { id: "recovery-massage", name: "Massage Guns & Rollers", slug: "massage-guns", itemCount: 24 },
      { id: "resistance-yoga", name: "Yoga Mats & Bands", slug: "yoga-bands", itemCount: 35 },
      { id: "gym-accessories", name: "Gym Accessories & Gloves", slug: "gym-gear", itemCount: 40 },
      { id: "outdoor-cycling", name: "Outdoor & Cycling", slug: "outdoor-cycling", itemCount: 18 },
    ],
  },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    iconImage: "/images/categories/automotive.svg",
    subcategories: [
      { id: "car-phone-holders", name: "Car Mounts & Holders", slug: "car-mounts", itemCount: 32 },
      { id: "car-chargers", name: "Fast Car Chargers & Plugs", slug: "car-chargers", itemCount: 27 },
      { id: "car-cleaning", name: "Handheld Mini Vacuums", slug: "car-vacuums", itemCount: 16 },
      { id: "car-interior", name: "Interior Comfort & Mats", slug: "car-interior", itemCount: 25 },
    ],
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    slug: "pet-supplies",
    iconImage: "/images/categories/pet-supplies.svg",
    subcategories: [
      { id: "pet-toys", name: "Interactive Pet Toys", slug: "pet-toys", itemCount: 28 },
      { id: "feeders-bowls", name: "Automatic Feeders & Bowls", slug: "pet-feeders", itemCount: 21 },
      { id: "grooming-cleaning", name: "Pet Grooming & Brushes", slug: "pet-grooming", itemCount: 19 },
      { id: "collars-leashes", name: "Collars & Harnesses", slug: "pet-collars", itemCount: 23 },
    ],
  },
  {
    id: "office-stationery",
    name: "Office & Stationery",
    slug: "office-stationery",
    iconImage: "/images/categories/office-stationery.svg",
    subcategories: [
      { id: "desk-organizers", name: "Desk Organizers & Trays", slug: "desk-organizers", itemCount: 34 },
      { id: "desk-mats", name: "Ergonomic Desk Mats", slug: "desk-mats", itemCount: 22 },
      { id: "notebooks", name: "Notebooks & Planners", slug: "notebooks", itemCount: 38 },
      { id: "pens-writing", name: "Writing Instruments", slug: "writing-instruments", itemCount: 41 },
    ],
  },
  {
    id: "more-categories",
    name: "More Categories",
    slug: "more-categories",
    iconImage: "/images/categories/more-categories.svg",
    subcategories: [
      { id: "smart-home", name: "Smart Home & Plugs", slug: "smart-home", itemCount: 29 },
      { id: "travel-gear", name: "Travel Gear & Neck Fans", slug: "travel-gear", itemCount: 33 },
      { id: "gift-bundles", name: "Gift Sets & Festive Combos", slug: "gift-sets", itemCount: 45 },
    ],
  },
];

