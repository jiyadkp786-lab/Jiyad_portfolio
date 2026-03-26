'use client';

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-3xl border border-white/10 bg-zinc-900/90 backdrop-blur-xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] shadow-2xl overflow-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement | null, slot: any, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
};

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  onSwap?: (index: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'smooth';
  children: React.ReactNode;
}

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 3000,
  pauseOnHover = false,
  onCardClick,
  onSwap,
  skewAmount = 6,
  easing = 'smooth',
  children
}) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 0.9,
          durMove: 0.9,
          durReturn: 0.9,
          promoteOverlap: 0.8,
          returnDelay: 0.1
        }
      : {
          ease: 'power4.inOut',
          durDrop: 1.4,
          durMove: 1.4,
          durReturn: 1.4,
          promoteOverlap: 0.75,
          returnDelay: 0.1
        }, [easing]);

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  
  if (refs.current.length !== childArr.length) {
    refs.current = childArr.map((_, i) => refs.current[i] || React.createRef<HTMLDivElement>());
  }

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>();
  const container = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const total = refs.current.length;
    refs.current.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (isAnimating.current || order.current.length < 2) return;
      isAnimating.current = true;

      const [front, ...rest] = order.current;
      const elFront = refs.current[front].current;
      
      // Update the active index immediately when the swap starts
      if (onSwap && rest.length > 0) onSwap(rest[0]);

      if (!elFront) {
        isAnimating.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
          order.current = [...rest, front];
        }
      });
      tlRef.current = tl;

      // Drop front card
      tl.to(elFront, {
        y: '+=600',
        autoAlpha: 0,
        scale: 0.9,
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs.current[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: config.durMove,
          ease: config.ease
        }, 'promote');
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.set(elFront, { zIndex: backSlot.zIndex }, `promote+=${config.durMove * 0.5}`);
      
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        autoAlpha: 1,
        scale: 1,
        duration: config.durReturn,
        ease: config.ease
      }, `-=${config.durReturn * 0.8}`);
    };

    intervalRef.current = window.setInterval(swap, delay);

    const node = container.current;
    if (node) {
      const pause = () => {
        if (pauseOnHover) clearInterval(intervalRef.current);
      };
      const resume = () => {
        if (pauseOnHover) {
          clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(swap, delay);
        }
      };
      const handleTrigger = (e: any) => {
        if (e.type === 'touchstart') e.preventDefault();
        // swap(); // Removed forced swap on hover to keep it purely automatic
      };

      node.addEventListener('mouseenter', pause);
      node.addEventListener('touchstart', handleTrigger);
      node.addEventListener('mouseleave', resume);
      node.addEventListener('touchend', resume);

      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('touchstart', handleTrigger);
        node.removeEventListener('mouseleave', resume);
        node.removeEventListener('touchend', resume);
        clearInterval(intervalRef.current);
        if (tlRef.current) tlRef.current.kill();
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, skewAmount, config, onSwap]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          ref: refs.current[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="relative origin-bottom-right perspective-[1200px] overflow-visible"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
