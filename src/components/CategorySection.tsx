import React from 'react';
import { CATEGORIES } from '../data/perfumes';
import { ScentCategory } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  onSelectCategory: (category: ScentCategory) => void;
  categoryImages?: Record<ScentCategory, string>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  categoryImages,
}) => {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EADFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
            Curated Collections
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#5A1224] mt-1 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop by Scent
          </h2>
          <p className="text-xs sm:text-sm text-[#615750] mt-2">
            Explore our thoughtfully curated fragrance families to match your everyday mood and personality.
          </p>
        </div>

        {/* 5 Minimal & Elegant Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((cat) => {
            const catImage = categoryImages?.[cat.id] || cat.image;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group text-left bg-white rounded-2xl border border-[#E8DED4] p-3 sm:p-4 hover:border-[#5A1224] hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Category Image */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#F4EDE5]">
                  <img
                    src={catImage}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

              <div>
                <h3
                  className="text-sm sm:text-base font-serif font-semibold text-[#5A1224] group-hover:text-[#7A1C33] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#6B5E57] line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F0E6DC] flex items-center justify-between text-[11px] font-semibold text-[#C59E3F] group-hover:text-[#5A1224] transition-colors">
                <span>Explore Scent</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      </div>
    </section>
  );
};
