"use client";

export const HowItWorks = () => {
   return (
      <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto">
         <div className="mb-16">
             <h2 className="text-3xl font-medium tracking-tight mb-3 text-white">Getting Paid workflow</h2>
             <p className="text-neutral-500 text-lg max-w-xl font-light">A seamless three step process to manage your entire digital billing lifecycle.</p>
         </div>
         
         <div className="relative border-l border-white/[0.08] ml-3 md:ml-0 space-y-12">
            {[
              { step: "01", title: "Initialize Vault", desc: "Upload your product SKUs and client DB into the system securely." },
              { step: "02", title: "Compile Invoice", desc: "NanoBill computes the geometry, injects Razorpay, and spits out a hosted PDF hash." },
              { step: "03", title: "Listen for Event", desc: "The background webhook securely waits for the transaction completion and syncs." }
            ].map((s, i) => (
                <div key={i} className="pl-10 relative group">
                    <div className="absolute left-[-16px] top-1 mt-[-2px] h-8 w-8 rounded-full bg-[#080808] border border-white/[0.1] group-hover:border-white/[0.3] transition-colors flex items-center justify-center text-[10px] font-mono text-neutral-400">
                       {s.step}
                    </div>
                    <h3 className="text-sm font-semibold mb-1.5 text-white">{s.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-md">{s.desc}</p>
                </div>
            ))}
         </div>
      </section>
   )
}
