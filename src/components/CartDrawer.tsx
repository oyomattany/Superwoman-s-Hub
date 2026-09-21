import React from 'react';
import { CartItem } from '../types';
import { formatPrice, generateCartWhatsAppUrl } from '../utils/format';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  brandConfig?: BrandConfig;
  onOrderSubmitted?: (items: CartItem[], total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  brandConfig = BRAND_CONFIG,
  onOrderSubmitted,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.price ?? 0) * item.quantity;
  }, 0);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const whatsappOrderUrl = generateCartWhatsAppUrl(cartItems, subtotal, brandConfig);

  const handleOrderClick = () => {
    if (onOrderSubmitted && cartItems.length > 0) {
      onOrderSubmitted(cartItems, subtotal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#240A10]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#EADFD4]">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-[#EADFD4] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#5A1224]" />
              <h2
                className="text-lg font-serif font-semibold text-[#5A1224]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Fragrance Bag
              </h2>
              <span className="text-xs bg-[#F5EAE1] text-[#5A1224] px-2 py-0.5 rounded-full font-semibold">
                {totalItemsCount}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#7A6C62] hover:text-[#5A1224] hover:bg-[#F5EAE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-[#F5EAE1] text-[#5A1224] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#2D2825] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#6B5E57] mb-6 max-w-xs mx-auto">
                  Find your signature scent from our collection of beautiful oil perfumes.
                </p>
                <button
                  onClick={onContinueShopping}
                  className="px-6 py-2.5 rounded-full bg-[#5A1224] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#721830] transition-colors"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E8DDD2] p-3 flex gap-3 items-center shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F5EAE1] flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 text-left">
                    <h4
                      className="font-serif font-semibold text-sm text-[#2D2825] truncate"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#8C7A6B]">
                      {item.selectedSize} • {item.category}
                    </p>
                    <p className="text-xs font-semibold text-[#5A1224] mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#9E8E84] hover:text-[#C82333] transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="inline-flex items-center rounded-full border border-[#D9C8BA] bg-[#FAF7F2] p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[#5A1224] hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-[#2D2825]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[#5A1224] hover:bg-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#EADFD4] bg-white space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6B5E57]">Subtotal</span>
                <span className="font-serif font-bold text-base text-[#5A1224]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-[11px] text-[#8C7A6B] leading-normal">
                Delivery fees are calculated based on your location during WhatsApp confirmation.
              </p>

              {/* Order via WhatsApp CTA as explicitly demanded */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onContinueShopping}
                className="w-full py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#F2E8DC] text-[#5A1224] border border-[#D9C8BA] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
