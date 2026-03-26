'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const socials = [
    { name: 'BEHANCE', url: 'https://www.behance.net/jiyadkp' },
    { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/jiyad-kp-ab537b354/' },
    { name: 'DRIBBBLE', url: '#' },
    { name: 'INSTAGRAM', url: '#' },
  ];

  return (
    <footer id="contact" className="relative bg-black pt-24 pb-12 px-12 overflow-hidden font-mono">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-30" />

      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-24 mb-40">
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mb-10"
            >
              <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase">
                SYSTEM_OUTPUT: CONNECT
              </span>
              <div className="w-16 h-px bg-cyan-500/40" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[110px] font-black text-white tracking-tighter leading-[0.8] uppercase mb-20"
            >
              [ LET'S SCALE_<br />
              <span>
                BIG_IDEAS_
              </span> ]
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-10 items-start md:items-center"
            >
              <a 
                href="mailto:jiyadkp786@gmail.com" 
                className="group relative px-14 py-7 bg-white/[0.04] border border-white/20 text-white font-black text-base tracking-[0.3em] uppercase rounded-sm transition-all hover:bg-white hover:text-black hover:border-white overflow-hidden backdrop-blur-md"
              >
                <span className="relative z-10 font-mono italic">jiyadkp786@gmail.com</span>
              </a>
              
              <div className="flex flex-col gap-6">
                 <a 
                   href="https://wa.me/918590616400" 
                   target="_blank"
                   className="flex items-center gap-4 group/item cursor-pointer"
                 >
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[12px] font-black text-white tracking-[0.3em] uppercase opacity-80 group-hover/item:opacity-100 group-hover/item:text-green-500 transition-all">+91 8590616400 // WhatsApp</span>
                 </a>
                 <a 
                   href="tel:+918590616400" 
                   className="flex items-center gap-4 group/item cursor-pointer"
                 >
                   <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                   <span className="text-[12px] font-black text-white tracking-[0.3em] uppercase opacity-80 group-hover/item:opacity-100 group-hover/item:text-cyan-500 transition-all">+91 8590616400 // Voice_Call</span>
                 </a>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-x-20 gap-y-10 min-w-fit">
            {socials.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="group cursor-target flex flex-col gap-3"
              >
                <span className="text-[12px] font-black text-white/60 tracking-[0.6em] group-hover:text-white transition-colors uppercase italic">{social.name}_</span>
                <div className="h-px w-24 bg-white/20 group-hover:bg-white/60 group-hover:w-full transition-all duration-700" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-40 pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-16 group">
            <div className="flex flex-col gap-3">
               <p className="text-[12px] font-black text-white/50 tracking-[0.5em] uppercase hover:text-white transition-colors duration-500 select-none">
                 JIYADH_PORTFOLIO_ENGINE_V.01
               </p>
               <span className="text-[10px] text-white/30 tracking-[1em] uppercase block font-black">© {new Date().getFullYear()} All Rights Reserved.</span>
            </div>
            
            <div className="flex gap-16">
               {['Documentation', 'Source', 'Styleguide'].map(item => (
                 <span key={item} className="text-[11px] font-black text-white/40 tracking-[0.3em] uppercase hover:text-cyan-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-cyan-500 after:transition-all hover:after:w-full">
                   {item}
                 </span>
               ))}
            </div>
            
            <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
               <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-cyan-500 transition-colors animate-bounce" />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;

