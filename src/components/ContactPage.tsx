import React, { useState } from 'react';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { MessageCircle, Phone, Mail, Instagram, Send, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  brandConfig?: BrandConfig;
}

export const ContactPage: React.FC<ContactPageProps> = ({ brandConfig = BRAND_CONFIG }) => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim() || !message.trim()) return;

    // Build optional WhatsApp forwarding
    const forwardText = `Hello ${brandConfig.businessName} 👋\n\nNew Inquiry from Website:\nName: ${name}\nContact: ${contactInfo}\nMessage: ${message}`;
    const waUrl = `https://wa.me/${brandConfig.whatsappNumber}?text=${encodeURIComponent(forwardText)}`;
    
    // Open in new tab if user chooses, or show friendly success
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C59E3F] font-bold">
            We Are Here For You
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#5A1224] mt-1 font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Let's Talk Fragrance
          </h1>
          <p className="text-xs sm:text-sm text-[#615750] mt-2">
            Have questions about scents, sizes, or placing an order? Reach out directly through any channel below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Direct Channels Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${brandConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl border border-[#E8DDD2] p-5 hover:border-[#25D366] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F8EE] text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
                    WhatsApp (Fastest)
                  </span>
                  <p className="font-semibold text-sm text-[#2D2825] group-hover:text-[#25D366] transition-colors">
                    {brandConfig.displayWhatsapp || brandConfig.whatsappNumber}
                  </p>
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${brandConfig.phone}`}
              className="block bg-white rounded-2xl border border-[#E8DDD2] p-5 hover:border-[#5A1224] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5EAE1] text-[#5A1224] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
                    Phone Call
                  </span>
                  <p className="font-semibold text-sm text-[#2D2825] group-hover:text-[#5A1224] transition-colors">
                    {brandConfig.phone}
                  </p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${brandConfig.email}`}
              className="block bg-white rounded-2xl border border-[#E8DDD2] p-5 hover:border-[#5A1224] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5EAE1] text-[#5A1224] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
                    Email
                  </span>
                  <p className="font-semibold text-sm text-[#2D2825] group-hover:text-[#5A1224] transition-colors truncate">
                    {brandConfig.email}
                  </p>
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={brandConfig.instagramUrl || `https://instagram.com/${brandConfig.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl border border-[#E8DDD2] p-5 hover:border-[#C59E3F] hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF0DC] text-[#C59E3F] flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
                    Instagram Direct
                  </span>
                  <p className="font-semibold text-sm text-[#2D2825] group-hover:text-[#C59E3F] transition-colors">
                    {brandConfig.instagram}
                  </p>
                </div>
              </div>
            </a>

          </div>

          {/* Contact Form Column (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-[#E8DDD2] p-6 sm:p-8 shadow-xs text-left">
            <h3
              className="text-xl font-serif font-semibold text-[#5A1224] mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Send Us a Message
            </h3>
            <p className="text-xs text-[#6B5E57] mb-6">
              Leave a note and we will get back to you promptly.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#25D366] mx-auto" />
                <h4 className="font-serif font-semibold text-lg text-[#2D2825]">
                  Message Prepared
                </h4>
                <p className="text-xs text-[#6B5E57] max-w-sm mx-auto">
                  Thank you, {name}! Your message has been routed to our WhatsApp chat for immediate assistance.
                </p>
                <button
                  onClick={() => {
                    setName('');
                    setContactInfo('');
                    setMessage('');
                    setSubmitted(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-full border border-[#D9C8BA] text-xs font-semibold uppercase tracking-wider text-[#5A1224] hover:bg-[#FAF7F2]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D3734] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Musa"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs sm:text-sm text-[#2D2825] focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D3734] mb-1.5">
                    Phone / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. 08012345678 or amina@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs sm:text-sm text-[#2D2825] focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D3734] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what scents you are looking for or any questions you have..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs sm:text-sm text-[#2D2825] focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#5A1224] hover:bg-[#721830] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
