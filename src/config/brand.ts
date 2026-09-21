// Editable Brand Configuration for Superwoman's Hub
// Update these values when actual business phone, WhatsApp, and social accounts are configured.

export interface BrandConfig {
  businessName: string;
  tagline: string;
  supportingText: string;
  heroHeadline: string;
  whatsappNumber: string; // international format without + or spaces for wa.me links
  displayWhatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  facebook: string;
  facebookUrl: string;
  tiktok: string;
  tiktokUrl: string;
  currency: string;
  currencyCode: string;
  locationNote: string;
}

export const BRAND_CONFIG: BrandConfig = {
  businessName: "Superwoman's Hub",
  tagline: "Find Your Signature Scent.",
  supportingText: "Beautiful oil perfumes for every mood, moment and personality.",
  heroHeadline: "Find Your Signature Scent.",
  whatsappNumber: "2347030881613", // WhatsApp number: 07030881613 in international format
  displayWhatsapp: "07030881613",
  phone: "07030881613",
  email: "hello@superwomanshub.com",
  instagram: "@superwomanshub",
  instagramUrl: "https://instagram.com/superwomanshub",
  facebook: "Superwoman's Hub",
  facebookUrl: "https://facebook.com/superwomanshub",
  tiktok: "@superwomanshub",
  tiktokUrl: "https://tiktok.com/@superwomanshub",
  currency: "₦",
  currencyCode: "NGN",
  locationNote: "Nigeria",
};
