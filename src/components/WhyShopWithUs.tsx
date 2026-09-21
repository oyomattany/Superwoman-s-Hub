import React from 'react';
import { Sparkles, MessageCircle, Heart } from 'lucide-react';

export const WhyShopWithUs: React.FC = () => {
  const benefits = [
    {
      title: 'Beautiful Scents',
      description: 'Carefully curated oil perfumes that smell rich, lovely, and elevate your everyday presence.',
      icon: Sparkles,
    },
    {
      title: 'Easy Ordering',
      description: 'Select your preferred oils and order directly through WhatsApp with friendly, personal service.',
      icon: MessageCircle,
    },
    {
      title: 'Perfumes for Every Mood',
      description: 'From sweet and fruity to fresh or warm and sensual, find a scent that matches who you are today.',
      icon: Heart,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-[#EADFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
            The Superwoman Experience
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#5A1224] mt-1 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Shop With Us
          </h2>
          <p className="text-xs sm:text-sm text-[#615750] mt-1.5">
            Fragrance made simple, personal, and delightfully accessible.
          </p>
        </div>

        {/* 3 Simple Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DDD2] p-6 sm:p-8 text-center flex flex-col items-center hover:border-[#5A1224]/40 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#F5EAE1] text-[#5A1224] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#5A1224]" />
                </div>
                <h3
                  className="text-lg font-serif font-semibold text-[#2D2825] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
