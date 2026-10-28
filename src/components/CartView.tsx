import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Tag, 
  ArrowRight, 
  ShoppingBag, 
  Coins, 
  Check, 
  Truck,
  Heart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CheckoutModal } from './CheckoutModal';
import { Order } from '../types';

interface CartViewProps {
  onContinueShopping: () => void;
  onViewOrder: (orderId: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ onContinueShopping, onViewOrder }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotals, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    coupons,
    superCoins, 
    useSuperCoins, 
    setUseSuperCoins, 
    pincode,
    toggleWishlist,
    navigateTo,
    showToast 
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      showToast(res.message);
      setCouponInput('');
    }
  };

  const handleOrderSuccess = (order: Order) => {
    onViewOrder(order.id);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your SmartSole Cart is Empty!</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our trending sneakers, running shoes, and formal footwear with exclusive college discounts.
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-[#2874f0] text-white px-8 py-3 rounded font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      <h1 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
        Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} Items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Pincode & Delivery banner */}
          <div className="bg-white rounded border border-slate-200 p-3.5 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Deliver to: <strong className="text-slate-900">{pincode}</strong></span>
            </div>
            <span className="text-green-700 font-semibold">Standard Express Delivery Available</span>
          </div>

          {/* Items */}
          <div className="bg-white rounded border border-slate-200 shadow-xs divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-50 rounded border border-slate-200 overflow-hidden">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{item.product.brand}</p>
                      <h3 className="text-sm font-semibold text-slate-900">{item.product.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Size: <strong className="text-slate-800">UK {item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-slate-800">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center justify-end gap-1.5 text-xs">
                        <span className="text-slate-400 line-through">
                          ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-green-700 font-bold">{item.product.discountPercent}% off</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Seller: KickAssure Direct • 7 Days Replacement</span>
                  </p>

                  {/* Quantity & Actions row */}
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Qty:</span>
                      <div className="flex items-center border border-slate-300 rounded">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <button
                        onClick={() => {
                          toggleWishlist(item.product.id);
                          removeFromCart(item.id);
                        }}
                        className="text-slate-600 hover:text-blue-600 flex items-center gap-1"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Save For Later</span>
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Place Order Bar */}
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <button
                onClick={onContinueShopping}
                className="text-xs text-slate-600 font-bold hover:underline"
              >
                &larr; Continue Shopping
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="hidden sm:flex border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 py-3 px-5 rounded font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Quick Pay Modal
                </button>
                <button
                  onClick={() => navigateTo('checkout')}
                  className="bg-[#fb641b] hover:bg-[#e85b16] text-white py-3 px-8 rounded font-extrabold text-xs uppercase tracking-wider transition-colors shadow flex items-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Coupons & Price Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Coupons Card */}
          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-700">
              <Tag className="w-4 h-4 text-green-700" />
              <span>Apply Coupons & Promo Codes</span>
            </div>

            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded p-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-green-800">{appliedCoupon.code}</span> applied!
                  <p className="text-[11px] text-green-600">Saved ₹{cartTotals.couponDiscount.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 font-bold hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. COLLEGE2026)"
                    className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono uppercase focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#2874f0] text-white px-4 py-1.5 rounded font-bold text-xs hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
              </form>
            )}

            {/* Quick 1-click coupons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">Available Coupons:</span>
              {coupons.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    const res = applyCoupon(c.code);
                    if (!res.success) setCouponError(res.message);
                    else showToast(res.message);
                  }}
                  className="p-2 rounded bg-slate-50 hover:bg-blue-50/50 border border-slate-200 cursor-pointer text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-700">{c.code}</span>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{c.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Apply</span>
                </div>
              ))}
            </div>
          </div>

          {/* SuperCoins Rewards Toggle */}
          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-slate-800">SuperCoins Balance: {superCoins}</p>
                <p className="text-[11px] text-slate-500">Redeem up to ₹150 discount</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useSuperCoins}
                onChange={(e) => setUseSuperCoins(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Price Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Price ({cart.length} items)</span>
                <span>₹{cartTotals.totalMRP.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount</span>
                <span>- ₹{cartTotals.discountOnMRP.toLocaleString('en-IN')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupons Discount ({appliedCoupon.code})</span>
                  <span>- ₹{cartTotals.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {useSuperCoins && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>SuperCoins Savings</span>
                  <span>- ₹{cartTotals.coinsDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-700">
                <span>Delivery Charges</span>
                <span className="text-green-700 font-bold">FREE</span>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between text-sm sm:text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-[#2874f0]">₹{cartTotals.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Savings Banner */}
            <div className="bg-green-50 text-green-800 text-xs font-bold p-2.5 rounded text-center">
              🎉 You will save ₹{cartTotals.totalSavings.toLocaleString('en-IN')} on this order!
            </div>
          </div>

          {/* Flipkart Trust Guarantee */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>Safe and Secure Payments. 100% Authentic Footwear Guarantee.</span>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};
