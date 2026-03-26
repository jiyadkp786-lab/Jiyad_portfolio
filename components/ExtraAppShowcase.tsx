'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const ExtraAppShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  const screens = [
    { title: 'Onboarding Intro', src: '/extra-app/onboarding-intro.png' },
    { title: 'Mobile Login', src: '/extra-app/onboarding-phone.png' },
    { title: 'OTP Verification', src: '/extra-app/onboarding-otp.png' },
    { title: 'KYC Verification', src: '/extra-app/identity-verification.png' },
    { title: 'Home Dashboard', src: '/extra-app/home-dashboard.png' },
    { title: 'Wallet Dashboard', src: '/extra-app/wallet-dashboard.png' },
    { title: 'Wallet Balance', src: '/extra-app/wallet-balance.png' },
    { title: 'Payment Methods', src: '/extra-app/payment-methods.png' },
    { title: 'Gold Rewards', src: '/extra-app/gold-rewards.png' },
    { title: 'Transaction History', src: '/extra-app/history-list.png' },
    { title: 'Cashback Rewards', src: '/extra-app/cashback-rewards.png' },
    { title: 'Success State', src: '/extra-app/transaction-success.png' },
  ];

  // Double screens for infinite loop
  const displayScreens = [...screens, ...screens];

  return (
    <section 
      ref={containerRef}
      className="relative z-10 bg-black font-sans overflow-hidden min-h-[100vh]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="px-8 md:px-20 lg:px-32 mb-12 relative z-20 text-left">
          <motion.div style={{ opacity, scale }}>
            <span className="text-[10px] md:text-[12px] tracking-[0.5em] text-white/30 font-bold mb-4 block font-mono">
              [ arch_v.05 ]
            </span>
            <h2 className="text-5xl md:text-[110px] font-clash font-extrabold text-white tracking-[-0.07em] leading-[0.85] uppercase">
              Recent<br />
              <span>Work_</span>
            </h2>
          </motion.div>
        </div>

        {/* Automatic Sliding Container */}
        <div className="relative h-[80vh] flex items-center overflow-hidden">
          <motion.div 
            animate={{ x: [0, "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 h-full items-center"
          >
            {/* Added a spacer to match initial offset if needed, but flex gap is enough */}
            {displayScreens.map((screen, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative flex-shrink-0 h-[65vh] md:h-[80vh] aspect-[9/19.5] group cursor-cell"
              >
                {/* Full-View Image (No Background Frame) */}
                <div className="absolute inset-0 overflow-hidden bg-transparent">
                  <Image 
                    src={screen.src} 
                    alt={screen.title}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    sizes="80vh"
                    priority={index < 3}
                  />
                  
                  {/* Subtle Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                </div>

                {/* Case Study Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-14 pt-32 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] text-white/60 font-bold uppercase">Work_Id: 00{index % screens.length + 1}</span>
                    <h3 className="text-2xl md:text-3xl font-satoshi font-semibold text-white tracking-widest uppercase">{screen.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Technical Progress Bar */}
        <div className="absolute bottom-10 left-8 md:left-20 right-8 md:right-20 flex flex-col gap-4">
          <div className="h-[2px] w-full bg-white/5 overflow-hidden">
            <motion.div 
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
              className="h-full bg-white/60"
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] md:text-[11px] tracking-[0.3em] text-white/20 uppercase font-black uppercase">
            <span>Systems_Check // active</span>
            <span>Recent_Work // v.1.5.8</span>
            <span>Scale_Full // 100%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraAppShowcase;
