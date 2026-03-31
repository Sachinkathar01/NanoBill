import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/[0.06] bg-[#080808]/70 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight text-white hover:opacity-80 transition-opacity cursor-pointer">
          NanoBill 
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
          Log in
        </Link>
        <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-md hover:bg-neutral-200 transition-colors">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};
