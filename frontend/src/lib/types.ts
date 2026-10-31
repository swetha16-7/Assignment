export interface ScopeItem {
  id?: string;
  title: string;
  description: string;
}

export interface DeliverableItem {
  id?: string;
  title: string;
  description: string;
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total?: number;
}

export interface TimelinePhase {
  id?: string;
  phase_name: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: string;
}

export interface TermItem {
  id?: string;
  title: string;
  content: string;
}

export type TemplateId = 'corporate' | 'modern' | 'minimal';

export interface ProposalFormData {
  id?: string;
  proposal_number?: string;
  title: string;
  selected_template: TemplateId;
  status: 'draft' | 'generated' | 'sent' | 'accepted';

  // Company
  company_name: string;
  company_logo_url?: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_website: string;

  // Client
  client_name: string;
  client_company: string;
  client_email: string;
  client_address: string;
  client_phone: string;

  // Project
  project_name: string;
  project_description: string;
  project_objectives: string[];
  scope_items: ScopeItem[];
  deliverables: DeliverableItem[];
  assumptions: string;

  // Pricing
  currency: string;
  currency_symbol: string;
  line_items: LineItem[];
  subtotal?: number;
  discount_percentage: number;
  discount_amount?: number;
  tax_percentage: number;
  tax_amount?: number;
  grand_total?: number;

  // Timeline
  timeline_phases: TimelinePhase[];

  // Terms
  terms: TermItem[];

  pdf_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  primary_color: string;
  accent_color: string;
  badge: string;
  features: string[];
}

export interface DashboardStats {
  total_proposals: number;
  draft_proposals: number;
  generated_pdfs: number;
  total_value: number;
  recent_proposals: ProposalFormData[];
}
