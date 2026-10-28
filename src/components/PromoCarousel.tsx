import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { ShoeCategory } from '../types';

interface PromoCarouselProps {
  onSelectCategory: (cat: ShoeCategory) => void;
}

const SLIDES = [
  {
    id: 1,
    badge: 'COLLEGE SPECIAL SALE',
    title: 'Big Footwear Festival 2026',
    subtitle: 'Air Jordan, Ultraboost, Puma Nitro & More',
    discount: 'UP TO 70% OFF',
    coupon: 'Use coupon COLLEGE2026 for extra 15% discount',
    category: 'Sneakers' as ShoeCategory,
    bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    accentColor: 'text-yellow-400',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    badge: 'NEW SEASON DROP',
    title: 'Performance Marathon Kicks',
    subtitle: 'Ultraboost Light & Gel-Kayano Stability Pods',
    discount: 'MIN 40% OFF',
    coupon: 'Instant ₹500 off on first purchase: FIRSTKICK',
    category: 'Running' as ShoeCategory,
    bgGradient: 'from-amber-900 via-orange-950 to-stone-900',
    accentColor: 'text-amber-300',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    badge: 'CAMPUS ESSENTIALS',
    title: 'Retro High-Tops & Vintage Suede',
    subtitle: 'Converse Chuck 70 & Vans Skate Heritage',
    discount: 'STARTING AT ₹2,499',
    coupon: 'Flipkart KickAssure 100% Originality Guarantee',
    category: 'High-Tops' as ShoeCategory,
    bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    accentColor: 'text-emerald-300',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80'
  }
];

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
      {/* Main Banner Slide */}
      <div className={`relative rounded-lg overflow-hidden bg-gradient-to-r ${slide.bgGradient} text-white shadow-lg min-h-[220px] sm:min-h-[280px] flex items-center transition-all duration-700`}>
        
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-blue-950 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {slide.badge}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                Trending Drops
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {slide.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium">
              {slide.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className={`text-xl sm:text-3xl font-black ${slide.accentColor}`}>
                {slide.discount}
              </span>
              <button
                onClick={() => onSelectCategory(slide.category)}
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-5 py-2 rounded font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Shop Collection</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-yellow-300/90 pt-1 font-mono">
              ★ {slide.coupon}
            </p>
          </div>

          {/* Shoe Image Float */}
          <div className="hidden sm:block relative w-64 h-52 lg:w-80 lg:h-64 flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover rounded-xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 ring-2 ring-white/20"
            />
            <div className="absolute -bottom-2 -left-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-yellow-400 border border-yellow-400/40 flex items-center gap-1">
              <Award className="w-3 h-3 text-yellow-400" />
              100% Genuine KickAssure
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Flipkart Trust / Value Props Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs bg-white rounded border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">100% KickAssure</p>
            <p className="text-[11px] text-slate-500">Verified authentic footwear</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">Fast Free Delivery</p>
            <p className="text-[11px] text-slate-500">Free shipping on orders ₹499+</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">7-Day Easy Returns</p>
            <p className="text-[11px] text-slate-500">Instant size exchange policy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">Secure Payments</p>
            <p className="text-[11px] text-slate-500">UPI, Cards, EMI & COD</p>
          </div>
        </div>
      </div>
    </div>
  );
};
