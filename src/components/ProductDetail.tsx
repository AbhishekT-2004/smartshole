import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  ShoppingCart, 
  Zap, 
  MapPin, 
  ChevronRight, 
  Check, 
  Maximize2, 
  X, 
  ZoomIn, 
  ThumbsUp, 
  Share2, 
  Tag, 
  Info,
  Ruler,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { Product, Review } from '../types';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
  onSelectProduct: (id: string) => void;
  allProducts: Product[];
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  productId, 
  onBack, 
  onSelectProduct,
  allProducts 
}) => {
  const { 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    navigateTo, 
    pincode, 
    pincodeData, 
    updatePincode,
    openAiChatWithPrompt,
    showToast 
  } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number>(8);
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  // Interactive Magnifier Zoom State
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [fullscreenZoomLevel, setFullscreenZoomLevel] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Size chart modal
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newFit, setNewFit] = useState<'True to Size' | 'Runs Small' | 'Runs Large'>('True to Size');

  // Pincode test
  const [inputPin, setInputPin] = useState(pincode);
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    api.getProductById(productId).then(prod => {
      if (prod) {
        setProduct(prod);
        setSelectedColor(prod.colors[0] || 'Default');
        const firstAvailable = prod.sizes.find(s => s.stock > 0);
        if (firstAvailable) setSelectedSize(firstAvailable.size);
      }
    });
    api.getReviews(productId).then(setReviews);
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading shoe details & high-res gallery...</p>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);
  const currentSizeObj = product.sizes.find(s => s.size === selectedSize);
  const stockForSelectedSize = currentSizeObj ? currentSizeObj.stock : 0;

  // Handle Magnifier coordinates on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomCoords({ x, y });
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(inputPin)) {
      setPinLoading(true);
      await updatePincode(inputPin);
      setPinLoading(false);
      showToast(`Deliverability checked for PIN ${inputPin}`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor);
    navigateTo('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) {
      showToast('Please fill in review title and comments');
      return;
    }
    const created = await api.submitReview({
      productId: product.id,
      userName: 'Pawan K.',
      rating: newRating,
      title: newReviewTitle,
      comment: newReviewComment,
      verifiedBuyer: true,
      fit: newFit,
      comfortRating: newRating,
      durabilityRating: newRating
    });
    setReviews(prev => [created, ...prev]);
    setIsReviewModalOpen(false);
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Thank you! Your verified review is published.');
  };

  const handleUpvoteReview = async (revId: string) => {
    const ok = await api.voteHelpful(revId);
    if (ok) {
      setReviews(prev => prev.map(r => r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1, userVotedHelpful: true } : r));
      showToast('Marked as helpful');
    }
  };

  // Similar shoes
  const similarShoes = allProducts.filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
        <button onClick={onBack} className="hover:text-blue-600">Home</button>
        <span>&gt;</span>
        <button onClick={onBack} className="hover:text-blue-600">Footwear</button>
        <span>&gt;</span>
        <span className="text-slate-600">{product.category}</span>
        <span>&gt;</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery on Left, Details on Right */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* LEFT COLUMN: Gallery with Zoom (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-3 sticky top-20">
          
          {/* Vertical Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px] no-scrollbar flex-shrink-0">
            {product.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                onMouseEnter={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded border-2 overflow-hidden transition-all flex-shrink-0 ${
                  activeImageIndex === idx 
                    ? 'border-[#2874f0] shadow-md ring-1 ring-blue-500 scale-102' 
                    : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Photo with Interactive Zoom Lens */}
          <div className="flex-1 relative">
            <div 
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsFullscreenModalOpen(true)}
              className="relative w-full aspect-square bg-slate-50 border border-slate-200 rounded-lg overflow-hidden cursor-crosshair group shadow-inner"
            >
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-2"
              />

              {/* Wishlist Heart */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-red-500 shadow-md transition-transform active:scale-90 z-20"
                title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Fullscreen Trigger Overlay */}
              <div className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors z-20" title="Click to view full-screen gallery">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Zoom Instruction Pill */}
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-1 rounded shadow pointer-events-none flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-blue-600" />
                <span>Hover to zoom • Click for full view</span>
              </div>

              {/* Floating Lens on Cursor */}
              {isZooming && (
                <div 
                  className="absolute pointer-events-none border-2 border-blue-500/80 bg-blue-500/10 rounded shadow-md z-10 hidden md:block"
                  style={{
                    width: '140px',
                    height: '140px',
                    left: `calc(${zoomCoords.x}% - 70px)`,
                    top: `calc(${zoomCoords.y}% - 70px)`,
                  }}
                />
              )}
            </div>

            {/* High-Definition 2.5x Zoom Magnifier Box (Overlays to the right on desktop hover) */}
            {isZooming && (
              <div 
                className="hidden lg:block absolute left-[103%] top-0 w-[420px] h-[420px] bg-white border-2 border-slate-300 rounded-lg shadow-2xl z-50 overflow-hidden pointer-events-none"
                style={{
                  backgroundImage: `url(${product.images[activeImageIndex]})`,
                  backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  backgroundSize: '300%',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  HD Magnifier 2.5x Texture View
                </div>
              </div>
            )}

            {/* Sticky Action Buttons (Desktop & Tablet) */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={stockForSelectedSize === 0}
                className="bg-[#ff9f00] hover:bg-[#f39700] text-white py-3.5 px-4 rounded font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 fill-white" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={stockForSelectedSize === 0}
                className="bg-[#fb641b] hover:bg-[#e85b16] text-white py-3.5 px-4 rounded font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shoe Details & Flipkart Offers (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {product.brand} • {product.gender}
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Product link copied to clipboard!');
                }}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Share shoe link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Flipkart KickAssure and Rating Pill */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                {product.ratingCount.toLocaleString('en-IN')} Ratings & {product.reviewCount} Reviews
              </span>

              {product.isAssured && (
                <div className="bg-[#2874f0] text-white text-[11px] font-black italic px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <span>Kick</span>
                  <span className="text-yellow-300">Assure</span>
                  <Award className="w-3 h-3 text-yellow-300 ml-0.5" />
                </div>
              )}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="border-y border-slate-100 py-3">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base font-bold text-green-700">
                {product.discountPercent}% off
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span>Inclusive of all taxes</span>
                <span>•</span>
                <span className="text-green-700 font-semibold">Free shipping across India</span>
              </p>
              <button
                onClick={() => openAiChatWithPrompt(`Tell me about ${product.name}: how does it fit and what outfits work best?`)}
                className="bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 border border-blue-200 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
                <span>Ask AI Stylist About This Pair</span>
              </button>
            </div>
          </div>

          {/* Flipkart Bank Offers Accordion */}
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Tag className="w-4 h-4 text-green-700" />
              <span>Available Offers & Bank Discounts</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 pl-1">
              <li className="flex items-start gap-2">
                <span className="bg-green-700 text-white text-[9px] font-bold px-1 rounded mt-0.5">BANK OFFER</span>
                <span>10% Instant Discount on SBI & HDFC Credit Cards, up to ₹1,500 on orders of ₹4,999+.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-600 text-white text-[9px] font-bold px-1 rounded mt-0.5">COLLEGE</span>
                <span>Extra 15% Student Discount with code <strong>COLLEGE2026</strong> at checkout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-yellow-500 text-blue-900 text-[9px] font-bold px-1 rounded mt-0.5">REWARDS</span>
                <span>Earn up to <strong>140 SuperCoins</strong> on this purchase for future discounts.</span>
              </li>
            </ul>
          </div>

          {/* Size Selector with Live Stock Indicator */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Select Size (UK/India)
              </label>
              <button
                onClick={() => setIsSizeChartOpen(true)}
                className="text-xs text-[#2874f0] font-semibold hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart & Foot Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isOutOfStock = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    onClick={() => {
                      if (!isOutOfStock) setSelectedSize(s.size);
                    }}
                    disabled={isOutOfStock}
                    className={`min-w-[50px] py-2 px-3 rounded text-xs font-bold border transition-all cursor-pointer relative ${
                      isOutOfStock
                        ? 'border-slate-200 bg-slate-100 text-slate-400 line-through cursor-not-allowed'
                        : isSelected
                        ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-300 text-slate-800 hover:border-slate-500 bg-white'
                    }`}
                  >
                    <span>UK {s.size}</span>
                    {s.stock > 0 && s.stock <= 3 && (
                      <span className="block text-[9px] text-amber-600 font-semibold font-sans mt-0.5">
                        {s.stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Inventory Stock Warning */}
            {stockForSelectedSize > 0 && stockForSelectedSize <= 4 && (
              <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Hurry! Only {stockForSelectedSize} pairs remaining in UK {selectedSize}.</span>
              </p>
            )}
            {stockForSelectedSize === 0 && (
              <p className="text-xs text-red-600 font-semibold">
                This size is currently sold out. Please select another UK size.
              </p>
            )}
          </div>

          {/* Color Variations */}
          {product.colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Color: <span className="font-semibold text-slate-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedColor === color
                        ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flipkart Pincode Delivery Checker */}
          <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                Delivery Options & Speed
              </span>
              <span className="text-[11px] text-green-700 font-semibold">Cash On Delivery Available</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <button
                type="submit"
                disabled={pinLoading}
                className="bg-[#2874f0] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {pinLoading ? 'Checking...' : 'Check'}
              </button>
            </form>

            {pincodeData && (
              <div className="pt-1 text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span>{pincodeData.message || `Delivery by ${pincodeData.estimatedDate}`}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Fulfilled via Ekart Logistics with contactless OTP verification.
                </p>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Product Highlights</h3>
            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
              {product.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Detailed Specifications Table */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Specifications</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/3">Sole Material</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.soleMaterial}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Upper Material</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.upperMaterial}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-500 font-medium">Fastening</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.fastening}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Weight</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.weight}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-500 font-medium">Cushioning Tech</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.cushioning}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Country of Origin</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.origin}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="px-3 py-2 text-slate-500 font-medium">Warranty</td>
                    <td className="px-3 py-2 text-slate-800 font-semibold">{product.specifications.warranty}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Care Instructions</td>
                    <td className="px-3 py-2 text-slate-800">{product.specifications.care}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Ratings & Reviews Section (Flipkart Style) */}
      <section className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-6 mt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ratings & Reviews</h2>
            <p className="text-xs text-slate-500">Verified buyer ratings collected by SoleKart Ekart system</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 rounded text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
          >
            Rate & Review Product
          </button>
        </div>

        {/* Rating Breakdown Bar Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-4 rounded-lg">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-4xl font-extrabold text-slate-900">{product.rating}</span>
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {product.ratingCount.toLocaleString('en-IN')} Ratings & {reviews.length} Reviews
            </p>
            <div className="pt-1 flex items-center justify-center md:justify-start gap-1 text-[11px] text-green-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verified Shoe Purchases</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-1.5 text-xs text-slate-600">
            {[
              { stars: 5, pct: 72 },
              { stars: 4, pct: 18 },
              { stars: 3, pct: 6 },
              { stars: 2, pct: 3 },
              { stars: 1, pct: 1 },
            ].map(row => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="w-6 font-semibold">{row.stars} ★</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${row.stars >= 4 ? 'bg-green-600' : row.stars === 3 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400 text-[11px]">{row.pct}%</span>
              </div>
            ))}
          </div>

          {/* Fit & Sentiment Tags */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-6 pt-3 md:pt-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Buyer Feedback</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Fit:</span>
                <span className="font-bold text-green-700">92% True to size</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comfort:</span>
                <span className="font-bold text-slate-800">4.8 / 5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Durability:</span>
                <span className="font-bold text-slate-800">4.7 / 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 divide-y divide-slate-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  <span>{rev.rating}</span>
                  <Star className="w-2.5 h-2.5 fill-white" />
                </span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{rev.title}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{rev.userName}</span>
                  <span>•</span>
                  <span>{rev.date}</span>
                  {rev.verifiedBuyer && (
                    <span className="text-green-700 font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                      Verified Buyer
                    </span>
                  )}
                  <span>•</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                    Fit: {rev.fit}
                  </span>
                </div>

                {/* Helpful button */}
                <button
                  onClick={() => handleUpvoteReview(rev.id)}
                  disabled={rev.userVotedHelpful}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                    rev.userVotedHelpful 
                      ? 'text-blue-600 font-bold' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Shoes / Recommended Footwear */}
      {similarShoes.length > 0 && (
        <section className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Similar {product.category} Footwear You Might Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {similarShoes.map((sim) => (
              <div 
                key={sim.id}
                onClick={() => onSelectProduct(sim.id)}
                className="bg-white rounded border border-slate-200 p-3 hover:shadow-lg transition-all cursor-pointer space-y-2 group"
              >
                <div className="aspect-square bg-slate-50 rounded overflow-hidden">
                  <img src={sim.images[0]} alt={sim.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{sim.brand}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">{sim.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-slate-900">₹{sim.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-green-700 font-bold">{sim.discountPercent}% off</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full pb-2">
            <div>
              <p className="font-bold text-sm sm:text-base">{product.name}</p>
              <p className="text-xs text-slate-400">Photo {activeImageIndex + 1} of {product.images.length}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFullscreenZoomLevel(prev => Math.min(prev + 0.5, 3))}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setFullscreenZoomLevel(1)}
                className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-white"
              >
                Reset ({fullscreenZoomLevel}x)
              </button>
              <button
                onClick={() => {
                  setIsFullscreenModalOpen(false);
                  setFullscreenZoomLevel(1);
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Fullscreen Image Preview */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              style={{ transform: `scale(${fullscreenZoomLevel})`, transition: 'transform 0.2s ease-out' }}
              className="max-h-[75vh] max-w-full object-contain select-none"
            />
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-3 py-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                  activeImageIndex === i ? 'border-yellow-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIZE CHART MODAL */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Footwear Size Guide</h3>
              </div>
              <button onClick={() => setIsSizeChartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full border-collapse border border-slate-200 text-center">
                <thead>
                  <tr className="bg-[#2874f0] text-white">
                    <th className="p-2 border border-slate-300">UK / India</th>
                    <th className="p-2 border border-slate-300">US</th>
                    <th className="p-2 border border-slate-300">EU</th>
                    <th className="p-2 border border-slate-300">Foot Length (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr><td className="p-2 font-bold">UK 6</td><td>7</td><td>40</td><td>25.0 cm</td></tr>
                  <tr className="bg-slate-50"><td className="p-2 font-bold">UK 7</td><td>8</td><td>41</td><td>25.8 cm</td></tr>
                  <tr><td className="p-2 font-bold">UK 8</td><td>9</td><td>42.5</td><td>26.7 cm</td></tr>
                  <tr className="bg-slate-50"><td className="p-2 font-bold">UK 9</td><td>10</td><td>44</td><td>27.5 cm</td></tr>
                  <tr><td className="p-2 font-bold">UK 10</td><td>11</td><td>45</td><td>28.3 cm</td></tr>
                  <tr className="bg-slate-50"><td className="p-2 font-bold">UK 11</td><td>12</td><td>46</td><td>29.2 cm</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 p-3 rounded text-xs text-blue-900 space-y-1">
              <p className="font-bold">How to measure your foot length accurately:</p>
              <p>1. Stand on a blank sheet of paper with heel against the wall.</p>
              <p>2. Mark the longest part of your foot with a pen.</p>
              <p>3. Measure length in centimeters and match with UK size above.</p>
            </div>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="w-full py-2.5 bg-[#2874f0] text-white font-bold rounded text-xs hover:bg-blue-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Rate & Review Product</h3>
                <p className="text-xs text-slate-500">{product.name}</p>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Overall Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">
                    {newRating === 5 ? 'Excellent!' : newRating === 4 ? 'Very Good' : newRating === 3 ? 'Average' : 'Below Average'}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">How did it fit?</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Runs Small', 'True to Size', 'Runs Large'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setNewFit(f)}
                      className={`py-2 rounded border font-medium ${newFit === f ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Incredibly comfortable sneakers for campus!"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Review & Experience</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell other shoppers about comfort, sole cushioning, leather quality, and durability..."
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2874f0] text-white rounded font-bold hover:bg-blue-700 shadow"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
