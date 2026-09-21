import React, { useState, useMemo } from 'react';
import { Perfume, ScentCategory } from '../types';
import { ProductCard } from './ProductCard';
import { Search, X } from 'lucide-react';

interface ShopPageProps {
  perfumes: Perfume[];
  initialCategory?: string;
  onSelectPerfume: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, e: React.MouseEvent) => void;
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Sweet & Fruity', label: 'Sweet & Fruity' },
  { id: 'Fresh & Clean', label: 'Fresh & Clean' },
  { id: 'Warm & Sensual', label: 'Warm & Sensual' },
  { id: 'Floral', label: 'Floral' },
  { id: 'Unisex', label: 'Unisex' },
];

export const ShopPage: React.FC<ShopPageProps> = ({
  perfumes,
  initialCategory = 'all',
  onSelectPerfume,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter perfumes based on category and search query
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => {
      // Category filter
      if (selectedCategory !== 'all' && perfume.category !== selectedCategory) {
        return false;
      }
      // Search by name filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = perfume.name.toLowerCase().includes(query);
        const matchesCategory = perfume.category.toLowerCase().includes(query);
        const matchesDesc = perfume.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [perfumes, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner as explicitly requested */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
            Fragrance Compendium
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#5A1224] mt-1 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Find Your Scent
          </h1>
          <p className="text-sm sm:text-base text-[#615750] mt-2">
            Explore the Superwoman's Hub fragrance collection.
          </p>
        </div>

        {/* Search Field & Filter Controls */}
        <div className="max-w-4xl mx-auto space-y-4 mb-10">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfumes by name (e.g. Pink Chiffon, Vanilla Lace, Cool Water)..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-[#D9C8BA] text-xs sm:text-sm text-[#2D2825] placeholder-[#9E9086] focus:outline-none focus:border-[#5A1224] focus:ring-1 focus:ring-[#5A1224] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#5A1224]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Simple Category Filter Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#5A1224] text-[#FAF7F2] shadow-sm'
                    : 'bg-white text-[#544D48] border border-[#E3D3C4] hover:bg-[#F5EAE1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#7A6D63] border-b border-[#EADFD4] pb-3">
          <span>
            Showing <strong className="text-[#5A1224]">{filteredPerfumes.length}</strong> perfume
            {filteredPerfumes.length !== 1 ? 's' : ''}
          </span>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[#5A1224] underline hover:text-[#7A1C33] cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Responsive Product Grid:
            Desktop: 3-4 products per row depending on screen width.
            Tablet: 2-3 products.
            Mobile: 2 products per row where practical, otherwise 1. */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EADFD4] p-8 max-w-md mx-auto">
            <p className="text-base font-serif font-semibold text-[#5A1224] mb-2">
              No matching perfumes found
            </p>
            <p className="text-xs text-[#6B5E57] mb-4">
              Try searching with a different perfume name or select "All" categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#5A1224] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Show All Perfumes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                onSelect={onSelectPerfume}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
