import { Perfume, SiteImages } from '../types';
import { PERFUMES } from '../data/perfumes';

export const DEFAULT_SITE_IMAGES: SiteImages = {
  hero: '/1789993107439.jpg',
  categories: {
    'Sweet & Fruity': '/1789992897373.jpg',
    'Fresh & Clean': '/1789992855444.jpg',
    'Warm & Sensual': '/1789992870791.jpg',
    'Floral': '/1789993107439.jpg',
    'Unisex': '/1789992855444.jpg',
  },
  about: {
    story1: '/1789993107439.jpg',
    story2: '/1789992870791.jpg',
  },
  productPlaceholder: '/product-placeholder.svg',
};

export interface MediaAsset {
  id: string;
  name: string;
  description: string;
  url: string;
}

export const BRAND_MEDIA_LIBRARY: MediaAsset[] = [
  {
    id: 'founder_case',
    name: "Founder with Perfume Organizer",
    description: "Authentic photo holding black roll-on perfume case",
    url: '/1789993107439.jpg',
  },
  {
    id: 'case_neat_rows',
    name: "Organizer Case Roll-on Collection",
    description: "Close-up of organized pocket roll-on oils with labeled caps",
    url: '/1789992855444.jpg',
  },
  {
    id: 'bulk_shipping_box',
    name: "Bulk Inventory Box",
    description: "Real packaging box filled with hundreds of roll-ons",
    url: '/1789992897373.jpg',
  },
  {
    id: 'fragrance_oils_table',
    name: "Fragrance Oil Dispenser Bottles",
    description: "Workshop countertop with amber oil bottles and droppers",
    url: '/1789992870791.jpg',
  },
  {
    id: 'neutral_bottle_placeholder',
    name: "Branded Neutral Placeholder",
    description: "Minimalist roll-on bottle graphic with gold accents",
    url: '/product-placeholder.svg',
  },
];

const SITE_IMAGES_KEY = 'superwomans_hub_site_images_v2';
const PRODUCTS_KEY = 'superwomans_hub_products_v2';

export function getStoredSiteImages(): SiteImages {
  try {
    const raw = localStorage.getItem(SITE_IMAGES_KEY);
    if (!raw) return DEFAULT_SITE_IMAGES;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_IMAGES,
      ...parsed,
      categories: {
        ...DEFAULT_SITE_IMAGES.categories,
        ...(parsed.categories || {}),
      },
      about: {
        ...DEFAULT_SITE_IMAGES.about,
        ...(parsed.about || {}),
      },
    };
  } catch {
    return DEFAULT_SITE_IMAGES;
  }
}

export function saveStoredSiteImages(images: SiteImages): void {
  try {
    localStorage.setItem(SITE_IMAGES_KEY, JSON.stringify(images));
  } catch (err) {
    console.error('Failed to save site images:', err);
  }
}

export function resetSiteImagesToDefault(): SiteImages {
  try {
    localStorage.removeItem(SITE_IMAGES_KEY);
  } catch {}
  return DEFAULT_SITE_IMAGES;
}

export function getStoredPerfumes(): Perfume[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return PERFUMES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return PERFUMES;
  } catch {
    return PERFUMES;
  }
}

export function saveStoredPerfumes(perfumes: Perfume[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(perfumes));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}
