import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  ShoppingBag, 
  Search, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Product, Order, SalesAnalytics, OrderStatus, ShoeCategory } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

interface AdminDashboardProps {
  products: Product[];
  onRefreshProducts: () => void;
  onSelectProduct: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  onRefreshProducts,
  onSelectProduct
}) => {
  const { showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters in Inventory
  const [inventorySearch, setInventorySearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');

  // Edit Stock Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState(0);
  const [editSizesStock, setEditSizesStock] = useState<{ size: number; stock: number }[]>([]);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newShoe, setNewShoe] = useState({
    name: '',
    brand: 'Nike',
    category: 'Sneakers' as ShoeCategory,
    gender: 'Men' as 'Men' | 'Women' | 'Unisex',
    price: 4999,
    originalPrice: 8999,
    discountPercent: 44,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=85'],
    description: 'High performance college athletic sneaker with responsive foam cushioning.',
    highlights: ['Lightweight breathable knit', 'High grip rubber sole', 'Flipkart KickAssure certified'],
    sizes: [
      { size: 6, stock: 5 },
      { size: 7, stock: 8 },
      { size: 8, stock: 12 },
      { size: 9, stock: 10 },
      { size: 10, stock: 6 },
      { size: 11, stock: 3 }
    ],
    colors: ['Red / White', 'Black / Volt'],
    isAssured: true,
    rating: 4.6,
    ratingCount: 120,
    reviewCount: 35,
    specifications: {
      soleMaterial: 'Rubber Sole',
      upperMaterial: 'Breathable Mesh',
      fastening: 'Laces',
      weight: '320g',
      cushioning: 'Responsive Foam',
      origin: 'India',
      warranty: '6 Months',
      care: 'Wipe with damp cloth'
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [analyticsData, ordersData] = await Promise.all([
      api.getAnalytics(),
      api.getOrders()
    ]);
    setAnalytics(analyticsData);
    setOrders(ordersData);
    setLoading(false);
  };

  // Status changer for admin
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await api.updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order ${orderId} updated to ${newStatus}`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setEditPrice(p.price);
    setEditOriginalPrice(p.originalPrice);
    setEditSizesStock([...p.sizes]);
  };

  // Save Edit Stock & Price
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const discount = Math.round(((editOriginalPrice - editPrice) / editOriginalPrice) * 100);
    const updated = await api.updateProduct(editingProduct.id, {
      price: editPrice,
      originalPrice: editOriginalPrice,
      discountPercent: discount,
      sizes: editSizesStock
    });

    if (updated) {
      onRefreshProducts();
      setEditingProduct(null);
      showToast(`Updated stock and pricing for ${updated.name}`);
    }
  };

  // Delete Shoe
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from inventory?`)) {
      const ok = await api.deleteProduct(id);
      if (ok) {
        onRefreshProducts();
        showToast(`Removed ${name} from catalog`);
      }
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShoe.name || !newShoe.brand) {
      showToast('Please fill all mandatory fields');
      return;
    }
    const discount = Math.round(((newShoe.originalPrice - newShoe.price) / newShoe.originalPrice) * 100);
    await api.createProduct({
      ...newShoe,
      discountPercent: discount
    });
    setIsAddModalOpen(false);
    onRefreshProducts();
    showToast(`Added new shoe "${newShoe.name}" to inventory`);
  };

  // Filtered inventory
  const filteredInventory = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || p.brand.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesBrand = filterBrand === 'All' || p.brand === filterBrand;
    return matchesQuery && matchesBrand;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-slate-400 font-mono">Node.js Express + MongoDB Document DB</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
            SmartSole Merchant & Inventory Command
          </h1>
          <p className="text-xs text-slate-400">
            Real-time fulfillment, live per-size SKU inventory management, and automated sales analytics.
          </p>
        </div>

        {/* Tab Switchers & Dedicated Page Links */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
          {[
            { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
            { id: 'inventory', label: 'Inventory (SKUs)', icon: Package },
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#2874f0] text-white shadow' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SALES ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ₹{analytics ? analytics.totalRevenue.toLocaleString('en-IN') : '4,89,200'}
              </p>
              <span className="text-[11px] text-green-700 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs last week
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {analytics ? analytics.totalOrders : '64'}
              </p>
              <span className="text-[11px] text-blue-600 font-semibold">
                100% Ekart Express Dispatch
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Units Sold</span>
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {analytics ? analytics.totalUnitsSold : '88'} Pairs
              </p>
              <span className="text-[11px] text-purple-600 font-semibold">
                Sneakers leading at 52%
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Warehouse Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {analytics ? analytics.activeInventoryCount : '340'} Units
              </p>
              <span className="text-[11px] text-amber-700 font-semibold">
                Across 12 Shoe Models
              </span>
            </div>
          </div>

          {/* Interactive Weekly Revenue Chart & Category Share */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 7-Day Revenue Bars (8 Cols) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Weekly Revenue & Order Velocity</h3>
                  <p className="text-xs text-slate-500">Daily gross turnover (in INR) across all channels</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded">
                  7-Day Trend
                </span>
              </div>

              {/* Bar visualization */}
              <div className="pt-4 flex items-end justify-between gap-3 h-52 border-b border-slate-200 pb-2">
                {analytics?.dailySales.map((day) => {
                  const maxAmt = 100000;
                  const heightPercent = Math.min(100, Math.max(20, (day.amount / maxAmt) * 100));
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ₹{(day.amount / 1000).toFixed(1)}k
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm group-hover:from-yellow-400 group-hover:to-yellow-300 transition-all cursor-pointer relative shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                          {day.orders} orders
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Share Breakdown (4 Cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Category Share</h3>
                <p className="text-xs text-slate-500">Sales volume proportion by shoe style</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Sneakers (Air Jordan, 9060)', pct: 50, color: 'bg-blue-600' },
                  { name: 'Running (Ultraboost, Nitro)', pct: 25, color: 'bg-emerald-600' },
                  { name: 'Sports (GEL-Kayano)', pct: 13, color: 'bg-amber-500' },
                  { name: 'Casual (Vans, Birkenstock)', pct: 8, color: 'bg-indigo-600' },
                  { name: 'Boots (Woodland Explorer)', pct: 4, color: 'bg-purple-600' }
                ].map(c => (
                  <div key={c.name} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{c.name}</span>
                      <span className="text-slate-900 font-mono">{c.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Top Products Leaderboard */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Top-Selling Footwear Drops</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-3">Shoe</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3 text-right">Units Sold</th>
                    <th className="p-3 text-right">Gross Revenue</th>
                    <th className="p-3 text-right">Warehouse Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics?.topProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200" />
                        <span className="font-semibold text-slate-900">{p.name}</span>
                      </td>
                      <td className="p-3 text-slate-600">{p.brand}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">{p.unitsSold}</td>
                      <td className="p-3 text-right font-mono font-bold text-green-700">₹{p.revenue.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stockRemaining <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {p.stockRemaining} units
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Actions & Filters */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search footwear SKU or brand..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="All">All Brands</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="New Balance">New Balance</option>
                <option value="Converse">Converse</option>
                <option value="Woodland">Woodland</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-[#2874f0] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Shoe Drop</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3">Shoe Details</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price / MRP</th>
                  <th className="p-3">UK Sizes Breakdown (Stock)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((p) => {
                  const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                  const isLowStock = totalStock <= 15 || p.sizes.some(s => s.stock <= 2);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded bg-slate-100 border border-slate-200 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-[10px] text-slate-400 uppercase">{p.brand}</span>
                            <p className="font-semibold text-slate-900 max-w-xs">{p.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-slate-600 font-medium">
                        {p.category}
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 block font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-slate-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.sizes.map((s) => (
                            <span 
                              key={s.size}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                s.stock === 0 
                                  ? 'bg-red-50 text-red-600 border-red-200 line-through'
                                  : s.stock <= 3 
                                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                              title={`Size UK ${s.size}: ${s.stock} in stock`}
                            >
                              UK{s.size}:{s.stock}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          totalStock === 0 
                            ? 'bg-red-100 text-red-700' 
                            : isLowStock 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {totalStock === 0 ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                          title="Edit Stock & Pricing"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                          title="Delete Shoe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Customer Shipments & Status Orchestrator</h3>
              <p className="text-xs text-slate-500">
                Change shipment stage below to simulate real-time Ekart warehouse updates for customer tracking.
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              className="p-1.5 border rounded hover:bg-slate-50 text-slate-600"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3">Order ID & Ekart Tracking</th>
                  <th className="p-3">Customer & Address</th>
                  <th className="p-3">Shoe Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Live Status (Admin Toggle)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 space-y-0.5">
                      <span className="font-mono font-bold text-slate-900">{o.id}</span>
                      <p className="font-mono text-[10px] text-blue-600">{o.trackingNumber}</p>
                      <span className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString('en-GB')}</span>
                    </td>

                    <td className="p-3 space-y-0.5">
                      <p className="font-bold text-slate-800">{o.shippingAddress.fullName}</p>
                      <p className="text-slate-500 text-[11px]">{o.shippingAddress.city}, {o.shippingAddress.state} ({o.shippingAddress.pincode})</p>
                      <p className="text-slate-400 text-[10px]">Mob: {o.shippingAddress.phone}</p>
                    </td>

                    <td className="p-3 space-y-1">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img src={it.product.images[0]} alt="" className="w-6 h-6 object-cover rounded" />
                          <span className="text-slate-800 truncate max-w-xs">{it.product.name} (UK {it.size}) × {it.quantity}</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-3 font-mono font-bold text-slate-900">
                      ₹{o.pricing.totalAmount.toLocaleString('en-IN')}
                      <span className="block text-[10px] font-normal text-slate-500">{o.paymentDetails.method}</span>
                    </td>

                    <td className="p-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded px-2.5 py-1.5 border ${
                          o.status === 'DELIVERED' 
                            ? 'bg-green-50 border-green-300 text-green-800' 
                            : o.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : o.status === 'SHIPPED'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                            : o.status === 'CANCELLED'
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="CONFIRMED">1. Confirmed</option>
                        <option value="SHIPPED">2. Shipped (Ekart)</option>
                        <option value="OUT_FOR_DELIVERY">3. Out For Delivery</option>
                        <option value="DELIVERED">4. Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT PRICE & STOCK MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Edit SKU Stock & Pricing</h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4">
              <div>
                <p className="font-bold text-slate-800">{editingProduct.name}</p>
                <p className="text-slate-500">{editingProduct.brand} • {editingProduct.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseInt(e.target.value, 10))}
                    className="w-full border rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(parseInt(e.target.value, 10))}
                    className="w-full border rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stock per UK Size:</label>
                <div className="grid grid-cols-3 gap-2">
                  {editSizesStock.map((s, idx) => (
                    <div key={s.size} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded border">
                      <span className="font-bold text-slate-600">UK {s.size}:</span>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const copy = [...editSizesStock];
                          copy[idx].stock = val;
                          setEditSizesStock(copy);
                        }}
                        className="w-12 bg-white border rounded px-1.5 py-0.5 text-center font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs my-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-slate-900">Add New Footwear SKU Drop</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Shoe Model Name *</label>
                <input
                  type="text"
                  required
                  value={newShoe.name}
                  onChange={(e) => setNewShoe({ ...newShoe, name: e.target.value })}
                  placeholder="e.g. Air Zoom Pegasus 41 Campus Edition"
                  className="w-full border rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Brand</label>
                  <select
                    value={newShoe.brand}
                    onChange={(e) => setNewShoe({ ...newShoe, brand: e.target.value })}
                    className="w-full border rounded px-2 py-1.5 text-xs"
                  >
                    {['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Woodland', 'Clarks', 'Vans', 'Asics', 'Birkenstock'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Category</label>
                  <select
                    value={newShoe.category}
                    onChange={(e) => setNewShoe({ ...newShoe, category: e.target.value as ShoeCategory })}
                    className="w-full border rounded px-2 py-1.5 text-xs"
                  >
                    {['Sneakers', 'Running', 'Sports', 'Formal', 'Casual', 'Boots', 'High-Tops'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Gender</label>
                  <select
                    value={newShoe.gender}
                    onChange={(e) => setNewShoe({ ...newShoe, gender: e.target.value as any })}
                    className="w-full border rounded px-2 py-1.5 text-xs"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newShoe.price}
                    onChange={(e) => setNewShoe({ ...newShoe, price: parseInt(e.target.value, 10) })}
                    className="w-full border rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Original MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newShoe.originalPrice}
                    onChange={(e) => setNewShoe({ ...newShoe, originalPrice: parseInt(e.target.value, 10) })}
                    className="w-full border rounded px-2.5 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">High-Res Photo URL</label>
                <input
                  type="url"
                  required
                  value={newShoe.images[0]}
                  onChange={(e) => setNewShoe({ ...newShoe, images: [e.target.value] })}
                  className="w-full border rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Description</label>
                <textarea
                  rows={2}
                  value={newShoe.description}
                  onChange={(e) => setNewShoe({ ...newShoe, description: e.target.value })}
                  className="w-full border rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 border rounded font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold hover:bg-blue-700"
                >
                  Add Shoe SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
