'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardSwap, { Card } from './CardSwap';

const SelectedWorks = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'ZenTrade',
      description: 'Modern trading platform designed for clarity and rapid decision making with real-time tracking.',
      tags: ['Fintech', 'Trading', 'Mobile UI', 'Figma'],
      color: 'from-blue-600/40',
      image: '/zentrade.webp',
      behance: 'https://www.behance.net/gallery/238547899/ZenTrade-Modern-Trading-App-UIUX-Case-Study'
    },
    {
      id: 2,
      title: 'Zayfinn Banking',
      description: 'Streamlined digital banking app focused on wallet management and secure payment interactions.',
      tags: ['Banking', 'Fintech', 'Mobile App', 'UI/UX'],
      color: 'from-emerald-600/40',
      image: '/zayfinn.png',
      behance: 'https://www.behance.net/gallery/229455443/Banking-Service-App'
    },
    {
      id: 3,
      title: 'CinemaSteller',
      description: 'A cinematic movie streaming case study featuring personalized discovery and a high-fidelity video player.',
      tags: ['Streaming', 'UI/UX', 'Figma', 'Case Study'],
      color: 'from-red-600/40',
      image: '/cinemasteller.png',
      behance: 'https://www.behance.net/gallery/209448941/-CinemaSteller-Movie-Streaming-App-Design'
    },
    {
      id: 4,
      title: 'Burger Corner',
      description: 'Vibrant food delivery application optimized for high engagement and seamless checkout flows.',
      tags: ['Food Delivery', 'Product Design', 'Figma'],
      color: 'from-orange-600/40',
      image: '/burger-corner.png',
      behance: 'https://www.behance.net/gallery/208191733/Burger-corner-Burger-APP'
    },
  ];

  return (
    <section className="relative z-10 bg-black py-60 px-12 md:px-20 lg:px-32 min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="max-w-[1800px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32 items-center">
        
        {/* Left Side: Content (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-12 min-h-[500px] justify-center text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] tracking-[0.5em] text-white/30 font-bold mb-8 font-mono">
              [ selection_v.01 ]
            </span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[120px] font-clash font-extrabold tracking-[-0.07em] text-white leading-[0.85] uppercase"
            >
              Selected<br />
              <span>Works_</span>
            </motion.h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8 border-l-[2px] border-white/10 pl-10"
            >
              <h3 className="text-3xl md:text-5xl font-clash font-black text-white tracking-tighter uppercase">
                {projects[activeIndex].title}
              </h3>
              <p className="text-lg md:text-2xl text-white/70 max-w-xl font-medium leading-relaxed tracking-tight">
                {projects[activeIndex].description}
              </p>
              <div className="flex flex-wrap gap-4 font-mono">
                {projects[activeIndex].tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-[11px] font-bold tracking-[0.3em] uppercase py-2.5 px-6 bg-white/[0.03] border border-white/10 text-white/50 rounded-sm">{tag}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex gap-16 mt-16 bg-white/[0.02] border border-white/10 p-10 rounded-sm self-start backdrop-blur-md font-mono">
            <div className="flex flex-col">
              <span className="text-white font-clash font-black text-5xl tabular-nums tracking-tighter decoration-cyan-500/50 underline-offset-8 underline decoration-1">12+</span>
              <span className="text-white/40 text-[11px] font-satoshi font-bold uppercase tracking-[0.4em] mt-4">Projects_Done</span>
            </div>
            <div className="w-[1px] h-20 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-white font-clash font-black text-5xl tabular-nums tracking-tighter decoration-cyan-500/50 underline-offset-8 underline decoration-1">1.5</span>
              <span className="text-white/40 text-[11px] font-satoshi font-bold uppercase tracking-[0.4em] mt-4">Years_Experience</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Card Stack (5 columns) */}
        <div className="lg:col-span-5 relative flex items-center justify-center scale-90 lg:scale-110 translate-y-12">
          {/* Decorative Grid BG behind cards */}
          <div className="absolute inset-x-0 inset-y-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] w-[120%] h-[120%]" />
          
          <CardSwap 
            width={700} 
            height={500} 
            delay={3500} 
            pauseOnHover={false}
            cardDistance={60}
            verticalDistance={45}
            easing="smooth"
            onSwap={setActiveIndex}
            onCardClick={(i) => window.open(projects[i].behance, '_blank')}
          >
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="p-10 flex flex-col justify-between group cursor-pointer hover:border-white transition-all duration-700 overflow-hidden border border-white/20 bg-black"
                style={{ 
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  imageRendering: 'auto',
                  filter: 'contrast(1.1) brightness(1.1) saturate(1.1)',
                }}
              >
                {/* Visual Clarity Lighting Effects */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5 opacity-50 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Dynamic Lighting Beam */}
                <motion.div 
                  initial={{ rotate: -45, x: '-150%' }}
                  animate={{ x: '250%' }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                />

                {/* Card Corners */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t-[2px] border-l-[2px] border-white/40 group-hover:border-white transition-all duration-500" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-[2px] border-r-[2px] border-white/40 group-hover:border-white transition-all duration-500" />

                <div className="relative z-10 p-2 flex justify-between items-end h-full font-mono">
                   <div className="flex flex-col gap-2 group-hover:translate-y-[-5px] transition-all duration-700">
                     <span className="text-[11px] font-black tracking-[0.4em] text-white/60 drop-shadow-md">ARCHIVE_ID: {project.id}</span>
                     <span className="text-[20px] font-black text-white uppercase tracking-widest drop-shadow-xl font-sans">{project.title}</span>
                   </div>
                   
                   <div className="flex items-center gap-6 group/btn translate-y-2 group-hover:translate-y-[-5px] transition-all duration-700">
                     <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white font-bold drop-shadow-md">PROJECT_PREVIEW</span>
                     <div className="w-16 h-[2px] bg-white/30 group-hover:bg-white group-hover:w-24 transition-all duration-700"></div>
                   </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>

      </div>
    </section>
  );
};

export default SelectedWorks;
