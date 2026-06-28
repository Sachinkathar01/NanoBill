"use client";

import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-[#262626] bg-[#090909] py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-neutral-400 mb-12">
                
                {/* Brand & Address Column */}
                <div className="space-y-4">
                    <span className="font-bold tracking-tight text-[#FAFAFA] hover:text-[#F97316] transition-colors font-mono text-base cursor-pointer">NanoBill</span>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                        Automated collections and 1-page checkout invoicing for modern freelancers, digital agencies, and micro-SMEs.
                    </p>
                    <div className="text-xs text-neutral-600 space-y-1">
                        <p className="font-semibold text-neutral-500">Corporate Address:</p>
                        <p>NanoBill Technologies Private Limited</p>
                        <p>402, 4th Floor, Tech Hub, Koramangala,</p>
                        <p>Bengaluru, Karnataka - 560034</p>
                    </div>
                </div>

                {/* Product Features Column */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-[#FAFAFA] text-xs uppercase tracking-wider">Product</h4>
                    <ul className="space-y-2.5 text-xs text-neutral-500">
                        <li>
                            <Link href="#features" className="hover:text-[#F97316] transition-colors">
                                1-Page Invoicing
                            </Link>
                        </li>
                        <li>
                            <Link href="#features" className="hover:text-[#F97316] transition-colors">
                                Platform Direct Payouts
                            </Link>
                        </li>
                        <li>
                            <Link href="#features" className="hover:text-[#F97316] transition-colors">
                                Auto WhatsApp Reminders
                            </Link>
                        </li>
                        <li>
                            <Link href="#features" className="hover:text-[#F97316] transition-colors">
                                Late Fee Penalties
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Company & Support Column */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-[#FAFAFA] text-xs uppercase tracking-wider">Support</h4>
                    <ul className="space-y-2.5 text-xs text-neutral-500">
                        <li>
                            <a href="mailto:support@nanobill.co" className="hover:text-[#F97316] transition-colors">
                                support@nanobill.co
                            </a>
                        </li>
                        <li>
                            <Link href="/dashboard" className="hover:text-[#F97316] transition-colors">
                                Merchant Portal
                            </Link>
                        </li>
                        <li>
                            <Link href="#how-it-works" className="hover:text-[#F97316] transition-colors">
                                Knowledge Base
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal Column */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-[#FAFAFA] text-xs uppercase tracking-wider">Legal</h4>
                    <ul className="space-y-2.5 text-xs text-neutral-500">
                        <li>
                            <Link href="/privacy" className="hover:text-[#F97316] transition-colors">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-[#F97316] transition-colors">
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookies" className="hover:text-[#F97316] transition-colors">
                                Cookie Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/payout-terms" className="hover:text-[#F97316] transition-colors">
                                Payout Guidelines
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-[#262626]/40 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-600 gap-4">
                <p>&copy; {new Date().getFullYear()} NanoBill Technologies. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors">Twitter</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
};
