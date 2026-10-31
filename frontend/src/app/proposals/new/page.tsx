'use client';

import React, { useState, useEffect } from 'react';
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
import { SAMPLE_PROPOSAL } from '@/lib/sampleData';
import { createProposal, updateProposal, generatePdf, getPdfDownloadUrl } from '@/lib/api';
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
  Eye,
  RotateCcw
} from 'lucide-react';

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

const INITIAL_PROPOSAL: ProposalFormData = {
  title: 'Business Proposal & Technical Scope',
  selected_template: 'corporate',
  status: 'draft',
  company_name: '',
  company_logo_url: '',
  company_address: '',
  company_email: '',
  company_phone: '',
  company_website: '',
  client_name: '',
  client_company: '',
  client_email: '',
  client_address: '',
  client_phone: '',
  project_name: '',
  project_description: '',
  project_objectives: [],
  scope_items: [],
  deliverables: [],
  assumptions: '',
  currency: 'USD',
  currency_symbol: '$',
  line_items: [
    {
      description: 'Initial Discovery & Architecture',
      quantity: 1,
      unit_price: 1500,
      total: 1500,
    },
  ],
  discount_percentage: 0,
  tax_percentage: 0,
  timeline_phases: [],
  terms: [],
};

const DRAFT_STORAGE_KEY = 'proposalcraft_active_draft_v1';

export default function NewProposalPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ProposalFormData>(INITIAL_PROPOSAL);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load draft from localStorage on mount and check template URL query param
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      let initial = saved ? JSON.parse(saved) : INITIAL_PROPOSAL;

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const tmplParam = params.get('template') as any;
        if (tmplParam && ['corporate', 'modern', 'minimal'].includes(tmplParam)) {
          initial = { ...initial, selected_template: tmplParam };
        }
      }

      setData(initial);
    } catch (e) {
      console.warn('LocalStorage draft load note:', e);
    }
  }, []);

  // Sync draft to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save note:', e);
    }
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const updateData = (fields: Partial<ProposalFormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handlePreFillSample = () => {
    setData(SAMPLE_PROPOSAL);
    showToast('Loaded complete enterprise proposal sample data!');
  };

  const handleResetForm = () => {
    if (confirm('Are you sure you want to reset all fields to a blank proposal?')) {
      setData(INITIAL_PROPOSAL);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setCurrentStep(1);
      showToast('Form reset to blank.');
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setErrorMessage('');
    try {
      if (data.id) {
        const updated = await updateProposal(data.id, data);
        setData(updated);
        showToast('Draft updated in database!');
      } else {
        const created = await createProposal(data);
        setData(created);
        showToast(`Draft created: ${created.proposal_number}`);
      }
    } catch (err: any) {
      // Offline fallback
      showToast('Draft preserved locally in browser.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage('');
    try {
      let proposalId = data.id;
      if (!proposalId) {
        const created = await createProposal(data);
        setData(created);
        proposalId = created.id;
      } else {
        await updateProposal(proposalId, data);
      }

      const res = await generatePdf(proposalId!);
      const dl = getPdfDownloadUrl(proposalId!);
      setDownloadUrl(dl);
      showToast(`PDF generated! Document #${res.proposal_number}`);
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
            <h1 className="text-base font-bold text-slate-900">
              {data.title || 'Proposal Creation Workspace'}
            </h1>
            {data.proposal_number && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {data.proposal_number}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreFillSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition active:scale-[0.98]"
              title="Quickly fill realistic sample data to test all 8 steps & PDF rendering instantly"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Proposal</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetForm}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Reset form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            {STEPS.map((s) => {
              const IconComp = s.icon;
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
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Generate Final PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
