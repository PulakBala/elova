"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import {
  type Order,
  type UserProfile,
  type SavedAddress,
  initialUserProfile,
  initialOrders,
  initialAddresses,
} from "@/data/mock-account";
import { mainCategories, type CategoryItem } from "@/data/categories";
import { fetchCategoryTree, resolveAssetUrl, type ApiCategoryTreeItem } from "@/lib/api";

export interface CartItem {
  id: string;
  productId: string | number;
  variantId?: number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  quantity: number;
  inStock: boolean;
}

export interface AddToCartOptions {
  size?: string;
  color?: string;
  quantity?: number;
  variantId?: number;
  price?: number;
  image?: string;
}

interface ShopContextType {
  // Categories (Dynamic from API + Fallback)
  categories: CategoryItem[];
  isCategoriesLoading: boolean;
  refreshCategories: () => Promise<void>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product | any, options?: AddToCartOptions) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  totalCartItems: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product) => void;

  // User Profile, Orders, Addresses
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  orders: Order[];
  addOrder: (newOrder: Omit<Order, "id" | "orderNumber" | "date" | "status" | "tracking">) => Order;
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultShippingAddress: (id: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 1500;

// Initial pre-seeded items for an engaging initial demo experience
const defaultCart: CartItem[] = [
  {
    id: "earbuds-standard-black",
    productId: "earbuds",
    title: "TWS Wireless Earbuds (ANC)",
    image: "/images/products/earbuds.jpg",
    price: 1099,
    originalPrice: 1499,
    size: "Standard",
    color: "Black",
    quantity: 1,
    inStock: true,
  },
];

const defaultWishlistIds = ["chopper", "waterbottle", "blender"];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

function mapApiCategory(apiCat: ApiCategoryTreeItem): CategoryItem {
  return {
    id: String(apiCat.id || apiCat.slug),
    name: apiCat.name,
    slug: apiCat.slug,
    iconImage: resolveAssetUrl(apiCat.icon_image),
    badge: apiCat.badge || undefined,
    subcategories: (apiCat.subcategories || []).map((sub) => ({
      id: String(sub.id || sub.slug),
      name: sub.name,
      slug: sub.slug,
      itemCount: sub.products_count,
    })),
  };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamic Categories from API with immediate fallback to mainCategories
  const [categories, setCategories] = useState<CategoryItem[]>(mainCategories);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const refreshCategories = useCallback(async () => {
    setIsCategoriesLoading(true);
    try {
      const tree = await fetchCategoryTree();
      if (tree && tree.length > 0) {
        setCategories(tree.map(mapApiCategory));
      }
    } catch (e) {
      console.warn("Could not fetch category tree from API, using fallback", e);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  // 1. Cart State
  const [cart, setCart] = useState<CartItem[]>(defaultCart);

  // 2. Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // 3. User & Orders & Addresses
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);

  // Load from localStorage on client mount & fetch live categories
  useEffect(() => {
    setIsClient(true);
    refreshCategories();
    try {
      const savedCart = localStorage.getItem("elvoa_cart");
      if (savedCart !== null) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart([]);
        }
      }

      const savedWishlist = localStorage.getItem("elvoa_wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      } else {
        // Pre-populate with a couple of nice items from allProducts dynamically
        import("@/data/products").then(({ allProducts }) => {
          const sampleWishlist = allProducts.filter((p) =>
            defaultWishlistIds.includes(p.id)
          );
          setWishlist(sampleWishlist);
        });
      }

      const savedUser = localStorage.getItem("elvoa_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedOrders = localStorage.getItem("elvoa_orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedAddresses = localStorage.getItem("elvoa_addresses");
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (e) {
      console.warn("Could not load stored shop data", e);
    }
  }, [refreshCategories]);

  // Save changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("elvoa_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("elvoa_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn(e);
    }
  }, [wishlist, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("elvoa_orders", JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("elvoa_addresses", JSON.stringify(addresses));
    } catch (e) {
      console.warn(e);
    }
  }, [addresses, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("elvoa_user", JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
  }, [user, isClient]);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const freeShippingProgress = useMemo(() => {
    return Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [cartSubtotal]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  }, [cartSubtotal]);

  // Cart Operations
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((product: Product | any, options?: AddToCartOptions) => {
    const size = options?.size || (product.sizes && product.sizes[0]) || "Standard";
    const color = options?.color || (product.colors && product.colors[0]) || "Standard";
    const quantity = options?.quantity || 1;
    const variantId =
      options?.variantId ||
      product.default_variant_id ||
      product.variants?.[0]?.id ||
      undefined;
    const price = options?.price !== undefined ? options.price : product.price;
    const originalPrice =
      product.originalPrice !== undefined ? product.originalPrice : product.original_price;
    const image = options?.image || product.image;
    const itemId = `${product.id}-${variantId || size.toLowerCase()}-${color.toLowerCase()}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          variantId,
          title: product.title,
          image,
          price,
          originalPrice,
          size,
          color,
          quantity,
          inStock: product.inStock !== false && product.in_stock !== false,
        },
      ];
    });

    // Automatically trigger slide-over drawer
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("elvoa_cart", JSON.stringify([]));
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  // Wishlist Operations
  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => String(p.id) === String(product.id))) {
        return prev.filter((p) => String(p.id) !== String(product.id));
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((p) => String(p.id) === String(productId));
  }, [wishlist]);

  const moveToCart = useCallback((product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  }, [addToCart, removeFromWishlist]);

  // User Profile
  const updateUserProfile = useCallback((updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  }, []);

  // Orders
  const addOrder = useCallback((newOrderData: Omit<Order, "id" | "orderNumber" | "date" | "status" | "tracking">): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date());

    const createdOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ELV-${randomSuffix}`,
      date: dateFormatted,
      status: "Pending",
      tracking: [
        {
          title: "Order Placed",
          date: `${dateFormatted}, Just now`,
          completed: true,
          current: true,
        },
        { title: "Payment & Order Verification", completed: false },
        { title: "Processing & Packaging", completed: false },
        { title: "Handed over to Courier", completed: false },
        { title: "Out for Delivery", completed: false },
      ],
    };

    setOrders((prev) => [createdOrder, ...prev]);
    return createdOrder;
  }, []);

  // Addresses
  const addAddress = useCallback((addressData: Omit<SavedAddress, "id">) => {
    const newId = `addr-${Date.now()}`;
    const newAddress: SavedAddress = {
      ...addressData,
      id: newId,
    };

    setAddresses((prev) => {
      if (newAddress.isDefaultShipping) {
        return [...prev.map((a) => ({ ...a, isDefaultShipping: false })), newAddress];
      }
      return [...prev, newAddress];
    });
  }, []);

  const updateAddress = useCallback((id: string, updated: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updated } : addr))
    );
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  }, []);

  const setDefaultShippingAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefaultShipping: addr.id === id,
      }))
    );
  }, []);

  const value: ShopContextType = useMemo(
    () => ({
      categories,
      isCategoriesLoading,
      refreshCategories,
      cart,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      totalCartItems,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingProgress,
      amountNeededForFreeShipping,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      user,
      updateUserProfile,
      orders,
      addOrder,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultShippingAddress,
    }),
    [
      categories,
      isCategoriesLoading,
      refreshCategories,
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      totalCartItems,
      freeShippingProgress,
      amountNeededForFreeShipping,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      moveToCart,
      user,
      updateUserProfile,
      orders,
      addOrder,
      addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultShippingAddress,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
