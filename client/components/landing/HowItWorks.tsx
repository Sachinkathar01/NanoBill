"use client";

import { motion } from "framer-motion";
import { UserPlus, Link2, BellDot } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: <UserPlus className="h-5 w-5 text-[#F97316]" />,
      title: "Create Invoice",
      desc: "Draft a clean invoice in under 30 seconds. Type in client contact details and payment amounts directly on a single page."
    },
    {
      step: "02",
      icon: <Link2 className="h-5 w-5 text-[#F97316]" />,
      title: "Share via WhatsApp",
      desc: "Deliver secure, custom checkout links directly to client chat windows. Clients pay instantly using UPI, NetBanking, or Credit Cards."
    },
    {
      step: "03",
      icon: <BellDot className="h-5 w-5 text-[#F97316]" />,
      title: "AI Collects Payment Automatically",
      desc: "Our background schedule triggers automated professional reminders. Late fee penalties are calculated and applied dynamically until settled."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 max-w-5xl mx-auto border-t border-[#262626] bg-[#0D0D0D]/20">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
          Workflow Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Three steps to settled invoices.<br />
          <span className="text-[#9CA3AF] font-light">Zero manual administrative overhead.</span>
        </h2>
      </div>

      {/* Steps List */}
      <div className="relative border-l border-[#262626] ml-4 md:ml-8 space-y-12 max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="pl-12 relative group"
          >
            {/* Step Counter Bubble */}
            <div className="absolute left-[-20px] top-1 h-10 w-10 rounded-full bg-[#090909] border border-[#262626] group-hover:border-[#F97316]/30 transition-colors flex items-center justify-center text-[11px] font-mono text-[#F97316]">
              {s.step}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-[#F97316]/5 border border-[#262626]">
                  {s.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#FAFAFA]">{s.title}</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] font-light leading-relaxed max-w-xl">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
