'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProposalFormData, DashboardStats, TemplateMetadata } from '@/lib/types';
import {
  fetchDashboardStats,
  fetchProposals,
  deleteProposal,
  getPdfDownloadUrl,
  fetchTemplates,
} from '@/lib/api';
import { formatCurrency } from '@/lib/calculations';
import {
  Plus,
  FileText,
  Clock,
  Sparkles,
  Download,
  Trash2,
  Edit3,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_proposals: 0,
    draft_proposals: 0,
    generated_pdfs: 0,
    total_value: 0,
    recent_proposals: [],
  });
  const [proposals, setProposals] = useState<ProposalFormData[]>([]);
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, proposalsData, tmplData] = await Promise.all([
        fetchDashboardStats(),
        fetchProposals({ search, status: statusFilter }),
        fetchTemplates(),
      ]);
      setStats(statsData);
      setProposals(proposalsData);
      setTemplates(tmplData);
    } catch (err) {
      console.warn('Dashboard load note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete proposal "${name}"?`)) return;
    try {
      await deleteProposal(id);
      showToast('Proposal deleted successfully');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete proposal');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfd]">
      <Navbar />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Executive Overview
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Proposals Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor active pitches, generated commercial PDFs, and estimated pipeline values.
            </p>
          </div>

          <Link
            href="/proposals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/20 active:scale-[0.98] transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Proposal</span>
          </Link>
        </div>

        {/* Analytics Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Created */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Proposals
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.total_proposals}
            </div>
            <p className="text-xs text-slate-400 mt-1">Lifetime proposals drafted</p>
          </div>

          {/* Draft Proposals */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Draft Proposals
              </span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.draft_proposals}
            </div>
            <p className="text-xs text-slate-400 mt-1">Work in progress</p>
          </div>

          {/* Generated PDFs */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Generated PDFs
              </span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <FileCheck2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.generated_pdfs}
            </div>
            <p className="text-xs text-slate-400 mt-1">Ready for signature download</p>
          </div>

          {/* Pipeline Value */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm card-hover">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Proposal Value
              </span>
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {formatCurrency(stats.total_value, '$')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Aggregated commercial value</p>
          </div>
        </div>

        {/* Quick Template Access Shelf */}
        <div id="templates" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Start with a Template</h2>
            </div>
            <span className="text-xs text-slate-500">3 Print-Ready PDF Layouts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tmpl.category}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tmpl.primary_color }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{tmpl.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-1.5">{tmpl.tagline}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {tmpl.description}
                  </p>
                </div>

                <Link
                  href={`/proposals/new?template=${tmpl.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
                >
                  <span>Launch With {tmpl.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Proposals Table & Search/Filter Section */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Commercial Proposals</h2>
              <p className="text-xs text-slate-500">
                All business proposals saved to your ProposalCraft database.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, title..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-blue-500 outline-none"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                {['all', 'draft', 'generated'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition ${
                      statusFilter === st
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Proposals Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  You haven't generated or saved any business proposals matching this filter yet.
                </p>
              </div>
              <Link
                href="/proposals/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Proposal</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Proposal / Number</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-3">Template</th>
                    <th className="py-3 px-4 text-right">Value</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{prop.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {prop.proposal_number}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{prop.client_name}</div>
                        <div className="text-[11px] text-slate-400">{prop.client_company}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="capitalize text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {prop.selected_template}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-semibold font-mono text-slate-900">
                        {formatCurrency(prop.grand_total, prop.currency_symbol || '$')}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            prop.status === 'generated'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {prop.id && (
                            <a
                              href={getPdfDownloadUrl(prop.id)}
                              download
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}

                          <Link
                            href={`/proposals/${prop.id}/preview`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Live Preview"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(prop.id!, prop.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete proposal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
