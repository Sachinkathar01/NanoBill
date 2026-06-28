"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquare, Mail, ShieldCheck, Star } from "lucide-react";

export const HeroSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [activeNotification, setActiveNotification] = useState<"whatsapp" | "email" | "paid" | null>(null);

  // Parallax calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setSpotlightPos({ x: e.clientX - left, y: e.clientY - top });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const card1X = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const card1Y = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const card2X = useTransform(mouseX, [-0.5, 0.5], [15, -15]);
  const card2Y = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  // Notification simulation
  useEffect(() => {
    const sequence = ["whatsapp", "email", "paid"];
    let index = 0;

    const interval = setInterval(() => {
      setActiveNotification(sequence[index] as any);
      index = (index + 1) % sequence.length;
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-36 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden select-none bg-[#090909]"
    >
      {/* Orange spotlight following cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(249, 115, 22, 0.12), transparent 85%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#F97316]/20"
            style={{
              top: `${15 + i * 15}%`,
              left: `${20 + i * 12}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Left Content Column */}
      <div className="flex-1 z-10 flex flex-col max-w-2xl text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111111]/40 px-3.5 py-1 text-xs font-medium text-neutral-400 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
            NanoBill 2.0: Modern Invoicing
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tighter leading-[1.05] text-[#FAFAFA]">
            Simple Billing.<br />
            <span className="animate-orange-shine">
              Billion-Dollar Experience.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed font-light max-w-lg">
            Create invoices in seconds. Accept online payments. Let AI automatically collect overdue invoices using WhatsApp and Email.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/register"
              className="relative inline-flex h-11 items-center justify-center rounded-full bg-white px-8 text-xs font-semibold text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-[0_4px_25px_rgba(249,115,22,0.18)] border border-[#F97316]/20 group"
            >
              Start Free
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#262626] bg-white/[0.01] px-8 text-xs font-semibold text-white transition-all hover:bg-white/[0.04] hover:border-[#F97316]/30 active:scale-95"
            >
              Book Demo
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 border-t border-[#262626] flex items-center gap-6 text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#F97316]" /> SECURE UPI ROUTING</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[#F97316]" /> 100% SUCCESS RATES</span>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Floating 3D Parallax Dashboard */}
      <motion.div
        className="flex-1 w-full max-w-xl z-10 h-[500px] relative hidden lg:block perspective-[1000px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* Main Invoice Card */}
          <motion.div
            style={{ x: card1X, y: card1Y, translateZ: 50 }}
            className="absolute top-12 left-8 w-[320px] rounded-24 border border-[#262626] bg-[#111111]/80 backdrop-blur-xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                <span className="text-[10px] text-neutral-500 font-mono">invoice_INV-204</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-2 py-0.5 rounded-sm">
                Intrastate GST
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase text-neutral-500 tracking-wider font-mono">Amount Due</span>
              <div className="text-3xl font-medium tracking-tight text-[#FAFAFA]">₹82,600.00</div>
            </div>

            <div className="space-y-2 border-t border-[#262626] pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-neutral-400 font-mono">₹70,000.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">CGST (9%)</span>
                <span className="text-neutral-400 font-mono">₹6,300.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">SGST (9%)</span>
                <span className="text-neutral-400 font-mono">₹6,300.00</span>
              </div>
            </div>

            {/* Paid Stamp overlay */}
            {activeNotification === "paid" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[#F97316]/30 text-[#F97316] font-bold font-mono tracking-widest text-lg px-4 py-1.5 rounded-md rotate-[-12deg] bg-[#111111] shadow-xl"
              >
                PAID
              </motion.div>
            )}
          </motion.div>

          {/* Activity Feed & Notifications */}
          <motion.div
            style={{ x: card2X, y: card2Y, translateZ: 80 }}
            className="absolute top-52 right-4 w-[280px] rounded-24 border border-[#262626] bg-[#111111]/90 backdrop-blur-xl p-5 shadow-2xl space-y-4"
          >
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono block">Collection log</span>
            
            <div className="space-y-3">
              {/* Notification 1: WhatsApp */}
              <div className={`flex items-start gap-3 transition-opacity duration-500 ${activeNotification === "whatsapp" ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-medium text-white">WhatsApp reminder sent</h4>
                  <p className="text-[10px] text-neutral-500 font-light">Secure payment link dispatched.</p>
                </div>
              </div>

              {/* Notification 2: Email */}
              <div className={`flex items-start gap-3 transition-opacity duration-500 ${activeNotification === "email" ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-medium text-white">Email invoice delivered</h4>
                  <p className="text-[10px] text-neutral-500 font-light">PDF invoice INV-204 received.</p>
                </div>
              </div>

              {/* Notification 3: Paid */}
              <div className={`flex items-start gap-3 transition-opacity duration-500 ${activeNotification === "paid" ? "opacity-100 scale-100" : "opacity-40 scale-95"}`}>
                <div className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <CheckCircle2 className="h-4 w-4 animate-bounce" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-medium text-white">₹82,600 received</h4>
                  <p className="text-[10px] text-neutral-500 font-light">Settled directly via UPI gateway.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
