'use client';

import React, { useRef, useEffect } from 'react';
import { motion, MotionValue, useMotionValue, useTransform } from 'framer-motion';

interface LaptopOverlayProps {
  scrollYProgress?: MotionValue<number>;
}

const LaptopOverlay: React.FC<LaptopOverlayProps> = ({ scrollYProgress }) => {
  const progress = scrollYProgress || useMotionValue(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Text overlays
  const leftTextOpacity  = useTransform(progress, [0.42, 0.52, 0.65, 0.72], [0, 1, 1, 0]);
  const rightTextOpacity = useTransform(progress, [0.70, 0.78, 0.93, 0.98], [0, 1, 1, 0]);

  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.src = '/realestate.png';
    img.onload = () => { imgRef.current = img; };
  }, []);

  // Draw design onto canvas whenever scroll changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = (prog: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !imgRef.current) return;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Screen not visible before progress 0.40
      if (prog < 0.40) return;
      const fadeIn = Math.min(1, (prog - 0.40) / 0.10);
      const fadeOut = prog > 0.94 ? Math.max(0, 1 - (prog - 0.94) / 0.06) : 1;
      ctx.globalAlpha = fadeIn * fadeOut;

      // Interpolation helper
      const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
      const t = Math.max(0, Math.min(1, (prog - 0.47) / (0.68 - 0.47)));

      // Screen bounding box as % of canvas (tilted → front-on)
      const sx = lerp(0.475, 0.295, t) * W;
      const sy = lerp(0.05,  0.12,  t) * H;
      const sw = lerp(0.20,  0.41,  t) * W;
      const sh = lerp(0.30,  0.46,  t) * H;

      // Draw image in screen region
      ctx.save();
      if (t < 1) {
        const skewFactor = (1 - t) * 0.04;
        ctx.transform(1, skewFactor, -skewFactor * 0.5, 1, sx, sy);
        ctx.drawImage(imgRef.current, 0, 0, sw, sh);
      } else {
        ctx.drawImage(imgRef.current, sx, sy, sw, sh);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw(progress.get());
    };

    resize();
    window.addEventListener('resize', resize);
    const unsub = progress.on('change', draw);

    return () => {
      window.removeEventListener('resize', resize);
      unsub();
    };
  }, [progress]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-mono">

      {/* Canvas layer for compositing the design onto the laptop screen */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-80"
      />

      {/* ── LEFT TEXT ── */}
      <motion.div
        style={{ opacity: leftTextOpacity }}
        className="absolute bottom-40 left-12 md:left-24 flex flex-col gap-6"
      >
        <div className="flex items-center gap-4">
          <span className="w-12 h-px bg-cyan-500" />
          <span className="text-[12px] font-black tracking-[0.5em] text-cyan-500 uppercase">
            CASE_STUDY_01
          </span>
        </div>
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
          [ CRAFTED WITH_<br />
          <span className="text-cyan-500">PRECISION_</span> ]
        </h2>
        <div className="flex gap-6 mt-2">
          <span className="text-[11px] text-white/60 tracking-widest uppercase italic font-bold">TYPE: MOBILE APP</span>
          <span className="text-[11px] text-white/60 tracking-widest uppercase italic font-bold">YEAR: 2024</span>
        </div>
      </motion.div>

      {/* ── RIGHT TEXT ── */}
      <motion.div
        style={{ opacity: rightTextOpacity }}
        className="absolute bottom-40 right-12 md:right-24 flex flex-col items-end gap-6 text-right pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-black tracking-[0.5em] text-cyan-500 uppercase">
            MARKETPLACE_V1
          </span>
          <span className="w-12 h-px bg-cyan-500" />
        </div>
        <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] mb-4">
          REAL ESTATE_<br />
          <span className="text-cyan-500">WEBSITE_UI</span>
        </h2>
        <motion.a
          href="https://www.behance.net/gallery/208665169/Real-Estate-Website-UI"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, x: -5, backgroundColor: '#00f3ff', color: '#000' }}
          className="mt-8 flex items-center gap-4 text-[12px] font-black tracking-[0.3em] text-white/70 uppercase border-[1.5px] border-white/20 px-10 py-4 rounded-sm hover:text-black hover:border-cyan-500 transition-all bg-white/[0.04] backdrop-blur-md"
        >
          VIEW_CASE_STUDY [→]
        </motion.a>
      </motion.div>

    </div>
  );
};


export default LaptopOverlay;
