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
  Star
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

interface OrderTrackingViewProps {
  initialOrderId?: string | null;
  onSelectProduct: (id: string) => void;
  onContinueShopping: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ 
  initialOrderId,
  onSelectProduct,
  onContinueShopping 
}) => {
  const { showToast } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Cancel order modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size by mistake');

  // Return order modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size is too tight, need exchange');

  // Invoice modal
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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
      showToast('Order cancelled. Refund initiated to original payment source.');
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
    o.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    o.trackingNumber.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
    o.items.some(i => i.product.name.toLowerCase().includes(searchOrderQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Retrieving Ekart shipment telemetry...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">No Orders Found Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't placed any shoe orders yet. Explore our footwear collection and place your first order!
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-[#2874f0] text-white px-8 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const order = selectedOrder || orders[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            My Orders & Live Shipment Tracking
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status updates powered by Flipkart Ekart Logistics
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchOrderQuery}
            onChange={(e) => setSearchOrderQuery(e.target.value)}
            placeholder="Search Order ID, Tracking or Shoe..."
            className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left Column: Orders List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Past Orders ({filteredOrders.length})
          </h3>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filteredOrders.map((o) => {
              const isSelected = order.id === o.id;
              const firstItem = o.items[0];
              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`p-3.5 bg-white rounded border cursor-pointer transition-all ${
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

        {/* Right Column: Live Tracking Card & Timeline (8 Cols) */}
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

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold text-slate-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Invoice</span>
                </button>

                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'RETURN_REQUESTED' && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded text-xs font-semibold transition-colors"
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <button
                    onClick={() => setIsReturnModalOpen(true)}
                    className="px-3 py-1.5 border border-amber-300 hover:bg-amber-50 text-amber-700 rounded text-xs font-semibold transition-colors"
                  >
                    Return / Exchange
                  </button>
                )}
              </div>
            </div>

            {/* VISUAL FLIPKART TRACKER PROGRESS BAR */}
            <div className="py-2">
              <div className="relative flex items-center justify-between">
                {/* Horizontal line track */}
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

              {order.status === 'CANCELLED' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>This order was cancelled: {order.cancelReason || 'Customer requested'}. Refund issued.</span>
                </div>
              )}
            </div>

            {/* Detailed Tracking Events Timeline */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Activity Log
              </h4>

              <div className="space-y-4 pl-2">
                {order.trackingTimeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {/* Line connector */}
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

            {/* Ordered Shoes Breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Items in This Shipment ({order.items.length})
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
                        <p className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
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

            {/* Shipping & Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Delivery Address</span>
                <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
                <p className="text-slate-600">
                  {order.shippingAddress.addressLine}, {order.shippingAddress.locality}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                </p>
                <p className="text-slate-500">Phone: {order.shippingAddress.phone}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Payment Summary</span>
                <p className="text-slate-600">Method: <strong className="text-slate-800">{order.paymentDetails.method}</strong></p>
                <p className="text-slate-600">Status: <strong className="text-green-700">{order.paymentDetails.status}</strong></p>
                <p className="text-slate-600">Transaction ID: <span className="font-mono text-slate-700">{order.paymentDetails.transactionId}</span></p>
                <p className="font-bold text-slate-900 text-sm pt-1">Total Paid: ₹{order.pricing.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CANCEL ORDER MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Cancel Shipment</h3>
              <button onClick={() => setIsCancelModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600">
              Are you sure you want to cancel order <strong>{order.id}</strong>? If already dispatched, the delivery will be recalled.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Reason for Cancellation:</label>
              {[
                'Ordered wrong size by mistake',
                'Found cheaper price on another store',
                'Delivery date is taking too long',
                'Changed mind / no longer needed'
              ].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={cancelReason === r}
                    onChange={() => setCancelReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2 border rounded font-semibold text-slate-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN ORDER MODAL */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900">Request Return / Size Exchange</h3>
              <button onClick={() => setIsReturnModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-slate-600">
              Flipkart 7-Day Hassle-Free Replacement: Our Ekart agent will inspect shoes in brand box at your doorstep.
            </p>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Reason for Exchange:</label>
              {[
                'Size is too tight, need larger UK size',
                'Size is too loose, need smaller UK size',
                'Defective stitching or manufacturing fault',
                'Received different color from ordered'
              ].map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="returnReason"
                    checked={returnReason === r}
                    onChange={() => setReturnReason(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="flex-1 py-2 border rounded font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnOrder}
                className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE GST TAX INVOICE MODAL */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs print:p-0 my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black italic text-[#2874f0]">
                  Sole<span className="text-[#ffe500]">Kart</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">| Tax Invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 border rounded hover:bg-slate-50 flex items-center gap-1 font-semibold text-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button onClick={() => setIsInvoiceOpen(false)} className="p-1 hover:text-slate-800">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-slate-800">Sold By:</p>
                  <p className="text-slate-600">SoleKart KickAssure Retail Pvt Ltd</p>
                  <p className="text-slate-500">GSTIN: 29AABCU9603R1ZM</p>
                  <p className="text-slate-500">Hosur Road, Bengaluru 560068</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">Billing & Shipping Details:</p>
                  <p className="text-slate-700 font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-slate-500">{order.shippingAddress.addressLine}</p>
                  <p className="text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">HSN</th>
                      <th className="p-2">Size</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{it.product.name}</td>
                        <td className="p-2 text-slate-400">640411</td>
                        <td className="p-2">UK {it.size}</td>
                        <td className="p-2 text-right">{it.quantity}</td>
                        <td className="p-2 text-right font-mono">₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
                <span className="font-bold text-slate-700">Total Tax Invoice Amount (Incl. GST 18%):</span>
                <span className="text-sm font-extrabold text-[#2874f0] font-mono">
                  ₹{order.pricing.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center border-t pt-2">
              This is a computer-generated tax invoice for College Project Demonstration. Certified KickAssure Original.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
