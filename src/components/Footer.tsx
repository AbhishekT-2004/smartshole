import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Award, Heart } from 'lucide-react';
import { ShoeCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ShoeCategory) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  return (
    <footer className="bg-[#172337] text-white mt-12 border-t border-slate-700 text-xs">
      
      {/* Top Value Assurance strip */}
      <div className="border-b border-slate-700/60 bg-[#121c2c] py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold text-xs">100% Authentic Footwear</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Truck className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-xs">Fast & Free Doorstep Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs">7-Day Hassle-Free Returns</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-xs">256-Bit SSL Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-slate-400">
        
        {/* Col 1 */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">ABOUT SOLEKART</h4>
          <ul className="space-y-1.5">
            <li><span className="hover:text-white cursor-pointer">About Us</span></li>
            <li><span className="hover:text-white cursor-pointer">Careers at SoleKart</span></li>
            <li><span className="hover:text-white cursor-pointer">Flipkart Stories</span></li>
            <li><span className="hover:text-white cursor-pointer">KickAssure Authenticity</span></li>
            <li><span className="hover:text-white cursor-pointer">Corporate Information</span></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">FOOTWEAR COLLECTIONS</h4>
          <ul className="space-y-1.5">
            <li><button onClick={() => onSelectCategory('Sneakers')} className="hover:text-white">Sneakers & Kicks</button></li>
            <li><button onClick={() => onSelectCategory('Running')} className="hover:text-white">Marathon & Running</button></li>
            <li><button onClick={() => onSelectCategory('High-Tops')} className="hover:text-white">Retro High-Tops</button></li>
            <li><button onClick={() => onSelectCategory('Formal')} className="hover:text-white">Formal Derby & Oxford</button></li>
            <li><button onClick={() => onSelectCategory('Boots')} className="hover:text-white">Rugged Leather Boots</button></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">HELP & SUPPORT</h4>
          <ul className="space-y-1.5">
            <li><span className="hover:text-white cursor-pointer">Payments & UPI</span></li>
            <li><span className="hover:text-white cursor-pointer">Ekart Shipping Rates</span></li>
            <li><span className="hover:text-white cursor-pointer">Cancellation & Returns</span></li>
            <li><span className="hover:text-white cursor-pointer">FAQ & Help Center</span></li>
            <li><button onClick={onOpenAdmin} className="text-yellow-400 font-bold hover:underline">Merchant Admin Panel</button></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">CONSUMER POLICY</h4>
          <ul className="space-y-1.5">
            <li><span className="hover:text-white cursor-pointer">Terms of Use</span></li>
            <li><span className="hover:text-white cursor-pointer">Security & Encryption</span></li>
            <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer">Grievance Redressal</span></li>
            <li><span className="hover:text-white cursor-pointer">EPR Compliance</span></li>
          </ul>
        </div>

        {/* Col 5: Registered Office */}
        <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-700/80 pt-4 md:pt-0 md:pl-4 col-span-2 md:col-span-1">
          <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">PROJECT OFFICE</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            SoleKart Footwear Platform<br />
            College Project Demonstration<br />
            Full-Stack Node.js & MongoDB Architecture<br />
            Bengaluru 560034, Karnataka, India
          </p>
          <div className="pt-2">
            <span className="text-[10px] text-yellow-300/80 font-mono block">Built for Pawan (pawan2004xy@gmail.com)</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 px-4 bg-[#0e1624]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SoleKart</span>
            <span>© 2026 SoleKart.com. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Flipkart-Inspired Architecture</span>
            <span>•</span>
            <span>Fast Loading & SEO Optimized</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
