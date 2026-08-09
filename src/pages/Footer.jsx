import React from 'react';
import {
    ArrowUpRight,



} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#E9E3DB] font-sans pt-20 pb-10 px-6 md:px-12 border-t border-[#3d352e]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold tracking-widest text-[#C4BEB6] mb-6">LUSTRE</h2>
            <p className="text-[#E9E3DB]/60 text-sm leading-relaxed max-w-xs mb-8">
              Redefining modern elegance. Sustainably crafted, thoughtfully designed clothing for the contemporary wardrobe.
            </p>
            <div className="flex gap-4">
           
           
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Shop</h4>
            <ul className="space-y-4 text-[#E9E3DB]/60 text-sm font-medium">
              <FooterLink text="Women's Collection" />
              <FooterLink text="Men's Collection" />
              <FooterLink text="Kids & Baby" />
              <FooterLink text="Accessories" />
              <FooterLink text="Sale" />
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-[#E9E3DB]/60 text-sm font-medium">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Sustainability" />
              <FooterLink text="Terms of Service" />
              <FooterLink text="Privacy Policy" />
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Stay in the Loop</h4>
            <p className="text-[#E9E3DB]/60 text-sm mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="flex border-b border-[#E9E3DB]/30 pb-2 focus-within:border-[#C4BEB6] transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none w-full text-sm placeholder:text-[#E9E3DB]/30 text-white"
              />
              <button className="text-[#C4BEB6] hover:text-white transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#E9E3DB]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[#E9E3DB]/40">
          <p>© {new Date().getFullYear()} Lustre Fashion. All rights reserved.</p>
          <p className="tracking-wide">
            Designed & Developed by <span className="text-[#C4BEB6] font-bold">Netxium Design</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ text }) {
  return (
    <li>
      <a href="#" className="hover:text-[#C4BEB6] transition-colors inline-block hover:translate-x-1 duration-300">
        {text}
      </a>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full border border-[#E9E3DB]/20 flex items-center justify-center hover:bg-[#E9E3DB] hover:text-[#1A1A1A] transition-all duration-300">
      {icon}
    </a>
  );
}