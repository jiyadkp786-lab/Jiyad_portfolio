'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onEnter: () => void;
}

export default function LoadingScreen({ onEnter }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showExplore, setShowExplore] = useState(false);
  const [isExplored, setIsExplored] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = 192;
  const pauseFrame = 90; // Frame where the door is open and character is aside
  const frameRequestRef = useRef<number>();

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const pad = (num: number) => num.toString().padStart(3, '0');
    
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/loading_sequence/frame_${pad(i)}_delay-0.041s.webp`;
      
      img.onload = () => {
        loadedCount++;
        const p = Math.floor((loadedCount / frameCount) * 100);
        setProgress(p);
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, []);

  // Animation Control
  useEffect(() => {
    if (!loaded) return;

    let startTime: number | null = null;
    const fps = 24; 
    const frameDuration = 1000 / fps;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      
      let nextFrame;
      if (!isExplored) {
        // Just show the first frame and wait for click
        setCurrentFrame(0);
        drawFrame(0);
        setShowExplore(true);
        return; 
      } else {
        // Start animation from 0 to end after click
        nextFrame = Math.floor(elapsed / frameDuration);
        if (nextFrame >= frameCount) {
          onEnter();
          return;
        }
      }

      setCurrentFrame(nextFrame);
      drawFrame(nextFrame);
      frameRequestRef.current = requestAnimationFrame(animate);
    };

    frameRequestRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [loaded, isExplored]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = w;
      drawHeight = w / imgRatio;
      offsetX = 0;
      offsetY = (h - drawHeight) / 2;
    } else {
      drawWidth = h * imgRatio;
      drawHeight = h;
      offsetX = (w - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const handleExplore = () => {
    setIsExplored(true);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center select-none"
    >
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ 
          filter: 'contrast(1.1) brightness(1.1) saturate(1.1)',
          imageRendering: 'crisp-edges'
        }}
        animate={{
            scale: isExplored && currentFrame > 140 ? 4 : 1,
            opacity: isExplored && currentFrame > 180 ? 0 : 1,
            filter: isExplored && currentFrame > 170 ? 'brightness(0)' : 'contrast(1.1) brightness(1.1) saturate(1.1)'
        }}
        transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
      />

      {/* Large Vertical Name on the Left */}
      {!isExplored && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute left-12 md:left-24 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <h1 className="font-sans uppercase flex flex-col leading-none tracking-[0.2em]">
            <span className="text-[14px] md:text-[18px] font-bold text-white/40 mb-3">MOHAMMED</span>
            <span className="text-5xl md:text-8xl font-black text-white">JIYADH</span>
          </h1>
        </motion.div>
      )}

      <AnimatePresence>
        {!loaded && (
          <motion.div
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
             <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full font-mono uppercase">
               <motion.div 
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: progress / 100 }}
                 className="absolute inset-0 bg-white origin-left"
               />
             </div>
             <span className="text-[10px] tracking-[0.5em] text-white/40 font-black uppercase font-mono">
               Synthesizing_Environment: {progress}%
             </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-[15%] flex justify-center z-20">
        <AnimatePresence>
          {showExplore && !isExplored && (
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExplore}
                className="group cursor-target relative px-16 py-6 overflow-hidden rounded-full border border-white/20 transition-all duration-500"
              >
              <div className="absolute inset-0 bg-white group-hover:bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 blur-xl group-hover:opacity-100 transition-opacity" />
              
              <span className="relative z-10 text-[12px] font-black tracking-[0.6em] text-white group-hover:text-black uppercase font-mono italic">
                EXPLORE_
              </span>
              
              {/* Pulsing Glow */}
              <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-x-0 bottom-0 h-px bg-white blur-md"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {!isExplored && (
        <div className="absolute inset-x-0 bottom-12 px-12 md:px-24 flex justify-between items-end pointer-events-none z-30">
           <div className="flex flex-col gap-1.5 font-mono text-[9px] text-white/10 tracking-[0.5em] uppercase text-left">
             <span>Protocol: Loading_v.1</span>
             <span>Status: {loaded ? 'Interfaced' : 'Acquiring_'}</span>
           </div>
           
           <div className="flex flex-col items-end text-right gap-3">
             <motion.span 
               initial={{ opacity: 0 }}
               animate={{ opacity: loaded ? 0.3 : 0 }}
               className="text-[10px] md:text-[11px] tracking-[0.6em] text-white font-bold uppercase font-sans"
             >
               Crafting_Gen_Interactions
             </motion.span>
             <div className="w-48 h-px bg-white/10" />
           </div>
        </div>
      )}
    </motion.div>
  );
}
