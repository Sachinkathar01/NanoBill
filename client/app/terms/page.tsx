"use client";

import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white py-24 px-6 max-w-4xl mx-auto space-y-8 font-sans">
            <div>
                <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors font-mono uppercase tracking-widest">
                    &larr; Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight mt-6">Terms of Service</h1>
                <p className="text-neutral-400 mt-2 text-sm">Last Updated: June 26, 2026</p>
            </div>

            <div className="space-y-6 text-sm text-neutral-300 leading-relaxed font-light">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the NanoBill SaaS platform, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease all access and operations on the platform.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">2. Merchant Account and Payouts</h2>
                    <p>
                        Merchants are solely responsible for entering correct bank payout credentials (IFSC and Account Number). NanoBill is not responsible for funds sent to incorrect accounts due to user configuration errors. All direct payment gateway routings are governed additionally by Razorpay merchant guidelines.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">3. Automated Notifications</h2>
                    <p>
                        By enabling Email and WhatsApp notifications, you confirm that your clients have consented to receive automated transactional alerts and invoice checking links under applicable telecommunication and anti-spam laws.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">4. Subscription Billing</h2>
                    <p>
                        Upgrade to Premium plan unlocks unlimited automated reminders and custom route overrides. Cancelations or changes to subscription plans take effect at the end of the current billing cycle.
                    </p>
                </section>
            </div>
        </main>
    );
}
