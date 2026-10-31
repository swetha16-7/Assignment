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
        name: 'Corporate Classic',
        tagline: 'Authoritative & Formal Enterprise Proposal',
        description: 'Structured layout featuring deep navy accents, corporate typography, formal executive cover page, bordered tables, and institutional page headers and footers.',
        category: 'Enterprise & Corporate',
        primary_color: '#0f2942',
        accent_color: '#1e3a5f',
        badge: 'Enterprise Ready',
        features: [
          'Formal corporate cover page with security & date stamping',
          'Structured grid layout with section hierarchy',
          'Elegant bordered pricing breakdown table',
          'Formal signatory & acceptance block'
        ]
      },
      {
        id: 'modern',
        name: 'Modern Edge',
        tagline: 'Contemporary & High-Impact Tech Proposal',
        description: 'Vibrant sapphire blue accents, modern geometric cover page, pill-style metric badges, card-style objective callouts, and clean striped pricing layout.',
        category: 'Tech & Startups',
        primary_color: '#2563eb',
        accent_color: '#4f46e5',
        badge: 'Popular',
        features: [
          'Split hero cover design with modern typography',
          'Highlighted cards for objectives & deliverables',
          'Contemporary zebra-striped pricing table with total callout',
          'Sleek milestone timeline cards'
        ]
      },
      {
        id: 'minimal',
        name: 'Minimal Professional',
        tagline: 'Sophisticated Whitespace & Clean Elegance',
        description: 'Architectural simplicity with neutral slate tones, airy margins, high typographic contrast, hairline divider lines, and uncluttered tables.',
        category: 'Consulting & Advisory',
        primary_color: '#111827',
        accent_color: '#64748b',
        badge: 'Minimalist',
        features: [
          'Crisp editorial typography with generous whitespace',
          'Hairline dividers with understated elegance',
          'Open, distraction-free pricing schedule',
          'Minimalist acceptance and signature block'
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
