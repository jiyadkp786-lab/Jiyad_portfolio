'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ 
  title, 
  description, 
  image, 
  link 
}: { 
  title: string; 
  description: string; 
  image: string; 
  link: string; 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-6 group cursor-pointer"
      onClick={() => window.open(link, '_blank')}
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden rounded-xl border border-white/20 shadow-2xl group-hover:border-white transition-colors duration-500">
        {/* Browser Top Bar - White Edition */}
        <div className="absolute top-0 inset-x-0 h-8 bg-white/95 backdrop-blur-md flex items-center px-4 gap-2 z-20 border-b border-black/5">
          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          <div className="ml-2 h-3.5 w-32 bg-black/5 rounded-full" />
        </div>
        
        <div className="absolute inset-0 pt-8">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/0 transition-colors duration-700" />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-[1.2]">
          {title}
        </h3>
        <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-sm">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm font-bold text-white mt-1 group/link">
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">→ View Case Study</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function HighlightShowcase() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: 4:13:58 AM GMT
      const timeStr = now.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZoneName: 'short'
      }).toUpperCase();
      setTime(timeStr);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#0b0b0b] py-24 md:py-32 px-8 md:px-20 lg:px-32 flex flex-col justify-center font-sans">
      <div className="max-w-[1700px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left Content Area (7 columns) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-24">
          <div className="flex flex-col gap-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-[90px] font-clash font-extrabold text-white leading-[0.8] tracking-[-0.05em] uppercase"
            >
              <span className="bg-white text-black px-2 mr-2">UI/UX Designer &</span>
              <br />
              <span className="bg-white text-black px-2 mr-2 leading-tight">Front End Developer</span>
              <span className="block mt-6">Strategist based</span>
              <span className="block mt-6 text-3xl md:text-5xl lg:text-7xl opacity-40 font-satoshi font-medium tracking-normal normal-case italic">in Kerala, India</span>
            </motion.h2>

            <div className="flex flex-col gap-4 mt-8 font-mono">
              <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm md:text-base">
                <span className="opacity-50">(Offline)</span>
                <span className="font-bold">Now, {time || '...'}</span>
              </div>
              <p className="text-zinc-400 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-xl font-satoshi font-medium">
                Enthusiastic about design, typography, and the dynamic areas of interaction design across the web. Specialised in building digital products that translate into accessible and functional experiences.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="bg-white text-black pl-5 pr-8 py-4 flex items-center gap-4 font-satoshi font-bold text-sm uppercase tracking-widest"
            >
              <span className="text-lg">→</span> My CV
            </motion.a>
            <motion.a 
              href="https://www.behance.net/jiyadkp"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="bg-[#1a1a1a] text-white pl-5 pr-8 py-4 flex items-center gap-4 font-satoshi font-bold text-sm border border-zinc-800 uppercase tracking-widest"
            >
              <span className="text-lg text-zinc-500">→</span> View All Work
            </motion.a>
          </div>
        </div>

        {/* Right Projects Area (5 columns) */}
        <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          <ProjectCard 
            title="Designing CinemaSteller: A Next-Generation Streaming Interface"
            description="Crafting a cinematic movie discovery experience with a focus on immersive visuals and personalization."
            image="/cinemasteller.png"
            link="https://www.behance.net/gallery/209448941/-CinemaSteller-Movie-Streaming-App-Design"
          />
          <ProjectCard 
            title="Modernizing Global Property Discovery Platforms"
            description="Reimagining the real estate search experience with high-fidelity UI and intuitive property architectures."
            image="/realestate.png"
            link="https://www.behance.net/gallery/201170941/Real-state-Website"
          />
        </div>

      </div>
    </section>
  );
}
