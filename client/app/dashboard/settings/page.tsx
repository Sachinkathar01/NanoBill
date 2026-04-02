"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
    const user = useAuthStore((state) => state.user);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/auth/me");
                const profile = res.data?.user;
                if (profile) {
                    setName(profile.name || "");
                    setEmail(profile.email || "");
                }
            } catch {
                toast.error("Failed to load profile info");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
                <p className="text-neutral-400 mt-2 text-sm">
                    Account visibility and workspace-level preferences.
                </p>
            </div>

            <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl">
                <h2 className="text-lg font-medium mb-4">Profile</h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="settings-name">Name</Label>
                        <Input
                            id="settings-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled
                            className="bg-[#111] border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="settings-email">Email</Label>
                        <Input
                            id="settings-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled
                            className="bg-[#111] border-white/10"
                        />
                    </div>
                </div>

                <p className="text-xs text-neutral-500 mt-4">
                    Profile editing API is not enabled yet. This page now exists so Settings navigation works without 404.
                </p>
            </section>

            <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl">
                <h2 className="text-lg font-medium mb-2">Session</h2>
                <p className="text-sm text-neutral-400 mb-4">
                    Auth persistence is active for your current browser.
                </p>
                <Button disabled={isLoading} variant="outline" className="border-white/10 hover:bg-white/5">
                    {isLoading ? "Checking session..." : "Session Active"}
                </Button>
            </section>
        </div>
    );
}
