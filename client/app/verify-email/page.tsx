"use client";

import { useEffect, useState, Suspense } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const performVerification = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err: any) {
        setStatus("error");
        toast.error(err.response?.data?.message || "Verification failed. Token may be expired.");
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="w-full max-w-sm mt-16 text-center">
      {status === "loading" && (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Verifying Email...</h1>
          <p className="text-neutral-500 text-sm">Please wait while we secure your workspace.</p>
          <div className="h-1 w-full bg-white/10 rounded overflow-hidden mt-6">
            <div className="h-full bg-white animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 p-6 border border-white/[0.08] rounded-xl bg-[#0c0c0c]">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workspace Verified</h1>
          <p className="text-neutral-400 text-sm mb-6">Your email address has been verified. Your SaaS dashboard is fully enabled.</p>
          <Button className="w-full bg-white text-black hover:bg-neutral-200" asChild>
            <Link href="/login">Proceed to Log In</Link>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 p-6 border border-red-500/20 rounded-xl bg-[#0c0c0c]">
          <h1 className="text-3xl font-bold tracking-tight text-red-400 mb-2">Verification Failed</h1>
          <p className="text-neutral-400 text-sm mb-6">The verification link is invalid or has expired. Please log in to request a new link.</p>
          <Button className="w-full bg-white text-black hover:bg-neutral-200" asChild>
            <Link href="/login">Return to Log In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailRoute() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 text-white font-sans">
      <Navbar />
      <Suspense fallback={<div className="text-neutral-400 font-mono text-sm">Loading verification...</div>}>
        <VerifyEmailInner />
      </Suspense>
    </div>
  );
}
