"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the Platform direct payout routing bypass gateway freezes?",
      a: "Rather than forcing you to register a corporate account and pass regulatory waitlists, NanoBill routes customer collections through our master aggregators. The funds are automatically logged, checked, and settled directly into your savings or current bank account."
    },
    {
      q: "Can I use my own Razorpay Merchant credentials?",
      a: "Yes! If you already have a verified Razorpay Merchant account, you can paste your Merchant ID into the settings dashboard. NanoBill will automatically bypass our routing aggregator and push collections directly into your gateway."
    },
    {
      q: "How do automated WhatsApp reminders work?",
      a: "When an invoice is issued, our backend scheduler registers reminder intervals. On target dates (upcoming, due day, overdue), it automatically fires secure checkout links to the client's WhatsApp number. These remind loops stop immediately once paid."
    },
    {
      q: "Is CGST + SGST tax calculation fully compliant?",
      a: "Absolutely. When building invoices, you can toggle the target GST tax percentage. NanoBill computes the CGST and SGST splits automatically and embeds compliant breakdowns in the generated PDF receipt."
    }
  ];

  return (
    <section id="faq" className="py-32 px-6 max-w-4xl mx-auto border-t border-[#262626]">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
          Intellectual Commons
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Frequently asked questions.<br />
          <span className="text-[#9CA3AF] font-light">Everything you need to know.</span>
        </h2>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border-b border-[#262626] pb-4"
          >
            <button
              onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
              className={`w-full flex justify-between items-center py-3 text-left text-sm font-semibold transition-colors ${
                activeIndex === idx ? "text-[#F97316]" : "text-[#FAFAFA] hover:text-[#F97316]"
              }`}
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-neutral-500 transition-transform duration-300 ${
                  activeIndex === idx ? "rotate-180 text-[#F97316]" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-[#9CA3AF] font-light leading-relaxed pt-2 pb-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
