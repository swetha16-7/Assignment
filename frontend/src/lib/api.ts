import { ProposalFormData, TemplateMetadata, DashboardStats } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchTemplates(): Promise<TemplateMetadata[]> {
  try {
    const res = await fetch(`${API_BASE}/api/templates`);
    if (!res.ok) throw new Error('Failed to load templates');
    return res.json();
  } catch (err) {
    // Fallback static catalog if backend is loading
    return [
      {
        id: 'corporate',
        name: 'Executive Elite',
        tagline: 'Formal & Authoritative Enterprise Consulting',
        description: 'Sophisticated consulting proposal with deep navy and muted gold accents, formal executive cover page, structured numerical hierarchy, and comprehensive financial breakdown.',
        category: 'Enterprise & Advisory',
        primary_color: '#0b1f3a',
        accent_color: '#c5a059',
        badge: 'Enterprise Elite',
        features: [
          'Formal luxury cover page with security reference & date stamp',
          'Executive summary with highlighted strategic thesis card',
          'Bordered workstream scope & deliverables matrix',
          'Muted gold accented financial breakdown & signatory block'
        ]
      },
      {
        id: 'modern',
        name: 'Modern Innovation',
        tagline: 'Contemporary & High-Impact Tech Agency',
        description: 'Vibrant sapphire blue and indigo palette with modern geometric layout, card-style objective blocks, structured deliverables, and high-impact total investment callouts.',
        category: 'Tech & Digital Agency',
        primary_color: '#2563eb',
        accent_color: '#4f46e5',
        badge: 'High Growth',
        features: [
          'Visually striking cover with gradient accent bar & metadata cards',
          'Attractive visual blocks for business goals & deliverables',
          'Zebra-striped pricing table with standout investment card',
          'Contemporary roadmap timeline with duration badges'
        ]
      },
      {
        id: 'minimal',
        name: 'Minimal Signature',
        tagline: 'Sophisticated Whitespace & Editorial Clarity',
        description: 'Architectural simplicity with pure white, deep charcoal, and warm stone tones. Generous whitespace, refined hairline dividers, and distraction-free financial schedules.',
        category: 'Consulting & Strategy',
        primary_color: '#18181b',
        accent_color: '#71717a',
        badge: 'Minimalist',
        features: [
          'Crisp editorial typography with generous breathing room',
          'Hairline dividers with understated architectural elegance',
          'Open, distraction-free commercial schedule',
          'Minimalist acceptance lines and clean signatory layout'
        ]
      }
    ];
  }
}

export async function fetchProposals(params?: {
  status?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<ProposalFormData[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.skip) query.set('skip', String(params.skip));
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/api/proposals?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch proposals');
  return res.json();
}

export async function fetchProposal(id: string): Promise<ProposalFormData> {
  const res = await fetch(`${API_BASE}/api/proposals/${id}`);
  if (!res.ok) throw new Error('Failed to fetch proposal');
  return res.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE}/api/proposals/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  } catch (err) {
    return {
      total_proposals: 0,
      draft_proposals: 0,
      generated_pdfs: 0,
      total_value: 0,
      recent_proposals: []
    };
  }
}

export async function createProposal(data: ProposalFormData): Promise<ProposalFormData> {
  const res = await fetch(`${API_BASE}/api/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create proposal');
  }
  return res.json();
}

export async function updateProposal(id: string, data: Partial<ProposalFormData>): Promise<ProposalFormData> {
  const res = await fetch(`${API_BASE}/api/proposals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update proposal');
  }
  return res.json();
}

export async function deleteProposal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/proposals/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete proposal');
}

export async function generatePdf(proposalId: string): Promise<{ pdf_url: string; proposal_number: string }> {
  const res = await fetch(`${API_BASE}/api/proposals/${proposalId}/generate-pdf`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'PDF generation failed');
  }
  return res.json();
}

export function getPdfDownloadUrl(proposalId: string): string {
  return `${API_BASE}/api/proposals/${proposalId}/download`;
}

export async function fetchPreviewHtml(data: ProposalFormData): Promise<string> {
  const res = await fetch(`${API_BASE}/api/proposals/preview-html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to render preview HTML');
  }
  return res.text();
}

export async function uploadLogo(file: File): Promise<{ url: string; data_uri: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/uploads/logo`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Logo upload failed');
  }

  const json = await res.json();
  return {
    url: `${API_BASE}${json.url}`,
    data_uri: json.data_uri,
  };
}
