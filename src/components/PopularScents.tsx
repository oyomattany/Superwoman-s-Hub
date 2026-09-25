import React from 'react';
import { Perfume } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface PopularScentsProps {
  perfumes: Perfume[];
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, e: React.MouseEvent) => void;
  onViewAll: () => void;
}

export const PopularScents: React.FC<PopularScentsProps> = ({
  perfumes,
  onSelectPerfume,
  onAddToCart,
  onViewAll,
}) => {
  // Show all popular & newly added live inventory items (up to 12)
  const displayPerfumes = perfumes.slice(0, 12);

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#EADFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
              Available Now • Live Collection
            </span>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#5A1224] mt-1 font-semibold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Popular Scents & New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#615750] mt-1.5 max-w-md">
              Discover fragrances our customers love. Pure oil formulas crafted to make an unforgettable impression.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#5A1224] hover:text-[#7A1C33] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Perfumes ({perfumes.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Product Cards Grid (3 on tablet/desktop, 2 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {displayPerfumes.map((perfume) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              onSelect={onSelectPerfume}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
