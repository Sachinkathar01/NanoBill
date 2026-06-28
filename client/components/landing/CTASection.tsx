"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-40 px-6 max-w-5xl mx-auto border-t border-[#262626] relative overflow-hidden">
      {/* Orange Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#F97316]/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="rounded-24 border border-[#262626] bg-[#111111]/80 backdrop-blur-2xl p-12 sm:p-20 text-center relative z-10 space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
            Instant Deployment
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#FAFAFA] leading-tight">
            Ready to stop chasing clients?<br />
            <span className="text-[#9CA3AF] font-light">Create your free NanoBill account today.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] font-light max-w-md mx-auto leading-relaxed">
            Create your account in under 30 seconds. No credit card required, zero gateway lock-in, immediate setup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto h-11 px-8 inline-flex items-center justify-center rounded-full bg-white text-xs font-semibold text-black hover:bg-neutral-200 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(249,115,22,0.2)] border border-[#F97316]/20 group"
          >
            Deploy Free Account
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto h-11 px-8 inline-flex items-center justify-center rounded-full border border-[#262626] bg-[#161616]/40 text-xs font-semibold text-[#FAFAFA] hover:bg-[#161616]/80 hover:border-[#F97316]/25 transition-all duration-300"
          >
            Explore Integration Documentation
          </Link>
        </div>
      </div>
    </section>
  );
};
