"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const reviews = [
    {
      quote: "Setting up NanoBill took literally 30 seconds. I don't need a complex CRM anymore just to invoice my digital marketing clients.",
      author: "Aditi Rao",
      role: "Freelance Marketer",
      company: "Rao Digital"
    },
    {
      quote: "Bypassing the Stripe onboarding KYC freezes allowed us to spin up billing for our micro-agency instantly. Payouts arrive directly without delay.",
      author: "Kunal Shah",
      role: "Co-Founder",
      company: "ByteStudio"
    },
    {
      quote: "The auto-chasing loop is a lifesaver. My clients pay within minutes of getting their WhatsApp link, and I don't have to send awkward reminder texts.",
      author: "Rahul Verma",
      role: "Independent Consultant",
      company: "Verma Tech"
    }
  ];

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto border-t border-[#262626]">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
          User Telemetry
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Loved by builders.<br />
          <span className="text-[#9CA3AF] font-light">Trusted with millions in collections.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-8 rounded-24 border border-[#262626] bg-[#111111]/80 flex flex-col justify-between h-[260px] relative hover:border-[#F97316]/30 hover:shadow-[0_0_35px_rgba(249,115,22,0.02)] transition-all duration-300"
          >
            <Quote className="absolute top-6 right-6 h-8 w-8 text-[#F97316]/[0.02]" />
            <p className="text-xs text-[#9CA3AF] font-light leading-relaxed">
              "{r.quote}"
            </p>
            <div className="border-t border-[#262626] pt-4 mt-4 space-y-1">
              <h4 className="text-xs font-semibold text-[#FAFAFA]">{r.author}</h4>
              <p className="text-[10px] text-[#9CA3AF] font-mono">
                {r.role}, {r.company}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
