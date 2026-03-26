'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const navItems = [
    { label: 'Works', href: '#works' },
    { label: 'Behance', href: 'https://www.behance.net/jiyadkp' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 w-full z-[100] px-8 py-8 md:px-20 lg:px-32"
    >
      <div className="max-w-[1800px] mx-auto flex justify-between items-center px-10 py-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 cursor-target">
          <span className="text-white font-clash font-extrabold text-xl md:text-2xl tracking-[-0.05em] whitespace-nowrap uppercase">
            Portfolio
          </span>
        </div>

        {/* Center: Gooey Nav */}
        <div className="hidden md:flex items-center cursor-target">
          <GooeyNav items={navItems} />
        </div>

        {/* Right: CTA & Utils */}
        <div className="flex items-center gap-6">
          <motion.a 
            href="/Mohammed jiyadh Resume.pdf"
            target="_blank"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:flex items-center gap-3 bg-white text-black pl-5 pr-8 py-3 font-satoshi font-bold text-[12px] tracking-widest group uppercase"
          >
            <span>→</span> My CV
          </motion.a>
          
          {/* Lock Icon Placeholder */}
          <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-sm hover:border-white/60 transition-colors cursor-pointer group">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 group-hover:opacity-100 transition-opacity">
              <rect x="2" y="7" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 7V4C4 2.34315 5.34315 1 7 1C8.65685 1 10 2.34315 10 4V7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
