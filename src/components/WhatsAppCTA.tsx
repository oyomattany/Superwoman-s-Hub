import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { generateGeneralWhatsAppUrl } from '../utils/format';

interface WhatsAppCTAProps {
  brandConfig?: BrandConfig;
}

export const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({ brandConfig = BRAND_CONFIG }) => {
  const whatsappUrl = generateGeneralWhatsAppUrl(
    `Hello ${brandConfig.businessName} 👋\nI would like help choosing an oil perfume that matches my personal style and preferences!`,
    brandConfig
  );

  return (
    <section className="py-14 sm:py-20 bg-[#F5EAE1] border-b border-[#EADFD4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#5A1224] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#E3D3C4]">
          <Sparkles className="w-3.5 h-3.5 text-[#C59E3F]" />
          <span>Personal Scent Guidance</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-[#5A1224] leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Not sure which scent is right for you?
        </h2>

        <p className="text-sm sm:text-base text-[#544D48] mt-3 max-w-xl mx-auto leading-relaxed">
          Chat with Superwoman's Hub and we'll help you find a fragrance that matches your style.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <span className="text-xs text-[#7A6C62]">
            Fast replies • Direct assistance with available stock
          </span>
        </div>

      </div>
    </section>
  );
};
