"use client";

import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white py-24 px-6 max-w-4xl mx-auto space-y-8 font-sans">
            <div>
                <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors font-mono uppercase tracking-widest">
                    &larr; Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight mt-6">Privacy Policy</h1>
                <p className="text-neutral-400 mt-2 text-sm">Last Updated: June 26, 2026</p>
            </div>

            <div className="space-y-6 text-sm text-neutral-300 leading-relaxed font-light">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when registering for a NanoBill account. This includes your business name, corporate address, email address, phone number, and bank account details necessary to configure direct aggregator payouts.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
                    <p>
                        We use the collected information to generate professional, tax-compliant GST receipts, trigger automated billing notifications (via email and WhatsApp), route invoice payments directly to your gateway, and process monthly/annual SaaS tier subscriptions.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Information Sharing and Payouts</h2>
                    <p>
                        NanoBill does not sell your data. Payout information is shared securely with our regulated banking and payment partners (such as Razorpay Route) to process merchant settlements under strict financial compliance standards.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Cookies and Analytics</h2>
                    <p>
                        We use technical cookies to persist user sessions and securely verify auth states. You can control cookie preferences directly through your browser settings.
                    </p>
                </section>
            </div>
        </main>
    );
}
