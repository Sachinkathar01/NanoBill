"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { FileText, Link as LinkIcon, Download } from "lucide-react";

export default function InvoicesPage() {
   const [invoices, setInvoices] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const loadInvoices = async () => {
      try {
         const res = await api.get("/invoices");
         setInvoices(res.data.invoices);
      } catch {
         toast.error("Failed to load invoices");
      } finally {
         setIsLoading(false);
      }
   }

   useEffect(() => { loadInvoices(); }, []);

   useEffect(() => {
      const intervalId = window.setInterval(() => {
         loadInvoices();
      }, 15000);

      const onFocus = () => {
         loadInvoices();
      };

      window.addEventListener('focus', onFocus);

      return () => {
         window.clearInterval(intervalId);
         window.removeEventListener('focus', onFocus);
      };
   }, []);

   const generatePDF = async (id: string) => {
      try {
         toast.info("Compiling native PDF stream...");
         // Using responseType blob tells Axios we are downloading raw binary data
         const res = await api.get(`/invoices/${id}/download-pdf`, { responseType: 'blob' });

         const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
         window.open(url, "_blank");
         toast.success("PDF instantly rendered locally!");
      } catch (err: any) {
         toast.error("Failed to compile native PDF stream");
      }
   }

   const generatePaymentLink = async (id: string) => {
      try {
         toast.info("Generating secure Razorpay Node...");
         const res = await api.post(`/invoices/${id}/payment-link`);
         toast.success("Payment Link Issued!");
         loadInvoices();
      } catch (err: any) {
         toast.error(err.response?.data?.message || "Failed to issue link");
      }
   }

   return (
      <div className="max-w-6xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight">Invoices</h1>
            <Button className="bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/5" asChild>
               <Link href="/dashboard/invoices/new">Build Invoice</Link>
            </Button>
         </div>

         <div className="border border-white/8 rounded-xl bg-[#0c0c0c] overflow-hidden shadow-2xl">
            <Table>
               <TableHeader>
                  <TableRow className="border-white/8 hover:bg-transparent">
                     <TableHead className="text-neutral-400 font-medium h-12">Invoice #</TableHead>
                     <TableHead className="text-neutral-400 font-medium h-12">Client</TableHead>
                     <TableHead className="text-neutral-400 font-medium h-12">Status</TableHead>
                     <TableHead className="text-neutral-400 font-medium h-12">Total</TableHead>
                     <TableHead className="text-neutral-400 font-medium h-12 text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={5} className="text-center py-16 text-neutral-500 font-mono">Loading telemetry...</TableCell></TableRow>
                  ) : invoices.length === 0 ? (
                     <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={5} className="text-center py-16 text-neutral-500 border-dashed font-mono">0 Invoices deployed.</TableCell></TableRow>
                  ) : (
                     invoices.map((inv) => (
                        <TableRow key={inv.id} className="border-white/5 hover:bg-white/2 transition-colors">
                           <TableCell className="font-mono text-white tracking-tight text-xs">{inv.invoice_number}</TableCell>
                           <TableCell className="text-neutral-300 font-medium">{inv.client_name}</TableCell>
                           <TableCell>
                              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${inv.status === 'Draft' ? 'bg-neutral-800 text-neutral-400' :
                                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                       'bg-amber-500/10 text-amber-400'
                                 }`}>
                                 {inv.status}
                              </span>
                           </TableCell>
                           <TableCell className="font-bold whitespace-nowrap text-white">₹{parseFloat(inv.total_amount).toFixed(2)}</TableCell>
                           <TableCell className="text-right space-x-2">
                              <button onClick={() => generatePDF(inv.id)} className="inline-flex h-8 items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 text-xs font-medium hover:bg-white/10 transition-colors text-white">
                                 <FileText className="h-3 w-3 mr-1" /> Compile PDF
                              </button>

                              {inv.payment_url ? (
                                 <a href={inv.payment_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 items-center justify-center rounded-md border border-[#3395FF]/20 bg-[#3395FF]/10 text-[#3395FF] px-3 text-xs font-medium hover:bg-[#3395FF]/20 transition-colors">
                                    <LinkIcon className="h-3 w-3 mr-1" /> Link
                                 </a>
                              ) : (
                                 <button onClick={() => generatePaymentLink(inv.id)} className="inline-flex h-8 items-center justify-center rounded-md border border-white/10 bg-transparent px-3 text-xs font-medium hover:bg-white/3 transition-colors text-neutral-400">
                                    <Zap className="h-3 w-3 mr-1" /> Payment Fast-Link
                                 </button>
                              )}
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}
// Quick inline component for the Razorpay button
const Zap = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
