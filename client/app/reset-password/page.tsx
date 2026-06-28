"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Suspense, useState } from "react";

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error("Password reset token is missing from the URL.");
      return;
    }
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired reset token.");
    }
  };

  return (
    <div className="w-full max-w-sm mt-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Configure Password</h1>
      <p className="text-neutral-500 text-sm mb-8">Choose a new password for your workspace.</p>

      {isSuccess ? (
        <div className="space-y-4 p-4 border border-white/[0.08] rounded-xl bg-[#0c0c0c] text-center">
          <p className="text-neutral-300 text-sm">Your password has been changed. You can now login with your new credentials.</p>
          <Button className="w-full bg-white text-black hover:bg-neutral-200" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" {...register("password")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-neutral-200 mt-6 h-11 font-medium">
            {isSubmitting ? "Updating Password..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordRoute() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-white font-sans">
      <Navbar />
      <Suspense fallback={<div className="text-neutral-400 font-mono text-sm">Loading reset portal...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
