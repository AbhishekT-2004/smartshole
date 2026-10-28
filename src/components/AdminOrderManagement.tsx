import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw, 
  MapPin, 
  User, 
  CreditCard, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

interface AdminOrderManagementProps {
  onBackToDashboard: () => void;
}

export const AdminOrderManagement: React.FC<AdminOrderManagementProps> = ({ onBackToDashboard }) => {
  const { showToast } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus, locationDetail?: string) => {
    const updated = await api.updateOrderStatus(orderId, status, locationDetail);
    if (updated) {
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order ${orderId} updated to ${status}. Customer tracking synced!`);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q) ||
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.phone.includes(q) ||
      o.items.some(i => i.product.name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  // KPI calculations
  const totalOrders = orders.length;
  const confirmedCount = orders.filter(o => o.status === 'CONFIRMED').length;
  const inTransitCount = orders.filter(o => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              ADMIN FULFILLMENT
            </span>
            <span className="text-xs text-slate-400 font-mono">Ekart Logistics Orchestrator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Order Management & Dispatch Control
          </h1>
          <p className="text-xs text-slate-400">
            Real-time fulfillment tracking, carrier dispatch milestones, and order lifecycle management.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-xs font-bold border border-white/20 transition-colors self-start md:self-auto cursor-pointer"
        >
          &larr; Sales Analytics Dashboard
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">Total Orders Placed</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">{totalOrders}</p>
          <span className="text-[11px] text-blue-600 font-medium">100% Verified Telemetry</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-amber-600 font-semibold block">Pending Dispatch</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-700 font-mono">{confirmedCount}</p>
          <span className="text-[11px] text-slate-500">Ready at Hosur Center</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-blue-600 font-semibold block">In Transit (Ekart)</span>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-700 font-mono">{inTransitCount}</p>
          <span className="text-[11px] text-slate-500">Active on delivery routes</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-green-700 font-semibold block">Delivered Successfully</span>
          <p className="text-xl sm:text-2xl font-extrabold text-green-700 font-mono">{deliveredCount}</p>
          <span className="text-[11px] text-green-700 font-medium">With OTP verification</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="font-bold text-slate-700 hidden sm:inline mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'CONFIRMED', label: '1. Confirmed' },
            { id: 'SHIPPED', label: '2. Shipped' },
            { id: 'OUT_FOR_DELIVERY', label: '3. Out For Delivery' },
            { id: 'DELIVERED', label: '4. Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#2874f0] text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order ID, Name, Phone..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            onClick={loadOrders}
            className="p-1.5 border rounded hover:bg-slate-50 text-slate-600"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-3.5">Order & Ekart Tracking</th>
                <th className="p-3.5">Customer & Delivery Location</th>
                <th className="p-3.5">Footwear Items & Sizes</th>
                <th className="p-3.5">Amount & Payment</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No orders match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    
                    {/* Order ID & Tracking */}
                    <td className="p-3.5 space-y-0.5">
                      <span className="font-mono font-bold text-slate-900 block">{o.id}</span>
                      <span className="font-mono text-[10px] text-blue-600 block">{o.trackingNumber}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-bold text-slate-800">{o.shippingAddress.fullName}</p>
                      <p className="text-slate-500 text-[11px] max-w-xs truncate">
                        {o.shippingAddress.addressLine}, {o.shippingAddress.city} - {o.shippingAddress.pincode}
                      </p>
                      <p className="text-slate-400 text-[10px]">Mob: {o.shippingAddress.phone}</p>
                    </td>

                    {/* Footwear Items */}
                    <td className="p-3.5 space-y-1">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img src={it.product.images[0]} alt="" className="w-7 h-7 object-cover rounded bg-slate-100 border border-slate-200" />
                          <span className="font-semibold text-slate-800 truncate max-w-xs">
                            {it.product.name} (UK {it.size}) × {it.quantity}
                          </span>
                        </div>
                      ))}
                    </td>

                    {/* Amount */}
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        ₹{o.pricing.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">
                        {o.paymentDetails.method} • {o.paymentDetails.status}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
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
                        <option value="SHIPPED">2. Shipped</option>
                        <option value="OUT_FOR_DELIVERY">3. Out For Delivery</option>
                        <option value="DELIVERED">4. Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    {/* Quick 1-click status forwarder */}
                    <td className="p-3.5 text-right">
                      {o.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'SHIPPED', 'Ekart National Hub Hosur')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs whitespace-nowrap"
                        >
                          Dispatch Ekart &rarr;
                        </button>
                      )}
                      {o.status === 'SHIPPED' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'OUT_FOR_DELIVERY', 'Local Station with Agent')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs whitespace-nowrap"
                        >
                          Out For Delivery &rarr;
                        </button>
                      )}
                      {o.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={() => handleUpdateStatus(o.id, 'DELIVERED', 'Doorstep OTP Verified')}
                          className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-xs whitespace-nowrap"
                        >
                          Mark Delivered &check;
                        </button>
                      )}
                      {o.status === 'DELIVERED' && (
                        <span className="text-green-700 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete
                        </span>
                      )}
                      {o.status === 'CANCELLED' && (
                        <span className="text-red-600 font-bold text-[11px]">
                          Cancelled
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
