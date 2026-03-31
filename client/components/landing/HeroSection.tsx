"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 overflow-hidden">
      
      {/* Vercel-style abstract minimal overhead lighting */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.04] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex-1 z-10 flex flex-col max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1 text-xs font-medium text-neutral-300 mb-8 backdrop-blur-sm">
             NanoBill 1.0 is Live
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
            Bill instantly.<br/>
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Get paid faster.
            </span>
          </h1>
          
          <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-normal max-w-xl">
            A minimalist invoice engine for developers and micro-SMEs. Generate gorgeous PDFs, embed Razorpay links, and track webhook payments without leaving your keyboard.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-neutral-200 focus:outline-none">
              Start Building
            </Link>
            <Link href="#how-it-works" className="inline-flex h-11 items-center justify-center rounded-md border border-white/[0.1] bg-transparent px-8 text-sm font-medium text-white transition-colors hover:bg-white/[0.03] focus:outline-none">
              Documentation
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="flex-1 w-full max-w-lg z-10 hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
           animate={{ y: [0, -10, 0] }}
           transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
        {/* Minimalist Wireframe Dashboard Mock */}
        <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0c0c0c] shadow-2xl relative overflow-hidden flex flex-col gap-6">
           
           <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
             <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                 <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                 <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
               </div>
               <span className="text-xs text-neutral-500 font-mono tracking-tight">invoice_INV-802</span>
             </div>
             <div className="h-5 px-2 bg-white flex items-center justify-center text-[9px] font-bold text-black rounded-sm tracking-wider uppercase">
                Paid
             </div>
           </div>
           
           <div className="flex justify-between items-end">
             <div>
                 <div className="text-[10px] text-neutral-500 mb-1 font-mono uppercase tracking-widest">Amount Due</div>
                 <div className="text-3xl font-medium tracking-tight text-white">₹24,500.00</div>
             </div>
           </div>
           
           <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-full rounded-md border border-white/[0.03] bg-white/[0.01] flex items-center px-4 justify-between">
                   <div className="h-1 w-20 bg-white/20 rounded-full" />
                   <div className="h-1 w-10 bg-white/10 rounded-full" />
                </div>
              ))}
           </div>
        </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
