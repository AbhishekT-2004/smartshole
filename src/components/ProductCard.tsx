import React, { useState } from 'react';
import { Heart, Star, ShieldCheck, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [selectedQuickSize, setSelectedQuickSize] = useState<number | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  // Available sizes with stock > 0
  const availableSizes = product.sizes.filter(s => s.stock > 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sizeToUse = selectedQuickSize || (availableSizes[0] ? availableSizes[0].size : 8);
    addToCart(product, sizeToUse);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div 
      onClick={() => onSelect(product.id)}
      className="group bg-white rounded border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top badges */}
      <div className="relative pt-[100%] bg-slate-50 overflow-hidden">
        {/* Main image with hover swap */}
        <img
          src={product.images[hoveredImageIndex] || product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onMouseEnter={() => {
            if (product.images.length > 1) setHoveredImageIndex(1);
          }}
          onMouseLeave={() => setHoveredImageIndex(0)}
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-transform active:scale-90 z-10"
          aria-label="Toggle Wishlist"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'hover:stroke-red-500'
            }`} 
          />
        </button>

        {/* KickAssure Badge */}
        {product.isAssured && (
          <div className="absolute top-2 left-2 bg-[#2874f0] text-white text-[10px] font-black italic px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
            <span>Kick</span>
            <span className="text-yellow-300">Assure</span>
          </div>
        )}

        {/* Trend / Best Seller Tag */}
        {product.isBestSeller && (
          <div className="absolute bottom-2 left-2 bg-yellow-400 text-blue-950 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm">
            Best Seller
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>{product.brand}</span>
            <span className="text-slate-400">{product.gender}</span>
          </div>

          {/* Product Name */}
          <h3 
            className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-[#2874f0] transition-colors mt-0.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </span>
            <span className="text-xs text-slate-500">
              ({product.ratingCount.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-extrabold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-green-700">
              {product.discountPercent}% off
            </span>
          </div>

          {/* Free delivery badge */}
          <p className="text-[11px] text-slate-500 mt-0.5">
            Free delivery by <strong className="text-slate-700">Tomorrow</strong>
          </p>

          {/* Size Pills */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">UK:</span>
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (s.stock > 0) setSelectedQuickSize(s.size);
                  }}
                  disabled={s.stock === 0}
                  className={`text-[10px] font-medium w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    s.stock === 0
                      ? 'text-slate-300 line-through cursor-not-allowed'
                      : selectedQuickSize === s.size
                      ? 'bg-[#2874f0] text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={s.stock === 0 ? 'Out of stock' : `${s.stock} left in UK ${s.size}`}
                >
                  {s.size}
                </button>
              ))}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                addedAnimation 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-50 text-[#2874f0] hover:bg-[#2874f0] hover:text-white'
              }`}
              title="Add to Cart"
            >
              {addedAnimation ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
