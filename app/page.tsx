'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScrollyCanvas from '@/components/ScrollyCanvas';
import Overlay from '@/components/Overlay';
import WhatIDo from '@/components/WhatIDo';
import Navbar from '@/components/Navbar';
import ScrollVelocity from '@/components/ScrollVelocity';
import SelectedWorks from '@/components/SelectedWorks';
import ExtraAppShowcase from '@/components/ExtraAppShowcase';
import ContactSection from '@/components/ContactSection';
import HighlightShowcase from '@/components/HighlightShowcase';
import MobileShowcase from '@/components/MobileShowcase';
import LoadingScreen from '@/components/LoadingScreen';
import SkillsSection from '@/components/SkillsSection';

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <main className="min-h-screen bg-black flex flex-col selection:bg-cyan-500/20">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <LoadingScreen key="loading" onEnter={() => setHasEntered(true)} />
        ) : (
          <div key="content" className="flex flex-col">
            <Navbar />
            
            {/* First Section */}
            <ScrollyCanvas 
              frameCount={120} 
              directory="sequence" 
              suffix="_delay-0.066s"
              extension="webp"
            >
              <Overlay />
            </ScrollyCanvas>

            <ScrollVelocity 
              texts={[
                'Creating high-end digital experiences with a focus on immersive interaction and visual storytelling.',
                'Creative technologist, UI/UX expert, and digital designer building the future of the web.'
              ]} 
              velocity={50}
              className="text-white/5 hover:text-cyan-500/80 transition-colors duration-500 uppercase font-bold"
            />

            {/* Second Section - 3D Avatar Sequence with What I Do Overlay */}
            <ScrollyCanvas 
              frameCount={192} 
              directory="avatar_sequence" 
              suffix="_delay-0.041s"
              height="500vh"
            >
              <WhatIDo />
            </ScrollyCanvas>

            <SelectedWorks />

            <ExtraAppShowcase />
            
            <MobileShowcase />

            {/* Replacement for Laptop Section - Typography focused showcase */}
            <HighlightShowcase />
            
            <SkillsSection />

            <ContactSection />
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
