"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      description: "Ideal for individual freelancers starting their billing setup.",
      features: [
        "1-Page Invoice creation",
        "Tax calculations (GST)",
        "Default PDF compilation",
        "Manual collection reminders"
      ],
      cta: "Get Started Free",
      href: "/register",
      popular: false
    },
    {
      name: "Professional",
      price: isAnnual ? "₹999" : "₹1,299",
      period: "/month",
      description: "For active creators and teams demanding full payment automation.",
      features: [
        "Everything in Starter",
        "Unlimited WhatsApp alerts",
        "Auto Late Fee Penalties",
        "Custom gateway routing",
        "Client behavioral scoring",
        "Priority support"
      ],
      cta: "Upgrade to Pro",
      href: "/register",
      popular: true
    },
    {
      name: "Agency",
      price: isAnnual ? "₹2,999" : "₹3,999",
      period: "/month",
      description: "For scaling agencies needing multi-user seats and retainers.",
      features: [
        "Everything in Professional",
        "Up to 5 team members",
        "Custom branded subdomains",
        "Premium layout templates",
        "Automated retainer cycles",
        "Dedicated account rep"
      ],
      cta: "Deploy Agency Plan",
      href: "/register",
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large firms requiring advanced volume settlement and integrations.",
      features: [
        "Everything in Agency",
        "Unlimited team members",
        "Custom API integrations",
        "Custom contracts & SLAs",
        "24/7 dedicated support",
        "Custom payout logic"
      ],
      cta: "Contact Enterprise",
      href: "mailto:enterprise@nanobill.co",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6 max-w-6xl mx-auto border-t border-[#262626] bg-[#0D0D0D]/10">
      {/* Title */}
      <div className="mb-12 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
          Transparent Costing
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Predictable flat-rate plans.<br />
          <span className="text-[#9CA3AF] font-light">With absolutely zero processing cuts.</span>
        </h2>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center items-center gap-3 mb-16 text-xs">
        <span className={`transition-colors duration-200 ${!isAnnual ? "text-[#FAFAFA]" : "text-[#9CA3AF]"}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-11 h-6 rounded-full p-1 flex items-center transition-colors focus:outline-none ${
            isAnnual ? "bg-[#F97316]/20 border border-[#F97316]/30" : "bg-white/10 border border-[#262626]"
          }`}
        >
          <motion.div
            layout
            className="w-4 h-4 rounded-full bg-white"
            animate={{ x: isAnnual ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        <span className={`transition-colors duration-200 flex items-center gap-1.5 ${isAnnual ? "text-[#FAFAFA]" : "text-[#9CA3AF]"}`}>
          Annual Save 20% <span className="text-[9px] uppercase bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 px-1.5 py-0.5 rounded-full font-bold">Offer</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`p-6 rounded-24 border bg-[#111111]/80 backdrop-blur-2xl flex flex-col justify-between h-[570px] relative transition-all duration-300 ${
              p.popular
                ? "border-[#F97316]/35 shadow-[0_0_35px_rgba(249,115,22,0.04)]"
                : "border-[#262626]"
            }`}
          >
            {p.popular && (
              <span className="absolute top-4 right-6 text-[9px] uppercase tracking-widest bg-[#F97316] text-[#FAFAFA] px-2 py-0.5 rounded-full font-mono font-bold">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#9CA3AF] font-mono uppercase tracking-widest">{p.name}</h3>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-semibold tracking-tighter text-[#FAFAFA]">{p.price}</span>
                  {p.period && <span className="text-xs text-[#9CA3AF] ml-1.5">{p.period}</span>}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2 font-light">{p.description}</p>
              </div>

              <ul className="space-y-3 text-xs text-[#9CA3AF] border-t border-[#262626] pt-6">
                {p.features.map((f, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-[#F97316] shrink-0" />
                    <span className="font-light">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={p.href}
              className={`w-full h-11 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                p.popular
                  ? "bg-white text-black hover:bg-neutral-200 hover:shadow-[0_4px_25px_rgba(249,115,22,0.2)] border border-[#F97316]/20"
                  : "bg-[#161616]/40 text-[#FAFAFA] border border-[#262626] hover:border-[#F97316]/25 hover:bg-[#161616]/80"
              }`}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
