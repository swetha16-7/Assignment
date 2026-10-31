import React, { useState } from 'react';
import { ProposalFormData, ScopeItem, DeliverableItem } from '@/lib/types';
import { FolderKanban, Plus, Trash2, CheckCircle2, ListChecks, Layers, HelpCircle } from 'lucide-react';

interface Step3Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

export default function Step3Project({ data, updateData }: Step3Props) {
  const [newObjective, setNewObjective] = useState('');

  // Objectives
  const addObjective = () => {
    if (!newObjective.trim()) return;
    updateData({
      project_objectives: [...data.project_objectives, newObjective.trim()]
    });
    setNewObjective('');
  };

  const removeObjective = (index: number) => {
    const updated = data.project_objectives.filter((_, i) => i !== index);
    updateData({ project_objectives: updated });
  };

  // Scope Items
  const addScopeItem = () => {
    const newItem: ScopeItem = {
      title: 'New Scope Phase / Workstream',
      description: 'Detail the tasks, architecture, or deliverables included in this phase.'
    };
    updateData({ scope_items: [...data.scope_items, newItem] });
  };

  const updateScopeItem = (index: number, field: keyof ScopeItem, value: string) => {
    const updated = [...data.scope_items];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ scope_items: updated });
  };

  const removeScopeItem = (index: number) => {
    const updated = data.scope_items.filter((_, i) => i !== index);
    updateData({ scope_items: updated });
  };

  // Deliverables
  const addDeliverable = () => {
    const newDeliv: DeliverableItem = {
      title: 'New Key Deliverable',
      description: 'Artifact format, repository, or handover document.'
    };
    updateData({ deliverables: [...data.deliverables, newDeliv] });
  };

  const updateDeliverable = (index: number, field: keyof DeliverableItem, value: string) => {
    const updated = [...data.deliverables];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ deliverables: updated });
  };

  const removeDeliverable = (index: number) => {
    const updated = data.deliverables.filter((_, i) => i !== index);
    updateData({ deliverables: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <FolderKanban className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Project Scope & Deliverables</h2>
        </div>
        <p className="text-sm text-slate-500">
          Define the technical vision, high-level objectives, work breakdown, and verifiable handover deliverables.
        </p>
      </div>

      {/* Main Title & Project Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Proposal Document Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder="e.g. Enterprise Cloud Modernization Proposal"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Project / Initiative Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.project_name}
            onChange={(e) => updateData({ project_name: e.target.value })}
            placeholder="e.g. Next-Gen Core Banking Platform"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Executive Summary / Project Description
          </label>
          <textarea
            rows={4}
            value={data.project_description}
            onChange={(e) => updateData({ project_description: e.target.value })}
            placeholder="Provide a comprehensive narrative of the client's challenge, the proposed technical solution, and high-level strategic impact..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition leading-relaxed"
          />
        </div>
      </div>

      {/* Project Objectives */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Project Objectives</h3>
          </div>
          <span className="text-xs text-slate-500">{data.project_objectives.length} defined</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addObjective(); } }}
            placeholder="e.g. Reduce compute infrastructure costs by 30% through automated Kubernetes scaling..."
            className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
          />
          <button
            type="button"
            onClick={addObjective}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Objective
          </button>
        </div>

        {data.project_objectives.length > 0 ? (
          <ul className="space-y-2 mt-2">
            {data.project_objectives.map((obj, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs sm:text-sm text-slate-800"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{obj}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeObjective(idx)}
                  className="text-slate-400 hover:text-red-600 p-1 transition"
                  title="Remove objective"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 italic">No objectives added yet.</p>
        )}
      </div>

      {/* Scope of Work */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Scope of Work Items</h3>
          </div>
          <button
            type="button"
            onClick={addScopeItem}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Scope Item
          </button>
        </div>

        {data.scope_items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5 relative group">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Workstream #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeScopeItem(idx)}
                className="text-slate-400 hover:text-red-600 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateScopeItem(idx, 'title', e.target.value)}
              placeholder="Scope item title or category..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-sm font-semibold text-slate-900"
            />
            <textarea
              rows={2}
              value={item.description}
              onChange={(e) => updateScopeItem(idx, 'description', e.target.value)}
              placeholder="Detailed description of activities and boundaries..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-700"
            />
          </div>
        ))}
      </div>

      {/* Deliverables */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Key Deliverables</h3>
          </div>
          <button
            type="button"
            onClick={addDeliverable}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Deliverable
          </button>
        </div>

        {data.deliverables.map((deliv, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Deliverable #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeDeliverable(idx)}
                className="text-slate-400 hover:text-red-600 p-1 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={deliv.title}
              onChange={(e) => updateDeliverable(idx, 'title', e.target.value)}
              placeholder="Deliverable title..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-sm font-semibold text-slate-900"
            />
            <textarea
              rows={2}
              value={deliv.description}
              onChange={(e) => updateDeliverable(idx, 'description', e.target.value)}
              placeholder="Handover format, repository, or acceptance criteria..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-700"
            />
          </div>
        ))}
      </div>

      {/* Assumptions */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Project Assumptions & Prerequisites
        </label>
        <textarea
          rows={3}
          value={data.assumptions}
          onChange={(e) => updateData({ assumptions: e.target.value })}
          placeholder="State any dependencies, client resource allocations, or prerequisites required to fulfill the scope..."
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition leading-relaxed"
        />
      </div>
    </div>
  );
}
