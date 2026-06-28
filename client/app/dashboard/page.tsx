"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface DashboardStats {
   activeClients: number;
   totalRevenue: number;
   pendingInvoices: number;
   paidInvoices: number;
}

interface RecentInvoice {
   id: string;
   invoice_number: string;
   client_name: string;
   status: string;
   total_amount: string;
   created_at: string;
}

interface RecentPaidInvoice {
   id: string;
   invoice_number: string;
   client_name: string;
   total_amount: string;
   created_at: string;
}

export default function DashboardOverview() {
   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
   const [recentPaidInvoices, setRecentPaidInvoices] = useState<RecentPaidInvoice[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [onboardingIncomplete, setOnboardingIncomplete] = useState(false);

   useEffect(() => {
      const loadDashboardData = async () => {
         try {
            const [statsRes, meRes] = await Promise.all([
               api.get("/dashboard/stats"),
               api.get("/auth/me")
            ]);
            setStats(statsRes.data.stats);
            setRecentInvoices(statsRes.data.recentInvoices);
            setRecentPaidInvoices(statsRes.data.recentPaidInvoices || []);

            const profile = meRes.data?.user;
            if (!profile?.business_name || !profile?.bank_account_number) {
               setOnboardingIncomplete(true);
            }
         } catch (err: any) {
            toast.error("Failed to load dashboard statistics");
         } finally {
            setIsLoading(false);
         }
      };

      loadDashboardData();
   }, []);

   return (
      <div className="max-w-6xl mx-auto space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-medium tracking-tight">Overview</h1>
         </div>

         {!isLoading && onboardingIncomplete && (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h3 className="font-semibold text-sm">⚠️ Complete Your SaaS Onboarding</h3>
                  <p className="text-xs text-amber-400/80 mt-1">To enable direct bank payouts and generate tax-compliant GST invoices, please fill in your Business & Bank details in Settings.</p>
               </div>
               <Link href="/dashboard/settings" className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold rounded-md transition-colors whitespace-nowrap">
                  Configure Profile
               </Link>
            </div>
         )}

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-white/8 bg-[#0c0c0c] shadow-2xl">
               <h3 className="text-sm font-semibold text-neutral-400 mb-2">Active Clients</h3>
               <p className="text-4xl font-medium tracking-tight text-white drop-shadow-sm">
                  {isLoading ? "..." : stats?.activeClients || 0}
               </p>
            </div>

            <div className="p-6 rounded-xl border border-[#3395FF]/20 bg-[#3395FF]/5 shadow-2xl">
               <h3 className="text-sm font-semibold text-[#3395FF]/70 mb-2">Total Revenue</h3>
               <p className="text-4xl font-medium tracking-tight text-[#3395FF] drop-shadow-sm">
                  ₹{isLoading ? "..." : (stats?.totalRevenue || 0).toFixed(2)}
               </p>
            </div>

            <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 shadow-2xl">
               <h3 className="text-sm font-semibold text-amber-500/70 mb-2">Pending Invoices</h3>
               <p className="text-4xl font-medium tracking-tight text-amber-500 drop-shadow-sm">
                  {isLoading ? "..." : stats?.pendingInvoices || 0}
               </p>
            </div>

            <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-2xl">
               <h3 className="text-sm font-semibold text-emerald-500/70 mb-2">Paid Invoices</h3>
               <p className="text-4xl font-medium tracking-tight text-emerald-400 drop-shadow-sm">
                  {isLoading ? "..." : stats?.paidInvoices || 0}
               </p>
            </div>
         </div>

         {/* Recent Activity Table */}
         <div>
            <h2 className="text-xl font-medium tracking-tight mb-4">Recent Activity</h2>
            <div className="border border-white/8 rounded-xl bg-[#0c0c0c] overflow-hidden shadow-2xl">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/8 hover:bg-transparent">
                        <TableHead className="text-neutral-400 font-medium h-12">Invoice #</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12">Client</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12">Status</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12">Date Issued</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12 text-right">Total</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow className="border-none hover:bg-transparent">
                           <TableCell colSpan={5} className="text-center py-12 text-neutral-500 font-mono">Loading telemetry...</TableCell>
                        </TableRow>
                     ) : recentInvoices.length === 0 ? (
                        <TableRow className="border-none hover:bg-transparent">
                           <TableCell colSpan={5} className="text-center py-12 text-neutral-500 font-mono">No recent invoices.</TableCell>
                        </TableRow>
                     ) : (
                        recentInvoices.map((inv) => (
                           <TableRow key={inv.id} className="border-white/5 hover:bg-white/2 transition-colors">
                              <TableCell className="font-mono text-white tracking-tight text-xs">{inv.invoice_number}</TableCell>
                              <TableCell className="text-neutral-300 font-medium">{inv.client_name}</TableCell>
                              <TableCell>
                                 <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${inv.status === 'Draft' ? 'bg-neutral-800 text-neutral-400' :
                                       inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                          inv.status === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                                             'bg-amber-500/10 text-amber-400'
                                    }`}>
                                    {inv.status}
                                 </span>
                              </TableCell>
                              <TableCell className="text-neutral-400 text-sm">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                              <TableCell className="font-bold text-right whitespace-nowrap text-white">₹{parseFloat(inv.total_amount).toFixed(2)}</TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </div>

         <div>
            <h2 className="text-xl font-medium tracking-tight mb-4">Recent Payments Received</h2>
            <div className="border border-emerald-500/20 rounded-xl bg-[#0c0c0c] overflow-hidden shadow-2xl">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/8 hover:bg-transparent">
                        <TableHead className="text-neutral-400 font-medium h-12">Invoice #</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12">Client</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12">Received On</TableHead>
                        <TableHead className="text-neutral-400 font-medium h-12 text-right">Amount</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow className="border-none hover:bg-transparent">
                           <TableCell colSpan={4} className="text-center py-12 text-neutral-500 font-mono">Syncing paid invoices...</TableCell>
                        </TableRow>
                     ) : recentPaidInvoices.length === 0 ? (
                        <TableRow className="border-none hover:bg-transparent">
                           <TableCell colSpan={4} className="text-center py-12 text-neutral-500 font-mono">No paid invoices yet.</TableCell>
                        </TableRow>
                     ) : (
                        recentPaidInvoices.map((inv) => (
                           <TableRow key={inv.id} className="border-white/5 hover:bg-white/2 transition-colors">
                              <TableCell className="font-mono text-white tracking-tight text-xs">{inv.invoice_number}</TableCell>
                              <TableCell className="text-neutral-300 font-medium">{inv.client_name}</TableCell>
                              <TableCell className="text-neutral-400 text-sm">{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                              <TableCell className="font-bold text-right whitespace-nowrap text-emerald-400">₹{parseFloat(inv.total_amount).toFixed(2)}</TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   )
}
