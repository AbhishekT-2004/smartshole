import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  RotateCcw, 
  ExternalLink, 
  ChevronRight, 
  X, 
  Printer, 
  ShieldCheck, 
  Search,
  CreditCard,
  QrCode,
  DollarSign,
  Receipt,
  Download,
  Check,
  RefreshCw,
  Building2,
  Banknote
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

interface OrderAndPaymentHistoryProps {
  initialOrderId?: string | null;
  onSelectProduct: (id: string) => void;
  onContinueShopping: () => void;
}

export const OrderAndPaymentHistory: React.FC<OrderAndPaymentHistoryProps> = ({
  initialOrderId,
  onSelectProduct,
  onContinueShopping
}) => {
  const { showToast } = useShop();

  const [activeTab, setActiveTab] = useState<'shipments' | 'payments'>('shipments');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel order modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size by mistake');

  // Return order modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size is too tight, need exchange');

  // Invoice modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await api.getOrders();
    setOrders(data);
    if (initialOrderId) {
      const match = data.find(o => o.id === initialOrderId || o.trackingNumber === initialOrderId);
      if (match) setSelectedOrder(match);
      else if (data.length > 0) setSelectedOrder(data[0]);
    } else if (data.length > 0 && !selectedOrder) {
      setSelectedOrder(data[0]);
    }
    setLoading(false);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    const updated = await api.cancelOrder(selectedOrder.id, cancelReason);
    if (updated) {
      setSelectedOrder(updated);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setIsCancelModalOpen(false);
      showToast('Order cancelled. Full refund initiated to original payment source.');
    }
  };

  const handleReturnOrder = async () => {
    if (!selectedOrder) return;
    const updated = await api.updateOrderStatus(selectedOrder.id, 'RETURN_REQUESTED', `Return requested: ${returnReason}`);
    if (updated) {
      setSelectedOrder(updated);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setIsReturnModalOpen(false);
      showToast('Return pickup scheduled via Ekart Logistics.');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.paymentDetails.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.items.some(i => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const order = selectedOrder || orders[0];

  // Financial aggregates
  const totalSpent = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + o.pricing.totalAmount, 0);
  const activeDeliveries = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header with Title and Financial Highlights */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
              Customer Account
            </span>
            <span className="text-xs text-slate-500 font-medium">Ekart Telemetry & Gateway Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Order & Payment History
          </h1>
          <p className="text-xs text-slate-500">
            Track live footwear shipments, download GST tax receipts, and view detailed payment transaction logs.
          </p>
        </div>

        {/* Aggregate KPI counters */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Total Spent</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg text-center">
            <span className="text-[10px] text-blue-600 block font-semibold">Active Shipments</span>
            <span className="text-sm font-extrabold text-blue-900 font-mono">
              {activeDeliveries} In Transit
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('shipments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shipments'
                ? 'bg-[#2874f0] text-white shadow'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Orders & Shipment Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-[#2874f0] text-white shadow'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Payment Transaction History ({orders.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Tracking or Shoe..."
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* TAB 1: SHIPMENTS & LIVE TRACKING */}
      {activeTab === 'shipments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Order Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Orders History ({filteredOrders.length})
            </h3>

            <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
              {filteredOrders.map((o) => {
                const isSelected = order?.id === o.id;
                const firstItem = o.items[0];
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`p-3.5 bg-white rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#2874f0] ring-1 ring-blue-500 shadow-md bg-blue-50/20' 
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={firstItem.product.images[0]}
                        alt={firstItem.product.name}
                        className="w-14 h-14 object-cover rounded bg-slate-50 border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500">{o.id}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            o.status === 'DELIVERED' 
                              ? 'bg-green-100 text-green-800' 
                              : o.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900 truncate mt-1">
                          {firstItem.product.name}
                        </p>

                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-slate-500">
                            {o.items.length > 1 ? `+${o.items.length - 1} more items` : `Size UK ${firstItem.size}`}
                          </span>
                          <span className="font-bold text-slate-800">
                            ₹{o.pricing.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Tracking Card & Timeline (8 cols) */}
          {order && (
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-6">
                
                {/* Order Header Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{order.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">Ekart Tracking: <strong className="font-mono text-blue-600">{order.trackingNumber}</strong></span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Courier: <strong>{order.courierPartner}</strong> • Estimated Delivery: <strong className="text-green-700">{order.estimatedDeliveryDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setInvoiceOrder(order);
                        setIsInvoiceOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tax Invoice</span>
                    </button>

                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'RETURN_REQUESTED' && (
                      <button
                        onClick={() => setIsCancelModalOpen(true)}
                        className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <button
                        onClick={() => setIsReturnModalOpen(true)}
                        className="px-3 py-1.5 border border-amber-300 hover:bg-amber-50 text-amber-700 rounded text-xs font-semibold"
                      >
                        Return / Exchange
                      </button>
                    )}
                  </div>
                </div>

                {/* VISUAL MILESTONE TRACKER */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                    
                    {['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((stage, idx) => {
                      const stages = ['CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                      const currentIdx = stages.indexOf(order.status);
                      const isCompleted = order.status !== 'CANCELLED' && currentIdx >= idx;
                      const isCurrent = order.status === stage;

                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-600 border-2 border-red-500'
                              : isCompleted 
                              ? 'bg-green-600 text-white shadow-md' 
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-green-200 delivery-pulse' : ''}`}>
                            {order.status === 'CANCELLED' ? (
                              <X className="w-4 h-4" />
                            ) : isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                            isCompleted ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {stage === 'CONFIRMED' ? 'Confirmed' : stage === 'SHIPPED' ? 'Shipped' : stage === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Delivered'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Log */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Dispatch Activity Log
                  </h4>

                  <div className="space-y-4 pl-2">
                    {order.trackingTimeline.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        {i < order.trackingTimeline.length - 1 && (
                          <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-200" />
                        )}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${
                          step.completed ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{step.title}</span>
                            <span className="text-slate-400 text-[11px]">{step.date} {step.time}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{step.description}</p>
                          {step.location && (
                            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{step.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Items in This Order ({order.items.length})
                  </h4>

                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                        <div 
                          onClick={() => onSelectProduct(item.product.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded bg-slate-50 border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-xs text-slate-900 group-hover:text-blue-600">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              UK {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-xs text-slate-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT TRANSACTION HISTORY */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Payment Transaction Ledger</h3>
              <p className="text-xs text-slate-500">
                Itemized transaction records for all online and cash-on-delivery orders
              </p>
            </div>
            <button
              onClick={loadOrders}
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
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Payment Status</th>
                  <th className="p-3 text-right">GST Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {o.paymentDetails.transactionId || `TXN-${o.id}`}
                    </td>

                    <td className="p-3 font-mono text-blue-600">
                      {o.id}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        {o.paymentDetails.method === 'UPI' && <QrCode className="w-3.5 h-3.5 text-emerald-600" />}
                        {o.paymentDetails.method === 'CARD' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        {o.paymentDetails.method === 'NETBANKING' && <Building2 className="w-3.5 h-3.5 text-indigo-600" />}
                        {o.paymentDetails.method === 'COD' && <Banknote className="w-3.5 h-3.5 text-emerald-700" />}
                        <span>{o.paymentDetails.method}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {o.paymentDetails.cardLast4 ? `Card ending ${o.paymentDetails.cardLast4}` : o.paymentDetails.upiId || 'Verified'}
                      </span>
                    </td>

                    <td className="p-3 text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      ₹{o.pricing.totalAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.paymentDetails.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : o.paymentDetails.status === 'REFUNDED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.paymentDetails.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setInvoiceOrder(o);
                          setIsInvoiceOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {isCancelModalOpen && order && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Cancel Shipment</h3>
              <button onClick={() => setIsCancelModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-600">
              Confirm cancellation for <strong>{order.id}</strong>. A refund will be credited back automatically.
            </p>
            <div className="space-y-1.5">
              {[
                'Ordered wrong size by mistake',
                'Found cheaper price on another store',
                'Delivery date taking too long',
                'Changed mind'
              ].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelOption"
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 py-2 border rounded font-bold">
                Keep Order
              </button>
              <button onClick={handleCancelOrder} className="flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {isReturnModalOpen && order && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Request Return / Size Exchange</h3>
              <button onClick={() => setIsReturnModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-slate-600">
              Free 7-Day Doorstep Replacement: An Ekart representative will verify shoe condition in the brand box.
            </p>
            <div className="space-y-1.5">
              {[
                'Size too tight, need larger UK size',
                'Size too loose, need smaller UK size',
                'Defective stitching or manufacturing flaw'
              ].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="returnOption"
                    checked={returnReason === r}
                    onChange={() => setReturnReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsReturnModalOpen(false)} className="flex-1 py-2 border rounded font-bold">
                Cancel
              </button>
              <button onClick={handleReturnOrder} className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold hover:bg-blue-700">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {isInvoiceOpen && invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs my-auto print:p-0">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black italic text-[#2874f0]">
                  Smart<span className="text-[#ffe500]">Sole</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">| GST Tax Receipt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 border rounded hover:bg-slate-50 flex items-center gap-1 font-semibold text-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setIsInvoiceOpen(false)} className="p-1 hover:text-slate-800">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-800">Merchant:</p>
                  <p className="text-slate-600">SmartSole Footwear Platform Pvt Ltd</p>
                  <p className="text-slate-500">GSTIN: 29AABCU9603R1ZM</p>
                  <p className="text-slate-500">Koramangala, Bengaluru 560034</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Customer Details:</p>
                  <p className="text-slate-700 font-medium">{invoiceOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-500">{invoiceOrder.shippingAddress.addressLine}</p>
                  <p className="text-slate-500">{invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state} - {invoiceOrder.shippingAddress.pincode}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2">Size</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceOrder.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{it.product.name}</td>
                        <td className="p-2">UK {it.size}</td>
                        <td className="p-2 text-right">{it.quantity}</td>
                        <td className="p-2 text-right font-mono">₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
                <span className="font-bold text-slate-700">Total Paid (Inclusive of GST):</span>
                <span className="text-sm font-extrabold text-[#2874f0] font-mono">
                  ₹{invoiceOrder.pricing.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center border-t pt-2">
              Transaction ID: {invoiceOrder.paymentDetails.transactionId || invoiceOrder.id} • SmartSole AI Platform
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
