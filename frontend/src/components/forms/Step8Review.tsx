import React, { useState } from 'react';
import { ProposalFormData, TemplateId } from '@/lib/types';
import {
  FileCheck,
  Download,
  Save,
  Edit,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import LivePreviewDocument from '@/components/preview/LivePreviewDocument';
import { formatCurrency, calculateTotals } from '@/lib/calculations';

interface Step8Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
  goToStep: (step: number) => void;
  onSaveDraft: () => Promise<void>;
  onGeneratePdf: () => Promise<void>;
  isGeneratingPdf: boolean;
  isSaving: boolean;
  downloadUrl?: string;
  errorMessage?: string;
}

export default function Step8Review({
  data,
  updateData,
  goToStep,
  onSaveDraft,
  onGeneratePdf,
  isGeneratingPdf,
  isSaving,
  downloadUrl,
  errorMessage,
}: Step8Props) {
  const [activeTab, setActiveTab] = useState<'preview' | 'summary'>('preview');
  const totals = calculateTotals(data.line_items, data.discount_percentage, data.tax_percentage);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Review & Document Preview</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify all details before generating the final customer-ready PDF document.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={onGeneratePdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 active:scale-[0.98] transition"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingPdf ? 'animate-spin' : ''}`} />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Generate PDF'}</span>
          </button>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg shadow-sm transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Template Switcher Pill Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Active Template:
        </span>
        <div className="flex items-center gap-2">
          {(['corporate', 'modern', 'minimal'] as TemplateId[]).map((tid) => (
            <button
              key={tid}
              type="button"
              onClick={() => updateData({ selected_template: tid })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                data.selected_template === tid
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tid}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`py-2 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'preview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Live A4 Document Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`py-2 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
            activeTab === 'summary'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Section Audit & Quick Jumps
        </button>
      </div>

      {/* Tab 1: Live A4 Document Preview */}
      {activeTab === 'preview' && (
        <div className="h-[750px] w-full">
          <LivePreviewDocument data={data} />
        </div>
      )}

      {/* Tab 2: Section Audit & Quick Jumps */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          {/* Company */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 1 • Company Details
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {data.company_name || 'No company name set'}
              </h4>
              <p className="text-xs text-slate-500">
                {data.company_email} • {data.company_phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Client */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 2 • Client Details
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {data.client_name || 'No client name set'} — {data.client_company}
              </h4>
              <p className="text-xs text-slate-500">
                {data.client_email} • {data.client_phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Project Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 3 • Project & Scope
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{data.title}</h4>
              <p className="text-xs text-slate-500">
                {data.scope_items.length} Scope Workstreams • {data.deliverables.length} Deliverables
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 4 • Investment & Cost
              </span>
              <h4 className="text-base font-bold text-emerald-700 mt-0.5">
                {formatCurrency(totals.grand_total, data.currency_symbol)}
              </h4>
              <p className="text-xs text-slate-500">
                {data.line_items.length} Line Items • Subtotal:{' '}
                {formatCurrency(totals.subtotal, data.currency_symbol)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Timeline */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 5 • Timeline & Phases
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {data.timeline_phases.length} Execution Phases Defined
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(5)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>

          {/* Terms */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step 6 • Contract Clauses
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                {data.terms.length} Terms & Conditions Clauses
              </h4>
            </div>
            <button
              type="button"
              onClick={() => goToStep(6)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
