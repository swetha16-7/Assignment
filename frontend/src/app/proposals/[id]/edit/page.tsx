'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Step1Company from '@/components/forms/Step1Company';
import Step2Client from '@/components/forms/Step2Client';
import Step3Project from '@/components/forms/Step3Project';
import Step4Pricing from '@/components/forms/Step4Pricing';
import Step5Timeline from '@/components/forms/Step5Timeline';
import Step6Terms from '@/components/forms/Step6Terms';
import Step7Templates from '@/components/forms/Step7Templates';
import Step8Review from '@/components/forms/Step8Review';
import { ProposalFormData } from '@/lib/types';
import { fetchProposal, updateProposal, generatePdf, getPdfDownloadUrl } from '@/lib/api';
import {
  Building2,
  User,
  FolderKanban,
  DollarSign,
  Calendar,
  ShieldCheck,
  LayoutTemplate,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  { id: 1, name: 'Company', icon: Building2 },
  { id: 2, name: 'Client', icon: User },
  { id: 3, name: 'Scope', icon: FolderKanban },
  { id: 4, name: 'Pricing', icon: DollarSign },
  { id: 5, name: 'Timeline', icon: Calendar },
  { id: 6, name: 'Terms', icon: ShieldCheck },
  { id: 7, name: 'Template', icon: LayoutTemplate },
  { id: 8, name: 'Preview', icon: FileCheck },
];

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ProposalFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const p = await fetchProposal(id);
        setData(p);
        if (p.pdf_path || p.status === 'generated') {
          setDownloadUrl(getPdfDownloadUrl(id));
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load proposal for editing');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const updateData = (fields: Partial<ProposalFormData>) => {
    setData((prev) => (prev ? { ...prev, ...fields } : null));
  };

  const handleSaveDraft = async () => {
    if (!data || !id) return;
    setIsSaving(true);
    setErrorMessage('');
    try {
      const updated = await updateProposal(id, data);
      setData(updated);
      showToast('Changes saved to database!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update proposal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!data || !id) return;
    setIsGeneratingPdf(true);
    setErrorMessage('');
    try {
      await updateProposal(id, data);
      const res = await generatePdf(id);
      const dl = getPdfDownloadUrl(id);
      setDownloadUrl(dl);
      showToast(`PDF updated & generated! Document #${res.proposal_number}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'PDF generation failed');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafbfd]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-slate-400">
          Loading proposal data for editing...
        </div>
        <Footer />
      </div>
    );
  }

  if (errorMessage && !data) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafbfd]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <h2 className="text-lg font-bold text-slate-900">Unable to Load Proposal</h2>
          <p className="text-xs text-slate-500">{errorMessage}</p>
          <Link href="/dashboard" className="text-xs font-semibold text-blue-600 underline">
            Return to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfd]">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subheader Toolbar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">
                  Edit Proposal: {data.title}
                </h1>
                {data.proposal_number && (
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {data.proposal_number}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Client: {data.client_company || data.client_name || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isPassed = currentStep > s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : isPassed
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : isPassed
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? '✓' : s.id}
                  </span>
                  <span>{s.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Form Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8">
          {currentStep === 1 && <Step1Company data={data} updateData={updateData} />}
          {currentStep === 2 && <Step2Client data={data} updateData={updateData} />}
          {currentStep === 3 && <Step3Project data={data} updateData={updateData} />}
          {currentStep === 4 && <Step4Pricing data={data} updateData={updateData} />}
          {currentStep === 5 && <Step5Timeline data={data} updateData={updateData} />}
          {currentStep === 6 && <Step6Terms data={data} updateData={updateData} />}
          {currentStep === 7 && <Step7Templates data={data} updateData={updateData} />}
          {currentStep === 8 && (
            <Step8Review
              data={data}
              updateData={updateData}
              goToStep={setCurrentStep}
              onSaveDraft={handleSaveDraft}
              onGeneratePdf={handleGeneratePdf}
              isGeneratingPdf={isGeneratingPdf}
              isSaving={isSaving}
              downloadUrl={downloadUrl}
              errorMessage={errorMessage}
            />
          )}

          {/* Stepper Footer Controls */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < 8 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-[0.98] transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-500/20 active:scale-[0.98] transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Update & Generate Final PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
