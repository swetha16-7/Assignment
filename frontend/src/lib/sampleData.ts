import { ProposalFormData } from './types';

export const SAMPLE_PROPOSAL: ProposalFormData = {
  title: 'Next-Generation Enterprise Cloud Modernization',
  selected_template: 'corporate',
  status: 'draft',

  company_name: 'Nexus Cloud Technologies Inc.',
  company_logo_url: '',
  company_address: '100 Silicon Vista Blvd, Suite 800, San Francisco, CA 94107',
  company_email: 'proposals@nexuscloud.io',
  company_phone: '+1 (415) 555-0148',
  company_website: 'https://nexuscloud.io',

  client_name: 'David Vance',
  client_company: 'Vanguard Global Financial Corp',
  client_email: 'd.vance@vanguardfin.com',
  client_address: '350 Park Avenue, 28th Floor, New York, NY 10022',
  client_phone: '+1 (212) 555-9240',

  project_name: 'Cloud-Native Core Banking Infrastructure',
  project_description:
    'Vanguard Global Financial Corp requires a resilient, multi-region cloud migration to replace legacy on-premises monolithic infrastructure. Nexus Cloud Technologies will architect and deploy an enterprise Kubernetes foundation with automated CI/CD pipelines, bank-grade encryption, and real-time observability.',
  project_objectives: [
    'Achieve 99.999% SLA availability across multi-region active-active clusters',
    'Reduce provisioning latency from 3 weeks to under 15 minutes via Infrastructure as Code (Terraform)',
    'Ensure SOC2 Type II, ISO 27001, and PCI-DSS compliance automation across all environments',
    'Lower annual compute expenditure by 32% through container rightsizing and auto-scaling'
  ],

  scope_items: [
    {
      title: 'Cloud Architecture & Landing Zone Blueprint',
      description: 'Design multi-account AWS Organizations landing zone with Transit Gateway, zero-trust network segregation, and encrypted KMS vaults.'
    },
    {
      title: 'Kubernetes Platform Engineering',
      description: 'Provision production-grade Amazon EKS clusters configured with ArgoCD GitOps, Cilium eBPF networking, and Istio service mesh.'
    },
    {
      title: 'Zero-Downtime Database Migration',
      description: 'Migrate mission-critical Oracle databases to Amazon Aurora PostgreSQL with continuous bi-directional replication and automated rollback validation.'
    },
    {
      title: 'Enterprise Observability & Security Hardening',
      description: 'Implement distributed tracing with OpenTelemetry, Prometheus metrics, Grafana dashboards, and automated vulnerability scanning in CI/CD.'
    }
  ],

  deliverables: [
    {
      title: 'Modular Terraform Infrastructure Repository',
      description: 'Fully automated, peer-reviewed Git repository deploying all network, compute, and security resources.'
    },
    {
      title: 'Production Cutover & Disaster Recovery Runbook',
      description: 'End-to-end documentation with step-by-step failover execution procedures and RTO/RPO validation.'
    },
    {
      title: 'DevOps Enablement & Knowledge Transfer Sessions',
      description: 'Four hands-on workshops for Vanguard internal SRE and operations teams.'
    }
  ],

  assumptions:
    'Vanguard will grant designated AWS access permissions within 5 business days of kick-off and designate a dedicated technical lead for weekly architecture reviews.',

  currency: 'USD',
  currency_symbol: '$',
  line_items: [
    {
      description: 'Enterprise Cloud Architecture & Landing Zone Design',
      quantity: 120,
      unit_price: 185.00
    },
    {
      description: 'Kubernetes GitOps Infrastructure Implementation',
      quantity: 200,
      unit_price: 165.00
    },
    {
      description: 'Database Replication & Zero-Downtime Migration',
      quantity: 110,
      unit_price: 190.00
    },
    {
      description: 'Security Hardening, Compliance Auditing & Observability',
      quantity: 90,
      unit_price: 175.00
    },
    {
      description: 'Operations Team Training & DR Simulation Drills',
      quantity: 40,
      unit_price: 150.00
    }
  ],
  discount_percentage: 5.0,
  tax_percentage: 8.5,

  timeline_phases: [
    {
      phase_name: 'Phase 1: Discovery & Architecture Blueprint',
      description: 'Stakeholder interviews, legacy workload profiling, security perimeter definition, and cloud foundation design.',
      start_date: '2026-11-01',
      end_date: '2026-11-21',
      duration: '3 Weeks'
    },
    {
      phase_name: 'Phase 2: Platform Foundation & GitOps Setup',
      description: 'Deploy VPCs, landing zones, EKS clusters, and automated CI/CD deployment pipelines.',
      start_date: '2026-11-22',
      end_date: '2026-12-31',
      duration: '5 Weeks'
    },
    {
      phase_name: 'Phase 3: Database & Application Migration',
      description: 'Data replication, shadow load testing, end-to-end user verification, and production cutover.',
      start_date: '2027-01-02',
      end_date: '2027-02-15',
      duration: '6 Weeks'
    },
    {
      phase_name: 'Phase 4: SRE Handover & Production Go-Live',
      description: 'Team training workshops, final documentation sign-off, and 30-day hypercare support.',
      start_date: '2027-02-16',
      end_date: '2027-03-05',
      duration: '3 Weeks'
    }
  ],

  terms: [
    {
      title: '1. Invoicing & Payment Milestones',
      content: 'Payment shall be disbursed according to milestones: 25% upon contract execution, 25% upon completion of Phase 2, 25% upon completion of Phase 3, and 25% upon final operational handover. Net 30 days.'
    },
    {
      title: '2. Commercial Validity',
      content: 'This commercial proposal and all associated professional rates remain valid for 45 days from the date of presentation.'
    },
    {
      title: '3. Intellectual Property Rights',
      content: 'Upon full settlement of all milestones, Vanguard Global Financial Corp shall retain full and unencumbered ownership of all custom scripts, IaC code, and documentation produced.'
    },
    {
      title: '4. Confidentiality & Non-Disclosure',
      content: 'Both parties agree to treat all business, architecture, and financial information disclosed during this engagement as strictly confidential.'
    }
  ]
};
