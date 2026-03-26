'use client';

import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

const CornerBox = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative p-8 ${className}`}>
    {/* Minimal Corner Accents */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-white/80" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-white/80" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-white/80" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-white/80" />
    {children}
  </div>
);

export default function Overlay({ scrollYProgress }: { scrollYProgress?: MotionValue<number> }) {
  if (!scrollYProgress) return null;
  
  // Section 1 (Visible 0% -> 20%)
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Section 2 (Visible 25% -> 50%)
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.5], [100, -100]);

  // Section 3 (Visible 55% -> 85%)
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.85], [100, -100]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-12 flex flex-col items-center justify-center font-sans tracking-tight">
      
      {/* Section 1 - Hero */}
      <motion.div 
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col justify-center w-full px-12 md:px-40 -mt-[5vh]"
      >
        <span className="text-[12px] tracking-[0.5em] text-white font-black mb-10 uppercase font-mono flex items-center gap-4">
          <span className="w-10 h-px bg-white/40" />
          [ welcome to the prototype_01 ]
        </span>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-20">
          {/* Name removed to Loading Screen as per request */}
          <div className="flex-1" />
          
          <div className="flex justify-end pb-4">
            <CornerBox className="">
              <p className="text-sm md:text-xl text-white font-black tracking-[0.2em] text-right uppercase">
                UI/UX Designer +<br />
                User Experience
              </p>
            </CornerBox>
          </div>
        </div>
      </motion.div>

      {/* Section 2 - About */}
      <motion.div 
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-y-0 left-0 flex flex-col justify-center w-full md:w-3/5 pl-12 md:pl-40"
      >
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-px bg-white/80" />
          <h2 className="text-4xl md:text-6xl font-satoshi font-semibold tracking-[0.1em] uppercase text-white">
            01_About
          </h2>
        </div>
        <CornerBox className="bg-white/[0.03] border border-white/10 max-w-2xl backdrop-blur-md">
          <p className="text-lg md:text-2xl text-white/90 font-medium leading-relaxed tracking-tight text-left">
            UI/UX designer with 1.5+ years of experience working across fintech, healthcare, and web platforms. Designed 6+ banking apps along with multiple mobile apps and websites, focusing on usability, clarity, and clean visual systems. I also have a basic understanding of HTML and CSS, helping me create developer-friendly designs.
          </p>
          <div className="mt-12 pt-12 border-t border-white/10 flex gap-20 font-mono">
            <div className="flex flex-col">
              <span className="text-[11px] text-white/40 tracking-widest uppercase mb-2 font-bold opacity-60">Status_</span>
              <span className="text-[14px] text-white font-bold opacity-80">open for interaction</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-white/40 tracking-widest uppercase mb-2 font-bold opacity-60">Location_</span>
              <span className="text-[14px] text-white font-bold uppercase tracking-widest">india / remote</span>
            </div>
          </div>
        </CornerBox>
      </motion.div>

      {/* Section 3 - Philosophy */}
      <motion.div 
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-y-0 right-0 flex flex-col justify-center items-end w-full md:w-3/5 pr-12 md:pr-40"
      >
        <div className="flex items-center gap-6 mb-12">
          <h2 className="text-4xl md:text-6xl font-satoshi font-semibold tracking-[0.1em] uppercase text-white">
            02_Philosophy
          </h2>
          <div className="w-16 h-px bg-white/80" />
        </div>
        <CornerBox className="bg-white/[0.03] border border-white/10 max-w-xl text-right backdrop-blur-md">
          <p className="text-xl md:text-3xl text-white font-medium leading-tight tracking-tight">
            "Good design is not just about visuals—it's about <span className="text-white underline decoration-1 underline-offset-8">clarity_</span>, usability, and purpose. Every interface should simplify complexity and make the user feel in <span className="text-white underline decoration-1 underline-offset-8">control_</span>"
          </p>
        </CornerBox>
      </motion.div>

    </div>
  );
}
