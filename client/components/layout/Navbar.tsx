"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", path: "#features" },
    { name: "Demo", path: "#demo" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Pricing", path: "#pricing" },
    { name: "FAQ", path: "#faq" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full"
    >
      {/* Announcement Bar */}
      <div className="w-full bg-[#0D0D0D] border-b border-[#262626] py-2 px-4 text-center text-[10px] font-mono tracking-widest uppercase text-neutral-400 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
        <span>🚀 AI Collection Agent is now live.</span>
        <Link href="#demo" className="text-white underline hover:text-[#F97316] transition-colors ml-1">
          Explore Demo &rarr;
        </Link>
      </div>

      {/* Main Navigation Row */}
      <div
        className={`px-6 md:px-12 transition-all duration-300 flex justify-between items-center ${
          isScrolled
            ? "bg-[#050505]/75 backdrop-blur-xl border-b border-[#262626] py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tighter text-white font-mono uppercase group-hover:text-[#F97316] transition-colors">
              NanoBill
            </span>
          </Link>
          
          {/* Desktop Links with Animated Underline */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="relative text-xs font-medium text-neutral-400 hover:text-white transition-colors py-1"
                onMouseEnter={() => setHoveredPath(item.path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <span>{item.name}</span>
                {hoveredPath === item.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F97316]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors px-3 py-1.5">
            Log in
          </Link>
          <Link 
            href="/register" 
            className="relative inline-flex items-center justify-center text-xs font-semibold bg-white text-black px-4 py-1.5 rounded-full hover:bg-neutral-200 transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] border border-[#F97316]/20 overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-[#F97316]/20 blur-md scale-0 group-hover:scale-150 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
