export type ShoeCategory = 
  | 'All' 
  | 'Sneakers' 
  | 'Running' 
  | 'Sports' 
  | 'Formal' 
  | 'Casual' 
  | 'Boots' 
  | 'High-Tops';

export interface ShoeSizeStock {
  size: number; // UK size 6 to 11
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ShoeCategory;
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  reviewCount: number;
  isAssured: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  images: string[];
  sizes: ShoeSizeStock[];
  colors: string[];
  description: string;
  highlights: string[];
  specifications: {
    soleMaterial: string;
    upperMaterial: string;
    fastening: string;
    weight: string;
    cushioning: string;
    origin: string;
    warranty: string;
    care: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
  fit: 'Runs Small' | 'True to Size' | 'Runs Large';
  comfortRating: number;
  durabilityRating: number;
  userVotedHelpful?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
  addedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  locality: string;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string;
  type: 'Home' | 'Work';
}

export type OrderStatus = 
  | 'CONFIRMED' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED'
  | 'RETURN_REQUESTED';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  items: {
    product: Product;
    size: number;
    color: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentDetails: {
    method: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'WALLET';
    status: 'PAID' | 'PENDING' | 'REFUNDED';
    transactionId: string;
    cardLast4?: string;
    upiId?: string;
    bankName?: string;
  };
  pricing: {
    totalMRP: number;
    discountOnMRP: number;
    couponDiscount: number;
    deliveryFee: number;
    totalAmount: number;
    superCoinsEarned: number;
  };
  couponApplied?: string;
  status: OrderStatus;
  trackingTimeline: TrackingStep[];
  courierPartner: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  cancelReason?: string;
  returnReason?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrder: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  activeInventoryCount: number;
  dailySales: { date: string; amount: number; orders: number }[];
  categoryShare: { category: string; sales: number; count: number; percentage: number }[];
  topProducts: {
    id: string;
    name: string;
    brand: string;
    unitsSold: number;
    revenue: number;
    image: string;
    stockRemaining: number;
  }[];
  lowStockItems: {
    id: string;
    name: string;
    brand: string;
    size: number;
    stock: number;
    image: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  recommendedShoeIds?: string[];
}
