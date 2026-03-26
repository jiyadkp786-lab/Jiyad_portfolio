'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LivingRoomSection = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Images */}
      <div className="absolute inset-0">
        {/* Dark (Off) version - Always present at the bottom */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/wall/light off.png')" }}
        />
        
        {/* Light (On) version - Fades in/out */}
        <motion.div
          initial={false}
          animate={{ opacity: isOn ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/wall/Light on.jpg')" }}
        />
        
        {/* Subtle Glow Overlay when ON */}
        <motion.div
          animate={{ opacity: isOn ? 0.1 : 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none bg-orange-400/20 mix-blend-overlay"
        />
      </div>

      {/* Switch UI Container */}
      <div className="absolute right-12 md:right-24 top-1/2 -translate-y-1/2 z-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col items-center">
            <span className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-700 ${isOn ? 'text-orange-200' : 'text-gray-500'}`}>
              Ambience
            </span>
            <div className={`mt-1 h-px w-8 transition-colors duration-700 ${isOn ? 'bg-orange-500/50' : 'bg-gray-700'}`} />
          </div>
          
          {/* Realistic 3D Switch */}
          <div 
            onClick={toggleSwitch}
            className="group relative cursor-pointer select-none"
          >
            {/* Switch Plate - Neumorphic design */}
            <div className="w-24 h-40 bg-[#e6e6e6] rounded-2xl shadow-[10px_10px_20px_#dadada,-10px_-10px_20px_#ffffff] flex items-center justify-center p-3 relative overflow-hidden transition-all duration-500 group-hover:shadow-[15px_15px_30px_#d1d1d1,-15px_-15px_30px_#ffffff]">
                {/* Screws */}
                <div className="absolute top-3 w-1.5 h-1.5 bg-gray-400 rounded-full shadow-inner opacity-60" />
                <div className="absolute bottom-3 w-1.5 h-1.5 bg-gray-400 rounded-full shadow-inner opacity-60" />
                
                {/* Switch Frame/Well */}
                <div className="w-14 h-28 bg-[#d8d8d8] rounded-xl shadow-[inset_4px_4px_8px_#c8c8c8,inset_-4px_-4px_8px_#e8e8e8] flex items-center justify-center p-1">
                    
                    {/* Switch Rocker - Physical toggle part */}
                    <motion.div 
                        animate={{ 
                            rotateX: isOn ? -25 : 25,
                            y: isOn ? -2 : 2,
                            boxShadow: isOn 
                                ? "0 5px 10px rgba(0,0,0,0.1), inset 0 -2px 5px rgba(255,255,255,1)" 
                                : "0 -5px 10px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,1)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-10 h-24 bg-[#efefef] rounded-lg relative flex flex-col items-center justify-between py-6 cursor-pointer"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        {/* Highlights & Shadows on the rocker itself */}
                        <div className={`absolute inset-0 transition-opacity duration-500 rounded-lg ${isOn ? 'bg-gradient-to-t from-black/5 to-transparent' : 'bg-gradient-to-b from-black/5 to-transparent'}`} />
                        
                        {/* Status Light Indicators */}
                        <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-500 ${!isOn ? 'bg-gray-300 shadow-inner' : 'bg-gray-100 opacity-20'}`} />
                        <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-500 ${isOn ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' : 'bg-gray-100 opacity-20'}`} />
                        
                        {/* Click Effect Overlay */}
                        <motion.div 
                            whileTap={{ opacity: 0.2 }}
                            className="absolute inset-0 bg-black opacity-0 transition-opacity rounded-lg"
                        />
                    </motion.div>
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black tracking-widest transition-colors duration-700 ${!isOn ? 'text-gray-200' : 'text-gray-600'}`}>OFF</span>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            <span className={`text-[11px] font-black tracking-widest transition-colors duration-700 ${isOn ? 'text-orange-400' : 'text-gray-600'}`}>ON</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Text */}
      <div className="absolute bottom-12 left-12 md:left-24 z-20 pointer-events-none">
        <motion.h2 
          animate={{ color: isOn ? '#ffffff' : '#666666' }}
          className="text-4xl md:text-6xl font-light tracking-tighter"
        >
          Cozy <span className="font-serif italic font-normal">Living</span>
        </motion.h2>
        <motion.p 
          animate={{ opacity: isOn ? 0.6 : 0.3 }}
          className="text-white mt-2 max-w-xs text-sm font-light tracking-wide"
        >
          {isOn ? "A warm glow fills the space, creating the perfect sanctuary for relaxation." : "Bathed in moonlight, the room rests in quiet stillness."}
        </motion.p>
      </div>
    </section>
  );
};

export default LivingRoomSection;
