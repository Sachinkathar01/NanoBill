"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export const WhySection = () => {
  const comparison = [
    {
      feature: "Payment Follow-ups",
      traditional: "Manual reminders, awkward follow-up texts, or expensive outreach tools.",
      nanobill: "Autonomous AI agent chases overdue collections automatically.",
    },
    {
      feature: "Delivery Channel",
      traditional: "Email only (often goes straight to client spam/promotions folders).",
      nanobill: "WhatsApp First. Direct checkout notifications delivered instantly to chat.",
    },
    {
      feature: "Checkout Speed",
      traditional: "Complicated payment gates requiring multi-step registration logs.",
      nanobill: "Instant Payments. 1-click settles directly via UPI, NetBanking, or Cards.",
    },
    {
      feature: "User Experience",
      traditional: "Slow, legacy layouts built for enterprise ERP software. Enterprise bloat.",
      nanobill: "Modern minimalist UI optimized for creators, consultants, and agencies.",
    },
    {
      feature: "Accounting Friction",
      traditional: "Accounting overload. Requires configuring inventory databases first.",
      nanobill: "Built for Freelancers. 1-page fast inline input under 30 seconds.",
    }
  ];

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto border-t border-[#262626]">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
          The Contrast
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Why freelancers choose NanoBill.<br />
          <span className="text-[#9CA3AF] font-light">Eliminating administrative friction.</span>
        </h2>
      </div>

      {/* Grid Comparison */}
      <div className="border border-[#262626] rounded-24 overflow-hidden bg-[#111111]/80 backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#262626] bg-[#161616]/40 p-5 text-xs font-mono font-semibold uppercase text-neutral-400">
          <div>Capabilities</div>
          <div className="hidden md:block">Standard Solutions</div>
          <div className="hidden md:block">NanoBill SaaS</div>
        </div>

        <div className="divide-y divide-[#262626]/60">
          {comparison.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 p-6 text-sm gap-4 items-center"
            >
              <div className="font-semibold text-[#FAFAFA]">{item.feature}</div>
              <div className="text-neutral-500 text-xs flex items-start gap-2">
                <X className="h-4 w-4 text-red-500/60 shrink-0 mt-0.5" />
                <span>{item.traditional}</span>
              </div>
              <div className="text-[#FAFAFA] text-xs flex items-start gap-2">
                <Check className="h-4 w-4 text-[#F97316] shrink-0 mt-0.5" />
                <span>{item.nanobill}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
