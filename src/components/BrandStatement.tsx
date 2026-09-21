import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BrandStatementProps {
  onDiscoverClick: () => void;
}

export const BrandStatement: React.FC<BrandStatementProps> = ({ onDiscoverClick }) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[#5A1224] text-[#FAF7F2] text-center">
      {/* Decorative gold background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C59E3F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C365] font-semibold">
          The Superwoman's Hub Philosophy
        </span>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-[#FAF7F2] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          &ldquo;A scent for every version of you.&rdquo;
        </h2>

        <p className="text-base sm:text-lg text-[#F4E3D8] font-light max-w-2xl mx-auto leading-relaxed">
          At Superwoman's Hub, we bring you a collection of beautiful oil perfumes designed to help you smell good, feel confident and leave a lasting impression.
        </p>

        <div className="pt-4">
          <button
            onClick={onDiscoverClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF7F2] hover:bg-white text-[#5A1224] font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <span>Discover Our Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
