# ProposalCraft: Dynamic Proposal Generation System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Playwright](https://img.shields.io/badge/Playwright-Chromium%20A4%20PDF-2EAD33?logo=playwright)](https://playwright.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-SQLAlchemy%20%2B%20Alembic-336791?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**ProposalCraft** is a production-grade, full-stack web application designed for engineering consultancies, digital agencies, and enterprise service teams. It automates commercial proposal design by injecting structured data into three bespoke print-ready A4 design systems rendered dynamically with Playwright Chromium.

---

## 🌟 Key Product Features

- **8-Step Guided Proposal Workspace**:
  - **Step 1: Company Branding**: Legal name, contact channels, and secure logo upload with live preview.
  - **Step 2: Client Credentials**: Primary stakeholder contact, corporate entity, and billing address.
  - **Step 3: Scope & Architecture**: Project title, executive narrative, dynamic objectives list, multi-item scope workstreams, key deliverables, and technical assumptions.
  - **Step 4: Decimal-Safe Pricing Engine**: Real-time line item calculations (`quantity × unit_price`), multi-currency selector (USD, EUR, GBP, INR, etc.), discount %, regional tax %, and grand total.
  - **Step 5: Project Roadmap & Milestones**: Phase names, milestone deliverables, start/end dates, and duration.
  - **Step 6: Terms & Conditions**: Standard preset clauses (Payment milestones, Proposal validity, IP ownership, Confidentiality) plus custom clause authoring.
  - **Step 7: Multi-Template Switcher**: Seamless 1-click template selection preserving 100% of form state.
  - **Step 8: Review & Live Preview**: Real-time zoomable A4 document viewport (50% to 150%) matching the downloaded PDF pixel-for-pixel.
- **One-Click Sample Data Pre-Fill**: Instant demo button that pre-populates a complete enterprise cloud migration proposal for rapid evaluation.
- **Three Distinct PDF Design Systems**:
  1. **Corporate Classic**: Deep navy styling, serif/sans corporate typography, formal security cover page, bordered pricing tables, and institutional signatory cards.
  2. **Modern Edge**: Sapphire blue & indigo gradient accents, pill badges, highlighted card containers for deliverables, zebra-striped pricing table, and contemporary sign-off blocks.
  3. **Minimal Professional**: Editorial aesthetic with generous whitespace, high typographic contrast, hairline divider rules, and open financial schedules.
- **Automated Draft Persistence**: Dual-layer saving with client LocalStorage auto-recovery and backend PostgreSQL/SQLite database synchronization.
- **Real-Time Analytics Dashboard**: Real-time counts of total proposals, active drafts, generated PDFs, total commercial pipeline value, and recent proposal management.

---

## 🏗️ Architecture & Technology Stack

```
                                  PROPOSALS WORKFLOW
                                  
  [ Next.js 14 Frontend ] <---- REST API ----> [ FastAPI Python Backend ]
       (React + TS)                                     |
            |                                    [ SQLAlchemy ORM ]
   Live Document Iframe                                 |
            ^                            [ Alembic Database Migrations ]
            |                                           |
  [ Real-Time Preview ]                  +--------------+---------------+
  (Shared HTML/CSS Engine)               |                              |
                                [ SQLite (Local) ]             [ PostgreSQL (Prod) ]
                                                        
                                                        |
                                            [ Playwright Chromium ]
                                                        |
                                          [ Print-Perfect A4 PDF Output ]
```

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Deployment**: Vercel-ready with zero hardcoded endpoints

### Backend
- **Framework**: FastAPI (Python 3.10)
- **Validation**: Pydantic v2
- **ORM & Migrations**: SQLAlchemy 2.0 & Alembic
- **PDF Engine**: Playwright Chromium Headless with CSS `@page` print rules
- **Template Engine**: Jinja2 with shared HTML/CSS templates
- **Deployment**: Docker container configured for Render Web Service

---

## 📁 Repository Structure

```
ProposalCraft/
├── backend/
│   ├── alembic/                      # Database migration versions
│   │   ├── env.py
│   │   └── versions/
│   ├── app/
│   │   ├── api/                      # REST API Routers
│   │   │   ├── health.py             # Health check & DB status
│   │   │   ├── pdf.py                # PDF generation & downloads
│   │   │   ├── proposals.py          # CRUD & live HTML preview
│   │   │   ├── templates.py          # Template catalog
│   │   │   └── uploads.py            # Secure logo file uploads
│   │   ├── models/                   # SQLAlchemy Database Models
│   │   │   ├── proposal.py
│   │   │   └── template.py
│   │   ├── schemas/                  # Pydantic Schemas & DTOs
│   │   │   ├── pricing.py
│   │   │   └── proposal.py
│   │   ├── services/                 # Core Business Services
│   │   │   ├── pdf_service.py        # Playwright Chromium PDF Engine
│   │   │   ├── proposal_service.py   # CRUD & number generator
│   │   │   ├── template_service.py   # Template metadata
│   │   │   └── upload_service.py     # Logo file & data URI handler
│   │   ├── templates/                # Print-Ready HTML/CSS Templates
│   │   │   ├── corporate/proposal.html
│   │   │   ├── modern/proposal.html
│   │   │   └── minimal/proposal.html
│   │   ├── utils/                    # Calculations & Validations
│   │   │   ├── calculations.py       # Safe decimal financial arithmetic
│   │   │   └── validation.py         # Upload & input validators
│   │   ├── config.py                 # Pydantic Settings
│   │   ├── database.py               # DB Engine & SessionLocal
│   │   └── main.py                   # FastAPI Application Entrypoint
│   ├── tests/                        # Backend and PDF Test Suite
│   ├── Dockerfile                    # Container with Playwright Chromium
│   ├── render.yaml                   # Render Blueprint
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                      # Next.js App Router Pages
│   │   │   ├── dashboard/page.tsx    # Proposal Analytics Dashboard
│   │   │   ├── proposals/
│   │   │   │   ├── [id]/preview/     # Standalone Preview & Download
│   │   │   │   └── new/page.tsx      # 8-Step Proposal Creation Wizard
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Modern SaaS Landing Page
│   │   ├── components/
│   │   │   ├── forms/                # Form Step 1-8 Components
│   │   │   ├── layout/               # Navbar & Footer
│   │   │   └── preview/              # Zoomable Live A4 Document Preview
│   │   └── lib/                      # Types, API client, Sample data
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Local Installation & Quick Start

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/proposalcraft.git
cd proposalcraft
```

### 3. Backend Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Install Playwright Chromium browser binary
playwright install chromium

# Run database migrations
cd backend
alembic upgrade head

# Start FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be running at `http://localhost:8000`. Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend application will be accessible at `http://localhost:3000`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL or SQLite connection string | `sqlite:///./proposalcraft.db` |
| `ENVIRONMENT` | Environment mode (`development` / `production`) | `development` |
| `STORAGE_DIR` | Base directory for physical file storage | `./storage` |
| `UPLOAD_DIR` | Directory for uploaded company logos | `./storage/uploads` |
| `PDF_OUTPUT_DIR`| Directory for generated proposal PDFs | `./storage/generated_pdfs` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated or `*`) | `*` |
| `SECRET_KEY` | Application cryptographic secret | `default-dev-secret-key` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the running FastAPI backend | `http://localhost:8000` |

---

## 🖨️ PDF Generation Architecture

1. **Jinja2 Semantic Templating**: Proposal data is sanitized and passed into the selected HTML template (`corporate`, `modern`, or `minimal`).
2. **Standardized Print CSS**:
   - Explicit page sizing: `@page { size: A4 portrait; margin: 18mm 18mm 20mm 18mm; }`
   - Page numbering counter: `@bottom-right { content: counter(page); }`
   - Page breaking: `page-break-after: always;` for cover pages and `break-inside: avoid;` for tables and signatory sections.
3. **Playwright Headless Rendering**:
   - Launches headless Chromium instance.
   - Loads rendered HTML with `page.set_content(html, wait_until='load')`.
   - Generates exact A4 output with `page.pdf(format='A4', print_background=True, prefer_css_page_size=True)`.
   - The identical HTML template is used by the frontend preview, guaranteeing 100% visual parity between preview and output.

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | API and database connectivity status |
| `GET` | `/api/templates` | Retrieve catalog of all proposal templates |
| `GET` | `/api/templates/{id}` | Retrieve single template metadata |
| `POST` | `/api/proposals` | Create a new proposal with decimal recalculation |
| `GET` | `/api/proposals` | List proposals with status and search filters |
| `GET` | `/api/proposals/stats` | Retrieve aggregated dashboard analytics |
| `GET` | `/api/proposals/{id}` | Retrieve single proposal by ID |
| `PUT` | `/api/proposals/{id}` | Update existing proposal |
| `DELETE`| `/api/proposals/{id}` | Delete proposal by ID |
| `POST` | `/api/proposals/preview-html` | Generate live HTML preview for unsaved form data |
| `POST` | `/api/proposals/{id}/generate-pdf` | Trigger Playwright Chromium PDF generation |
| `GET` | `/api/proposals/{id}/download` | Download generated A4 PDF file |
| `POST` | `/api/uploads/logo` | Upload brand logo (PNG, JPG, SVG up to 5MB) |

---

## 🚢 Deployment Guide

### Frontend on Vercel
1. Push repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import the repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset will automatically detect **Next.js**.
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g. `https://proposalcraft-backend.onrender.com`).
6. Click **Deploy**.

### Backend on Render
1. In [Render Dashboard](https://render.com/), create a new **PostgreSQL Database** (`proposalcraft-db`).
2. Create a new **Web Service** and connect your GitHub repository.
3. Select **Docker** environment (or utilize the provided `backend/render.yaml` Blueprint).
4. Set **Docker Context** to `./backend` and **Dockerfile Path** to `./backend/Dockerfile`.
5. Configure Environment Variables:
   - `DATABASE_URL`: Internal Connection String from Render PostgreSQL.
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: `https://your-proposalcraft-frontend.vercel.app,*`
   - `SECRET_KEY`: Set to a secure random string.
6. The provided Dockerfile installs Chromium and all necessary system libraries automatically.
7. Click **Create Web Service**.

---

## 🧪 Testing & Verification

Run the automated backend test suite:
```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/macOS

# Run end-to-end benchmark and test script
python backend/tests/run_tests.py
```

Expected output:
```text
=== RUNNING PROPOSALCRAFT TEST SUITE ===
Testing /health ...
PASSED: /health
Testing /api/templates ...
PASSED: /api/templates
Testing proposal creation & exact decimal calculations ...
PASSED: proposal creation & decimal calculations
Testing /api/proposals/preview-html ...
PASSED: preview-html
Testing Playwright Chromium PDF generation (modern) ...
PASSED: Playwright PDF generation (modern)
Testing Playwright PDF generation for all 3 templates (corporate, modern, minimal) ...
PASSED: All 3 templates generated pristine PDFs!

ALL BACKEND & PDF TESTS PASSED SUCCESSFULLY!
```

---

## 📄 License
MIT License. Built for production commercial proposal generation.
