import React, { useState, useEffect } from 'react';
import { ProposalFormData } from '@/lib/types';
import { fetchPreviewHtml } from '@/lib/api';
import { ZoomIn, ZoomOut, RefreshCw, Maximize2, FileCheck } from 'lucide-react';

interface LivePreviewDocumentProps {
  data: ProposalFormData;
}

export default function LivePreviewDocument({ data }: LivePreviewDocumentProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(100);

  const loadHtml = async () => {
    setLoading(true);
    try {
      const content = await fetchPreviewHtml(data);
      setHtml(content);
    } catch (err) {
      console.warn('Backend preview note, falling back to embedded frame:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHtml();
    }, 300);
    return () => clearTimeout(timer);
  }, [
    data.title,
    data.selected_template,
    data.company_name,
    data.company_logo_url,
    data.client_name,
    data.client_company,
    data.line_items,
    data.discount_percentage,
    data.tax_percentage,
    data.currency,
    data.scope_items,
    data.deliverables,
    data.timeline_phases,
    data.terms,
  ]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(150, Math.max(50, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/70 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Preview Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live A4 Document Preview
          </span>
          <span className="text-[11px] text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded">
            {data.selected_template} Template
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => handleZoom(-15)}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold text-slate-700 px-1.5 min-w-[42px] text-center font-mono">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(15)}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={loadHtml}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Refresh preview"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* A4 Paper Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: '210mm',
            minHeight: '297mm',
          }}
          className="bg-white shadow-2xl rounded-sm border border-slate-300 relative shrink-0"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Rendering Template...</span>
              </div>
            </div>
          )}

          {html ? (
            <iframe
              srcDoc={html}
              title="Proposal Document Preview"
              className="w-full border-0"
              style={{
                width: '210mm',
                height: '1100px',
                display: 'block',
              }}
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Preparing document preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
