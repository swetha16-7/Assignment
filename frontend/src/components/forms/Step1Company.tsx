import React, { useRef, useState } from 'react';
import { ProposalFormData } from '@/lib/types';
import { Building2, Upload, Trash2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { uploadLogo } from '@/lib/api';

interface Step1Props {
  data: ProposalFormData;
  updateData: (fields: Partial<ProposalFormData>) => void;
}

export default function Step1Company({ data, updateData }: Step1Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      // Direct file reader fallback for instantaneous client preview
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Data = uploadEvent.target?.result as string;
        updateData({ company_logo_url: base64Data });
      };
      reader.readAsDataURL(file);

      // Also upload to backend for server persistence
      const result = await uploadLogo(file);
      updateData({ company_logo_url: result.data_uri || result.url });
    } catch (err: any) {
      // Even if backend upload fails offline, client FileReader keeps it working!
      console.warn('Backend upload note:', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    updateData({ company_logo_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <Building2 className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Company Information & Branding</h2>
        </div>
        <p className="text-sm text-slate-500">
          Enter your organization's business credentials. These details and logo will appear dynamically across your proposal headers, covers, and signatory pages.
        </p>
      </div>

      {/* Logo Upload Card */}
      <div className="p-5 border border-slate-200/90 rounded-xl bg-white shadow-sm">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Company Brand Logo
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {data.company_logo_url ? (
            <div className="relative group p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center w-48 h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.company_logo_url}
                alt="Company Logo Preview"
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
                title="Remove logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-64 h-32 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center px-4"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="text-xs font-medium text-slate-700">Click to upload company logo</span>
              <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, SVG up to 5MB</span>
            </div>
          )}

          <div className="flex-1 space-y-2 text-xs text-slate-500">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
            />
            <p>
              <strong>High-Resolution Recommendation:</strong> Transparent PNG or vector SVG logos with a 3:1 or 4:1 aspect ratio render best on A4 cover pages.
            </p>
            {uploading && <p className="text-blue-600 font-medium">Uploading logo...</p>}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
          </div>
        </div>
      </div>

      {/* Company Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Company Legal Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.company_name}
            onChange={(e) => updateData({ company_name: e.target.value })}
            placeholder="e.g. Acme Technologies LLC"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Business Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={data.company_email}
              onChange={(e) => updateData({ company_email: e.target.value })}
              placeholder="proposals@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.company_phone}
              onChange={(e) => updateData({ company_phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Website URL
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="url"
              value={data.company_website}
              onChange={(e) => updateData({ company_website: e.target.value })}
              placeholder="https://company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Company Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.company_address}
              onChange={(e) => updateData({ company_address: e.target.value })}
              placeholder="100 Tech Blvd, Suite 200, City, State ZIP"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-900 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
