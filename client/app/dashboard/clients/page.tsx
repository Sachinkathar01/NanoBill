"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ClientValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" }
  });

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data.clients);
    } catch {
      toast.error("Failed to load clients database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onSubmit = async (data: ClientValues) => {
    try {
      await api.post("/clients", data);
      toast.success("Client added successfully");
      setIsDialogOpen(false);
      reset();
      fetchClients();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating client");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-medium tracking-tight">Clients</h1>
         
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button className="bg-white text-black hover:bg-neutral-200 shadow-xl shadow-white/5">Create Client</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0c0c0c] border border-white/[0.08] text-white">
               <DialogHeader>
                  <DialogTitle className="text-xl">Add New Client</DialogTitle>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                     <Label>Company Name</Label>
                     <Input {...register("name")} className="bg-[#111] border-white/10" placeholder="Acme Corp" />
                     {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                     <Label>Email</Label>
                     <Input {...register("email")} className="bg-[#111] border-white/10" placeholder="billing@acme.inc" />
                  </div>
                  <div className="space-y-2">
                     <Label>Phone Number</Label>
                     <Input {...register("phone")} className="bg-[#111] border-white/10" placeholder="+91 99999 99999" />
                  </div>
                  <div className="space-y-2">
                     <Label>Address</Label>
                     <Input {...register("address")} className="bg-[#111] border-white/10" placeholder="123 Tech Park" />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black mt-4 h-11 font-medium hover:bg-neutral-200 transition-colors">
                     {isSubmitting ? "Saving..." : "Save to Database"}
                  </Button>
               </form>
            </DialogContent>
         </Dialog>
       </div>

       <div className="border border-white/[0.08] rounded-xl bg-[#0c0c0c] overflow-hidden shadow-2xl">
          <Table>
             <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                   <TableHead className="text-neutral-400 font-medium h-12">Name</TableHead>
                   <TableHead className="text-neutral-400 font-medium h-12">Email</TableHead>
                   <TableHead className="text-neutral-400 font-medium h-12">Phone</TableHead>
                   <TableHead className="text-neutral-400 font-medium h-12 text-right">Added</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
                {isLoading ? (
                   <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={4} className="text-center py-12 text-neutral-500 font-mono">Loading vault...</TableCell></TableRow>
                ) : clients.length === 0 ? (
                   <TableRow className="border-none hover:bg-transparent"><TableCell colSpan={4} className="text-center py-12 text-neutral-500 font-mono border-dashed">No clients tracked. Add one above.</TableCell></TableRow>
                ) : (
                   clients.map((c) => (
                      <TableRow key={c.id} className="border-white/[0.05] hover:bg-white/[0.02] cursor-pointer transition-colors">
                         <TableCell className="font-medium text-white">{c.name}</TableCell>
                         <TableCell className="text-neutral-400 font-mono text-xs">{c.email || "—"}</TableCell>
                         <TableCell className="text-neutral-400 font-mono text-xs">{c.phone || "—"}</TableCell>
                         <TableCell className="text-neutral-400 text-right font-mono text-xs">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                   ))
                )}
             </TableBody>
          </Table>
       </div>
    </div>
  )
}
