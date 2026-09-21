import { Perfume, ScentCategory } from '../types';

export const CATEGORIES: {
  id: ScentCategory;
  name: ScentCategory;
  description: string;
  image: string;
}[] = [
  {
    id: 'Sweet & Fruity',
    name: 'Sweet & Fruity',
    description: 'Playful, delicious, and delightfully sweet aromas.',
    image: '/1789992897373.jpg',
  },
  {
    id: 'Fresh & Clean',
    name: 'Fresh & Clean',
    description: 'Crisp, invigorating scents reminiscent of morning breezes.',
    image: '/1789992855444.jpg',
  },
  {
    id: 'Warm & Sensual',
    name: 'Warm & Sensual',
    description: 'Cozy, inviting oils with deep vanilla and warm musk.',
    image: '/1789992870791.jpg',
  },
  {
    id: 'Floral',
    name: 'Floral',
    description: 'Soft, graceful blossoms and feminine bouquets.',
    image: '/1789993107439.jpg',
  },
  {
    id: 'Unisex',
    name: 'Unisex',
    description: 'Balanced fragrances crafted for anyone to wear with confidence.',
    image: '/1789992855444.jpg',
  },
];

// Initial real inventory products for Superwoman's Hub
// As per instructions, individual products use neutral placeholders until individual product photos are uploaded.
export const PERFUMES: Perfume[] = [
  {
    id: 'pink-chiffon',
    name: 'Pink Chiffon',
    slug: 'pink-chiffon',
    description: 'A soft, feminine, and lightly sweet blend with fruity floral undertones that feels charming and joyful.',
    category: 'Sweet & Fruity',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-10',
    vibe: 'Soft, sweet, feminine',
  },
  {
    id: 'chocolate-musk',
    name: 'Chocolate Musk',
    slug: 'chocolate-musk',
    description: 'Rich, comforting cocoa and warm velvety musk. A delectable gourmand scent loved for its cozy aura.',
    category: 'Warm & Sensual',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-11',
    vibe: 'Warm, cozy chocolate & musk',
  },
  {
    id: 'vanilla-lace',
    name: 'Vanilla Lace',
    slug: 'vanilla-lace',
    description: 'Pure, comforting sweet vanilla with an alluring amber warmth. Perfect for everyday elegance.',
    category: 'Sweet & Fruity',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-12',
    vibe: 'Sweet vanilla & gentle warmth',
  },
  {
    id: 'cool-water',
    name: 'Cool Water',
    slug: 'cool-water',
    description: 'Crisp aquatic freshness with clean herbal and oceanic notes. Invigorating, refreshing, and clean.',
    category: 'Fresh & Clean',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-13',
    vibe: 'Crisp, oceanic, revitalizing',
  },
  {
    id: 'sugar-baby',
    name: 'Sugar Baby',
    slug: 'sugar-baby',
    description: 'Playful spun sugar and sweet candy delight. A lively, delicious oil perfume that brightens the day.',
    category: 'Sweet & Fruity',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-14',
    vibe: 'Playful, sweet sugar confection',
  },
  {
    id: 'one-million',
    name: 'One Million',
    slug: 'one-million',
    description: 'Bold, charismatic warm spice with subtle leather and amber touches. Confident and unforgettable.',
    category: 'Unisex',
    price: 3000,
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: true,
    createdAt: '2026-01-15',
    vibe: 'Warm spice, confident amber',
  },
];
