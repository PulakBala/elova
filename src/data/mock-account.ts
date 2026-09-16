import type { Product } from "./products";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberSince: string;
  rewardPoints: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderTrackingStep {
  title: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Cash on Delivery";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  tracking: OrderTrackingStep[];
}

export interface SavedAddress {
  id: string;
  type: "Home" | "Office" | "Other";
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export const initialUserProfile: UserProfile = {
  name: "Tanvir Ahmed",
  email: "tanvir.ahmed@example.com",
  phone: "+880 1712 345678",
  memberSince: "January 2026",
  rewardPoints: 240,
};

export const initialOrders: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "ELV-98421",
    date: "Sep 12, 2026",
    status: "Delivered",
    items: [
      {
        productId: "chopper",
        title: "Mini Electric Food Chopper 250ml",
        image: "/images/products/chopper.jpg",
        price: 499,
        quantity: 1,
        variant: "Color: White | Size: 250ml",
      },
      {
        productId: "earbuds",
        title: "TWS Wireless Earbuds (ANC)",
        image: "/images/products/earbuds.jpg",
        price: 1099,
        quantity: 1,
        variant: "Color: Black",
      },
    ],
    subtotal: 1598,
    shippingFee: 0,
    discount: 100,
    total: 1498,
    paymentMethod: "bKash Online Payment",
    paymentStatus: "Paid",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+880 1712 345678",
      address: "House 42, Road 11, Block D, Banani",
      city: "Dhaka",
      postalCode: "1213",
    },
    tracking: [
      { title: "Order Placed", date: "Sep 12, 10:30 AM", completed: true },
      { title: "Payment Verified", date: "Sep 12, 10:32 AM", completed: true },
      { title: "Order Packed & Shipped", date: "Sep 13, 02:15 PM", completed: true },
      { title: "Out for Delivery", date: "Sep 14, 09:40 AM", completed: true },
      { title: "Delivered", date: "Sep 14, 01:20 PM", completed: true, current: true },
    ],
  },
  {
    id: "ord-1002",
    orderNumber: "ELV-97834",
    date: "Sep 05, 2026",
    status: "Processing",
    items: [
      {
        productId: "waterbottle",
        title: "Motivational Water Bottle 1 Liter",
        image: "/images/products/waterbottle.jpg",
        price: 449,
        quantity: 2,
        variant: "Color: Pink",
      },
    ],
    subtotal: 898,
    shippingFee: 60,
    discount: 0,
    total: 958,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Cash on Delivery",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+880 1712 345678",
      address: "House 42, Road 11, Block D, Banani",
      city: "Dhaka",
      postalCode: "1213",
    },
    tracking: [
      { title: "Order Placed", date: "Sep 05, 04:10 PM", completed: true },
      { title: "Processing & Quality Check", date: "Sep 06, 11:00 AM", completed: true, current: true },
      { title: "Handed over to Courier", completed: false },
      { title: "Delivered", completed: false },
    ],
  },
  {
    id: "ord-1003",
    orderNumber: "ELV-96120",
    date: "Aug 28, 2026",
    status: "Delivered",
    items: [
      {
        productId: "lamp",
        title: "LED Rechargeable Desk Lamp",
        image: "/images/products/lamp.jpg",
        price: 599,
        quantity: 1,
        variant: "Color: White",
      },
    ],
    subtotal: 599,
    shippingFee: 60,
    discount: 50,
    total: 609,
    paymentMethod: "Visa / Mastercard",
    paymentStatus: "Paid",
    shippingAddress: {
      fullName: "Tanvir Ahmed",
      phone: "+880 1712 345678",
      address: "House 42, Road 11, Block D, Banani",
      city: "Dhaka",
      postalCode: "1213",
    },
    tracking: [
      { title: "Order Placed", date: "Aug 28, 08:20 PM", completed: true },
      { title: "Payment Verified", date: "Aug 28, 08:22 PM", completed: true },
      { title: "Delivered", date: "Aug 30, 03:45 PM", completed: true, current: true },
    ],
  },
];

export const initialAddresses: SavedAddress[] = [
  {
    id: "addr-1",
    type: "Home",
    fullName: "Tanvir Ahmed",
    phone: "+880 1712 345678",
    streetAddress: "House 42, Road 11, Block D, Banani",
    city: "Dhaka",
    postalCode: "1213",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: "addr-2",
    type: "Office",
    fullName: "Tanvir Ahmed",
    phone: "+880 1987 654321",
    streetAddress: "Level 6, Simpletree Anarkali, 89 Gulshan Avenue",
    city: "Dhaka",
    postalCode: "1212",
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

