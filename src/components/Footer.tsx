import React from 'react';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { NavPage } from '../types';
import { MessageCircle, Phone, Mail, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  brandConfig?: BrandConfig;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, brandConfig = BRAND_CONFIG }) => {
  const handleNav = (page: NavPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#5A1224] text-[#FAF7F2] pt-14 pb-10 border-t border-[#460C1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-[#721A30]">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <h3
              className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2] tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {BRAND_CONFIG.businessName.toUpperCase()}
            </h3>
            <p className="text-[#E5C365] text-sm font-serif italic">
              &ldquo;{BRAND_CONFIG.tagline}&rdquo;
            </p>
            <p className="text-xs text-[#F2DFD5] leading-relaxed font-light">
              {BRAND_CONFIG.supportingText}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C365]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="text-[#F2DFD5] hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop')}
                  className="text-[#F2DFD5] hover:text-white transition-colors cursor-pointer"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-[#F2DFD5] hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="text-[#F2DFD5] hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C365]">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F2DFD5]">
              <li>
                <a
                  href={`https://wa.me/${brandConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp: {brandConfig.displayWhatsapp || brandConfig.whatsappNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brandConfig.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E5C365]" />
                  <span>Phone: {brandConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brandConfig.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5C365]" />
                  <span>Email: {brandConfig.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C365]">
              Follow Our Journey
            </h4>
            <p className="text-xs text-[#F2DFD5] font-light">
              Connect with {brandConfig.businessName} for new scent drops and perfume inspiration.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={brandConfig.instagramUrl || `https://instagram.com/${brandConfig.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#721A30] hover:bg-[#8A243E] flex items-center justify-center text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={brandConfig.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#721A30] hover:bg-[#8A243E] flex items-center justify-center text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={brandConfig.tiktokUrl || `https://tiktok.com/@${brandConfig.tiktok.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-[#721A30] hover:bg-[#8A243E] flex items-center justify-center text-white font-bold text-xs transition-colors"
              >
                TK
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 text-center text-xs text-[#E8D1C7] font-light flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 {brandConfig.businessName}. All rights reserved.</p>
          <p className="text-[11px] text-[#D8BCB0]">
            Crafted for Nigerian Oil Perfume Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
