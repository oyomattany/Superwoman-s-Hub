import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, MessageCircle } from 'lucide-react';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { NavPage } from '../types';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage, category?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  brandConfig?: BrandConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenSearch,
  brandConfig = BRAND_CONFIG,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADFD4] transition-all">
      {/* Top subtle bar with brand motto */}
      <div className="bg-[#5A1224] text-[#FAF7F2] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
        <span>{brandConfig.supportingText || "Beautiful oil perfumes for every mood, moment and personality."}</span>
        <a
          href={`https://wa.me/${brandConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-[#E5C365] hover:text-white transition-colors underline ml-2"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left flex flex-col justify-center cursor-pointer group"
          >
            <span
              className="text-xl sm:text-2xl font-serif tracking-wider font-semibold text-[#5A1224] group-hover:text-[#7A1C33] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {brandConfig.businessName.toUpperCase()}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B] -mt-0.5">
              Oil Perfumes & Fragrances
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-xs uppercase tracking-widest transition-colors cursor-pointer py-1 ${
                currentPage === 'home'
                  ? 'text-[#5A1224] font-bold border-b-2 border-[#5A1224]'
                  : 'text-[#544D48] hover:text-[#5A1224]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`text-xs uppercase tracking-widest transition-colors cursor-pointer py-1 ${
                currentPage === 'shop'
                  ? 'text-[#5A1224] font-bold border-b-2 border-[#5A1224]'
                  : 'text-[#544D48] hover:text-[#5A1224]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-xs uppercase tracking-widest transition-colors cursor-pointer py-1 ${
                currentPage === 'about'
                  ? 'text-[#5A1224] font-bold border-b-2 border-[#5A1224]'
                  : 'text-[#544D48] hover:text-[#5A1224]'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-xs uppercase tracking-widest transition-colors cursor-pointer py-1 ${
                currentPage === 'contact'
                  ? 'text-[#5A1224] font-bold border-b-2 border-[#5A1224]'
                  : 'text-[#544D48] hover:text-[#5A1224]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Icons: Search & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenSearch}
              aria-label="Search perfumes"
              className="p-2 text-[#3D3734] hover:text-[#5A1224] hover:bg-[#F2E8DC] rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="relative p-2 text-[#3D3734] hover:text-[#5A1224] hover:bg-[#F2E8DC] rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#5A1224] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#3D3734] hover:text-[#5A1224] hover:bg-[#F2E8DC] rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#EADFD4] px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm uppercase tracking-wider font-medium ${
              currentPage === 'home'
                ? 'bg-[#5A1224] text-[#FAF7F2] font-semibold'
                : 'text-[#3D3734] hover:bg-[#F2E8DC]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm uppercase tracking-wider font-medium ${
              currentPage === 'shop'
                ? 'bg-[#5A1224] text-[#FAF7F2] font-semibold'
                : 'text-[#3D3734] hover:bg-[#F2E8DC]'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm uppercase tracking-wider font-medium ${
              currentPage === 'about'
                ? 'bg-[#5A1224] text-[#FAF7F2] font-semibold'
                : 'text-[#3D3734] hover:bg-[#F2E8DC]'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm uppercase tracking-wider font-medium ${
              currentPage === 'contact'
                ? 'bg-[#5A1224] text-[#FAF7F2] font-semibold'
                : 'text-[#3D3734] hover:bg-[#F2E8DC]'
            }`}
          >
            Contact
          </button>

          <div className="pt-3 border-t border-[#EADFD4]">
            <a
              href={`https://wa.me/${brandConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#25D366] text-white font-medium text-xs tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
