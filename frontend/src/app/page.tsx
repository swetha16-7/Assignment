import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Building2,
  Feather,
  Download,
  ShieldCheck,
  Calculator,
  LayoutDashboard,
  Check,
  ChevronRight,
  Printer
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfd]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Proposal Engineering</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-navy-900 tracking-tight leading-[1.1] mb-6">
            Create Professional Proposals <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              in Minutes.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed mb-10">
            Ditch fragile document formatters. ProposalCraft empowers engineering leaders, consultants, and enterprise teams to generate high-converting, print-perfect A4 business proposals dynamically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/proposals/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 font-mono">3+</div>
              <div className="text-xs text-slate-500 font-medium">Bespoke Design Systems</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-mono">100%</div>
              <div className="text-xs text-slate-500 font-medium">Dynamic Data Injection</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-mono">0.00</div>
              <div className="text-xs text-slate-500 font-medium">Decimal-Safe Pricing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 font-mono">A4</div>
              <div className="text-xs text-slate-500 font-medium">Playwright Headless PDF</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE SECTION */}
      <section id="templates" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Template Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-3 mb-4">
              Three Genuinely Distinct Design Systems
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every template features an independent HTML/CSS layout, bespoke color palette, and tailored typographic hierarchy. Switch templates effortlessly without losing a single character of entered data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1: Executive Elite */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between card-hover">
              <div>
                <div className="w-full h-44 rounded-xl bg-slate-900 p-4 text-white flex flex-col justify-between relative overflow-hidden mb-6 shadow-inner">
                  <div className="w-12 h-1 bg-amber-400 rounded" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Formal RFP</span>
                    <div className="text-lg font-serif font-bold text-white">Executive Elite</div>
                  </div>
                  <div className="h-0.5 bg-slate-800 w-full" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-900" />
                  <h3 className="text-lg font-bold text-slate-900">Executive Elite</h3>
                </div>
                <p className="text-xs font-semibold text-blue-700 mb-2">Enterprise & Government Contracts</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Authoritative navy and white styling, muted gold accents, executive summary thesis block, structured workstream tables, and luxury investment summary.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Formal security cover page with reference numbering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Bordered financial breakdown with grand total card</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Institutional acceptance and signatory blocks</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/proposals/new?template=corporate"
                className="w-full py-2.5 px-4 text-center text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                Use Executive Elite
              </Link>
            </div>

            {/* Template 2: Modern Innovation */}
            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-50/20 shadow-lg shadow-blue-600/5 flex flex-col justify-between card-hover relative">
              <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>

              <div>
                <div className="w-full h-44 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-4 text-white flex flex-col justify-between relative overflow-hidden mb-6 shadow-md">
                  <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur rounded text-[9px] font-semibold tracking-wider">
                    TECH READY
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100">Startup & SaaS</span>
                    <div className="text-lg font-sans font-extrabold text-white">Modern Innovation</div>
                  </div>
                  <div className="h-1 bg-white/30 rounded w-1/3" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Modern Innovation</h3>
                </div>
                <p className="text-xs font-semibold text-blue-600 mb-2">Technology & Software Agencies</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Contemporary sapphire blue palette, modern typography, visual section indicators, card-style objective containers, and clean striped pricing layout.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Split hero cover layout with pill metadata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Interactive visual card containers for deliverables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Zebra-striped pricing with total summary card</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/proposals/new?template=modern"
                className="w-full py-2.5 px-4 text-center text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                Use Modern Innovation
              </Link>
            </div>

            {/* Template 3: Minimal Signature */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between card-hover">
              <div>
                <div className="w-full h-44 rounded-xl bg-white border border-slate-200 p-4 text-slate-900 flex flex-col justify-between relative overflow-hidden mb-6 shadow-sm">
                  <div className="text-[10px] font-mono tracking-widest text-slate-400">REF: PC-A4</div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Editorial</span>
                    <div className="text-lg font-light tracking-tight text-slate-900">Minimal Signature</div>
                  </div>
                  <div className="h-0.5 bg-slate-200 w-1/4" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Feather className="w-4 h-4 text-slate-700" />
                  <h3 className="text-lg font-bold text-slate-900">Minimal Signature</h3>
                </div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Consulting & Strategic Advisory</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Architectural elegance with neutral slate tones, generous whitespace, high typographic contrast, hairline divider lines, and uncluttered tables.
                </p>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>Airy, distraction-free typographic hierarchy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>Open, unboxed financial breakdown schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>Minimalist horizontal line authorization block</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/proposals/new?template=minimal"
                className="w-full py-2.5 px-4 text-center text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                Use Minimal Signature
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Intuitive Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mt-3 mb-4">
            Four Steps to a Winning Document
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            ProposalCraft guides you through a guided stepper designed specifically for complex business proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Branding & Client Info',
              desc: 'Upload company logo and specify recipient stakeholder details.',
              icon: Building2,
            },
            {
              step: '02',
              title: 'Scope & Architecture',
              desc: 'Articulate project goals, deliverables, and verifiable workstreams.',
              icon: Layers,
            },
            {
              step: '03',
              title: 'Pricing & Timelines',
              desc: 'Add line items with real-time decimal precision and execution milestones.',
              icon: Calculator,
            },
            {
              step: '04',
              title: 'Instant PDF Export',
              desc: 'Select a template, preview A4 pages live, and export pristine PDFs.',
              icon: Printer,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm relative group card-hover"
              >
                <div className="text-3xl font-black text-slate-200 mb-3 font-mono">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
              Technical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3 mb-4">
              Engineered for Mission-Critical Proposals
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every component is built for production reliability, from sub-second browser rendering to decimal-safe financial calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Playwright Chromium PDF Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders genuine A4 documents using headless Chromium with pixel-accurate CSS print specifications and clean multi-page break controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Decimal-Safe Financial Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents floating point rounding errors. Computes exact line totals, discounts, regional taxes, and grand totals with multi-currency support.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">PostgreSQL & Alembic Persistence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Normalized relational tables and structured JSON storage guarantee your commercial proposals are persistently backed up and versioned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-tr from-blue-700 to-indigo-700 rounded-3xl p-10 sm:p-14 text-white shadow-2xl shadow-blue-600/20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Build Your Winning Proposal?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Create high-converting, professional business proposals with dynamic pricing, executive branding, and instant A4 PDF downloads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/proposals/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition"
            >
              <span>Launch Proposal Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
