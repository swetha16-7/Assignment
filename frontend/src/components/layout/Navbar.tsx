import Link from 'next/link';
import { FileText, Plus, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              ProposalCraft
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                Pro
              </span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Enterprise Proposals</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/dashboard#templates" className="hover:text-blue-600 transition-colors">
            Templates
          </Link>
          <Link href="/#features" className="hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            All Proposals
          </Link>
          <Link
            href="/proposals/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Proposal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
