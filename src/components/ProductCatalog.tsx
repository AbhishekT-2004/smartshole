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
  Search
} from 'lucide-react';
import { Product, ShoeCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: ShoeCategory;
  onSelectCategory: (cat: ShoeCategory) => void;
  onSelectProduct: (productId: string) => void;
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  searchQuery
}) => {
  // Filters state
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyAssured, setOnlyAssured] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available brands derived from current products
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
      // Search query
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
      // Price Range
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
      // Popularity default
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
    onSelectCategory('All');
  };

  const hasActiveFilters = 
    selectedBrands.length > 0 || 
    selectedSizes.length > 0 || 
    selectedPriceRange !== 'all' || 
    minRating > 0 || 
    minDiscount > 0 || 
    onlyAssured ||
    selectedCategory !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Breadcrumb & Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-slate-200">
        <div>
          <nav className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onSelectCategory('All')}>Home</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-blue-600" onClick={() => onSelectCategory('All')}>Footwear</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-semibold">{selectedCategory} Shoes</span>
          </nav>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Men & Women Footwear' : `${selectedCategory} Collection`}
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              (Showing {filteredProducts.length} items)
            </span>
          </div>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 shadow-xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
          </button>

          {/* Flipkart Sort Bar */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
            <span className="font-bold text-slate-700 hidden sm:inline mr-1">Sort By:</span>
            {[
              { id: 'popularity', label: 'Popularity' },
              { id: 'price_asc', label: 'Price -- Low to High' },
              { id: 'price_desc', label: 'Price -- High to Low' },
              { id: 'newest', label: 'Newest First' },
              { id: 'rating', label: 'Customer Rating' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  sortBy === tab.id
                    ? 'font-bold text-[#2874f0] border-b-2 border-[#2874f0] bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block bg-white rounded border border-slate-200 p-4 space-y-5 shadow-xs sticky top-20">
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

          {/* Flipkart KickAssure Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAssured}
                onChange={(e) => setOnlyAssured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="bg-[#2874f0] text-white text-[10px] font-black italic px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <span>Kick</span>
                <span className="text-yellow-300">Assure</span>
              </span>
              <span className="text-xs text-slate-600 font-medium">Verified Only</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Price</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under3k', label: 'Under ₹3,000' },
                { id: '3k-6k', label: '₹3,000 - ₹6,000' },
                { id: '6k-10k', label: '₹6,000 - ₹10,000' },
                { id: 'above10k', label: 'Over ₹10,000' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === opt.id}
                    onChange={() => setSelectedPriceRange(opt.id)}
                    className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Brand</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Shoe Size Filter (UK) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Size (UK)</h4>
            <div className="grid grid-cols-3 gap-1.5">
              {[6, 7, 8, 9, 10, 11].map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-1 text-xs rounded border transition-colors cursor-pointer font-medium ${
                      isSelected
                        ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    UK {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Customer Ratings</h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[4, 3].map((star) => (
                <label key={star} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === star}
                    onChange={() => setMinRating(minRating === star ? 0 : star)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span className="flex items-center gap-1">
                    {star}★ & above
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Discount</h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[50, 40, 30, 20].map((disc) => (
                <label key={disc} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minDiscount"
                    checked={minDiscount === disc}
                    onChange={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span>{disc}% or more</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Stream */}
        <div className="md:col-span-3 lg:col-span-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Shoes Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any footwear matching your exact filter criteria. Try clearing some filters or searching with different terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2874f0] text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
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

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filter Footwear</span>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-6 text-xs">
              {/* Brand Filter */}
              <div>
                <p className="font-bold uppercase text-slate-700 mb-2">Brands</p>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="font-bold uppercase text-slate-700 mb-2">UK Sizes</p>
                <div className="grid grid-cols-3 gap-2">
                  {[6, 7, 8, 9, 10, 11].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`py-1.5 rounded border text-center font-medium ${
                        selectedSizes.includes(s)
                          ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      UK {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="font-bold uppercase text-slate-700 mb-2">Price</p>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under3k', label: 'Under ₹3,000' },
                    { id: '3k-6k', label: '₹3,000 - ₹6,000' },
                    { id: '6k-10k', label: '₹6,000 - ₹10,000' },
                    { id: 'above10k', label: 'Above ₹10,000' }
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mobPrice"
                        checked={selectedPriceRange === opt.id}
                        onChange={() => setSelectedPriceRange(opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 bg-[#2874f0] text-white rounded font-bold shadow hover:bg-blue-700"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
