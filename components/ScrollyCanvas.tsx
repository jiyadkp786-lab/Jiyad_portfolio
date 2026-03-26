'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface ScrollyCanvasProps {
  frameCount: number;
  directory: string;
  prefix?: string;
  suffix?: string;
  extension?: string | ((index: number) => string);
  height?: string;
  children?: React.ReactNode;
}

export default function ScrollyCanvas({
  frameCount,
  directory,
  prefix = 'frame_',
  suffix = '',
  extension = 'webp',
  height = '500vh',
  children
}: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const pad = (num: number) => num.toString().padStart(3, '0');
    
    // Clear old images if props change
    imagesRef.current = [];
    
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const ext = typeof extension === 'function' ? extension(i) : extension;
      // Ensure leading slash and no double slashes
      const cleanDirectory = directory.startsWith('/') ? directory.slice(1) : directory;
      img.src = `/${cleanDirectory}/${prefix}${pad(i)}${suffix}.${ext}`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= frameCount * 0.5) { // Start showing images earlier
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= frameCount * 0.5) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [frameCount, directory, prefix, suffix, extension]);

  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const images = imagesRef.current;
    const img = images[index];
    
    if (!img || !img.complete || img.naturalHeight === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = window.innerWidth * dpr;
    const canvasHeight = window.innerHeight * dpr;
    
    // Only resize and clear if needed/dimensions changed
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Use rounded coordinates to prevent sub-pixel blurring
    ctx.drawImage(
      img, 
      Math.round(offsetX), 
      Math.round(offsetY), 
      Math.round(drawWidth), 
      Math.round(drawHeight)
    );
  };

  useEffect(() => {
    if (loaded) {
      drawImage(Math.floor(scrollYProgress.get() * (frameCount - 1)));
    }
  }, [loaded, scrollYProgress, frameCount]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!loaded) return;
    const frameIndex = Math.floor(latest * (frameCount - 1));
    const safeIndex = Math.max(0, Math.min(frameCount - 1, frameIndex));
    drawImage(safeIndex);
  });

  return (
    <div ref={containerRef} className="relative w-full bg-[#121212]" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block" 
          style={{ 
            imageRendering: 'auto',
            filter: 'contrast(1.05) brightness(1.05) saturate(1.05)',
            transform: 'translateZ(0)' // Hardware acceleration
          }}
        />
        {children && React.cloneElement(children as React.ReactElement, { scrollYProgress })}
        {!loaded && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#121212]">
            <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

