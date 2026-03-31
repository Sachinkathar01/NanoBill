"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterRoute() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/auth/register", data);
      toast.success("Account securely created! Redirecting...");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-white font-sans">
      <Navbar />
      <div className="w-full max-w-sm mt-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
        <p className="text-neutral-500 text-sm mb-8">Deploy NanoBill for your micro-business instantly.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name / Full Name</Label>
            <Input id="name" {...register("name")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Secure Password</Label>
            <Input id="password" type="password" {...register("password")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-neutral-200 mt-6 h-11 font-medium">
             {isSubmitting ? "Provisioning..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
           Already have a workspace? <Link href="/login" className="text-white hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
