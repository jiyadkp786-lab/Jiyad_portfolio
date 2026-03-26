'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'UI Design', level: 'Expert', icon: '🎨' },
  { name: 'UX Research', level: 'Advanced', icon: '🔍' },
  { name: 'Figma', level: 'Expert', icon: '📐' },
  { name: 'Design Systems', level: 'Expert', icon: '🍱' },
  { name: 'Mobile Apps', level: '12+ Apps', icon: '📱' },
  { name: 'Banking UX', level: '6+ Apps', icon: '🏦' },
  { name: 'Prototyping', level: 'Advanced', icon: '🕹️' },
  { name: 'HTML/CSS/JS', level: 'Basic', icon: '💻' },
  { name: 'Interaction', level: 'Fluent', icon: '✨' },
];

export default function SkillsSection() {
  return (
    <section className="py-32 px-12 md:px-24 bg-black relative overflow-hidden" id="skills">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          <div className="flex items-center gap-6">
            <div className="w-16 h-px bg-white/40" />
            <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-widest text-white">
              Experience_
            </h2>
          </div>
          <p className="max-w-md text-white/40 font-sans text-sm md:text-base leading-relaxed tracking-wider uppercase font-bold">
            Merging technical accuracy with aesthetic excellence to deliver user-centered digital products.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="group cursor-target p-8 border border-white/10 rounded-2xl flex items-center justify-between transition-all duration-500 bg-white/0 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] tracking-[0.4em] text-white/20 font-black uppercase font-mono">
                   {skill.level}
                 </span>
                 <h3 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight">
                   {skill.name}
                 </h3>
              </div>
              <span className="text-3xl filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                {skill.icon}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats / Accents */}
        <div className="mt-32 flex flex-wrap justify-between gap-12 border-t border-white/10 pt-16">
           <div className="flex flex-col gap-1">
             <span className="text-5xl md:text-7xl font-sans font-black text-white">06+</span>
             <span className="text-[11px] tracking-[0.5em] text-white/40 font-bold uppercase">Banking Projects</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-5xl md:text-7xl font-sans font-black text-white">12+</span>
             <span className="text-[11px] tracking-[0.5em] text-white/40 font-bold uppercase">Mobile Apps</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-5xl md:text-7xl font-sans font-black text-white">1.5+</span>
             <span className="text-[11px] tracking-[0.5em] text-white/40 font-bold uppercase">Years Exp_</span>
           </div>
        </div>
      </div>

      {/* Background Lighting */}
      <div className="absolute -bottom-[10%] -left-[10%] w-1/2 h-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
