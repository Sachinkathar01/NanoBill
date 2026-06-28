"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordRoute() {
  const [isSent, setIsSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/auth/forgot-password", data);
      setIsSent(true);
      toast.success("Reset link sent if email exists.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-white font-sans">
      <Navbar />
      <div className="w-full max-w-sm mt-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h1>
        <p className="text-neutral-500 text-sm mb-8">Enter your email and we'll send you a password reset link.</p>

        {isSent ? (
          <div className="space-y-4 p-4 border border-white/[0.08] rounded-xl bg-[#0c0c0c] text-center">
            <p className="text-neutral-300 text-sm">We have sent a secure link to your email address to reset your password. Please check your inbox and spam folders.</p>
            <Button className="w-full bg-white text-black hover:bg-neutral-200" asChild>
              <Link href="/login">Return to Log In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} className="bg-[#0c0c0c] border-white/10 text-white" placeholder="billing@yourbrand.com" />
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-neutral-200 mt-6 h-11 font-medium">
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-neutral-500 mt-6">
          Remember your credentials? <Link href="/login" className="text-white hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
