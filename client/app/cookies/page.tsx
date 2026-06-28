"use client";

import Link from "next/link";

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white py-24 px-6 max-w-4xl mx-auto space-y-8 font-sans">
            <div>
                <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors font-mono uppercase tracking-widest">
                    &larr; Back to Home
                </Link>
                <h1 className="text-4xl font-bold tracking-tight mt-6">Cookie Policy</h1>
                <p className="text-neutral-400 mt-2 text-sm">Last Updated: June 26, 2026</p>
            </div>

            <div className="space-y-6 text-sm text-neutral-300 leading-relaxed font-light">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">What Are Cookies</h2>
                    <p>
                        Cookies are small text files stored on your computer or device by your web browser when you visit websites. They help websites recognize your device and remember specific user preferences.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">How We Use Cookies</h2>
                    <p>
                        We use essential cookies to maintain secure merchant login sessions, verify authorization tokens when loading dashboard endpoints, and save notification toggle preferences locally.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-white">Your Choices</h2>
                    <p>
                        Most web browsers allow you to manage cookies through browser settings. Disabling cookies will disrupt your session authentication and prevent you from accessing the secure NanoBill dashboard.
                    </p>
                </section>
            </div>
        </main>
    );
}
