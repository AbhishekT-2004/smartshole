import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Check, 
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Search,
  Sparkles,
  Grid3X3,
  ListFilter,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { Product, ShoeCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryBar } from './CategoryBar';
import { useShop } from '../context/ShopContext';

interface ShoppingPageProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

export const ShoppingPage: React.FC<ShoppingPageProps> = ({ products, onSelectProduct }) => {
  const { openAiChatWithPrompt } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<ShoeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyAssured, setOnlyAssured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available brands derived from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }, [products]);

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Sizes
      if (selectedSizes.length > 0) {
        const hasSize = p.sizes.some(s => selectedSizes.includes(s.size) && s.stock > 0);
        if (!hasSize) return false;
      }
      // Price
      if (selectedPriceRange === 'under3k' && p.price >= 3000) return false;
      if (selectedPriceRange === '3k-6k' && (p.price < 3000 || p.price > 6000)) return false;
      if (selectedPriceRange === '6k-10k' && (p.price < 6000 || p.price > 10000)) return false;
      if (selectedPriceRange === 'above10k' && p.price < 10000) return false;

      // Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Discount
      if (minDiscount > 0 && p.discountPercent < minDiscount) return false;

      // Assured
      if (onlyAssured && !p.isAssured) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.ratingCount * b.rating) - (a.ratingCount * a.rating);
    });
  }, [products, selectedCategory, searchQuery, selectedBrands, selectedSizes, selectedPriceRange, minRating, minDiscount, onlyAssured, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedPriceRange('all');
    setMinRating(0);
    setMinDiscount(0);
    setOnlyAssured(false);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedBrands.length > 0 || 
    selectedSizes.length > 0 || 
    selectedPriceRange !== 'all' || 
    minRating > 0 || 
    minDiscount > 0 || 
    onlyAssured ||
    selectedCategory !== 'All' ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f1f2f4]">
      
      {/* Category Pills Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
        
        {/* SmartSole AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-lg p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">SmartSole AI Footwear Stylist</span>
                <span className="bg-yellow-400 text-blue-950 text-[9px] font-black uppercase px-1 rounded">
                  AI
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Not sure which shoe fits your routine? Tell our AI your budget, foot shape, or purpose.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openAiChatWithPrompt("Recommend the best shoes for college daily wear under ₹6,000")}
              className="flex-1 sm:flex-initial bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-xs font-bold px-3.5 py-2 rounded shadow transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Ask AI for Campus Kicks
            </button>
            <button
              onClick={() => openAiChatWithPrompt("Compare performance running shoes for marathons")}
              className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded border border-white/20 whitespace-nowrap"
            >
              Marathon Guide
            </button>
          </div>
        </div>

        {/* Top Controls: Search in page & Sort dropdown */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sneakers, running, formal, brands..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-700"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
            </button>

            {/* Sort Controls */}
            <div className="flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
              <span className="font-bold text-slate-700 hidden sm:inline mr-1">Sort:</span>
              {[
                { id: 'popularity', label: 'Popular' },
                { id: 'price_asc', label: 'Price: Low to High' },
                { id: 'price_desc', label: 'Price: High to Low' },
                { id: 'discount', label: 'Discount %' },
                { id: 'rating', label: 'Rating' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSortBy(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                    sortBy === tab.id
                      ? 'font-bold text-[#2874f0] bg-blue-50 border border-blue-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
            <span className="font-bold text-blue-900 text-[11px] uppercase">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-white border border-blue-300 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedBrands.map(b => (
              <span key={b} className="bg-white border border-blue-300 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                {b}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
              </span>
            ))}
            {selectedSizes.map(s => (
              <span key={s} className="bg-white border border-blue-300 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                UK {s}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSize(s)} />
              </span>
            ))}
            {selectedPriceRange !== 'all' && (
              <span className="bg-white border border-blue-300 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                Price Filter
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPriceRange('all')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[#2874f0] font-bold hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Grid and Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block bg-white rounded-lg border border-slate-200 p-4 space-y-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#2874f0] font-semibold hover:underline"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* SmartSole Assured */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAssured}
                  onChange={(e) => setOnlyAssured(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="bg-[#2874f0] text-white text-[10px] font-black italic px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span>Kick</span>
                  <span className="text-yellow-300">Assure</span>
                </span>
                <span className="text-xs text-slate-700 font-medium">100% Verified</span>
              </label>
            </div>

            {/* Price Ranges */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Price</h4>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under3k', label: 'Under ₹3,000' },
                { id: '3k-6k', label: '₹3,000 - ₹6,000' },
                { id: '6k-10k', label: '₹6,000 - ₹10,000' },
                { id: 'above10k', label: 'Above ₹10,000' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="shopPrice"
                    checked={selectedPriceRange === opt.id}
                    onChange={() => setSelectedPriceRange(opt.id)}
                    className="text-blue-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Brands */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Brands</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* UK Sizes */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Size (UK)</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {[6, 7, 8, 9, 10, 11].map((s) => {
                  const isSel = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`py-1 text-xs rounded border font-medium transition-colors ${
                        isSel ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold' : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      UK {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discounts */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Discount</h4>
              {[50, 40, 30, 20].map((d) => (
                <label key={d} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="shopDiscount"
                    checked={minDiscount === d}
                    onChange={() => setMinDiscount(minDiscount === d ? 0 : d)}
                    className="text-blue-600"
                  />
                  <span>{d}% or more</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Product Cards Stream */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="mb-2 text-xs text-slate-500 font-medium">
              Showing <strong>{filteredProducts.length}</strong> footwear models
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Shoes Matched Your Criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the brand, category, or size filters. You can also consult our AI Stylist for smart recommendations!
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2 bg-[#2874f0] text-white rounded text-xs font-bold hover:bg-blue-700 shadow"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => openAiChatWithPrompt("Suggest the most popular sneakers in stock right now")}
                    className="px-4 py-2 bg-yellow-400 text-blue-950 rounded text-xs font-bold hover:bg-yellow-300 shadow flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask SmartSole AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full flex flex-col shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="font-bold text-sm">Filter Footwear</span>
              <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs">
              <div>
                <span className="font-bold block mb-1.5">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ShoeCategory)}
                  className="w-full border rounded p-1.5"
                >
                  {['All', 'Sneakers', 'Running', 'Sports', 'Formal', 'Casual', 'Boots', 'High-Tops'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="font-bold block mb-1.5">UK Sizes</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[6, 7, 8, 9, 10, 11].map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`p-1.5 border rounded ${selectedSizes.includes(s) ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold' : ''}`}
                    >
                      UK {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold block mb-1.5">Brands</span>
                <div className="space-y-1">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex gap-2">
              <button onClick={clearAllFilters} className="flex-1 py-2 border rounded font-bold text-xs">Clear</button>
              <button onClick={() => setIsMobileFilterOpen(false)} className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold text-xs">
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
