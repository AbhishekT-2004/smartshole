import React from 'react';
import { Heart, Trash2, ShoppingCart, Star, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

interface WishlistViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onContinueShopping: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ 
  products, 
  onSelectProduct, 
  onContinueShopping 
}) => {
  const { wishlist, toggleWishlist, addToCart, showToast } = useShop();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    const available = product.sizes.find(s => s.stock > 0);
    const size = available ? available.size : 8;
    addToCart(product, size);
    toggleWishlist(product.id);
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full mx-auto flex items-center justify-center">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your SoleKart Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our shoes and tap the heart icon on any sneakers or boots to save them here for later!
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-[#2874f0] text-white px-8 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow"
        >
          Explore Footwear
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            My Wishlist ({wishlistedProducts.length} Shoes)
          </h1>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showToast('Wishlist link copied to clipboard!');
          }}
          className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Wishlist</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs divide-y divide-slate-100">
        {wishlistedProducts.map((p) => {
          const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
          const inStock = totalStock > 0;

          return (
            <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div 
                onClick={() => onSelectProduct(p.id)}
                className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded bg-slate-50 border border-slate-200 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{p.brand}</span>
                  <h3 className="text-sm font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors">
                    {p.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      <span>{p.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-xs text-slate-500">({p.ratingCount})</span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-green-700 font-bold">{p.discountPercent}% off</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                <button
                  onClick={() => handleMoveToCart(p)}
                  disabled={!inStock}
                  className="flex-1 sm:flex-initial bg-[#2874f0] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:bg-slate-300"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{inStock ? 'Move to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded border border-slate-200 hover:border-red-200 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
