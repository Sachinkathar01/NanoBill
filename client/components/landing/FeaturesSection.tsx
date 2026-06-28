"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Sparkles, 
  Link2, 
  Receipt, 
  Clock, 
  BarChart2, 
  RefreshCw, 
  Sliders, 
  FileText,
  Award
} from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
}

const NumberCounter = ({ value, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }
    const stepTime = Math.abs(Math.floor(2000 / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

export const FeaturesSection = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "WhatsApp Billing",
      description: "Send payment notifications directly on WhatsApp. Deliver checkout links straight to chats with 95% open rates.",
      stat: { value: 95, suffix: "% Open Rate" }
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "AI Collection Agent",
      description: "Automated billing loop chases clients via scheduled professional follow-ups. Ceases instantly upon checkout completion.",
      stat: { value: 87, suffix: "% Recovery" }
    },
    {
      icon: <Link2 className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Instant Payment Links",
      description: "Enable unified payments including UPI, Net Banking, and Cards. Start collecting with zero gateway KYC delay.",
      stat: { value: 1, suffix: " Click Pay" }
    },
    {
      icon: <Receipt className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "GST Receipts",
      description: "Render CGST and SGST splits automatically on invoice items and generate tax-compliant PDF downloads.",
      stat: { value: 100, suffix: "% Compliant" }
    },
    {
      icon: <Clock className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Late Fee Automation",
      description: "Enforce automatic interest penalty rules to incentivize clients to clear overdue items faster.",
      stat: { value: 15, suffix: "% interest/yr" }
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Collection Analytics",
      description: "Track key performance numbers, monitor accounts receivable, and view client payment behavioral ratings.",
      stat: { value: 100, suffix: "% Real-time" }
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Recurring Billing",
      description: "Schedule monthly retention cycles and automate subscription billing for retainer agreements.",
      stat: { value: 12, suffix: " Retainers" }
    },
    {
      icon: <Sliders className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Custom Branding",
      description: "Brand payment flows with custom logos, customized email templates, and personalized WhatsApp messages.",
      stat: { value: 100, suffix: "% White-labeled" }
    },
    {
      icon: <FileText className="h-6 w-6 text-[#F97316] group-hover:rotate-12 transition-transform duration-300" />,
      title: "Invoice Templates",
      description: "Access a library of minimal, clean layouts designed to look professional for top startups.",
      stat: { value: 5, suffix: " Layouts" }
    }
  ];

  return (
    <section id="features" className="py-32 px-6 max-w-6xl mx-auto border-t border-[#262626]">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#9CA3AF] font-mono">
          <Award className="h-3 w-3 text-[#F97316]" /> Core Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Invoicing infrastructure.<br />
          <span className="text-[#9CA3AF] font-light">Without the enterprise bloat.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="p-8 rounded-24 border border-[#262626] bg-[#111111]/80 hover:bg-[#161616]/80 hover:border-[#F97316]/30 hover:shadow-[0_0_35px_rgba(249,115,22,0.04)] transition-all duration-300 group flex flex-col justify-between h-[270px] relative overflow-hidden"
          >
            {/* Spotlight Accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F97316]/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="space-y-4">
              <div className="p-3 w-fit rounded-lg bg-[#F97316]/5 border border-[#262626] transition-colors group-hover:bg-[#F97316]/10">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">{feature.title}</h3>
                <p className="text-xs text-[#9CA3AF] font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>

            {/* Micro-Interaction counter stats */}
            <div className="text-xs font-mono text-neutral-500 pt-4 border-t border-[#262626]/40 flex justify-between items-center">
              <span>Metric:</span>
              <span className="text-[#FAFAFA] font-medium">
                {typeof feature.stat.value === 'number' && feature.stat.value > 0 ? (
                  <NumberCounter value={feature.stat.value} suffix={feature.stat.suffix} />
                ) : (
                  <span>{feature.stat.value}{feature.stat.suffix}</span>
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
