import React from 'react';
import { ShoeCategory } from '../types';
import { 
  Sparkles, 
  Flame, 
  Activity, 
  Zap, 
  Briefcase, 
  Smile, 
  Compass, 
  Layers 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: ShoeCategory;
  onSelectCategory: (category: ShoeCategory) => void;
}

const CATEGORIES: { label: ShoeCategory; icon: any; tag?: string }[] = [
  { label: 'All', icon: Sparkles },
  { label: 'Sneakers', icon: Flame, tag: 'HOT' },
  { label: 'Running', icon: Activity },
  { label: 'Sports', icon: Zap },
  { label: 'Formal', icon: Briefcase },
  { label: 'Casual', icon: Smile },
  { label: 'Boots', icon: Compass },
  { label: 'High-Tops', icon: Layers }
];

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white shadow-xs border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-8 py-2.5 min-w-max">
          {CATEGORIES.map(({ label, icon: Icon, tag }) => {
            const isActive = selectedCategory === label;
            return (
              <button
                key={label}
                onClick={() => onSelectCategory(label)}
                className={`group flex flex-col items-center gap-1 px-2.5 py-1 rounded transition-all relative ${
                  isActive
                    ? 'text-[#2874f0] font-bold'
                    : 'text-slate-600 hover:text-[#2874f0]'
                }`}
              >
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-blue-50 text-[#2874f0]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {tag && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black px-1 rounded-full animate-bounce">
                      {tag}
                    </span>
                  )}
                </div>
                <span className="text-xs tracking-tight whitespace-nowrap">
                  {label === 'All' ? 'All Footwear' : label}
                </span>

                {/* Active underline indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#2874f0] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
