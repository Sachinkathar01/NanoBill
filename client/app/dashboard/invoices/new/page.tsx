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

   const [isNewClient, setIsNewClient] = useState(false);
   const [clientId, setClientId] = useState("");
   const [newClientName, setNewClientName] = useState("");
   const [newClientEmail, setNewClientEmail] = useState("");
   const [newClientPhone, setNewClientPhone] = useState("");
   const [newClientAddress, setNewClientAddress] = useState("");

   const [customItemName, setCustomItemName] = useState("");
   const [customItemPrice, setCustomItemPrice] = useState("");

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

   const addCustomItem = () => {
      if (!customItemName || !customItemPrice) {
         toast.error("Item name and price are required.");
         return;
      }
      const price = parseFloat(customItemPrice);
      if (isNaN(price) || price < 0) {
         toast.error("Please enter a valid price.");
         return;
      }
      const tempId = `custom-${Date.now()}`;
      setSelectedItems([...selectedItems, { item_id: tempId, name: customItemName, quantity: 1, price }]);
      setCustomItemName("");
      setCustomItemPrice("");
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

   const [taxRate, setTaxRate] = useState(0);

   const subtotal = selectedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
   const tax = (subtotal * taxRate) / 100;
   const totalAmount = subtotal + tax;

   const submitInvoice = async () => {
      if ((!isNewClient && !clientId) || (isNewClient && !newClientName)) {
          toast.error("Please select a client or enter client details.");
          return;
      }
      if (selectedItems.length === 0 || !dueDate) {
          toast.error("Due Date and at least 1 item are required.");
          return;
      }
      
      const payload = {
          client_id: isNewClient ? undefined : clientId,
          client_name: isNewClient ? newClientName : undefined,
          client_email: isNewClient ? newClientEmail : undefined,
          client_phone: isNewClient ? newClientPhone : undefined,
          client_address: isNewClient ? newClientAddress : undefined,
          invoice_number: invoiceNumber,
          due_date: dueDate,
          status: "Pending",
          tax_amount: tax,
          total_amount: totalAmount,
          notes: notes,
          items: selectedItems.map(i => ({
              item_id: i.item_id.startsWith("custom-") ? undefined : i.item_id,
              name: i.item_id.startsWith("custom-") ? i.name : undefined,
              quantity: i.quantity,
              price: i.price
          }))
      };

      try {
          await api.post("/invoices", payload);
          toast.success("Invoice created successfully.");
          router.push("/dashboard/invoices");
      } catch (err: any) {
          toast.error(err.response?.data?.message || "Failed to create invoice");
      }
   }

   return (
       <div className="max-w-4xl mx-auto pb-20">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-8">
             <h1 className="text-3xl font-medium tracking-tight">Create New Invoice</h1>
             <Button onClick={() => router.push("/dashboard/invoices")} variant="outline" className="border-white/10 bg-transparent text-neutral-400 hover:text-white hover:bg-white/[0.03]">Cancel</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <Label className="text-neutral-400">Client</Label>
                       <button
                          type="button"
                          onClick={() => setIsNewClient(!isNewClient)}
                          className="text-xs text-neutral-400 hover:text-white underline transition-colors"
                       >
                          {isNewClient ? "Select Existing Client" : "+ Create New Client"}
                       </button>
                    </div>

                    {!isNewClient ? (
                       <Select value={clientId} onValueChange={setClientId}>
                          <SelectTrigger className="w-full h-11 px-3 bg-[#0c0c0c] border border-white/10 text-white outline-none focus:ring-1 focus:ring-white/30 transition-colors">
                             <SelectValue placeholder="-- Select Client --" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0c0c0c] border-white/10 text-white">
                             {clients.map(c => <SelectItem key={c.id} value={c.id} className="cursor-pointer focus:bg-white/[0.05]">{c.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    ) : (
                       <div className="space-y-3 p-4 border border-white/[0.05] rounded-md bg-[#080808]">
                          <Input placeholder="Client Name *" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="bg-[#111] border-white/10 text-white" />
                          <Input placeholder="Client Email" type="email" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} className="bg-[#111] border-white/10 text-white" />
                          <Input placeholder="Client Phone" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} className="bg-[#111] border-white/10 text-white" />
                          <Input placeholder="Client Address" value={newClientAddress} onChange={e => setNewClientAddress(e.target.value)} className="bg-[#111] border-white/10 text-white" />
                       </div>
                    )}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="mb-2 block text-neutral-400">Invoice Number</Label>
                        <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="bg-[#0c0c0c] border-white/10 font-mono text-white" />
                    </div>
                    <div>
                        <Label className="mb-2 block text-neutral-400">Due Date</Label>
                        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-[#0c0c0c] border-white/10 text-white css-invert-calendar" style={{colorScheme: 'dark'}} />
                    </div>
                 </div>

                 <div>
                    <Label className="mb-2 block text-neutral-400">Additional Notes (Optional)</Label>
                    <textarea 
                       className="w-full p-3 rounded-md border border-white/10 bg-[#0c0c0c] text-white outline-none focus:border-white/30 transition-colors min-h-[100px]"
                       placeholder="Add terms, payment info, or remarks..."
                       value={notes} 
                       onChange={(e) => setNotes(e.target.value)}
                    />
                 </div>
             </div>

             <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-xl p-6 flex flex-col h-full shadow-2xl">
                  <h2 className="text-lg font-medium mb-4 text-white">Invoice Items</h2>
                  
                  <div className="mb-6 space-y-4">
                     <Select value="" onValueChange={(val) => { if (val) addItem(val); }}>
                        <SelectTrigger className="w-full h-10 px-3 bg-[#111] border border-white/10 text-xs font-mono text-white outline-none focus:ring-1 focus:ring-white/30 transition-colors hover:bg-white/[0.02]">
                           <SelectValue placeholder="+ Add Item from Catalog..." />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-white/10 text-white font-mono text-xs">
                           {catalog.map(i => <SelectItem key={i.id} value={i.id} className="cursor-pointer focus:bg-white/[0.05]">{i.name} — ₹{parseFloat(i.default_price).toFixed(2)}</SelectItem>)}
                        </SelectContent>
                     </Select>
                     
                     <div className="border border-white/5 rounded-md p-3 bg-[#080808] space-y-2">
                        <Label className="text-[10px] text-neutral-400 uppercase">Or Add Custom Item</Label>
                        <div className="flex gap-2">
                           <Input placeholder="Item Name" value={customItemName} onChange={e => setCustomItemName(e.target.value)} className="h-8 text-xs bg-[#111] border-white/10 text-white flex-1" />
                           <Input type="number" placeholder="Price" value={customItemPrice} onChange={e => setCustomItemPrice(e.target.value)} className="h-8 text-xs bg-[#111] border-white/10 text-white w-20" />
                           <Button type="button" onClick={addCustomItem} className="h-8 px-3 bg-white text-black hover:bg-neutral-200 text-xs font-medium">Add</Button>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                     {selectedItems.length === 0 ? (
                        <p className="text-neutral-600 text-xs font-mono text-center mt-12 border border-dashed border-white/10 rounded-md p-6">No items added to this invoice.</p>
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

                  <div className="border-t border-white/[0.08] pt-4 mt-auto space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400">Subtotal</span>
                        <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-sm">GST (Tax Rate)</span>
                        <Select value={String(taxRate)} onValueChange={(val) => setTaxRate(Number(val))}>
                           <SelectTrigger className="w-28 h-8 px-2 bg-[#111] border border-white/10 text-xs text-white">
                              <SelectValue placeholder="0%" />
                           </SelectTrigger>
                           <SelectContent className="bg-[#111] border-white/10 text-white text-xs">
                              <SelectItem value="0" className="cursor-pointer">0% GST</SelectItem>
                              <SelectItem value="5" className="cursor-pointer">5% GST</SelectItem>
                              <SelectItem value="12" className="cursor-pointer">12% GST</SelectItem>
                              <SelectItem value="18" className="cursor-pointer">18% GST</SelectItem>
                              <SelectItem value="28" className="cursor-pointer">28% GST</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     {taxRate > 0 && (
                        <div className="flex justify-between items-center text-xs text-neutral-500 pl-4 border-l border-white/10">
                           <span>CGST ({(taxRate / 2)}%) + SGST ({(taxRate / 2)}%)</span>
                           <span>₹{(tax).toFixed(2)}</span>
                        </div>
                     )}

                     <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <span className="text-neutral-400 text-sm">Total Amount</span>
                        <span className="text-2xl font-bold tracking-tight text-white">₹{totalAmount.toFixed(2)}</span>
                     </div>
                     <Button onClick={submitInvoice} className="w-full bg-white text-black hover:bg-neutral-200 h-11 font-medium shadow-xl shadow-white/5 transition-colors">
                         Save Invoice
                     </Button>
                  </div>
              </div>
          </div>
       </div>
   )
}
