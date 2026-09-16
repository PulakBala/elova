"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  MapPin,
  Heart,
  Calendar,
  Lock,
  Edit2,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { TopBar } from "@/components/elvoa/TopBar";
import { Header } from "@/components/elvoa/Header";
import { SubNav } from "@/components/elvoa/SubNav";
import { CategorySidebar } from "@/components/elvoa/CategorySidebar";
import { TrustPillars } from "@/components/elvoa/TrustPillars";
import { Footer } from "@/components/elvoa/Footer";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { AddressModal } from "./AddressModal";
import { useShop } from "@/context/ShopContext";
import type { Order, SavedAddress } from "@/data/mock-account";

type ActiveTab = "profile" | "orders" | "addresses";

export function AccountContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("orders");

  const {
    user,
    updateUserProfile,
    orders,
    wishlist,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultShippingAddress,
  } = useShop();

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address Modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileErrorMsg("");

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileErrorMsg("Name and email are required.");
      return;
    }

    if (profileForm.newPassword) {
      if (profileForm.newPassword.length < 6) {
        setProfileErrorMsg("New password must be at least 6 characters.");
        return;
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileErrorMsg("New passwords do not match.");
        return;
      }
    }

    updateUserProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });

    setProfileSuccessMsg("Profile information updated successfully!");
    setProfileForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setTimeout(() => setProfileSuccessMsg(""), 4000);
  };

  const handleSaveAddress = (
    data: Omit<SavedAddress, "id">,
    editId?: string
  ) => {
    if (editId) {
      updateAddress(editId, data);
    } else {
      addAddress(data);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-[#FF5B37] selection:text-white overflow-x-hidden">
      {/* 1. Global Navigation */}
      <TopBar />
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <SubNav onOpenSidebar={() => setSidebarOpen(true)} />

      <CategorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Account Hub Container */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 mb-5">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="font-semibold text-neutral-900">
              Account Dashboard
            </span>
          </nav>

          {/* Top User Profile Hero Banner */}
          <div className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              {/* Avatar & User Details */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-2xl bg-[#FF5B37] text-white font-extrabold text-xl sm:text-2xl shadow-sm">
                  {getInitials(user.name || "User")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-neutral-900">
                      {user.name}
                    </h1>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700">
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {user.email} • {user.phone}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Member since {user.memberSince}</span>
                  </p>
                </div>
              </div>

              {/* Quick Stat Counters */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-neutral-100">
                {/* Orders Stat */}
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 sm:p-3.5 text-center transition-colors hover:bg-neutral-100/80 cursor-pointer"
                >
                  <span className="block text-lg sm:text-xl font-extrabold text-neutral-900">
                    {orders.length}
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-medium">
                    Orders
                  </span>
                </button>

                {/* Wishlist Stat */}
                <Link
                  href="/wishlist"
                  className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 sm:p-3.5 text-center transition-colors hover:bg-neutral-100/80 cursor-pointer"
                >
                  <span className="block text-lg sm:text-xl font-extrabold text-neutral-900">
                    {wishlist.length}
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-medium">
                    Wishlist
                  </span>
                </Link>

                {/* Reward Points Stat */}
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3 sm:p-3.5 text-center">
                  <span className="block text-lg sm:text-xl font-extrabold text-[#FF5B37]">
                    {user.rewardPoints}
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-medium">
                    Points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-neutral-200 gap-2 sm:gap-4 mb-6 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "orders"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "profile"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 pb-3 px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "addresses"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>
          </div>

          {/* 3. Tab Contents */}

          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-6 shadow-xs hover:border-neutral-300 transition-all"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-extrabold text-sm sm:text-base text-neutral-900">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs text-neutral-500">
                          {order.date}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status === "Processing"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-500 block">
                          Total Amount
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-[#D92D20]">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items Preview Row */}
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-2.5"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-100">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-neutral-900 truncate">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-neutral-500">
                              Qty: {item.quantity} • ৳{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
                      <div className="text-neutral-500">
                        Paid via <strong className="text-neutral-800 font-semibold">{order.paymentMethod}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <span>View Order Details</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
                    <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">
                    No orders placed yet
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    Once you make a purchase, you will find order receipts, live courier tracking, and reorder controls right here!
                  </p>
                  <Link
                    href="/shop"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#FF5B37] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-all cursor-pointer"
                  >
                    <span>Start Shopping</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE DETAILS */}
          {activeTab === "profile" && (
            <div className="max-w-2xl rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-neutral-200 pb-4 mb-5">
                <h2 className="text-base font-bold text-neutral-900">
                  Personal Information & Security
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your contact info and login credentials.
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
                  {profileErrorMsg}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-neutral-300 px-3.5 text-xs focus:border-[#FF5B37] focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-neutral-300 px-3.5 text-xs focus:border-[#FF5B37] focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-neutral-300 px-3.5 text-xs focus:border-[#FF5B37] focus:outline-none"
                  />
                </div>

                {/* Change Password Sub-Section */}
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Change Password</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={profileForm.currentPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Leave blank to keep current password"
                          className="w-full h-10 rounded-xl border border-neutral-300 pl-3.5 pr-10 text-xs focus:border-[#FF5B37] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={profileForm.newPassword}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Min. 6 characters"
                            className="w-full h-10 rounded-xl border border-neutral-300 pl-3.5 pr-10 text-xs focus:border-[#FF5B37] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Re-enter password"
                          className="w-full h-10 rounded-xl border border-neutral-300 px-3.5 text-xs focus:border-[#FF5B37] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save CTA */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FF5B37] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Manage multiple shipping and billing addresses for fast checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5B37] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-2xl border p-5 transition-all bg-white ${
                      addr.isDefaultShipping
                        ? "border-[#FF5B37] ring-1 ring-[#FF5B37]/30 shadow-xs"
                        : "border-neutral-200/90 shadow-2xs hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-700">
                          {addr.type}
                        </span>
                        {addr.isDefaultShipping && (
                          <span className="rounded-lg bg-[#FF5B37]/10 px-2 py-0.5 text-[11px] font-bold text-[#FF5B37]">
                            Default Shipping
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(addr);
                            setAddressModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                          aria-label="Edit address"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-xs space-y-1">
                      <p className="font-bold text-neutral-900">
                        {addr.fullName}
                      </p>
                      <p className="text-neutral-600">{addr.streetAddress}</p>
                      <p className="text-neutral-600">
                        {addr.city} {addr.postalCode ? `- ${addr.postalCode}` : ""}
                      </p>
                      <p className="text-neutral-500 pt-1">
                        Phone: {addr.phone}
                      </p>
                    </div>

                    {!addr.isDefaultShipping && (
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => setDefaultShippingAddress(addr.id)}
                          className="text-[11.5px] font-bold text-[#FF5B37] hover:underline cursor-pointer"
                        >
                          Set as Default Shipping Address
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 4. Modals */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => {
          setAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />

      <TrustPillars />
      <Footer />
    </div>
  );
}

