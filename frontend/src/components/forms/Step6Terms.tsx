import React from 'react';
import { ProposalFormData, TermItem } from '@/lib/types';
import { ShieldCheck, Plus, Trash2, BookOpen } from 'lucide-react';

interface Step6Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

const PRESET_TERMS = [
  {
    title: 'Payment Terms & Milestone Billing',
    content: '50% deposit required upon formal proposal acceptance. 50% balance invoiced upon final delivery and client verification. Net 15 days payment terms.'
  },
  {
    title: 'Commercial Proposal Validity',
    content: 'This commercial proposal and associated hourly/project rates remain valid for 30 calendar days from the date of issuance.'
  },
  {
    title: 'Scope Changes & Revisions Policy',
    content: 'Any additions or material modifications to the defined scope will be evaluated under a formal Change Order request and billed at standard professional hourly rates.'
  },
  {
    title: 'Intellectual Property & Ownership',
    content: 'Full legal title and unencumbered ownership of all custom software, configurations, and deliverables will transfer to the client upon receipt of final payment.'
  },
  {
    title: 'Confidentiality & Non-Disclosure',
    content: 'Both parties agree to treat all business, technical, proprietary, and financial information disclosed during this engagement with the utmost confidentiality.'
  }
];

export default function Step6Terms({ data, updateData }: Step6Props) {
  const addTerm = () => {
    const newTerm: TermItem = {
      title: 'Custom Terms & Conditions Clause',
      content: 'Specify governing law, delivery boundaries, or SLA warranties here.'
    };
    updateData({ terms: [...data.terms, newTerm] });
  };

  const updateTerm = (index: number, field: keyof TermItem, val: string) => {
    const updated = [...data.terms];
    updated[index] = { ...updated[index], [field]: val };
    updateData({ terms: updated });
  };

  const removeTerm = (index: number) => {
    const updated = data.terms.filter((_, i) => i !== index);
    updateData({ terms: updated });
  };

  const addPresetTerm = (preset: { title: string; content: string }) => {
    updateData({ terms: [...data.terms, preset] });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Terms & Conditions</h2>
        </div>
        <p className="text-sm text-slate-500">
          Establish legal terms, payment schedules, warranty boundaries, and proposal validity.
        </p>
      </div>

      {/* Preset Quick-Add Tags */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Quick-Add Standard Clauses
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TERMS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addPresetTerm(preset)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              <span>{preset.title.split('&')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Terms Clauses List */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Contract Clauses</h3>
          <button
            type="button"
            onClick={addTerm}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Clause
          </button>
        </div>

        {data.terms.map((term, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Clause #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeTerm(idx)}
                className="text-slate-400 hover:text-red-600 p-1 transition"
                title="Remove Clause"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={term.title}
              onChange={(e) => updateTerm(idx, 'title', e.target.value)}
              placeholder="Clause title (e.g. Payment Schedule)..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-sm text-slate-900 focus:border-blue-500 outline-none"
            />
            <textarea
              rows={3}
              value={term.content}
              onChange={(e) => updateTerm(idx, 'content', e.target.value)}
              placeholder="Terms clause narrative..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:border-blue-500 outline-none leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
