import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { CartItem, Perfume } from '../types';

/**
 * Format number into Nigerian Naira display
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return 'Price on request';
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Build dynamic WhatsApp order URL for cart items according to exact specification
 */
export function generateCartWhatsAppUrl(
  items: CartItem[],
  total: number,
  config: BrandConfig = BRAND_CONFIG
): string {
  const itemsText = items
    .map((item) => `• ${item.name} (${item.selectedSize}) × ${item.quantity}`)
    .join('\n');

  const priceText = total > 0 ? formatPrice(total) : 'Price to be confirmed';

  const message = `Hello ${config.businessName} 👋\n\nI would like to order:\n\n${itemsText}\n\nOrder Total: ${priceText}\n\nPlease confirm availability and delivery details.`;

  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build single perfume quick order WhatsApp link matching exact order template
 */
export function generateSinglePerfumeWhatsAppUrl(
  perfume: Perfume,
  selectedSize?: string,
  price?: number | null,
  qty = 1,
  config: BrandConfig = BRAND_CONFIG
): string {
  const sizeText = selectedSize || (perfume.sizes.length > 0 ? perfume.sizes[0].name : 'Standard Roll-on');
  const unitPrice = price !== undefined && price !== null ? price : (perfume.sizes[0]?.price ?? perfume.price);
  const totalPrice = unitPrice !== null && unitPrice !== undefined ? unitPrice * qty : null;
  const priceText = totalPrice !== null ? formatPrice(totalPrice) : 'Price to be confirmed';

  const message = `Hello ${config.businessName} 👋\n\nI would like to order:\n\n• ${perfume.name} (${sizeText}) × ${qty}\n\nOrder Total: ${priceText}\n\nPlease confirm availability and delivery details.`;

  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * General consultation WhatsApp link
 */
export function generateGeneralWhatsAppUrl(
  promptText?: string,
  config: BrandConfig = BRAND_CONFIG
): string {
  const text = promptText || `Hello ${config.businessName} 👋\nI would love help choosing an oil perfume that matches my personality and style.`;
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
