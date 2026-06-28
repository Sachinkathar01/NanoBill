"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, CheckCircle2, TrendingUp, Users } from "lucide-react";

interface LogItem {
  id: string;
  client: string;
  amount: string;
  time: string;
  type: "paid" | "chase" | "overdue";
}

export const DashboardDemo = () => {
  const [revenue, setRevenue] = useState(245800);
  const [successRate, setSuccessRate] = useState(94.2);
  const [progress, setProgress] = useState(72);
  const [logs, setLogs] = useState<LogItem[]>([
    { id: "1", client: "Google Cloud", amount: "₹45,000", time: "Just now", type: "paid" },
    { id: "2", client: "Acme Corp", amount: "₹18,200", time: "2 min ago", type: "chase" },
    { id: "3", client: "Vercel Inc", amount: "₹82,600", time: "5 min ago", type: "paid" },
  ]);

  useEffect(() => {
    const clients = ["Netflix", "Stripe", "Supabase", "Linear", "Retool", "Resend"];
    const amounts = ["₹12,400", "₹38,000", "₹64,300", "₹9,500", "₹22,100"];

    const interval = setInterval(() => {
      // 1. Slightly drift revenue & success rate
      setRevenue((prev) => prev + Math.floor(Math.random() * 5000) + 1000);
      setSuccessRate((prev) => Math.min(100, Math.max(90, Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)))));
      setProgress((prev) => (prev >= 95 ? 60 : prev + 2));

      // 2. Push a new log
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const type = Math.random() > 0.4 ? "paid" : "chase";

      const newLog: LogItem = {
        id: String(Date.now()),
        client: randomClient,
        amount: randomAmount,
        time: "Just now",
        type: type as any,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 3)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-32 px-6 max-w-6xl mx-auto border-t border-[#262626] bg-[#0D0D0D]/30">
      {/* Title */}
      <div className="mb-20 text-center space-y-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F97316]">Live Simulation</span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#FAFAFA]">
          Watch collection automation run.<br />
          <span className="text-[#9CA3AF] font-light">In real-time, on auto-pilot.</span>
        </h2>
      </div>

      {/* Glass Board Wrapper */}
      <div className="rounded-24 border border-[#262626] bg-[#111111]/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F97316]/[0.01] to-transparent pointer-events-none" />

        {/* Dashboard Grid Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Revenue */}
          <div className="p-6 rounded-xl border border-[#262626] bg-[#161616]/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>Annual Revenue Run Rate</span>
              <DollarSign className="h-4 w-4 text-[#F97316]" />
            </div>
            <div className="text-3xl font-medium tracking-tight text-[#F97316] font-mono">
              ₹{revenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#FB923C]">
              <TrendingUp className="h-3.5 w-3.5" /> +14.2% from last month
            </div>
          </div>

          {/* Card 2: Collection Progress */}
          <div className="p-6 rounded-xl border border-[#262626] bg-[#161616]/40 space-y-4">
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>Collection Success Rate</span>
              <CheckCircle2 className="h-4 w-4 text-[#F97316]" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-medium tracking-tight text-[#FAFAFA] font-mono">{successRate}%</div>
              {/* Progress bar */}
              <div className="w-full bg-[#262626] h-1 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#F97316] h-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Merchants */}
          <div className="p-6 rounded-xl border border-[#262626] bg-[#161616]/40 space-y-2">
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>Active Receivables</span>
              <Users className="h-4 w-4 text-[#F97316]" />
            </div>
            <div className="text-3xl font-medium tracking-tight text-[#FAFAFA] font-mono">
              18 <span className="text-xs text-neutral-500 font-sans font-normal">Clients</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-light leading-relaxed">
              Auto-chasing configuration enabled for all tenants.
            </div>
          </div>

        </div>

        {/* Dashboard split content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Table - Active Invoices */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Active Receivables
            </h3>
            <div className="rounded-xl border border-[#262626] overflow-hidden bg-black/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#262626] text-neutral-500">
                    <th className="p-4 font-medium">Invoice #</th>
                    <th className="p-4 font-medium">Client</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#262626]/60 text-[#FAFAFA]">
                    <td className="p-4 font-mono">INV-204</td>
                    <td className="p-4">Acme Corp</td>
                    <td className="p-4">
                      <span className="bg-orange-500/10 text-[#F97316] border border-orange-500/20 px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold">
                        Pending
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">₹18,200</td>
                  </tr>
                  <tr className="border-b border-[#262626]/60 text-[#FAFAFA]">
                    <td className="p-4 font-mono">INV-203</td>
                    <td className="p-4">Vercel Inc</td>
                    <td className="p-4">
                      <span className="bg-orange-500/10 text-[#F97316] border border-orange-500/20 px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold">
                        Paid
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">₹82,600</td>
                  </tr>
                  <tr className="text-[#FAFAFA]">
                    <td className="p-4 font-mono">INV-202</td>
                    <td className="p-4">Google Cloud</td>
                    <td className="p-4">
                      <span className="bg-orange-500/10 text-[#F97316] border border-orange-500/20 px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold">
                        Paid
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">₹45,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Activity Stream */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Live Automated Engine
            </h3>
            <div className="rounded-xl border border-[#262626] p-5 bg-[#111111]/40 h-[210px] relative overflow-hidden flex flex-col justify-end">
              <div className="space-y-4 absolute top-5 left-5 right-5">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between p-3 rounded-lg border border-[#262626] bg-[#161616]/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                        <div>
                          <p className="text-xs font-medium text-white">{log.client}</p>
                          <p className="text-[10px] text-neutral-500">{log.type === "paid" ? "Invoice settled" : "WhatsApp link sent"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-[#F97316] font-semibold">{log.amount}</p>
                        <p className="text-[9px] text-neutral-600 font-mono">{log.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
