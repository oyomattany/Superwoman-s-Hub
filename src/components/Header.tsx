import React, { useState } from 'react';
import { ShoppingBag, Search, MessageCircle, Sparkles, X } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScentFinder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenScentFinder,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="w-full bg-[#201511] text-[#FAF9F6] relative shadow-md z-30 border-b border-[#3A2922]">
      {/* Top micro-announcement bar */}
      <div className="bg-[#160E0B] text-[11px] sm:text-xs text-[#D6C7BC] py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-[#2C1D17] tracking-wider uppercase">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span className="font-light">Complimentary delivery within Lagos above ₦60,000 • Curated Nigerian Perfumery</span>
      </div>

      {/* Main Header with Centered Logo (exact brand banner design from tastehub.shop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center relative">
        
        {/* Left Side Quick Actions (Mobile/Desktop) */}
        <div className="absolute left-4 sm:left-6 top-6 sm:top-8 flex items-center gap-2">
          <button
            id="scent-finder-header-btn"
            onClick={onOpenScentFinder}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#4A3830] hover:border-[#D4AF37] text-xs font-medium text-[#FAF9F6] bg-[#2A1D18] hover:bg-[#34241E] transition-all tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Scent Consultation</span>
          </button>
        </div>

        {/* Center: Brand Identity with Flame/Atomizer & Script */}
        <div className="flex flex-col items-center text-center cursor-pointer group">
          {/* Flame / Scent Droplet Motif */}
          <div className="relative mb-1.5 flex items-center justify-center">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-105 duration-300"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Luxury Flame / Perfume Vapor Silhouette */}
              <path
                d="M50 8C50 8 36 28 36 44C36 54 42 60 50 60C58 60 64 54 64 44C64 28 50 8 50 8Z"
                fill="url(#fireGradient)"
              />
              <path
                d="M50 20C50 20 42 34 42 46C42 52 46 56 50 56C54 56 58 52 58 46C58 34 50 20 50 20Z"
                fill="#FAF0E6"
              />
              {/* Droplets / Spray accents */}
              <circle cx="28" cy="38" r="3.5" fill="#D4AF37" />
              <circle cx="72" cy="36" r="3" fill="#D4AF37" />
              <circle cx="78" cy="50" r="2" fill="#E6C687" />
              <circle cx="22" cy="52" r="2.5" fill="#E6C687" />
              <defs>
                <linearGradient id="fireGradient" x1="50" y1="8" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F3E5AB" />
                  <stop offset="0.5" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#996515" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Scent Hub Main Typography */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAF9F6] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif", letterSpacing: '0.04em' }}
          >
            Scent<span className="text-[#D4AF37] italic">Hub</span>
          </h1>

          {/* by Ya-Maryam Calligraphy Sub-heading */}
          <div
            className="text-sm sm:text-base text-[#D6C7BC] mt-0.5 tracking-widest uppercase font-light"
            style={{ letterSpacing: '0.2em' }}
          >
            BY YA-MARYAM
          </div>

          {/* Tagline subtle divider motif */}
          <div className="mt-2 flex items-center gap-3">
            <span className="h-[1px] w-6 bg-[#4A3830]" />
            <p className="text-[11px] sm:text-xs text-[#B5A599] italic font-serif tracking-wider">
              Where Every Spray Awakens Your Senses
            </p>
            <span className="h-[1px] w-6 bg-[#4A3830]" />
          </div>
        </div>

        {/* Right Side Actions: Search, Contact & Cart */}
        <div className="absolute right-4 sm:right-6 top-6 sm:top-8 flex items-center gap-2.5">
          {/* Search Toggle */}
          <button
            id="search-toggle-btn"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 border border-[#4A3830] hover:border-[#D4AF37] bg-[#2A1D18] hover:bg-[#34241E] text-[#FAF9F6] transition-all"
            title="Search fragrances"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* WhatsApp Direct Ordering Button */}
          <a
            id="whatsapp-header-link"
            href="https://wa.me/2348012345678?text=Hello%20ScentHub%20by%20Ya-Maryam,%20I%20would%20like%20to%20order%20perfumes!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 border border-[#2E5E4E] bg-[#1E3F34] hover:bg-[#254F41] text-xs font-medium text-[#E0F2FE] shadow-xs transition-all uppercase tracking-wider"
            title="Chat with Ya-Maryam on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#6EE7B7]" />
            <span>Concierge</span>
          </a>

          {/* Cart Trigger with live badge */}
          <button
            id="cart-header-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2 border border-[#996515] bg-[#3E2B20] hover:bg-[#4E372A] text-[#FAF9F6] font-medium text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline font-serif font-semibold">{formatPrice(cartTotal)}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-[#D4AF37] text-[#1A1A1A] font-bold text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="w-full max-w-xl mt-5 px-2 animate-fadeIn">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#B5A599] absolute left-3.5 pointer-events-none" />
              <input
                id="perfume-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search perfumes by name, notes (e.g. Vanilla, Oud, Rose, Amber)..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#2A1D18] border border-[#4A3830] text-[#FAF9F6] placeholder-[#8E7E73] text-sm focus:outline-none focus:border-[#D4AF37] transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 text-[#B5A599] hover:text-[#FAF9F6]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

