/**
 * ELVOA Enterprise Frontend API Client
 * Connects Next.js to Laravel REST APIs (/api/v1/...)
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://fabri.test/backend/public/api/v1";

export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://fabri.test/backend/public";

/**
 * Utility to properly resolve image asset URLs.
 * Works seamlessly for local public images (/images/...), Laravel uploaded media (/storage/... or products/...), and absolute URLs.
 */
export function resolveAssetUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return "/images/products/placeholder.jpg";
  }

  const trimmed = path.trim();

  // Fully qualified URL (HTTP / HTTPS)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Frontend public static images (e.g. /images/products/..., /images/elvoa/...)
  if (trimmed.startsWith("/images/")) {
    return trimmed;
  }

  // Already prefixed with storage (e.g. /storage/products/... or storage/products/...)
  if (trimmed.startsWith("/storage/") || trimmed.startsWith("storage/")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${BACKEND_BASE_URL}${cleanPath}`;
  }

  // Uploaded media relative paths from Laravel (e.g. products/gallery/..., categories/..., banners/...)
  if (
    trimmed.startsWith("products/") ||
    trimmed.startsWith("categories/") ||
    trimmed.startsWith("banners/") ||
    trimmed.startsWith("gallery/") ||
    trimmed.startsWith("uploads/")
  ) {
    return `${BACKEND_BASE_URL}/storage/${trimmed}`;
  }

  // If path has a leading slash, treat as root-relative
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Fallback for any other relative path to guarantee a valid URL with /storage/
  return `${BACKEND_BASE_URL}/storage/${trimmed}`;
}

// -------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------

export interface ApiCategoryTreeItem {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon_image: string;
  banner_image?: string | null;
  badge?: string | null;
  is_featured: boolean;
  sort_order: number;
  products_count: number;
  subcategories: ApiCategoryTreeItem[];
}

export interface ApiProductVariant {
  id: number;
  sku: string;
  variant_name?: string | null;
  size?: string | null;
  color?: string | null;
  material?: string | null;
  regular_price: number;
  sale_price?: number | null;
  effective_price: number;
  image?: string | null;
  stock_quantity: number;
  in_stock: boolean;
  status: string;
}

export interface ApiReview {
  id: number;
  user_name: string;
  rating: number;
  title?: string | null;
  review_text?: string | null;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  sku: string;
  badge?: {
    text: string;
    type: "discount" | "new" | "hot";
  } | null;
  short_description?: string | null;
  description?: string | null;
  image: string;
  gallery: string[];
  price: number;
  original_price?: number | null;
  rating: number;
  reviews_count: number;
  sales_count: number;
  total_stock?: number;
  in_stock: boolean;
  is_featured: boolean;
  has_add_to_cart: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
    parent?: { id: number; name: string; slug: string } | null;
  } | null;
  brand?: {
    id: number;
    name: string;
    slug: string;
    logo?: string | null;
  } | null;
  colors: string[];
  sizes: string[];
  default_variant_id?: number | null;
  variants?: ApiProductVariant[];
  reviews?: ApiReview[];
  related_products?: ApiProduct[];
  created_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductQueryParams {
  category_slug?: string;
  sub?: string | string[];
  min_price?: string | number;
  max_price?: string | number;
  sizes?: string | string[];
  colors?: string | string[];
  in_stock?: boolean | string;
  is_featured?: boolean | string;
  sort?: string;
  search?: string;
  page?: number;
  per_page?: number;
  tag?: string;
}

export interface ValidateCouponResponse {
  success: boolean;
  message: string;
  data?: {
    coupon_id: number;
    code: string;
    type: "percent" | "percentage" | "fixed";
    value: number;
    discount_amount: number;
  };
  errors?: Record<string, string[]>;
}

export interface CheckoutOrderItem {
  product_id: number;
  product_variant_id: number;
  quantity: number;
}

export interface CheckoutOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  password?: string | null;
  shipping_district: string;
  shipping_address: string;
  postal_code?: string | null;
  delivery_method: "inside-dhaka" | "outside-dhaka";
  payment_method: "cod" | "sslcommerz";
  coupon_code?: string | null;
  customer_notes?: string | null;
  items: CheckoutOrderItem[];
}

export interface CheckoutOrderResult {
  success: boolean;
  message: string;
  redirect_url?: string | null;
  payment_type?: "online" | "cod" | string;
  data?: {
    id: number;
    order_number: string;
    grand_total: number;
    subtotal: number;
    discount: number;
    delivery_charge: number;
    order_status: string;
    payment_status: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    shipping_district: string;
    items_count: number;
  };
  auth?: {
    token: string;
    is_new_user: boolean;
    message: string;
    user?: ApiUser | null;
  } | null;
  errors?: Record<string, string[]>;
}

export interface ApiCustomerAddress {
  id: number;
  type?: string | null;
  title?: string | null;
  recipient_name: string;
  phone?: string | null;
  recipient_phone?: string | null;
  district: string;
  city_zone?: string | null;
  address?: string;
  address_line?: string;
  postal_code?: string | null;
  is_default: boolean;
  created_at?: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  status: string;
  role: string;
  role_name: string;
  default_address?: ApiCustomerAddress | null;
  addresses?: ApiCustomerAddress[];
  orders_count?: number;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: ApiUser;
    token: string;
  };
  errors?: Record<string, string[]>;
}

// -------------------------------------------------------------
// Token Storage Helpers
// -------------------------------------------------------------

export const TOKEN_STORAGE_KEY = "elvoa_auth_token";
export const USER_STORAGE_KEY = "elvoa_auth_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (local) return local;

    // Fallback to cookie
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${TOKEN_STORAGE_KEY}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      document.cookie = `${TOKEN_STORAGE_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      document.cookie = `${TOKEN_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// API Helper Methods
// -------------------------------------------------------------

async function safeFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const token = getStoredToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...((options.headers as Record<string, string>) || {}),
    },
    cache: options.cache || "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(", ") : `HTTP Error ${response.status}`);
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// -------------------------------------------------------------
// Public Endpoints
// -------------------------------------------------------------

/**
 * Fetch hierarchical category tree for header, navigation drawer, and filter sidebar
 */
export async function fetchCategoryTree(): Promise<ApiCategoryTreeItem[]> {
  try {
    const res = await safeFetch<{ success: boolean; data: ApiCategoryTreeItem[] }>(
      "/categories/tree"
    );
    return res.data || [];
  } catch (error) {
    console.error("fetchCategoryTree error:", error);
    return [];
  }
}

/**
 * Fetch category details by slug
 */
export async function fetchCategory(slug: string): Promise<ApiCategoryTreeItem | null> {
  try {
    const res = await safeFetch<{ success: boolean; data: ApiCategoryTreeItem }>(
      `/categories/${encodeURIComponent(slug)}`
    );
    return res.data || null;
  } catch (error) {
    console.error(`fetchCategory(${slug}) error:`, error);
    return null;
  }
}

/**
 * Fetch paginated product catalog with query filters
 */
export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<{ products: ApiProduct[]; meta: PaginationMeta }> {
  const query = new URLSearchParams();

  if (params.category_slug && params.category_slug !== "all" && params.category_slug !== "shop") {
    query.set("category_slug", params.category_slug);
  }

  if (params.sub) {
    const subStr = Array.isArray(params.sub) ? params.sub.join(",") : params.sub;
    if (subStr) query.set("sub", subStr);
  }

  if (params.min_price !== undefined && params.min_price !== "") {
    query.set("min_price", String(params.min_price));
  }

  if (params.max_price !== undefined && params.max_price !== "") {
    query.set("max_price", String(params.max_price));
  }

  if (params.sizes) {
    const sizesStr = Array.isArray(params.sizes) ? params.sizes.join(",") : params.sizes;
    if (sizesStr) query.set("sizes", sizesStr);
  }

  if (params.colors) {
    const colorsStr = Array.isArray(params.colors) ? params.colors.join(",") : params.colors;
    if (colorsStr) query.set("colors", colorsStr);
  }

  if (params.in_stock) {
    query.set("in_stock", "1");
  }

  if (params.is_featured) {
    query.set("is_featured", "1");
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.tag) {
    query.set("tag", params.tag);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.per_page) {
    query.set("per_page", String(params.per_page));
  }

  const endpoint = `/products?${query.toString()}`;
  const res = await safeFetch<{
    success: boolean;
    data: ApiProduct[];
    meta: PaginationMeta;
  }>(endpoint);

  return {
    products: res.data || [],
    meta: res.meta || { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  };
}

/**
 * Fetch detailed product information by slug (with images, variants, and reviews)
 */
export async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await safeFetch<{ success: boolean; data: ApiProduct }>(
      `/products/${encodeURIComponent(slug)}`
    );
    return res.data || null;
  } catch (error) {
    console.error(`fetchProduct(${slug}) error:`, error);
    return null;
  }
}

/**
 * Validate coupon code against subtotal in real time
 */
export async function validateCouponApi(
  code: string,
  subtotal: number
): Promise<ValidateCouponResponse> {
  return await safeFetch<ValidateCouponResponse>("/cart/validate-coupon", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

/**
 * Submit checkout order to create order, decrement stock, and register guest account
 */
export async function submitCheckoutOrder(
  payload: CheckoutOrderPayload
): Promise<CheckoutOrderResult> {
  return await safeFetch<CheckoutOrderResult>("/checkout/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch order confirmation details by order_number
 */
export async function fetchCheckoutOrder(orderNumber: string): Promise<{
  success: boolean;
  message?: string;
  data?: {
    id: number;
    order_number: string;
    customer: {
      name: string;
      phone: string;
      email?: string | null;
      user_id?: number | null;
    };
    shipping: {
      district: string;
      address: string;
      delivery_charge: number;
    };
    pricing: {
      subtotal: number;
      discount: number;
      delivery_charge: number;
      grand_total: number;
    };
    status: {
      order_status: string;
      payment_status: string;
      payment_method: string;
    };
    items: Array<{
      id: number;
      product_id: number;
      product_variant_id: number;
      product_name: string;
      variant_details?: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }>;
    customer_notes?: string | null;
    created_at?: string;
  };
}> {
  return await safeFetch(`/checkout/order/${encodeURIComponent(orderNumber)}`);
}

/**
 * Initiate or re-initiate SSLCommerz payment for an order
 */
export async function initiateSSLCommerzPayment(orderNumber: string): Promise<{
  success: boolean;
  redirect_url?: string | null;
  sessionkey?: string | null;
  message?: string;
}> {
  return await safeFetch(`/payment/sslcommerz/initiate/${encodeURIComponent(orderNumber)}`, {
    method: "POST",
  });
}


// -------------------------------------------------------------
// Customer Authentication & Profile Endpoints
// -------------------------------------------------------------

export async function loginApi(credentials: {
  login: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await safeFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  if (res.success && res.data?.token) {
    setStoredToken(res.data.token);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    } catch {}
  }
  return res;
}

export async function registerApi(payload: {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const res = await safeFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.success && res.data?.token) {
    setStoredToken(res.data.token);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
    } catch {}
  }
  return res;
}

export async function logoutApi(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await safeFetch<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    });
    setStoredToken(null);
    return res;
  } catch {
    setStoredToken(null);
    return { success: true, message: "Logged out locally." };
  }
}

export async function fetchUserProfileApi(): Promise<{ success: boolean; data: ApiUser }> {
  return await safeFetch<{ success: boolean; data: ApiUser }>("/user/profile");
}

export async function updateUserProfileApi(payload: {
  name: string;
  email?: string | null;
  phone?: string | null;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}): Promise<{ success: boolean; message: string; data: ApiUser }> {
  return await safeFetch<{ success: boolean; message: string; data: ApiUser }>("/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export interface ApiOrderHistoryItem {
  id: number;
  order_number: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  grand_total: number;
  delivery_charge: number;
  courier_partner?: string | null;
  courier_tracking_code?: string | null;
  courier_tracking_url?: string | null;
  courier_consignment_id?: string | null;
  customer_name: string;
  customer_phone: string;
  shipping_district: string;
  shipping_address: string;
  customer_notes?: string | null;
  items: {
    id: number;
    product_id: number;
    product_variant_id?: number | null;
    product_title: string;
    variant_attributes?: string | null;
    thumbnail_image: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}

/**
 * Fetch authenticated customer's order history strictly from GET /api/v1/customer/orders
 */
export async function fetchCustomerOrdersApi(
  page: number = 1,
  perPage: number = 10
): Promise<{ success: boolean; data: ApiOrderHistoryItem[]; meta: PaginationMeta }> {
  return await safeFetch<{ success: boolean; data: ApiOrderHistoryItem[]; meta: PaginationMeta }>(
    `/customer/orders?page=${page}&per_page=${perPage}`
  );
}

export async function fetchUserOrdersApi(
  page: number = 1,
  perPage: number = 10
): Promise<{ success: boolean; data: any[]; meta: PaginationMeta }> {
  return await safeFetch<{ success: boolean; data: any[]; meta: PaginationMeta }>(
    `/customer/orders?page=${page}&per_page=${perPage}`
  );
}

export async function fetchUserOrderDetailsApi(
  orderNumber: string
): Promise<{ success: boolean; data: any }> {
  return await safeFetch<{ success: boolean; data: any }>(
    `/user/orders/${encodeURIComponent(orderNumber)}`
  );
}

export async function addUserAddressApi(
  address: Partial<ApiCustomerAddress>
): Promise<{ success: boolean; message: string; data: ApiCustomerAddress }> {
  return await safeFetch<{ success: boolean; message: string; data: ApiCustomerAddress }>(
    "/user/addresses",
    {
      method: "POST",
      body: JSON.stringify(address),
    }
  );
}

export async function updateUserAddressApi(
  id: number,
  address: Partial<ApiCustomerAddress>
): Promise<{ success: boolean; message: string; data: ApiCustomerAddress }> {
  return await safeFetch<{ success: boolean; message: string; data: ApiCustomerAddress }>(
    `/user/addresses/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(address),
    }
  );
}

export async function deleteUserAddressApi(
  id: number
): Promise<{ success: boolean; message: string }> {
  return await safeFetch<{ success: boolean; message: string }>(`/user/addresses/${id}`, {
    method: "DELETE",
  });
}

export async function setDefaultUserAddressApi(
  id: number
): Promise<{ success: boolean; message: string; data: ApiCustomerAddress }> {
  return await safeFetch<{ success: boolean; message: string; data: ApiCustomerAddress }>(
    `/user/addresses/${id}/default`,
    {
      method: "POST",
    }
  );
}
