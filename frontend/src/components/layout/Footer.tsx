import Link from 'next/link';
import { FileText, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900">ProposalCraft</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
              Executive proposal generation platform engineered for high-growth agencies, consultants, and enterprise service teams.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Next.js 14</span>
              <span>•</span>
              <span>FastAPI</span>
              <span>•</span>
              <span>Playwright Chromium</span>
              <span>•</span>
              <span>PostgreSQL</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
              <li><Link href="/proposals/new" className="hover:text-blue-600">Proposal Builder</Link></li>
              <li><Link href="/#templates" className="hover:text-blue-600">Template Engine</Link></li>
              <li><Link href="/#features" className="hover:text-blue-600">Features</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Templates</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><span className="text-slate-700 font-medium">Executive Elite</span> — Enterprise RFP</li>
              <li><span className="text-slate-700 font-medium">Modern Innovation</span> — Tech & Startups</li>
              <li><span className="text-slate-700 font-medium">Minimal Signature</span> — Advisory & Strategy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} ProposalCraft. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Production-Grade Architecture</span>
            <span>Independent Deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
