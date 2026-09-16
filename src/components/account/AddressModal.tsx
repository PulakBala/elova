"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Building, Phone, User } from "lucide-react";
import type { SavedAddress } from "@/data/mock-account";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, "id">, editId?: string) => void;
  initialAddress?: SavedAddress | null;
}

const DISTRICT_CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
];

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [formData, setFormData] = useState({
    type: "Home" as SavedAddress["type"],
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "Dhaka",
    postalCode: "",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialAddress) {
      setFormData({
        type: initialAddress.type,
        fullName: initialAddress.fullName,
        phone: initialAddress.phone,
        streetAddress: initialAddress.streetAddress,
        city: initialAddress.city,
        postalCode: initialAddress.postalCode,
        isDefaultShipping: initialAddress.isDefaultShipping,
        isDefaultBilling: initialAddress.isDefaultBilling,
      });
    } else {
      setFormData({
        type: "Home",
        fullName: "",
        phone: "",
        streetAddress: "",
        city: "Dhaka",
        postalCode: "",
        isDefaultShipping: false,
        isDefaultBilling: false,
      });
    }
    setErrors({});
  }, [initialAddress, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Street address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData, initialAddress?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-neutral-200 p-6 text-neutral-900"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h2 className="text-base font-bold text-neutral-900">
            {initialAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Address Label
            </label>
            <div className="flex gap-2">
              {(["Home", "Office", "Other"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    formData.type === t
                      ? "border-[#FF5B37] bg-[#FF5B37] text-white"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Recipient Name <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Tanvir Ahmed"
                className="w-full h-9.5 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none"
              />
              {errors.fullName && (
                <p className="mt-1 text-[11px] text-[#D92D20]">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Phone Number <span className="text-[#D92D20]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="017XXXXXXXX"
                className="w-full h-9.5 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none"
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-[#D92D20]">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Street Address <span className="text-[#D92D20]">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.streetAddress}
              onChange={(e) =>
                setFormData({ ...formData, streetAddress: e.target.value })
              }
              placeholder="House no, Road name, Block, Sector"
              className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs focus:border-[#FF5B37] focus:outline-none resize-none"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-[11px] text-[#D92D20]">
                {errors.streetAddress}
              </p>
            )}
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                City / District
              </label>
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full h-9.5 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none bg-white cursor-pointer"
              >
                {DISTRICT_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                placeholder="1212"
                className="w-full h-9.5 rounded-xl border border-neutral-300 px-3 text-xs focus:border-[#FF5B37] focus:outline-none"
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefaultShipping}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDefaultShipping: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-neutral-300 text-[#FF5B37] focus:ring-[#FF5B37] accent-[#FF5B37]"
              />
              <span>Set as default delivery address</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#FF5B37] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#eb4e2a] transition-colors cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

