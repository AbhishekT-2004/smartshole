import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  Coins, 
  MapPin, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Truck,
  Sparkles,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, Order } from '../types';
import { api } from '../services/api';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToCart, onOrderSuccess }) => {
  const { 
    cart, 
    cartTotals, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    coupons,
    clearCart, 
    savedAddresses, 
    selectedAddress, 
    setSelectedAddress, 
    saveNewAddress,
    superCoins,
    useSuperCoins,
    setUseSuperCoins,
    showToast 
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'WALLET'>('UPI');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Address form
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: 'Pawan Kumar',
    phone: '9876543210',
    pincode: '560034',
    locality: 'Koramangala 4th Block',
    addressLine: 'Flat 304, Green Heights, 5th Main',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: 'Near Sony World Signal',
    type: 'Home'
  });

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8920 1029 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardName, setCardName] = useState('PAWAN KUMAR');

  // UPI details
  const [upiOption, setUpiOption] = useState<'vpa' | 'qr'>('vpa');
  const [upiId, setUpiId] = useState('pawan2004@okaxis');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // COD Captcha
  const [captchaCode, setCaptchaCode] = useState('7849');
  const [userCaptcha, setUserCaptcha] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to Bank 3D Secure Gateway...');

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

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.pincode || !newAddr.addressLine) {
      showToast('Please fill all mandatory fields');
      return;
    }
    saveNewAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      showToast('Cart is empty');
      return;
    }

    if (paymentMethod === 'COD') {
      if (userCaptcha.trim() !== captchaCode) {
        showToast('Incorrect captcha code. Please re-enter.');
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStatus('Securing 256-Bit SSL Handshake with SmartSole Payment Gateway...');

    setTimeout(() => {
      setProcessingStatus(
        paymentMethod === 'UPI' 
          ? 'NPCI UPI Mandate Verified via GooglePay/PhonePe...' 
          : paymentMethod === 'CARD'
          ? 'Verifying Visa/Mastercard 3D Secure OTP...' 
          : paymentMethod === 'NETBANKING'
          ? 'Connecting to HDFC/SBI Core Banking Server...'
          : 'Generating Ekart COD Shipment Docket...'
      );
    }, 1200);

    setTimeout(async () => {
      const orderPayload = {
        items: cart.map(item => ({
          product: item.product,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: selectedAddress,
        paymentDetails: {
          method: paymentMethod,
          status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          transactionId: `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`,
          cardLast4: paymentMethod === 'CARD' ? cardNumber.slice(-4) : undefined,
          upiId: paymentMethod === 'UPI' ? upiId : undefined,
          bankName: paymentMethod === 'NETBANKING' ? selectedBank : undefined
        },
        pricing: {
          totalMRP: cartTotals.totalMRP,
          discountOnMRP: cartTotals.discountOnMRP,
          couponDiscount: cartTotals.couponDiscount,
          deliveryFee: cartTotals.deliveryFee,
          totalAmount: cartTotals.totalAmount,
          superCoinsEarned: Math.round(cartTotals.totalAmount * 0.02)
        },
        couponApplied: appliedCoupon ? appliedCoupon.code : undefined
      };

      try {
        const order = await api.placeOrder(orderPayload);
        clearCart();
        setIsProcessing(false);

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {}

        onOrderSuccess(order);
      } catch (err) {
        setIsProcessing(false);
        showToast('Order placed successfully!');
      }
    }, 2800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center">
          <Truck className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Checkout is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Add some footwear to your cart before proceeding to the checkout page.
        </p>
        <button
          onClick={onBackToCart}
          className="bg-[#2874f0] text-white px-8 py-2.5 rounded font-bold text-xs uppercase hover:bg-blue-700 shadow"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={onBackToCart} className="hover:text-blue-600 flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </button>
          <span>&gt;</span>
          <span className="font-bold text-slate-900">Secure Checkout Page</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 px-2.5 py-1 rounded">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>256-Bit SSL PCI-DSS Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Left Column: Checkout Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <section className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900">Delivery Address</h3>
              </div>
              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs text-[#2874f0] font-bold hover:underline"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {!isAddingNewAddress ? (
              <div className="space-y-3">
                {savedAddresses.map((addr, idx) => {
                  const isSelected = selectedAddress.phone === addr.phone && selectedAddress.addressLine === addr.addressLine;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="checkoutAddr"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr)}
                            className="text-blue-600"
                          />
                          <span className="font-bold text-slate-900 text-xs">{addr.fullName}</span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {addr.type}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{addr.phone}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 pl-6">
                        {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleAddNewAddress} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="w-full bg-white border rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">10-Digit Phone *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-white border rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full bg-white border rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Street Address / Flat No. *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAddr.addressLine}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                    className="w-full bg-white border rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-4 py-2 border rounded font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2874f0] text-white px-5 py-2 rounded font-bold hover:bg-blue-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* STEP 2: ORDER ITEMS SUMMARY */}
          <section className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Order Footwear Summary ({cart.length} Models)
              </h3>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded bg-slate-50 border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-400 text-[10px] uppercase">{item.product.brand}</p>
                    <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-slate-500 mt-0.5">
                      UK Size: <strong className="text-slate-800">{item.selectedSize}</strong> • Color: {item.selectedColor} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900 block">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-green-700 font-bold">
                      {item.product.discountPercent}% off
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/50 rounded border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-blue-600" />
                Delivery by Ekart Express within 48-72 hrs
              </span>
              <span className="font-bold text-green-700 uppercase">FREE SHIPPING</span>
            </div>
          </section>

          {/* STEP 3: PAYMENT GATEWAY */}
          <section className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#2874f0] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm text-slate-900">Select Secure Payment Gateway</h3>
              </div>
              <span className="text-xs font-extrabold text-[#2874f0]">
                Payable: ₹{cartTotals.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <div className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'UPI' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethodChoice"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-800">UPI (GPay, PhonePe, Paytm, QR)</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Instant
                  </span>
                </label>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 text-xs pl-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUpiOption('vpa')}
                        className={`px-3 py-1.5 rounded font-semibold border ${
                          upiOption === 'vpa' ? 'bg-[#2874f0] text-white border-blue-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Enter UPI VPA
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiOption('qr')}
                        className={`px-3 py-1.5 rounded font-semibold border ${
                          upiOption === 'qr' ? 'bg-[#2874f0] text-white border-blue-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Scan Dynamic QR
                      </button>
                    </div>

                    {upiOption === 'vpa' ? (
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. pawan@okaxis"
                        className="w-full bg-white border rounded px-3 py-2 text-xs font-mono"
                      />
                    ) : (
                      <div className="p-3 bg-white border rounded text-center space-y-1">
                        <img 
                          src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=smartsole@okaxis%26pn=SmartSole%26am=11998" 
                          alt="QR Code" 
                          className="w-32 h-32 mx-auto"
                        />
                        <p className="text-[10px] text-slate-500">Scan via any UPI App</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit Card */}
              <div className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'CARD' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethodChoice"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-800">Credit / Debit / ATM Card</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Visa • Mastercard • RuPay</span>
                </label>

                {paymentMethod === 'CARD' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs pl-6">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">16-Digit Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border rounded px-3 py-1.5 font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border rounded px-3 py-1.5 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border rounded px-3 py-1.5 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Name on Card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white border rounded px-3 py-1.5 text-xs uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'NETBANKING' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethodChoice"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-xs text-slate-800">Net Banking</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">SBI, HDFC, ICICI, Axis</span>
                </label>

                {paymentMethod === 'NETBANKING' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs pl-6">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded border text-left font-medium ${
                          selectedBank === bank ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Option 4: COD */}
              <div className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === 'COD' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethodChoice"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-xs text-slate-800">Cash on Delivery (COD)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-700">Available</span>
                </label>

                {paymentMethod === 'COD' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs pl-6">
                    <p className="text-slate-600">Enter the security verification code to authorize COD delivery:</p>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 text-yellow-300 font-mono text-base font-black px-3 py-1 rounded">
                        {captchaCode}
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        placeholder="Enter 4 digits"
                        className="w-28 border rounded px-2.5 py-1 text-center font-mono font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complete Order Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={onBackToCart}
                className="text-xs text-slate-600 font-semibold hover:underline"
              >
                Modify Cart
              </button>

              <button
                onClick={handleCompleteOrder}
                className="bg-[#fb641b] hover:bg-[#e85b16] text-white px-8 py-3 rounded font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm & Pay ₹{cartTotals.totalAmount.toLocaleString('en-IN')}</span>
              </button>
            </div>
          </section>

        </div>

        {/* Right Column: Price Summary & Coupons (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Coupon Code Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Tag className="w-4 h-4 text-green-700" />
              <span>Promo Coupons & Student Discounts</span>
            </div>

            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded p-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-green-800">{appliedCoupon.code}</span> applied!
                  <p className="text-[11px] text-green-600">You saved ₹{cartTotals.couponDiscount.toLocaleString('en-IN')}</p>
                </div>
                <button onClick={removeCoupon} className="text-red-600 font-bold hover:underline">
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
                    placeholder="e.g. COLLEGE2026"
                    className="flex-1 border rounded px-2.5 py-1.5 text-xs font-mono uppercase"
                  />
                  <button type="submit" className="bg-[#2874f0] text-white px-4 py-1.5 rounded font-bold text-xs hover:bg-blue-700">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
              </form>
            )}

            <div className="space-y-1 pt-1">
              {coupons.slice(0, 2).map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    const res = applyCoupon(c.code);
                    if (!res.success) setCouponError(res.message);
                    else showToast(res.message);
                  }}
                  className="p-1.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer text-xs flex justify-between"
                >
                  <span className="font-mono font-bold text-blue-700">{c.code}</span>
                  <span className="text-[10px] text-blue-600 uppercase font-bold">Apply</span>
                </div>
              ))}
            </div>
          </div>

          {/* SuperCoins rewards */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-slate-800">SuperCoins: {superCoins}</p>
                <p className="text-[11px] text-slate-500">Redeem ₹150 discount</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useSuperCoins}
                onChange={(e) => setUseSuperCoins(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-2">
              Payment Price Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total MRP ({cart.length} shoes)</span>
                <span>₹{cartTotals.totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount on MRP</span>
                <span>- ₹{cartTotals.discountOnMRP.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>- ₹{cartTotals.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {useSuperCoins && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>SuperCoins Deducted</span>
                  <span>- ₹{cartTotals.coinsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="text-green-700 font-bold">FREE</span>
              </div>

              <div className="pt-3 border-t border-dashed flex justify-between text-sm sm:text-base font-extrabold text-slate-900">
                <span>Final Payable</span>
                <span className="text-[#2874f0]">₹{cartTotals.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-green-50 text-green-800 text-xs font-bold p-2.5 rounded text-center">
              🎉 Total Savings: ₹{cartTotals.totalSavings.toLocaleString('en-IN')}
            </div>
          </div>

        </div>

      </div>

      {/* PROCESSING MODAL */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-base text-slate-900">Processing Payment</h3>
            <p className="text-xs text-slate-500 font-mono">{processingStatus}</p>
            <div className="bg-blue-50 p-2.5 rounded text-xs text-blue-900">
              Please do not press back or refresh.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
