import { Product, Review, Order, SalesAnalytics, Coupon, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS, AVAILABLE_COUPONS } from '../data/initialData';

// Storage keys for client-side persistence fallback
const STORAGE_KEYS = {
  CART: 'solekart_cart_items',
  WISHLIST: 'solekart_wishlist_ids',
  ADDRESSES: 'solekart_saved_addresses',
  USER: 'solekart_current_user',
  SUPERCOINS: 'solekart_supercoins'
};

export const api = {
  // --- Products ---
  async getProducts(params?: {
    category?: string;
    brand?: string;
    query?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    try {
      const url = new URL('/api/products', window.location.origin);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            url.searchParams.append(k, String(v));
          }
        });
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) return json.data;
      }
    } catch (e) {
      console.warn('API call failed, falling back to local dataset:', e);
    }

    // Client-side fallback
    let items = [...INITIAL_PRODUCTS];
    if (params) {
      if (params.category && params.category !== 'All') {
        items = items.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params.brand && params.brand !== 'All') {
        items = items.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
      }
      if (params.gender && params.gender !== 'All') {
        items = items.filter(p => p.gender === params.gender || p.gender === 'Unisex');
      }
      if (params.minPrice) items = items.filter(p => p.price >= params.minPrice!);
      if (params.maxPrice) items = items.filter(p => p.price <= params.maxPrice!);
      if (params.query) {
        const q = params.query.toLowerCase().trim();
        items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }
      if (params.sort === 'price_asc') items.sort((a, b) => a.price - b.price);
      if (params.sort === 'price_desc') items.sort((a, b) => b.price - a.price);
      if (params.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    }
    return items;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch product by id:', e);
    }
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to create product via API:', e);
    }
    const mock: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return mock;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to update product via API:', e);
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // --- Reviews ---
  async getReviews(productId: string): Promise<Review[]> {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch reviews:', e);
    }
    return INITIAL_REVIEWS.filter(r => r.productId === productId);
  },

  async submitReview(reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Promise<Review> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to submit review via API:', e);
    }
    const mock: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      helpfulCount: 0
    };
    return mock;
  },

  async voteHelpful(reviewId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, { method: 'POST' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    }
    const saved = localStorage.getItem('solekart_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch order by id:', e);
    }
    const orders = await this.getOrders();
    return orders.find(o => o.id === id || o.trackingNumber === id) || null;
  },

  async placeOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to place order via API:', e);
    }

    // Fallback order generator
    const newOrder: Order = {
      id: `OD-${Date.now().toString().slice(-10)}`,
      trackingNumber: `EKART-${Math.floor(100000000 + Math.random() * 900000000)}`,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentDetails: orderData.paymentDetails,
      pricing: orderData.pricing,
      couponApplied: orderData.couponApplied,
      status: 'CONFIRMED',
      courierPartner: 'Ekart Logistics Express',
      estimatedDeliveryDate: 'Within 3 Days',
      createdAt: new Date().toISOString(),
      trackingTimeline: [
        {
          status: 'CONFIRMED',
          title: 'Order Confirmed',
          description: 'Payment authorized and verified.',
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
          location: 'Bengaluru Fulfillment Center'
        }
      ]
    };
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus, location?: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, location })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to update order status via API:', e);
    }
    return null;
  },

  async cancelOrder(id: string, reason: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to cancel order via API:', e);
    }
    return null;
  },

  // --- Analytics ---
  async getAnalytics(): Promise<SalesAnalytics> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch analytics:', e);
    }
    return {
      totalRevenue: 489200,
      totalOrders: 64,
      totalUnitsSold: 88,
      averageOrderValue: 7640,
      activeInventoryCount: 340,
      dailySales: [
        { date: 'Mon', amount: 28400, orders: 4 },
        { date: 'Tue', amount: 34990, orders: 5 },
        { date: 'Wed', amount: 48900, orders: 7 },
        { date: 'Thu', amount: 52400, orders: 8 },
        { date: 'Fri', amount: 69800, orders: 11 },
        { date: 'Sat', amount: 92400, orders: 14 },
        { date: 'Sun', amount: 84600, orders: 12 }
      ],
      categoryShare: [
        { category: 'Sneakers', sales: 245000, count: 42, percentage: 50 },
        { category: 'Running', sales: 120000, count: 22, percentage: 25 },
        { category: 'Sports', sales: 65000, count: 12, percentage: 13 },
        { category: 'Casual', sales: 38000, count: 8, percentage: 8 },
        { category: 'Boots', sales: 21200, count: 4, percentage: 4 }
      ],
      topProducts: [],
      lowStockItems: []
    };
  },

  // --- Coupons ---
  async getCoupons(): Promise<Coupon[]> {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch coupons:', e);
    }
    return AVAILABLE_COUPONS;
  },

  // --- Pincode Deliverability Check ---
  async checkPincode(pincode: string): Promise<any> {
    try {
      const res = await fetch('/api/pincode/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode })
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        serviceable: true,
        deliveryDays: 3,
        estimatedDate: 'Within 3 Days',
        message: 'Delivery Available | FREE Delivery with Flipkart KickAssure'
      };
    }
  },

  // --- SmartSole AI Chatbot ---
  async askAiChatbot(message: string, conversationHistory: { role: string; content: string }[] = []): Promise<{
    reply: string;
    suggestedActions?: string[];
    recommendedShoeIds?: string[];
  }> {
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory })
      });
      if (res.ok) {
        const json = await res.json();
        return {
          reply: json.reply,
          suggestedActions: json.suggestedActions || [],
          recommendedShoeIds: json.recommendedShoeIds || []
        };
      }
    } catch (e) {
      console.warn('AI Chat API failed:', e);
    }
    return {
      reply: "Welcome to SmartSole! I'm your AI Footwear Stylist. Try asking about running shoes, sneakers for college, or checking active discount codes like COLLEGE2026!",
      suggestedActions: ['Best sneakers', 'Running shoes', 'Check coupons'],
      recommendedShoeIds: ['prod-nike-air-jordan-1', 'prod-adidas-ultraboost-light']
    };
  }
};

