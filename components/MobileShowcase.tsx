'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MobileShowcase = () => {
  return (
    <section className="relative z-10 bg-black py-32 md:py-48 px-8 md:px-20 lg:px-32 overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full -z-10 translate-x-1/4" />
      
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Left Side: Matching Caption */}
          <div className="flex flex-col gap-8 text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[12px] tracking-[0.6em] text-white/30 font-bold mb-6 block font-mono">
                [ interface_v.02 ]
              </span>
              <h2 className="text-5xl md:text-8xl font-clash font-extrabold text-white tracking-[-0.05em] leading-[0.9] uppercase mb-8">
                SEAMLESS<br />
                <span className="text-white/40">DIGITAL EXPERIENCES_</span>
              </h2>
              <p className="text-lg md:text-2xl text-white/60 max-w-xl font-satoshi font-medium leading-relaxed tracking-tight">
                Designing intuitive, user-centered mobile and web interfaces 
                that enhance usability and create meaningful interactions.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Smartphone Mockup with Button Down */}
          <div className="flex flex-col items-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] md:aspect-square flex flex-col items-center justify-center p-8 group mb-12"
            >
              <Image 
                src="/Hand holding smartphone mockup.png"
                alt="Mobile App Mockup"
                width={800}
                height={1000}
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              
              {/* Decorative Circle behind image */}
              <div className="absolute inset-x-0 inset-y-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(circle_at_50%_50%,#000_20%,transparent_100%)] w-full h-full" />
            </motion.div>

            {/* View All Button - Placed literally "image down" */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <a 
                href="https://www.behance.net/gallery/246456505/Tippay" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-6 px-14 py-6 bg-white/[0.04] border border-white/20 text-white font-mono text-[11px] font-black tracking-[0.5em] uppercase rounded-full hover:bg-white hover:text-black transition-all duration-700 overflow-hidden shadow-2xl backdrop-blur-md"
              >
                <span className="relative z-10">VIEW_ALL_WORKS</span>
                <div className="w-10 h-px bg-white/30 group-hover:w-16 group-hover:bg-black/60 transition-all duration-700 relative z-10" />
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
