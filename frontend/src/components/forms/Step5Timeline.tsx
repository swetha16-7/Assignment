import React from 'react';
import { ProposalFormData, TimelinePhase } from '@/lib/types';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';

interface Step5Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

export default function Step5Timeline({ data, updateData }: Step5Props) {
  const addPhase = () => {
    const newPhase: TimelinePhase = {
      phase_name: `Phase ${data.timeline_phases.length + 1}: Implementation`,
      description: 'Detail the scope, development sprint milestones, and testing activities.',
      start_date: '',
      end_date: '',
      duration: '3 Weeks',
    };
    updateData({ timeline_phases: [...data.timeline_phases, newPhase] });
  };

  const updatePhase = (index: number, field: keyof TimelinePhase, val: string) => {
    const updated = [...data.timeline_phases];
    updated[index] = { ...updated[index], [field]: val };
    updateData({ timeline_phases: updated });
  };

  const removePhase = (index: number) => {
    const updated = data.timeline_phases.filter((_, i) => i !== index);
    updateData({ timeline_phases: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Calendar className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Project Timeline & Execution Phases</h2>
        </div>
        <p className="text-sm text-slate-500">
          Structure delivery milestones, start/finish dates, and estimated durations for each project phase.
        </p>
      </div>

      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Project Phases & Milestones</h3>
          <button
            type="button"
            onClick={addPhase}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Phase
          </button>
        </div>

        {data.timeline_phases.map((phase, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Phase #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removePhase(idx)}
                className="text-slate-400 hover:text-red-600 p-1 transition"
                title="Remove Phase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Phase Name / Milestone Title
                </label>
                <input
                  type="text"
                  value={phase.phase_name}
                  onChange={(e) => updatePhase(idx, 'phase_name', e.target.value)}
                  placeholder="e.g. Discovery & Architecture Blueprint"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-sm text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Duration (Weeks / Days)
                </label>
                <input
                  type="text"
                  value={phase.duration}
                  onChange={(e) => updatePhase(idx, 'duration', e.target.value)}
                  placeholder="e.g. 2 Weeks"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Activities & Milestone Description
              </label>
              <textarea
                rows={2}
                value={phase.description}
                onChange={(e) => updatePhase(idx, 'description', e.target.value)}
                placeholder="Key activities, reviews, or deliverables completed in this milestone..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Start Date</label>
                <input
                  type="date"
                  value={phase.start_date}
                  onChange={(e) => updatePhase(idx, 'start_date', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-0.5">End Date</label>
                <input
                  type="date"
                  value={phase.end_date}
                  onChange={(e) => updatePhase(idx, 'end_date', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
