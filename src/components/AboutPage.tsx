import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onShopClick: () => void;
  aboutImages?: {
    story1: string;
    story2: string;
  };
}

export const AboutPage: React.FC<AboutPageProps> = ({ onShopClick, aboutImages }) => {
  const story1Image = aboutImages?.story1 || '/1789993107439.jpg';
  const story2Image = aboutImages?.story2 || '/1789992870791.jpg';
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
            Our Story & Vision
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#5A1224] mt-1 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Superwoman's Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#8C7A6B] mt-2 italic">
            &ldquo;{BRAND_CONFIG.tagline}&rdquo;
          </p>
        </div>

        {/* Narrative Card with verbatim starter copy */}
        <div className="bg-white rounded-3xl border border-[#E8DDD2] p-6 sm:p-10 shadow-xs space-y-6 text-left">
          
          <div className="flex items-center gap-2 text-[#5A1224] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#C59E3F]" />
            <span>Fragrance as Self-Expression</span>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#3D3734] leading-relaxed font-light">
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#5A1224] first-letter:mr-2 first-letter:float-left">
              Superwoman's Hub is a fragrance brand offering a carefully selected collection of oil perfumes for different personalities, moods and occasions.
            </p>

            <p>
              We believe fragrance is more than something you wear — it can become part of how you express yourself.
            </p>
          </div>

          {/* Authentic Business Photography Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DDD2] bg-[#FAF7F2] aspect-[4/3] group">
              <img
                src={story1Image}
                alt="Superwoman's Hub Founder with Oil Perfume Collection"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-semibold">Hand-Picked Oil Perfumes</p>
                <p className="text-[10px] text-[#FAF7F2]/80">Curated with passion for every unique personality.</p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#E8DDD2] bg-[#FAF7F2] aspect-[4/3] group">
              <img
                src={story2Image}
                alt="Superwoman's Hub Fragrance Oils"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-xs font-semibold">Pure Fragrance Oils</p>
                <p className="text-[10px] text-[#FAF7F2]/80">Rich, long-lasting, and alcohol-free formulations.</p>
              </div>
            </div>
          </div>

          {/* Simple Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F0E6DC]">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADFD4]">
              <h3 className="font-serif font-semibold text-sm text-[#5A1224] mb-1">
                Pocket-Sized Confidence
              </h3>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                Practical, easy-to-carry roll-on oils designed to fit comfortably in your purse, bag, or pocket for any moment of your day.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADFD4]">
              <h3 className="font-serif font-semibold text-sm text-[#5A1224] mb-1">
                Personalized Service
              </h3>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                We take joy in answering questions and recommending scents that truly align with your vibe and favorite notes.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 text-center">
            <button
              onClick={onShopClick}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#5A1224] hover:bg-[#721830] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
