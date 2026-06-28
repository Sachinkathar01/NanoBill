"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [razorpayAccountId, setRazorpayAccountId] = useState("");
    const [reminderWhatsappEnabled, setReminderWhatsappEnabled] = useState(true);
    const [reminderEmailEnabled, setReminderEmailEnabled] = useState(true);
    const [subscriptionPlan, setSubscriptionPlan] = useState("free");

    // Onboarding details
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [bankIfsc, setBankIfsc] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/auth/me");
                const profile = res.data?.user;
                if (profile) {
                    setName(profile.name || "");
                    setEmail(profile.email || "");
                    setRazorpayAccountId(profile.razorpay_account_id || "");
                    setReminderWhatsappEnabled(profile.reminder_whatsapp_enabled ?? true);
                    setReminderEmailEnabled(profile.reminder_email_enabled ?? true);
                    setSubscriptionPlan(profile.subscription_plan || "free");
                    
                    setBusinessName(profile.business_name || "");
                    setBusinessAddress(profile.business_address || "");
                    setPhone(profile.phone || "");
                    setBankAccountNumber(profile.bank_account_number || "");
                    setBankIfsc(profile.bank_ifsc || "");
                }
            } catch {
                toast.error("Failed to load profile info");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put("/auth/settings", {
                razorpay_account_id: razorpayAccountId || null,
                reminder_whatsapp_enabled: reminderWhatsappEnabled,
                reminder_email_enabled: reminderEmailEnabled,
                business_name: businessName || null,
                business_address: businessAddress || null,
                phone: phone || null,
                bank_account_number: bankAccountNumber || null,
                bank_ifsc: bankIfsc || null,
            });
            toast.success("Settings updated successfully!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const upgradePlan = async () => {
        try {
            const nextPlan = subscriptionPlan === "free" ? "premium" : "free";
            const res = await api.put("/auth/settings", {
                razorpay_account_id: razorpayAccountId || null,
                reminder_whatsapp_enabled: reminderWhatsappEnabled,
                reminder_email_enabled: reminderEmailEnabled,
                subscription_plan: nextPlan
            });
            setSubscriptionPlan(res.data.user.subscription_plan);
            toast.success(`Plan updated to ${nextPlan.toUpperCase()}!`);
        } catch {
            toast.error("Failed to upgrade subscription");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-neutral-400 font-mono text-sm">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
                <p className="text-neutral-400 mt-2 text-sm">
                    Configure your automated billing, custom payment integrations, and plan subscription.
                </p>
            </div>

            <form onSubmit={saveSettings} className="space-y-8">
                {/* Profile section */}
                <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
                    <h2 className="text-lg font-medium text-white">Profile Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="settings-name">Name</Label>
                            <Input
                                id="settings-name"
                                value={name}
                                disabled
                                className="bg-[#111] border-white/10 text-neutral-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="settings-email">Email</Label>
                            <Input
                                id="settings-email"
                                value={email}
                                disabled
                                className="bg-[#111] border-white/10 text-neutral-400"
                            />
                        </div>
                    </div>
                </section>

                {/* Onboarding & Business details */}
                <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
                    <h2 className="text-lg font-medium text-white">SaaS Merchant Business Profile</h2>
                    <p className="text-xs text-neutral-400">
                        These details will be used on tax-compliant GST receipts sent to your clients.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="settings-business-name">Business / Brand Name</Label>
                            <Input
                                id="settings-business-name"
                                placeholder="Your registered company or trading name"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="bg-[#111] border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="settings-phone">Business Contact Number</Label>
                            <Input
                                id="settings-phone"
                                placeholder="+91 xxxxx xxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-[#111] border-white/10 text-white"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="settings-business-address">Business Address</Label>
                            <textarea
                                id="settings-business-address"
                                placeholder="Full physical office or home office address"
                                value={businessAddress}
                                onChange={(e) => setBusinessAddress(e.target.value)}
                                className="w-full h-20 rounded-md bg-[#111] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                            />
                        </div>
                    </div>
                </section>

                {/* Bank Payout settings */}
                <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
                    <h2 className="text-lg font-medium text-white">Bank Payout Routing</h2>
                    <p className="text-xs text-neutral-400">
                        If you do not have a custom Razorpay account, payments will be accepted via NanoBill Aggregator and automatically routed to this bank account.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="settings-bank-acc">Bank Account Number</Label>
                            <Input
                                id="settings-bank-acc"
                                placeholder="Your savings/current account number"
                                value={bankAccountNumber}
                                onChange={(e) => setBankAccountNumber(e.target.value)}
                                className="bg-[#111] border-white/10 text-white font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="settings-bank-ifsc">Bank IFSC Code</Label>
                            <Input
                                id="settings-bank-ifsc"
                                placeholder="IFSC Code (e.g. SBIN0001234)"
                                value={bankIfsc}
                                onChange={(e) => setBankIfsc(e.target.value)}
                                className="bg-[#111] border-white/10 text-white font-mono"
                            />
                        </div>
                    </div>
                </section>

                {/* Custom Razorpay Integration */}
                <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
                    <h2 className="text-lg font-medium text-white">Direct Payment Routing</h2>
                    <p className="text-xs text-neutral-400">
                        Input your custom Razorpay Merchant Account ID to bypass platform routing and receive payments directly into your gateway.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="settings-razorpay">Razorpay Merchant Account ID</Label>
                        <Input
                            id="settings-razorpay"
                            placeholder="e.g. acc_xxxxxxxxxxxxxx"
                            value={razorpayAccountId}
                            onChange={(e) => setRazorpayAccountId(e.target.value)}
                            className="bg-[#111] border-white/10 text-white font-mono"
                        />
                    </div>
                </section>

                {/* Automation Reminders */}
                <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
                    <h2 className="text-lg font-medium text-white">Automated Reminder Alerts</h2>
                    <p className="text-xs text-neutral-400">
                        Choose how late or upcoming invoice payment links are automatically sent to your clients.
                    </p>
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium text-white">Email Reminders</Label>
                                <p className="text-xs text-neutral-500">Auto-email reminders 1 day before and on due date.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={reminderEmailEnabled}
                                onChange={(e) => setReminderEmailEnabled(e.target.checked)}
                                className="w-5 h-5 accent-white rounded bg-[#111] border-white/10"
                            />
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium text-white">WhatsApp Notifications</Label>
                                <p className="text-xs text-neutral-500">Send automatic WhatsApp checkout reminders to client mobile numbers.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={reminderWhatsappEnabled}
                                onChange={(e) => setReminderWhatsappEnabled(e.target.checked)}
                                className="w-5 h-5 accent-white rounded bg-[#111] border-white/10"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-neutral-200 px-8 py-2 font-medium">
                        {isSaving ? "Saving Settings..." : "Save Settings"}
                    </Button>
                </div>
            </form>

            {/* SaaS Subscription Plans */}
            <section className="rounded-xl border border-white/8 bg-[#0c0c0c] p-6 shadow-2xl space-y-6">
                <div>
                    <h2 className="text-lg font-medium text-white">SaaS Subscription</h2>
                    <p className="text-xs text-neutral-400 mt-1">
                        Manage your account plan level. Get access to advanced analytics and unlimited reminders.
                    </p>
                </div>

                <div className="flex justify-between items-center border border-white/5 bg-[#111]/30 rounded-lg p-4">
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Active Plan</div>
                        <div className="text-lg font-semibold text-white mt-0.5 capitalize">
                            {subscriptionPlan} Plan
                        </div>
                    </div>
                    <Button onClick={upgradePlan} className="bg-white text-black hover:bg-neutral-200">
                        {subscriptionPlan === "free" ? "Upgrade to Premium" : "Downgrade to Free"}
                    </Button>
                </div>
            </section>
        </div>
    );
}
