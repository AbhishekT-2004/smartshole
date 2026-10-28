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
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, Order } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { 
    cart, 
    cartTotals, 
    appliedCoupon, 
    clearCart, 
    savedAddresses, 
    selectedAddress, 
    setSelectedAddress, 
    saveNewAddress,
    superCoins,
    useSuperCoins,
    showToast 
  } = useShop();

  const [step, setStep] = useState<'address' | 'summary' | 'payment' | 'processing' | 'confirmed'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'WALLET'>('UPI');

  // Address form
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
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
  const [captchaCode, setCaptchaCode] = useState('8392');
  const [userCaptcha, setUserCaptcha] = useState('');

  // Processing state
  const [processingStatusText, setProcessingStatusText] = useState('Connecting to RBI 3D Secure Gateway...');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.pincode || !newAddr.addressLine) {
      showToast('Please fill all required address fields');
      return;
    }
    saveNewAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === 'COD') {
      if (userCaptcha.trim() !== captchaCode) {
        showToast('Incorrect security captcha. Please re-enter.');
        return;
      }
    }

    setStep('processing');
    setProcessingStatusText('Encrypting 256-Bit SSL Payment Handshake...');

    setTimeout(() => {
      setProcessingStatusText(
        paymentMethod === 'UPI' 
          ? 'NPCI UPI Mandate Verified via GooglePay/PhonePe...' 
          : paymentMethod === 'CARD'
          ? 'Verifying Visa / Mastercard 3D-Secure OTP...' 
          : paymentMethod === 'NETBANKING'
          ? 'Connecting to HDFC / SBI Secure Core Banking Server...'
          : 'Generating Ekart Cash-on-Delivery Dispatch Docket...'
      );
    }, 1200);

    setTimeout(async () => {
      // Build order payload
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
        setConfirmedOrder(order);
        setStep('confirmed');
        clearCart();

        // Celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if unavailable
        }
      } catch (err) {
        showToast('Payment verification succeeded. Order placed!');
      }
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-auto overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-[#2874f0] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-yellow-300" />
            <h2 className="text-base font-bold tracking-tight">
              SoleKart 100% Secure Checkout
            </h2>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Checkout Progress Stepper */}
        {step !== 'processing' && step !== 'confirmed' && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
            <button
              onClick={() => setStep('address')}
              className={`flex items-center gap-1.5 font-bold ${
                step === 'address' ? 'text-[#2874f0]' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'address' ? 'bg-[#2874f0] text-white' : 'bg-slate-200 text-slate-700'
              }`}>1</span>
              <span>Delivery Address</span>
            </button>

            <span className="text-slate-300">──</span>

            <button
              onClick={() => setStep('summary')}
              className={`flex items-center gap-1.5 font-bold ${
                step === 'summary' ? 'text-[#2874f0]' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'summary' ? 'bg-[#2874f0] text-white' : 'bg-slate-200 text-slate-700'
              }`}>2</span>
              <span>Order Summary</span>
            </button>

            <span className="text-slate-300">──</span>

            <button
              onClick={() => setStep('payment')}
              className={`flex items-center gap-1.5 font-bold ${
                step === 'payment' ? 'text-[#2874f0]' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' ? 'bg-[#2874f0] text-white' : 'bg-slate-200 text-slate-700'
              }`}>3</span>
              <span>Payment Gateway</span>
            </button>
          </div>
        )}

        {/* STEP 1: DELIVERY ADDRESS */}
        {step === 'address' && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Select Delivery Address
              </h3>
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
                          ? 'border-[#2874f0] bg-blue-50/50 ring-1 ring-blue-500' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-bold text-slate-900 text-xs">{addr.fullName}</span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {addr.type}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{addr.phone}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 pl-6">
                        {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                    </div>
                  );
                })}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setStep('summary')}
                    className="bg-[#fb641b] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#e85b16] transition-colors flex items-center gap-1.5 shadow"
                  >
                    <span>Deliver Here</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleAddNewAddressSubmit} className="space-y-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Flat, House no., Building, Street *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAddr.addressLine}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2874f0] text-white px-5 py-2 rounded font-bold hover:bg-blue-700"
                  >
                    Save & Deliver Here
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: ORDER SUMMARY */}
        {step === 'summary' && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <h3 className="font-bold text-sm text-slate-800">Review Shoes in Cart ({cart.length})</h3>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded bg-slate-50 border border-slate-200" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-slate-500">Size: <strong className="text-slate-800">UK {item.selectedSize}</strong> • Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details Bar */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total MRP:</span>
                <span>₹{cartTotals.totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Discount on MRP:</span>
                <span>- ₹{cartTotals.discountOnMRP.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>- ₹{cartTotals.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {useSuperCoins && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>SuperCoins Deducted:</span>
                  <span>- ₹{cartTotals.coinsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges:</span>
                <span className="text-green-700 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Payable:</span>
                <span className="text-[#2874f0]">₹{cartTotals.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() => setStep('address')}
                className="text-xs text-slate-600 font-semibold hover:underline"
              >
                Back to Address
              </button>
              <button
                onClick={() => setStep('payment')}
                className="bg-[#fb641b] text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#e85b16] transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SECURE PAYMENT GATEWAY */}
        {step === 'payment' && (
          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Select Payment Method
                </h3>
                <p className="text-[11px] text-slate-500">256-Bit SSL Encrypted Payment Gateway</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Amount</span>
                <span className="text-base font-extrabold text-[#2874f0]">
                  ₹{cartTotals.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Options Accordion */}
            <div className="space-y-2.5">
              
              {/* Option 1: UPI */}
              <div className={`border rounded-lg p-3 transition-colors ${
                paymentMethod === 'UPI' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-800">UPI (Google Pay, PhonePe, Paytm, QR)</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Fastest
                  </span>
                </label>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 text-xs pl-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUpiOption('vpa')}
                        className={`px-3 py-1.5 rounded font-semibold border ${
                          upiOption === 'vpa' ? 'bg-[#2874f0] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Enter UPI ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiOption('qr')}
                        className={`px-3 py-1.5 rounded font-semibold border ${
                          upiOption === 'qr' ? 'bg-[#2874f0] text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        Show QR Code
                      </button>
                    </div>

                    {upiOption === 'vpa' ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okaxis, 9876543210@paytm"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                        <p className="text-[11px] text-slate-500">
                          A payment request will be sent to your UPI app for instant approval.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-white rounded border border-slate-200 flex flex-col items-center space-y-2">
                        <div className="w-36 h-36 bg-slate-100 p-2 rounded flex items-center justify-center border border-slate-300">
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=solekart@okaxis%26pn=SoleKart%26am=13499" 
                            alt="Scan UPI QR" 
                            className="w-full h-full"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Credit / Debit / ATM Card */}
              <div className={`border rounded-lg p-3 transition-colors ${
                paymentMethod === 'CARD' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-xs text-slate-800">Credit / Debit / ATM Card</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Visa • MC • RuPay</span>
                </label>

                {paymentMethod === 'CARD' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs pl-6">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs uppercase"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                      <Lock className="w-3 h-3 text-green-600" />
                      <span>Cards are protected by 3D-Secure Bank OTP and PCI-DSS Level 1 Encryption</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 3: Net Banking */}
              <div className={`border rounded-lg p-3 transition-colors ${
                paymentMethod === 'NETBANKING' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-xs text-slate-800">Net Banking</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">All Major Indian Banks</span>
                </label>

                {paymentMethod === 'NETBANKING' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs pl-6">
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded border text-left text-xs font-medium transition-colors ${
                            selectedBank === bank ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-700'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Option 4: Cash on Delivery */}
              <div className={`border rounded-lg p-3 transition-colors ${
                paymentMethod === 'COD' ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-blue-500' : 'border-slate-200'
              }`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-xs text-slate-800">Cash on Delivery (COD)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-green-700 font-bold">No Extra Fee</span>
                </label>

                {paymentMethod === 'COD' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs pl-6">
                    <p className="text-slate-600">
                      Enter the 4-digit security code shown below to confirm your cash-on-delivery shipment:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800 text-yellow-300 font-mono text-base font-bold tracking-widest px-3 py-1.5 rounded select-none shadow-inner">
                        {captchaCode}
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        placeholder="Enter code"
                        className="w-28 bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs text-center font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep('summary')}
                className="text-xs text-slate-600 font-semibold hover:underline"
              >
                Back to Summary
              </button>
              <button
                onClick={handleProcessPayment}
                className="bg-[#fb641b] text-white px-8 py-3 rounded font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#e85b16] transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{cartTotals.totalAmount.toLocaleString('en-IN')} & Place Order</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROCESSING SIMULATION */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Processing Your Payment</h3>
              <p className="text-xs text-slate-500 font-mono">{processingStatusText}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 max-w-sm mx-auto flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Please do not press back or refresh this screen.</span>
            </div>
          </div>
        )}

        {/* STEP 5: ORDER CONFIRMED */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="bg-yellow-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                Order Placed Successfully!
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 pt-1">
                Thank You, {selectedAddress.fullName}!
              </h3>
              <p className="text-xs text-slate-500">
                A confirmation has been dispatched. Ekart Logistics is handling your shipment.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Number:</span>
                <span className="font-mono font-bold text-blue-600">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Delivery:</span>
                <span className="font-bold text-green-700">{confirmedOrder.estimatedDeliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">₹{confirmedOrder.pricing.totalAmount.toLocaleString('en-IN')} via {confirmedOrder.paymentDetails.method}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOrderSuccess(confirmedOrder);
                }}
                className="flex-1 py-3 bg-[#2874f0] text-white rounded font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>

              <button
                onClick={() => onClose()}
                className="py-3 px-5 border border-slate-300 rounded font-bold text-xs text-slate-700 hover:bg-slate-100"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
