import React from 'react';
import { ProposalFormData, TemplateId } from '@/lib/types';
import { LayoutTemplate, Check, Sparkles, Building2, Zap, Feather } from 'lucide-react';

interface Step7Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

const TEMPLATES = [
  {
    id: 'corporate' as TemplateId,
    name: 'Executive Elite',
    tagline: 'Formal & Authoritative Enterprise Consulting',
    category: 'Enterprise & Advisory',
    badge: 'Enterprise Elite',
    primaryColor: '#0b1f3a',
    accentColor: '#c5a059',
    icon: Building2,
    description:
      'Sophisticated consulting proposal with deep navy and muted gold accents, formal executive cover page, structured numerical hierarchy, and comprehensive financial breakdown.',
    features: [
      'Formal luxury cover page with security reference & date stamp',
      'Executive summary with highlighted strategic thesis card',
      'Bordered workstream scope & deliverables matrix',
      'Muted gold accented financial breakdown & signatory block'
    ]
  },
  {
    id: 'modern' as TemplateId,
    name: 'Modern Innovation',
    tagline: 'Contemporary & High-Impact Tech Agency',
    category: 'Tech & Digital Agency',
    badge: 'High Growth',
    primaryColor: '#2563eb',
    accentColor: '#4f46e5',
    icon: Zap,
    description:
      'Vibrant sapphire blue and indigo palette with modern geometric layout, card-style objective blocks, structured deliverables, and high-impact total investment callouts.',
    features: [
      'Visually striking cover with gradient accent bar & metadata cards',
      'Attractive visual blocks for business goals & deliverables',
      'Zebra-striped pricing table with standout investment card',
      'Contemporary roadmap timeline with duration badges'
    ]
  },
  {
    id: 'minimal' as TemplateId,
    name: 'Minimal Signature',
    tagline: 'Sophisticated Whitespace & Editorial Clarity',
    category: 'Consulting & Strategy',
    badge: 'Minimalist',
    primaryColor: '#18181b',
    accentColor: '#71717a',
    icon: Feather,
    description:
      'Architectural simplicity with pure white, deep charcoal, and warm stone tones. Generous whitespace, refined hairline dividers, and distraction-free financial schedules.',
    features: [
      'Crisp editorial typography with generous breathing room',
      'Hairline dividers with understated architectural elegance',
      'Open, distraction-free commercial schedule',
      'Minimalist acceptance lines and clean signatory layout'
    ]
  }
];

export default function Step7Templates({ data, updateData }: Step7Props) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <LayoutTemplate className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Choose Proposal Template</h2>
        </div>
        <p className="text-sm text-slate-500">
          Select an aesthetic that matches your client's industry and brand tone. Switching templates preserves all entered proposal data seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => {
          const isSelected = data.selected_template === tmpl.id;
          const IconComponent = tmpl.icon;

          return (
            <div
              key={tmpl.id}
              onClick={() => updateData({ selected_template: tmpl.id })}
              className={`relative rounded-2xl border-2 cursor-pointer transition-all p-5 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/20 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {tmpl.category}
                </span>
                {isSelected ? (
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full border border-slate-300 bg-white" />
                )}
              </div>

              {/* Visual Thumbnail Representation */}
              <div className="w-full h-36 rounded-xl border border-slate-200 mb-4 overflow-hidden relative p-3 flex flex-col justify-between bg-slate-50">
                <div
                  className="h-2 rounded-full w-full"
                  style={{ backgroundColor: tmpl.primaryColor }}
                />
                <div className="space-y-1.5 my-auto">
                  <div className="h-3 bg-slate-300/80 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 rounded w-1/2" />
                  <div className="h-2 bg-slate-200 rounded w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                  <div className="h-2 bg-slate-300 rounded w-1/4" />
                  <div
                    className="h-2 rounded w-1/4"
                    style={{ backgroundColor: tmpl.accentColor }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="w-4 h-4 text-slate-700" />
                  <h3 className="text-base font-bold text-slate-900">{tmpl.name}</h3>
                </div>
                <p className="text-xs font-medium text-blue-600 mb-2">{tmpl.tagline}</p>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{tmpl.description}</p>

                {/* Features */}
                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                  {tmpl.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <span className="text-blue-500 font-bold shrink-0">•</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection button */}
              <button
                type="button"
                className={`mt-5 w-full py-2 rounded-lg text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isSelected ? 'Selected Template' : 'Choose ' + tmpl.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
