"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const itemSchema = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().optional(),
   default_price: z.preprocess((a) => {
      if (typeof a === "string" || typeof a === "number") {
         const num = Number(a);
         return isNaN(num) ? undefined : num;
      }
      return undefined;
   }, z.number().min(0, "Price must be positive")),
   image: z.any().optional(),
});

type ItemValues = {
   name: string;
   description?: string;
   default_price: number;
   image?: any;
};

export default function ItemsPage() {
   const [items, setItems] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ItemValues>({
      resolver: zodResolver(itemSchema) as any,
      defaultValues: {
         name: "",
         description: "",
         default_price: 0,
         image: undefined,
      },
   });

   const fetchItems = async () => {
      try {
         const res = await api.get("/items");
         setItems(res.data.items);
      } catch {
         toast.error("Failed to load inventory");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchItems();
   }, []);

   const onSubmit: (data: ItemValues) => Promise<void> = async (data) => {
      try {
         const formData = new FormData();
         formData.append("name", data.name);
         formData.append("default_price", data.default_price.toString());
         if (data.description) formData.append("description", data.description);

         // Hook into the multipart system for Cloudinary bypass upload
         if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
         }

         await api.post("/items", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
         });

         toast.success("Product added successfully");
         setIsDialogOpen(false);
         reset();
         fetchItems();
      } catch (err: any) {
         toast.error(err.response?.data?.message || "Error saving item");
      }
   };

   return (
      <div className="max-w-6xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight">Products & Services</h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
               <DialogTrigger asChild>
                  <Button className="bg-white text-black hover:bg-neutral-200">Add Product/Service</Button>
               </DialogTrigger>
               <DialogContent className="bg-[#0c0c0c] border border-white/8 text-white">
                  <DialogHeader>
                     <DialogTitle>Add New Product/Service</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                     <div className="space-y-2">
                        <Label>Product/Service Name</Label>
                        <Input {...register("name")} className="bg-[#111] border-white/10" placeholder="e.g. Premium UI Design" />
                        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label>Description</Label>
                        <Input {...register("description")} className="bg-[#111] border-white/10" placeholder="Optional details..." />
                     </div>
                     <div className="space-y-2">
                        <Label>Default Price (₹)</Label>
                        <Input type="number" step="0.01" {...register("default_price")} className="bg-[#111] border-white/10" placeholder="1500.00" />
                        {errors.default_price && <p className="text-red-400 text-xs">{errors.default_price.message}</p>}
                     </div>
                     <div className="space-y-2">
                        <Label>Product Image</Label>
                        <Input type="file" accept="image/*" {...register("image")} className="bg-[#111] border-white/10 file:bg-white file:text-black file:border-none file:mr-4 file:px-2 file:py-1 file:rounded-sm hover:file:bg-neutral-200 cursor-pointer" />
                     </div>
                     <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black mt-4 h-11 transition-colors hover:bg-neutral-200">
                        {isSubmitting ? "Saving Product..." : "Save Product"}
                     </Button>
                  </form>
               </DialogContent>
            </Dialog>
         </div>

         {isLoading ? (
            <div className="text-center py-20 text-neutral-500 font-mono">Loading catalog...</div>
         ) : items.length === 0 ? (
            <div className="border border-white/8 rounded-xl bg-[#0c0c0c] p-16 text-center text-neutral-500 border-dashed hover:bg-[#111] transition-colors">
               Your catalog is empty. Add your first product/service to get started.
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
               {items.map(item => (
                  <div key={item.id} className="rounded-xl border border-white/8 bg-[#0c0c0c] overflow-hidden group hover:border-white/20 transition-colors shadow-2xl">
                     {item.image_url ? (
                        <div className="h-44 w-full bg-black border-b border-white/5 overflow-hidden">
                           <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                     ) : (
                        <div className="h-44 w-full bg-[#080808] border-b border-white/5 flex items-center justify-center text-neutral-800 font-mono text-xs tracking-widest">
                           NO_MEDIA
                        </div>
                     )}
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-semibold text-white truncate pr-2 tracking-tight">{item.name}</h3>
                           <span className="text-sm font-bold text-white whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-md">₹{parseFloat(item.default_price).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-2">{item.description || "No description."}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}
