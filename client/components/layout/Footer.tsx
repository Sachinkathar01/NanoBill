export const Footer = () => {
    return (
      <footer className="border-t border-white/[0.05] bg-[#080808] py-12 px-6 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 max-w-7xl mx-auto w-full">
        <p className="font-mono uppercase tracking-widest mb-4 md:mb-0">NanoBill &copy; {new Date().getFullYear()}</p>
        <div className="flex gap-6">
           <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
           <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
           <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
        </div>
      </footer>
    );
  }
