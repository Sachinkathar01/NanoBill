"use client";

const features = [
  {
    title: "Instant PDFs",
    description: "Generate fully branded, geometric PDF invoices mapped directly to Cloudinary edge nodes in milliseconds.",
  },
  {
    title: "Razorpay Links",
    description: "Automated payment checkout URLs injected cleanly into every invoice you generate, drastically dropping friction.",
  },
  {
    title: "Webhook Tracking",
    description: "NanoBill listens silently for complete transactions and instantly syncs your database status behind the scenes.",
  },
  {
    title: "Minimal API",
    description: "Access your clients, product catalogs, and historic data securely from anywhere through a robust backend.",
  }
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 px-6 max-w-5xl mx-auto border-t border-white/[0.05]">
            <div className="mb-16">
                <h2 className="text-3xl font-medium tracking-tight mb-3 text-white">Built for performance.</h2>
                <p className="text-neutral-500 text-lg max-w-xl font-light">Uncompromised tooling for developers and freelancers who want to drop the enterprise bloat and just bill.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                    <div
                      key={i}
                      className="p-8 rounded-xl border border-white/[0.08] bg-[#0c0c0c] hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
                    >
                       <h3 className="text-sm font-semibold mb-2 text-white">{feature.title}</h3>
                       <p className="text-neutral-500 text-sm leading-relaxed font-normal">
                          {feature.description}
                       </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
