'use client';

import React, { useState, useEffect } from 'react';
import { motion, MotionValue, useTransform, useMotionValue } from 'framer-motion';

interface WhatIDoProps {
  scrollYProgress?: MotionValue<number>;
}

// Typing Text Component that reacts to scroll progress
const TypewriterScrollText = ({ 
  text, 
  progress, 
  range, 
  className 
}: { 
  text: string; 
  progress: MotionValue<number>; 
  range: [number, number];
  className?: string;
}) => {
  const charCount = useTransform(progress, range, [0, text.length]);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    return charCount.on("change", (latest) => {
      setDisplayText(text.slice(0, Math.floor(latest)));
    });
  }, [charCount, text]);

  return <span className={className}>{displayText}</span>;
};

const ServiceCard = ({ title, description, tools, index, progress }: { 
  title: string; 
  description: string; 
  tools: string[]; 
  index: number;
  progress: MotionValue<number>;
}) => {
  // Shifting start time to align with frame 078 (78/191 ≈ 0.408)
  const baseStart = 0.408;
  const start = baseStart + index * 0.18;
  const end = start + 0.15;
  
  const opacity = useTransform(progress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.05, start, end, end + 0.05], [20, 0, 0, -20]);
  const pointerEvents = useTransform(progress, (latest) => 
    latest >= start && latest <= end ? ("auto" as const) : ("none" as const)
  );

  return (
    <motion.div 
      style={{ opacity, y, pointerEvents }}
      className="absolute inset-x-0 top-0 flex flex-col justify-start group"
    >
      <div className="relative w-full max-lg:max-w-md lg:max-w-xl">
        {/* Technical Corner Accents */}
        <div className="absolute -top-3 -left-3 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-white/70 group-hover:border-white transition-colors" />
        <div className="absolute -top-3 -right-3 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-white/70 group-hover:border-white transition-colors" />
        <div className="absolute -bottom-3 -left-3 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-white/70 group-hover:border-white transition-colors" />
        <div className="absolute -bottom-3 -right-3 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-white/70 group-hover:border-white transition-colors" />
        
        <div className="relative z-10 p-2">
          <h3 className="text-xl md:text-2xl font-satoshi font-semibold tracking-wider text-white mb-8 uppercase">
            <span className="text-white/40 mr-3">[</span>
            <TypewriterScrollText 
              text={title}
              progress={progress}
              range={[start, start + 0.05]}
            />
            <span className="text-white/40 ml-3">]</span>
          </h3>
          <p className="text-white/90 text-sm md:text-lg mb-10 leading-relaxed font-medium tracking-tight min-h-[4em] font-sans">
            <TypewriterScrollText 
              text={description}
              progress={progress}
              range={[start + 0.03, start + 0.12]}
            />
          </p>
          <div className="flex flex-wrap gap-4 font-mono">
            {tools.map((tool, tIndex) => {
              const toolStart = start + 0.08 + (tIndex * 0.01);
              return (
                <motion.span 
                  key={tool} 
                  style={{ opacity: useTransform(progress, [toolStart, toolStart + 0.01], [0, 1]) }}
                  className="text-[11px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 bg-white/[0.04] border border-white/10 text-white/60 group-hover:text-white group-hover:border-white/50 transition-all rounded-sm flex items-center gap-2.5 backdrop-blur-sm"
                >
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full" />
                  {tool}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function WhatIDo({ scrollYProgress }: WhatIDoProps) {
  const currentProgress = scrollYProgress || useMotionValue(0);
  
  // Heading appears starting from frame 10
  const titleOpacity = useTransform(currentProgress, [0.052, 0.1, 0.9, 0.95], [0, 1, 1, 0]);
  const titleX = useTransform(currentProgress, [0.052, 0.15], [20, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 p-12 md:p-24 flex justify-end font-sans">
      <div className="w-full max-w-xl flex flex-col items-end gap-24">
        
        {/* Top Right Grouping */}
        <div className="w-full flex flex-col items-end pt-[10vh]">
          {/* Small Title Header */}
          <motion.div 
            style={{ opacity: titleOpacity, x: titleX }}
            className="mb-20 text-right"
          >
            <div className="flex flex-col items-end gap-2 mb-8 opacity-60 font-mono">
              <span className="text-[11px] tracking-[0.4em] uppercase text-white font-bold">Process_Overview</span>
              <div className="w-32 h-px bg-white/40" />
            </div>
            <h2 className="text-6xl md:text-[120px] font-clash font-extrabold tracking-[-0.07em] text-white leading-[0.75] select-none uppercase">
              <TypewriterScrollText 
                text="What"
                progress={currentProgress}
                range={[0.052, 0.13]}
              />
              <br />
              <span>
                <TypewriterScrollText 
                  text="I Do_"
                  progress={currentProgress}
                  range={[0.13, 0.21]}
                />
              </span>
            </h2>
          </motion.div>

          {/* Cards Stacked Right Below Title */}
          <div className="relative w-full h-80 pointer-events-auto">
            <ServiceCard 
              index={0}
              progress={currentProgress}
              title="UX/UI Architecture"
              description="Structuring digital ecosystems with precision, focus on user mental models, and robust design systems."
              tools={["Figma", "Design Systems", "Blueprinting", "Prototyping"]}
            />
            <ServiceCard 
              index={1}
              progress={currentProgress}
              title="Interactive Prototyping"
              description="Bringing designs to life with functional prototypes that validate emotions and interactions early in the cycle."
              tools={["Framer Motion", "Lottie", "Interaction Design", "Rive"]}
            />
            <ServiceCard 
              index={2}
              progress={currentProgress}
              title="Creative Development"
              description="Translating complex visual concepts into pixel-perfect, performant code using modern frontend frameworks."
              tools={["Next.js", "Three.js", "Tailwind", "GSAP"]}
            />
          </div>
        </div>

      </div>
      
      {/* Background Glow - localized to top right */}
      <motion.div 
        style={{ opacity: titleOpacity }}
        className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-white/5 blur-[120px] -z-10 rounded-full translate-x-1/4 -translate-y-1/4"
      />
    </div>
  );
}
