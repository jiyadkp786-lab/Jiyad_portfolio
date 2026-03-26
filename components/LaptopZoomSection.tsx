'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import {
  useScroll, useTransform, useMotionValueEvent,
  useSpring, motion, MotionValue,
} from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy-load Hyperspeed (avoids SSR issues with Three.js)
const Hyperspeed = dynamic(() => import('./Hyperspeed'), { ssr: false });

/* ──────────────────────────────────────────────────────────────────────────
   MotionBlurWrapper — applies CSS blur via direct DOM mutation (no re-render)
────────────────────────────────────────────────────────────────────────── */
function MotionBlurWrapper({
  blurAmount,
  children,
}: {
  blurAmount: MotionValue<number>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMotionValueEvent(blurAmount, 'change', (v) => {
    if (ref.current) ref.current.style.filter = v > 0.2 ? `blur(${v.toFixed(2)}px)` : 'none';
  });
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }}>{children}</div>;
}

/* ──────────────────────────────────────────────────────────────────────────
   ZoomLabel — "Featured Work" text that fades in then drifts away
────────────────────────────────────────────────────────────────────────── */
function ZoomLabel({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.04, 0.14, 0.35, 0.48], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [0.04, 0.16], [18, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none text-center select-none"
    >
      <span className="text-[9px] tracking-[0.6em] text-cyan-400 uppercase font-black">Featured Work</span>
      <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight leading-tight">
        Real Estate Website
      </h2>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Main Section
────────────────────────────────────────────────────────────────────────── */
export default function LaptopZoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const imagesRef    = useRef<HTMLImageElement[]>([]);
  const lastIdxRef   = useRef<number>(-1);
  const [loaded, setLoaded]           = useState(false);
  const [showHyperspeed, setShowHyperspeed] = useState(false);
  const FRAME_COUNT = 192;

  /* ── Scroll progress ─────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 18, mass: 0.35 });

  /* ── Animation map ───────────────────────────────────────────────────────
     Phase 0  (0.00–0.06)  : black curtain opens, laptop fades in at distance
     Phase 1  (0.06–0.50)  : slow cinematic glide toward laptop screen
     Phase 2  (0.50–0.78)  : exponential zoom punch — Hyperspeed appears on screen
     Phase 3  (0.78–0.92)  : full punch-through, canvas vignette shrinks
     Phase 4  (0.92–1.00)  : Hyperspeed fills entire viewport, laptop gone
  ───────────────────────────────────────────────────────────────────────── */

  // Main scale of the laptop canvas
  const scale = useTransform(smooth,
    [0,    0.06,  0.50,  0.78,  1.0 ],
    [0.78, 0.86,  1.04,  8.0,   22  ]
  );

  // Nudge viewport toward the screen (not the base)
  const yShift = useTransform(smooth, [0, 0.50, 0.80], ['0%', '0%', '-5%']);

  // Laptop canvas opacity — fades out when we punch through
  const canvasOpacity = useTransform(smooth, [0, 0.06, 0.68, 0.86], [0, 1, 1, 0]);

  // Full-black curtain: covers at start and end
  const overlayOpacity = useTransform(smooth, [0, 0.05, 0.75, 0.90], [1, 0, 0, 1]);

  // Cinematic edge vignette
  const vignetteOpacity = useTransform(smooth, [0, 0.10, 0.50, 0.86], [0.92, 0.55, 0.32, 0.98]);

  // Motion blur peaks during fast punch
  const blurAmount = useTransform(smooth, [0.48, 0.65, 0.82, 1.0], [0, 6, 16, 0]);

  // Hyperspeed overlay: fades in as we zoom into the screen then fills
  const hyperspeedOpacity = useTransform(smooth, [0.42, 0.60, 0.80, 0.92], [0, 0.85, 1, 1]);

  // Hyperspeed scale: starts small (inside the laptop screen rect) → full vp
  // These numbers represent CSS scale, so 1 = normal size
  const hyperspeedScale = useTransform(smooth, [0.42, 0.80, 0.92], [0.22, 0.22, 1.0]);

  // Hyperspeed border radius: rounded while inside screen, sharp when full-screen
  const hyperspeedBorderRadius = useTransform(smooth, [0.42, 0.88], ['8px', '0px']);

  // Scroll hint
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Show/hide Hyperspeed (avoids 3D context running while off screen)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowHyperspeed(v > 0.35);
  });

  /* ── Preload laptop sequence frames ─────────────────────────────────── */
  useEffect(() => {
    let done = 0;
    const pad = (n: number) => String(n).padStart(3, '0');
    const imgs: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = `/sequence_laptop/frame_${pad(i)}.webp`;
      img.onload = img.onerror = () => {
        done++;
        if (done >= Math.floor(FRAME_COUNT * 0.4)) setLoaded(true);
      };
      return img;
    });
    imagesRef.current = imgs;
  }, []);

  /* ── Canvas drawing ───────────────────────────────────────────────────── */
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalHeight) return;

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth * dpr, H = window.innerHeight * dpr;

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ir = img.width / img.height, cr = W / H;
    let dw: number, dh: number, ox: number, oy: number;
    if (cr > ir) { dw = W; dh = W / ir; ox = 0; oy = (H - dh) / 2; }
    else         { dw = H * ir; dh = H; ox = (W - dw) / 2; oy = 0; }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, Math.round(ox), Math.round(oy), Math.round(dw), Math.round(dh));
  };

  useEffect(() => {
    if (!loaded) return;
    drawFrame(Math.floor(scrollYProgress.get() * (FRAME_COUNT - 1)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!loaded) return;
    const idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(v * (FRAME_COUNT - 1))));
    if (idx !== lastIdxRef.current) { lastIdxRef.current = idx; drawFrame(idx); }
  });

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '700vh' }}>

      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* ── Laptop sequence (zooms toward screen) ──────────────────── */}
        <motion.div
          className="absolute inset-0"
          style={{ scale, y: yShift, opacity: canvasOpacity, transformOrigin: '50% 41%' }}
        >
          <MotionBlurWrapper blurAmount={blurAmount}>
            <canvas ref={canvasRef} className="w-full h-full block" style={{ imageRendering: 'auto' }} />
          </MotionBlurWrapper>
        </motion.div>

        {/* ── Hyperspeed — appears inside the laptop screen, then fills vp ─ */}
        {showHyperspeed && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-5"
            style={{
              opacity: hyperspeedOpacity,
              scale: hyperspeedScale,
              // As scale reaches 1 the clip naturally fills the whole viewport
              transformOrigin: '50% 41%',
              borderRadius: hyperspeedBorderRadius,
            }}
          >
            <Suspense fallback={null}>
              <Hyperspeed />
            </Suspense>
          </motion.div>
        )}

        {/* ── Cinematic vignette ────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ opacity: vignetteOpacity }}
        >
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 66% 66% at 50% 50%, transparent 24%, rgba(0,0,0,0.97) 100%)',
          }} />
        </motion.div>

        {/* ── Black curtain (opening + closing) ────────────────────── */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none z-30"
          style={{ opacity: overlayOpacity }}
        />

        {/* ── Section label ─────────────────────────────────────────── */}
        <ZoomLabel scrollYProgress={scrollYProgress} />

        {/* ── Scroll hint ───────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 pointer-events-none"
        >
          <span className="text-[10px] tracking-[0.45em] text-white/25 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)' }}
          />
        </motion.div>

        {/* ── Loading state ─────────────────────────────────────────── */}
        {!loaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div
                className="absolute inset-0 rounded-full border-t border-cyan-500 animate-spin"
                style={{ animationDuration: '0.9s' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
