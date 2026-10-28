import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ShippingAddress, Coupon } from '../types';
import { api } from '../services/api';

export type AppView = 
  | 'home' 
  | 'shopping' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'wishlist' 
  | 'orders' 
  | 'order-detail' 
  | 'admin' 
  | 'admin-orders' 
  | 'ai-stylist';

interface ShopContextType {
  currentView: AppView;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  navigateTo: (view: AppView, id?: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: number, color?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotals: {
    totalMRP: number;
    discountOnMRP: number;
    couponDiscount: number;
    coinsDiscount: number;
    deliveryFee: number;
    totalAmount: number;
    totalSavings: number;
  };
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons & Rewards
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  superCoins: number;
  useSuperCoins: boolean;
  setUseSuperCoins: (val: boolean) => void;

  // Address
  savedAddresses: ShippingAddress[];
  selectedAddress: ShippingAddress;
  saveNewAddress: (addr: ShippingAddress) => void;
  setSelectedAddress: (addr: ShippingAddress) => void;

  // Pincode & Delivery
  pincode: string;
  pincodeData: any;
  updatePincode: (pin: string) => Promise<void>;

  // Admin Switcher
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;

  // AI Chatbot
  isAiChatOpen: boolean;
  setIsAiChatOpen: (val: boolean) => void;
  aiInitialPrompt: string | null;
  openAiChatWithPrompt: (prompt: string) => void;

  // Toast / notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_ADDRESS: ShippingAddress = {
  fullName: 'Aakash Verma',
  phone: '9876543210',
  pincode: '560034',
  locality: 'Koramangala 4th Block',
  addressLine: '#42, 3rd Cross, Near BDA Complex',
  city: 'Bengaluru',
  state: 'Karnataka',
  landmark: 'Opposite Starbucks',
  type: 'Home'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('smartsole_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smartsole_wishlist');
      return saved ? JSON.parse(saved) : ['prod-nike-air-jordan-1', 'prod-nb-9060-drift'];
    } catch {
      return ['prod-nike-air-jordan-1'];
    }
  });

  // Addresses
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(() => {
    try {
      const saved = localStorage.getItem('smartsole_addresses');
      return saved ? JSON.parse(saved) : [DEFAULT_ADDRESS];
    } catch {
      return [DEFAULT_ADDRESS];
    }
  });
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(savedAddresses[0] || DEFAULT_ADDRESS);

  // Coupons & Rewards
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [superCoins, setSuperCoins] = useState<number>(450);
  const [useSuperCoins, setUseSuperCoins] = useState<boolean>(false);

  // Delivery Pincode
  const [pincode, setPincode] = useState<string>('560034');
  const [pincodeData, setPincodeData] = useState<any>({
    serviceable: true,
    estimatedDate: 'Tomorrow, by 6 PM',
    message: 'Delivery by Tomorrow | FREE Delivery'
  });

  // Admin Mode
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // AI Chatbot
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  useEffect(() => {
    localStorage.setItem('smartsole_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smartsole_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('smartsole_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    api.getCoupons().then(setCoupons);
  }, []);

  const navigateTo = (view: AppView, id?: string) => {
    setCurrentView(view);
    if (view === 'product-detail' && id) {
      setSelectedProductId(id);
    } else if ((view === 'orders' || view === 'order-detail') && id) {
      setSelectedOrderId(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAiChatWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAiChatOpen(true);
  };

  const addToCart = (product: Product, size: number, color?: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.selectedSize === size);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        productId: product.id,
        product,
        selectedSize: size,
        selectedColor: color || product.colors[0],
        quantity,
        addedAt: new Date().toISOString()
      };
      return [newItem, ...prev];
    });
    showToast(`Added ${product.name} (UK ${size}) to Cart!`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
    showToast('Item removed from Cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setUseSuperCoins(false);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "COLLEGE2026" or "BIGSALE"' };
    }

    const currentTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (currentTotal < found.minOrder) {
      return {
        success: false,
        message: `Min order of ₹${found.minOrder.toLocaleString('en-IN')} required for ${found.code}`
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const saveNewAddress = (addr: ShippingAddress) => {
    setSavedAddresses(prev => [addr, ...prev]);
    setSelectedAddress(addr);
    showToast('New delivery address saved');
  };

  const updatePincode = async (pin: string) => {
    setPincode(pin);
    const data = await api.checkPincode(pin);
    setPincodeData(data);
  };

  // Cart Price Computations
  const totalMRP = cart.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const totalSellingPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountOnMRP = totalMRP - totalSellingPrice;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((totalSellingPrice * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.code === 'COLLEGE2026' && couponDiscount > 1500) couponDiscount = 1500;
      if (appliedCoupon.code === 'FIRSTKICK' && couponDiscount > 1000) couponDiscount = 1000;
    } else if (appliedCoupon.flatDiscount) {
      couponDiscount = appliedCoupon.flatDiscount;
    }
  }

  const coinsDiscount = useSuperCoins ? Math.min(superCoins, 150) : 0;
  const deliveryFee = totalSellingPrice > 499 || cart.length === 0 ? 0 : 40;
  const totalAmount = Math.max(0, totalSellingPrice - couponDiscount - coinsDiscount + deliveryFee);
  const totalSavings = discountOnMRP + couponDiscount + coinsDiscount;

  return (
    <ShopContext.Provider
      value={{
        currentView,
        selectedProductId,
        selectedOrderId,
        navigateTo,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotals: {
          totalMRP,
          discountOnMRP,
          couponDiscount,
          coinsDiscount,
          deliveryFee,
          totalAmount,
          totalSavings
        },
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        superCoins,
        useSuperCoins,
        setUseSuperCoins,
        savedAddresses,
        selectedAddress,
        saveNewAddress,
        setSelectedAddress,
        pincode,
        pincodeData,
        updatePincode,
        isAdminMode,
        setIsAdminMode,
        isAiChatOpen,
        setIsAiChatOpen,
        aiInitialPrompt,
        openAiChatWithPrompt,
        toastMessage,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
