export type ScentCategory =
  | 'Sweet & Fruity'
  | 'Fresh & Clean'
  | 'Warm & Sensual'
  | 'Floral'
  | 'Unisex';

export interface PerfumeSize {
  id: string;
  name: string; // e.g. "3ml Roll-on", "6ml Roll-on", "12ml Pocket Oil"
  price?: number; // optional specific price for this size in Naira
}

export interface Perfume {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ScentCategory;
  price: number | null; // null represents "Price available on request"
  image: string;
  sizes: PerfumeSize[];
  stockStatus: 'in_stock' | 'limited' | 'preorder';
  featured: boolean;
  createdAt: string;
  // Optional oil-specific notes for display when available
  vibe?: string;
}

export interface CartItem {
  id: string; // unique key (perfume.id + selected size)
  perfumeId: string;
  name: string;
  category: ScentCategory;
  selectedSize: string;
  price: number | null;
  quantity: number;
  image: string;
}

export interface SiteImages {
  hero: string;
  categories: Record<ScentCategory, string>;
  about: {
    story1: string;
    story2: string;
  };
  productPlaceholder: string;
}

export type NavPage = 'home' | 'shop' | 'about' | 'contact' | 'admin' | '404';

export type AdminSection = 'dashboard' | 'products' | 'orders' | 'settings' | 'homepage';

export type OrderStatus = 'New' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface OrderProductItem {
  name: string;
  size: string;
  quantity: number;
  price: number | null;
}

export interface OrderRecord {
  id: string;
  orderId: string;
  customerName: string;
  phoneNumber: string;
  products: OrderProductItem[];
  quantity: number;
  total: number;
  date: string;
  status: OrderStatus;
  notes?: string;
  createdAt?: string;
}
