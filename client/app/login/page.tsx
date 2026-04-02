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
import { useAuthStore } from "@/store/useAuthStore";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Invalid password"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginRoute() {
  const router = useRouter();
  const loginFn = useAuthStore(state => state.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // API call automatically receives HTTP-only JWT Cookie
      const response = await api.post("/auth/login", data);

      // Hydrate global Zustand store
      loginFn(response.data.user, response.data.token);

      toast.success("Authentication successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Are you registered?");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-white font-sans">
      <Navbar />
      <div className="w-full max-w-sm mt-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-neutral-500 text-sm mb-8">Enter your credentials to access your vault.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-neutral-500 cursor-pointer hover:text-white">Forgot?</span>
            </div>
            <Input id="password" type="password" {...register("password")} className="bg-[#0c0c0c] border-white/10 text-white" />
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-neutral-200 mt-6 h-11 font-medium">
            {isSubmitting ? "Authenticating..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          No account yet? <Link href="/register" className="text-white hover:underline">Deploy Workspace</Link>
        </p>
      </div>
    </div>
  );
}
