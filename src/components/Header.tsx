import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Package, 
  ShieldCheck, 
  MapPin, 
  Coins, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  LogOut,
  ExternalLink,
  Flame,
  Menu,
  X,
  Bot,
  Receipt,
  Grid,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useShop, AppView } from '../context/ShopContext';
import { Product } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  products: Product[];
}

export const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery, products }) => {
  const { 
    currentView, 
    navigateTo, 
    cart, 
    wishlist, 
    superCoins, 
    isAdminMode, 
    setIsAdminMode,
    pincode,
    updatePincode,
    setIsAiChatOpen,
    openAiChatWithPrompt,
    showToast
  } = useShop();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState(pincode);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Autocomplete matching
  const matchingProducts = searchQuery.trim().length > 0 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(tempPincode)) {
      updatePincode(tempPincode);
      setIsPincodeModalOpen(false);
      showToast(`Pincode set to ${tempPincode}. Delivery estimates updated!`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] text-white shadow-md">
      {/* Top micro banner */}
      <div className="bg-[#1c5fc4] text-xs py-1 px-4 text-center font-medium hidden sm:block">
        <span className="inline-flex items-center gap-1.5 text-yellow-300">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>SmartSole AI Footwear Platform: Use code <strong>COLLEGE2026</strong> for extra 15% Student Discount!</span>
        </span>
      </div>

      {/* Main Flipkart-style bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-5">
        
        {/* Left: Mobile hamburger & Brand Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-white hover:bg-blue-700 rounded-md"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => { navigateTo('home'); setIsAdminMode(false); }}
            className="cursor-pointer group flex flex-col items-start leading-none select-none"
          >
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black italic tracking-tight font-sans">
                Smart<span className="text-[#ffe500]">Sole</span>
              </span>
              <span className="bg-yellow-400 text-blue-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded italic">
                AI
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-blue-200 group-hover:text-yellow-300 transition-colors">
              <span className="italic font-medium">AI Footwear</span>
              <span className="text-yellow-300 font-bold italic flex items-center">
                Platform <Sparkles className="w-2.5 h-2.5 ml-0.5 text-yellow-300 inline" />
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search footwear, brands (Nike, Jordan, Adidas), categories..."
              value={searchQuery}
              onChange={(e) => {
                onSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 pl-4 pr-10 py-2 rounded-sm text-sm font-normal shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button 
              className="absolute right-2 text-[#2874f0] p-1.5 hover:text-blue-800"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && matchingProducts.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white text-slate-800 rounded-b-md shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                Matching Shoes ({matchingProducts.length})
              </div>
              {matchingProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigateTo('product-detail', p.id);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.brand} • in {p.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-green-600 block">{p.discountPercent}% off</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deliver to Pincode Indicator */}
        <button
          onClick={() => setIsPincodeModalOpen(true)}
          className="hidden xl:flex items-center gap-1.5 text-xs text-white hover:text-yellow-200 px-2 py-1 rounded transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-yellow-300" />
          <div className="text-left leading-tight">
            <span className="text-[10px] text-blue-200 block">Deliver to</span>
            <span className="font-semibold underline decoration-dotted">{pincode}</span>
          </div>
        </button>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Quick Nav Links on Desktop */}
          <button
            onClick={() => { setIsAdminMode(false); navigateTo('shopping'); }}
            className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold hover:bg-blue-700 transition-colors ${
              currentView === 'shopping' ? 'bg-blue-800 text-yellow-300 font-bold' : 'text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Shop Shoes</span>
          </button>

          {/* AI Stylist Button */}
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-blue-950 px-2.5 py-1.5 rounded text-xs font-extrabold shadow-sm transition-transform active:scale-95 cursor-pointer"
            title="Open SmartSole AI Stylist & Chatbot"
          >
            <Bot className="w-3.5 h-3.5 text-blue-950" />
            <span className="hidden md:inline">AI Stylist</span>
            <span className="md:hidden">AI</span>
          </button>

          {/* Admin Dropdown Switcher */}
          <div ref={adminRef} className="relative">
            <button
              onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-bold transition-all shadow-xs ${
                isAdminMode || currentView === 'admin' || currentView === 'admin-orders'
                  ? 'bg-yellow-400 text-blue-950 ring-2 ring-white' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title="Admin Dashboards & Order Management"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {isAdminDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Merchant Control
                </div>
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    navigateTo('admin');
                    setIsAdminDropdownOpen(false);
                    showToast('Opened Admin Dashboard & Sales Analytics');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sales & Inventory Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    navigateTo('admin-orders');
                    setIsAdminDropdownOpen(false);
                    showToast('Opened Admin Order Management & Dispatch');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 font-medium text-slate-700"
                >
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin Order Management</span>
                </button>
              </div>
            )}
          </div>

          {/* User Account Dropdown */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#2874f0] font-semibold text-xs rounded hover:bg-slate-100 transition-colors shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pawan</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1 z-50 text-xs divide-y divide-slate-100">
                <div className="px-4 py-2.5 bg-blue-50/50">
                  <p className="font-bold text-slate-900 text-sm">Hello, Pawan</p>
                  <p className="text-[11px] text-slate-500">pawan2004xy@gmail.com</p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded text-[11px] font-semibold w-fit">
                    <Coins className="w-3.5 h-3.5 text-yellow-600" />
                    <span>{superCoins} SuperCoins</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigateTo('orders');
                      setIsAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                  >
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <span>Orders & Payment History</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('checkout');
                      setIsAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                  >
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Checkout Page</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('wishlist');
                      setIsAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAiChatOpen(true);
                      setIsAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                  >
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>SmartSole AI Stylist</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsPincodeModalOpen(true);
                      setIsAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-600"
                  >
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Change Pincode ({pincode})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative p-1.5 text-white hover:text-yellow-300 transition-colors hidden sm:block"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigateTo('cart')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 hover:bg-blue-700 rounded transition-colors text-white font-semibold text-xs sm:text-sm"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#1c5fc4] border-t border-blue-400/30 px-4 py-3 space-y-2 text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
            <span className="text-xs text-blue-200">Deliver to: <strong className="text-white">{pincode}</strong></span>
            <button 
              onClick={() => { setIsPincodeModalOpen(true); setMobileMenuOpen(false); }}
              className="text-xs text-yellow-300 underline"
            >
              Change
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { navigateTo('shopping'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-blue-700/60 rounded text-xs font-medium text-left"
            >
              <Grid className="w-4 h-4 text-yellow-300" />
              <span>Shop Shoes</span>
            </button>
            <button
              onClick={() => { setIsAiChatOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-yellow-400 text-blue-950 rounded text-xs font-bold text-left"
            >
              <Bot className="w-4 h-4" />
              <span>AI Chatbot</span>
            </button>
            <button
              onClick={() => { navigateTo('orders'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-blue-700/60 rounded text-xs font-medium text-left"
            >
              <Receipt className="w-4 h-4 text-emerald-300" />
              <span>Orders & Payments</span>
            </button>
            <button
              onClick={() => { navigateTo('checkout'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-blue-700/60 rounded text-xs font-medium text-left"
            >
              <Lock className="w-4 h-4 text-purple-300" />
              <span>Checkout Page</span>
            </button>
            <button
              onClick={() => { navigateTo('admin'); setIsAdminMode(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-slate-900 text-white rounded text-xs font-bold text-left"
            >
              <SlidersHorizontal className="w-4 h-4 text-yellow-300" />
              <span>Admin Dashboard</span>
            </button>
            <button
              onClick={() => { navigateTo('admin-orders'); setIsAdminMode(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2 bg-slate-900 text-white rounded text-xs font-bold text-left"
            >
              <Package className="w-4 h-4 text-green-300" />
              <span>Order Management</span>
            </button>
          </div>
        </div>
      )}

      {/* Pincode Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-lg p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Select Delivery Location
              </h3>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your 6-digit Indian PIN code to view accurate stock and express delivery dates.
            </p>
            <form onSubmit={handlePincodeSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 560034"
                  className="flex-1 border rounded px-3 py-2 text-sm font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#2874f0] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700"
                >
                  Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
