'use client';

import React, { useRef, useEffect, useState, useMemo, useId } from 'react';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
}

const CurvedLoop: React.FC<CurvedLoopProps> = ({
  marqueeText = '',
  speed = 2,
  className = '',
  curveAmount = 150, // Adjusted for a more subtle look by default
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0\u00A0\u00A0';
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, '')}`;
  const pathD = `M-100,60 Q720,${60 + curveAmount} 1540,60`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const totalText = useMemo(() => {
    if (!spacing) return text;
    // Repeat text enough times to fill the path width
    return Array(Math.ceil(3000 / spacing) + 2).fill(text).join('');
  }, [text, spacing]);

  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    const initial = -spacing;
    if (textPathRef.current) {
      textPathRef.current.setAttribute('startOffset', `${initial}px`);
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame: number;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        
        if (newOffset <= -wrapPoint * 2) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        
        textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    
    if (newOffset <= -wrapPoint * 2) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    
    textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    if (Math.abs(velRef.current) > 0.5) {
      dirRef.current = velRef.current > 0 ? 'right' : 'left';
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#121212] py-20 flex items-center justify-center`}
      style={{ cursor: interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block text-[5rem] md:text-[8rem] font-black uppercase leading-none opacity-20 hover:opacity-100 transition-opacity duration-700"
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <text 
          ref={measureRef} 
          xmlSpace="preserve" 
          className="font-black"
          style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}
        >
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white shadow-2xl ${className}`}>
            <textPath 
              ref={textPathRef} 
              href={`#${pathId}`} 
              startOffset={`${offset}px`} 
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
      
      {/* Subtle Gradient Overlays for depth */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default CurvedLoop;
