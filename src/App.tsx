import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop, AppView } from './context/ShopContext';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { PromoCarousel } from './components/PromoCarousel';
import { ProductCatalog } from './components/ProductCatalog';
import { ShoppingPage } from './components/ShoppingPage';
import { ProductDetail } from './components/ProductDetail';
import { CartView } from './components/CartView';
import { CheckoutPage } from './components/CheckoutPage';
import { WishlistView } from './components/WishlistView';
import { OrderAndPaymentHistory } from './components/OrderAndPaymentHistory';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminOrderManagement } from './components/AdminOrderManagement';
import { SmartSoleChatbot } from './components/SmartSoleChatbot';
import { Footer } from './components/Footer';
import { Product, ShoeCategory } from './types';
import { api } from './services/api';
import { 
  Home, 
  Grid, 
  Heart, 
  Package, 
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Bot,
  Receipt,
  Lock
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    currentView, 
    selectedProductId, 
    selectedOrderId, 
    navigateTo, 
    cart, 
    wishlist, 
    isAdminMode, 
    setIsAdminMode,
    setIsAiChatOpen,
    toastMessage 
  } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSelectCategory = (cat: ShoeCategory) => {
    setSelectedCategory(cat);
    if (currentView !== 'home' && currentView !== 'shopping') {
      navigateTo('shopping');
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4] text-slate-900 pb-16 sm:pb-0">
      
      {/* SmartSole Main Navigation Header */}
      <Header
        onSearch={(q) => {
          setSearchQuery(q);
          if (currentView !== 'shopping' && currentView !== 'home') {
            navigateTo('shopping');
          }
        }}
        searchQuery={searchQuery}
        products={products}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            {!searchQuery && selectedCategory === 'All' && (
              <PromoCarousel onSelectCategory={handleSelectCategory} />
            )}
            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onSelectProduct={(id) => navigateTo('product-detail', id)}
              searchQuery={searchQuery}
            />
          </>
        )}

        {/* VIEW 2: DEDICATED SHOPPING PAGE */}
        {currentView === 'shopping' && (
          <ShoppingPage
            products={products}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
          />
        )}

        {/* VIEW 3: DEDICATED PRODUCT DETAIL PAGE (PDP) */}
        {currentView === 'product-detail' && selectedProductId && (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => navigateTo('shopping')}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
            allProducts={products}
          />
        )}

        {/* VIEW 4: CART VIEW */}
        {currentView === 'cart' && (
          <CartView
            onContinueShopping={() => navigateTo('shopping')}
            onViewOrder={(orderId) => navigateTo('orders', orderId)}
          />
        )}

        {/* VIEW 5: DEDICATED CHECKOUT PAGE */}
        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => navigateTo('cart')}
            onOrderSuccess={(order) => navigateTo('orders', order.id)}
          />
        )}

        {/* VIEW 6: WISHLIST PAGE */}
        {currentView === 'wishlist' && (
          <WishlistView
            products={products}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
            onContinueShopping={() => navigateTo('shopping')}
          />
        )}

        {/* VIEW 7: DEDICATED ORDER & PAYMENT HISTORY PAGE */}
        {(currentView === 'orders' || currentView === 'order-detail') && (
          <OrderAndPaymentHistory
            initialOrderId={selectedOrderId}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
            onContinueShopping={() => navigateTo('shopping')}
          />
        )}

        {/* VIEW 8: DEDICATED ADMIN DASHBOARD & SALES ANALYTICS */}
        {currentView === 'admin' && (
          <AdminDashboard
            products={products}
            onRefreshProducts={loadProducts}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
          />
        )}

        {/* VIEW 9: DEDICATED ADMIN ORDER MANAGEMENT PAGE */}
        {currentView === 'admin-orders' && (
          <AdminOrderManagement
            onBackToDashboard={() => navigateTo('admin')}
          />
        )}
      </main>

      {/* Global SmartSole AI Chatbot Stylist */}
      <SmartSoleChatbot
        products={products}
        onSelectProduct={(id) => navigateTo('product-detail', id)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={() => {
          setIsAdminMode(true);
          navigateTo('admin');
        }}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around z-40 shadow-lg">
        <button
          onClick={() => {
            setIsAdminMode(false);
            navigateTo('home');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-colors ${
            currentView === 'home' && !isAdminMode ? 'text-[#2874f0]' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setIsAdminMode(false);
            navigateTo('shopping');
          }}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-colors ${
            currentView === 'shopping' ? 'text-[#2874f0]' : 'text-slate-500'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setIsAiChatOpen(true)}
          className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-amber-600 transition-colors"
        >
          <Bot className="w-4 h-4 text-blue-600" />
          <span>AI Chat</span>
        </button>

        <button
          onClick={() => navigateTo('orders')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold transition-colors ${
            currentView === 'orders' || currentView === 'order-detail' ? 'text-[#2874f0]' : 'text-slate-500'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => navigateTo('cart')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-semibold relative transition-colors ${
            currentView === 'cart' || currentView === 'checkout' ? 'text-[#2874f0]' : 'text-slate-500'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-2 bg-yellow-400 text-blue-900 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 sm:left-6 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-lg shadow-2xl z-50 text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
