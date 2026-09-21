import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { NavPage } from '../types';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  return (
    <div className="bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DDD2] p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#F5EAE1] text-[#5A1224] flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-[#C59E3F]" />
        </div>

        <span className="text-4xl font-serif font-bold text-[#5A1224]">404</span>

        <h1
          className="text-2xl font-serif font-semibold text-[#2D2825] mt-2 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Fragrance Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#6B5E57] mb-6 leading-relaxed">
          The page you are looking for might have been moved or does not exist. Let's get you back to discovering lovely oil perfumes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#5A1224] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#721830] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
          <button
            onClick={onNavigateShop}
            className="px-5 py-2.5 rounded-full border border-[#D9C8BA] text-[#5A1224] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
          >
            Browse Scents
          </button>
        </div>
      </div>
    </div>
  );
};
