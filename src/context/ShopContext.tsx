"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  quantity: number;
  inStock: boolean;
}

interface AddToCartOptions {
  size?: string;
  color?: string;
  quantity?: number;
}

interface ShopContextType {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, options?: AddToCartOptions) => void;
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

export function ShopProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Cart State
  const [cart, setCart] = useState<CartItem[]>(defaultCart);

  // 2. Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // 3. User & Orders & Addresses
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedCart = localStorage.getItem("elvoa_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
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
  }, []);

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
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, options?: AddToCartOptions) => {
    const size = options?.size || (product.sizes && product.sizes[0]) || "Standard";
    const color = options?.color || (product.colors && product.colors[0]) || "Standard";
    const quantity = options?.quantity || 1;
    const itemId = `${product.id}-${size.toLowerCase()}-${color.toLowerCase()}`;

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
          title: product.title,
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          size,
          color,
          quantity,
          inStock: product.inStock !== false,
        },
      ];
    });

    // Automatically trigger slide-over drawer
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.some((p) => p.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const moveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  // User Profile
  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Orders
  const addOrder = (newOrderData: Omit<Order, "id" | "orderNumber" | "date" | "status" | "tracking">): Order => {
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
  };

  // Addresses
  const addAddress = (addressData: Omit<SavedAddress, "id">) => {
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
  };

  const updateAddress = (id: string, updated: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updated } : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const setDefaultShippingAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefaultShipping: addr.id === id,
      }))
    );
  };

  const value: ShopContextType = {
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
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}

