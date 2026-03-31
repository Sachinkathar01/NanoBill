"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function NewInvoicePage() {
   const router = useRouter();
   const [clients, setClients] = useState<any[]>([]);
   const [catalog, setCatalog] = useState<any[]>([]);

   const [clientId, setClientId] = useState("");
   const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
   const [dueDate, setDueDate] = useState("");
   const [notes, setNotes] = useState("");
   
   const [selectedItems, setSelectedItems] = useState<{item_id: string, quantity: number, price: number, name: string}[]>([]);

   useEffect(() => {
      api.get("/clients").then(res => setClients(res.data.clients));
      api.get("/items").then(res => setCatalog(res.data.items));
   }, []);

   const addItem = (itemId: string) => {
      const item = catalog.find(i => i.id === itemId);
      if (!item) return;

      const existing = selectedItems.find(i => i.item_id === itemId);
      if (existing) {
         setSelectedItems(selectedItems.map(i => i.item_id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
         setSelectedItems([...selectedItems, { item_id: item.id, name: item.name, quantity: 1, price: parseFloat(item.default_price) }]);
      }
   }

   const removeItem = (itemId: string) => {
      setSelectedItems(selectedItems.filter(i => i.item_id !== itemId));
   }
   
   const updateQuantity = (itemId: string, qty: number) => {
      if (qty < 1) return;
      setSelectedItems(selectedItems.map(i => i.item_id === itemId ? { ...i, quantity: qty } : i));
   }

   const updatePrice = (itemId: string, price: number) => {
      if (price < 0) return;
      setSelectedItems(selectedItems.map(i => i.item_id === itemId ? { ...i, price } : i));
   }

   const subtotal = selectedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
   const tax = 0; // Keeping MVP minimal
   const totalAmount = subtotal + tax;

   const submitInvoice = async () => {
      if (!clientId || selectedItems.length === 0 || !dueDate) {
          toast.error("Client, Due Date, and at least 1 item are required.");
          return;
      }
      
      const payload = {
          client_id: clientId,
          invoice_number: invoiceNumber,
          due_date: dueDate,
          status: "Pending", // Or Draft
          tax_amount: tax,
          total_amount: totalAmount,
          notes: notes,
          items: selectedItems.map(i => ({ item_id: i.item_id, quantity: i.quantity, price: i.price }))
      };

      try {
          // This routes to your complex relational DB insert in Postgres
          await api.post("/invoices", payload);
          toast.success("Invoice fully computed and saved to database.");
          router.push("/dashboard/invoices");
      } catch (err: any) {
          toast.error(err.response?.data?.message || "Failed to compile invoice");
      }
   }

   return (
       <div className="max-w-4xl mx-auto pb-20">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-8">
             <h1 className="text-3xl font-medium tracking-tight">System Builder</h1>
             <Button onClick={() => router.push("/dashboard/invoices")} variant="outline" className="border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.03]">Cancel Compile</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                 <div>
                    <Label className="mb-2 block text-neutral-400">Target Client Node</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                       <SelectTrigger className="w-full h-11 px-3 bg-[#0c0c0c] border border-white/10 text-white outline-none focus:ring-1 focus:ring-white/30 transition-colors">
                          <SelectValue placeholder="-- Select Valid Target --" />
                       </SelectTrigger>
                       <SelectContent className="bg-[#0c0c0c] border-white/10 text-white">
                          {clients.map(c => <SelectItem key={c.id} value={c.id} className="cursor-pointer focus:bg-white/[0.05]">{c.name}</SelectItem>)}
                       </SelectContent>
                    </Select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="mb-2 block text-neutral-400">Invoice Hash</Label>
                        <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="bg-[#0c0c0c] border-white/10 font-mono text-white" />
                    </div>
                    <div>
                        <Label className="mb-2 block text-neutral-400">Due Date</Label>
                        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-[#0c0c0c] border-white/10 text-white css-invert-calendar" style={{colorScheme: 'dark'}} />
                    </div>
                 </div>

                 <div>
                    <Label className="mb-2 block text-neutral-400">Packet Notes (Optional)</Label>
                    <textarea 
                       className="w-full p-3 rounded-md border border-white/10 bg-[#0c0c0c] text-white outline-none focus:border-white/30 transition-colors min-h-[100px]"
                       placeholder="Append custom closing text..."
                       value={notes} 
                       onChange={(e) => setNotes(e.target.value)}
                    />
                 </div>
             </div>

             <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-xl p-6 flex flex-col h-full shadow-2xl">
                 <h2 className="text-lg font-medium mb-4 text-white">Data Payload</h2>
                 
                 <div className="mb-6">
                    <Select value="" onValueChange={(val) => { if (val) addItem(val); }}>
                       <SelectTrigger className="w-full h-10 px-3 bg-[#111] border border-white/10 text-xs font-mono text-white outline-none focus:ring-1 focus:ring-white/30 transition-colors hover:bg-white/[0.02]">
                          <SelectValue placeholder="+ Append SKU from Catalog..." />
                       </SelectTrigger>
                       <SelectContent className="bg-[#111] border-white/10 text-white font-mono text-xs">
                          {catalog.map(i => <SelectItem key={i.id} value={i.id} className="cursor-pointer focus:bg-white/[0.05]">{i.name} — ₹{parseFloat(i.default_price).toFixed(2)}</SelectItem>)}
                       </SelectContent>
                    </Select>
                 </div>

                 <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                    {selectedItems.length === 0 ? (
                       <p className="text-neutral-600 text-xs font-mono text-center mt-12 border border-dashed border-white/10 rounded-md p-6">No SKUs attached to payload.</p>
                    ) : (
                       selectedItems.map((item) => (
                          <div key={item.item_id} className="p-3 border border-white/[0.05] rounded-md bg-[#080808] group">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium tracking-tight text-white truncate pr-4">{item.name}</span>
                                <button onClick={() => removeItem(item.item_id)} className="text-neutral-500 hover:text-red-400 transition-colors">
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                             <div className="flex gap-2">
                                <div className="flex-1">
                                   <Label className="text-[10px] text-neutral-500 uppercase">Qty</Label>
                                   <Input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.item_id, parseInt(e.target.value) || 1)} className="h-8 text-xs bg-[#111] border-white/10 focus-visible:ring-0 text-white" />
                                </div>
                                <div className="flex-[2]">
                                   <Label className="text-[10px] text-neutral-500 uppercase">Price</Label>
                                   <Input type="number" value={item.price} onChange={(e) => updatePrice(item.item_id, parseFloat(e.target.value) || 0)} className="h-8 text-xs bg-[#111] border-white/10 focus-visible:ring-0 text-white" />
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>

                 <div className="border-t border-white/[0.08] pt-4 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-neutral-400 text-sm">Computation Total</span>
                       <span className="text-2xl font-bold tracking-tight text-white">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <Button onClick={submitInvoice} className="w-full bg-white text-black hover:bg-neutral-200 h-11 font-medium shadow-xl shadow-white/5 transition-colors">
                        Inject To Database
                    </Button>
                 </div>
             </div>
          </div>
       </div>
   )
}
