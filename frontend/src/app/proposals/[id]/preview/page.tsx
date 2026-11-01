'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LivePreviewDocument from '@/components/preview/LivePreviewDocument';
import { ProposalFormData } from '@/lib/types';
import { fetchProposal, generatePdf, getPdfDownloadUrl, downloadProposalPdf } from '@/lib/api';
import {
  Download,
  Sparkles,
  ArrowLeft,
  FileCheck2,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProposalPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<ProposalFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const p = await fetchProposal(id);
        setProposal(p);
        if (p.pdf_path || p.status === 'generated') {
          setDownloadUrl(getPdfDownloadUrl(id));
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load proposal');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleGenerate = async () => {
    if (!id) return;
    setIsGenerating(true);
    setErrorMsg('');
    try {
      await generatePdf(id);
      setDownloadUrl(getPdfDownloadUrl(id));
      setToastMsg('PDF generated and ready to download!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
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

      {/* Top Banner Toolbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">
                  {proposal?.title || 'Proposal Document'}
                </h1>
                {proposal?.proposal_number && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {proposal.proposal_number}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Prepared for {proposal?.client_company || proposal?.client_name || 'Client'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Rendering PDF...' : 'Regenerate PDF'}</span>
            </button>

            {downloadUrl && (
              <button
                type="button"
                onClick={() => downloadProposalPdf(id, `${proposal?.proposal_number || 'proposal'}.pdf`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Preview Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="p-20 text-center text-sm text-slate-400">Loading proposal...</div>
        ) : errorMsg && !proposal ? (
          <div className="p-16 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Proposal Not Found</h3>
            <p className="text-xs text-slate-500">{errorMsg}</p>
            <Link href="/dashboard" className="inline-block text-xs text-blue-600 underline">
              Return to Dashboard
            </Link>
          </div>
        ) : proposal ? (
          <div className="h-[800px] w-full">
            <LivePreviewDocument data={proposal} />
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
