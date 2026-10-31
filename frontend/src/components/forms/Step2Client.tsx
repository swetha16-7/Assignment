import React from 'react';
import { ProposalFormData } from '@/lib/types';
import { User, Building, Mail, Phone, MapPin } from 'lucide-react';

interface Step2Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

export default function Step2Client({ data, updateData }: Step2Props) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <User className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Client Information</h2>
        </div>
        <p className="text-sm text-slate-500">
          Provide the recipient organization and principal point of contact for this proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Primary Client Contact Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.client_name}
              onChange={(e) => updateData({ client_name: e.target.value })}
              placeholder="e.g. Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Client Company / Organization <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.client_company}
              onChange={(e) => updateData({ client_company: e.target.value })}
              placeholder="e.g. Acme Enterprises Global"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Client Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={data.client_email}
              onChange={(e) => updateData({ client_email: e.target.value })}
              placeholder="jane.doe@clientcompany.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Client Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.client_phone}
              onChange={(e) => updateData({ client_phone: e.target.value })}
              placeholder="+1 (555) 987-6543"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Client Address / Headquarters
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.client_address}
              onChange={(e) => updateData({ client_address: e.target.value })}
              placeholder="e.g. 500 Avenue of the Americas, Floor 14, New York, NY 10011"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
