# AI Career Hub 🚀

A comprehensive enterprise SaaS platform that serves as your AI-powered career operating system. Built with Next.js 16, FastAPI, and the Vercel AI SDK.

![AI Career Hub](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)
![npm](https://img.shields.io/badge/npm-10.0+-CB3837?style=flat-square&logo=npm)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [AI Integration](#ai-integration)
- [Authentication & Security](#authentication--security)
- [Admin Dashboard](#admin-dashboard)
- [Development Workflow](#development-workflow)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AI Career Hub is a full-stack career management platform that leverages artificial intelligence to help professionals optimize every aspect of their career journey. Whether you're just starting out or looking to advance to the next level, our platform provides intelligent guidance, tools, and insights.

**Key Differentiators:**
- 🤖 AI-powered features that learn from your career history
- 🎯 Personalized career path recommendations
- 📊 Real-time job market insights and salary data
- 💼 Integration with major job boards and career platforms
- 🔐 Enterprise-grade security and data privacy
- 📱 Responsive design optimized for all devices

## ✨ Key Features

### For Job Seekers

| Feature | Description | AI-Powered |
|---------|-------------|-----------|
| **AI Resume Builder** | Drag-and-drop resume builder with ATS optimization | ✅ |
| **Smart Job Matching** | AI-driven recommendations based on skills & preferences | ✅ |
| **Interview Preparation** | Mock interviews with real-time feedback | ✅ |
| **Skills Assessment** | Gap analysis with learning recommendations | ✅ |
| **Cover Letter Assistant** | AI-generated, job-specific cover letters | ✅ |
| **Career Analytics** | Insights into career progression and opportunities | ✅ |
| **Learning Paths** | Curated learning resources aligned with goals | ✅ |
| **AI Career Coach** | 24/7 conversational career guidance | ✅ |
| **Job Tracker** | Application pipeline and status tracking | ❌ |
| **Notifications** | Real-time alerts for job matches | ❌ |

### For Administrators

| Feature | Description |
|---------|-------------|
| **User Management** | Full CRUD operations with role-based access |
| **Analytics Dashboard** | Platform metrics and usage insights |
| **System Settings** | Configurable platform features |
| **Audit Logging** | Comprehensive activity tracking |
| **User Reports** | Export and analysis of user data |

## 🛠️ Tech Stack

### Frontend Architecture

```
Technology Stack:
├── Framework
│   ├── Next.js 16 (App Router)
│   ├── React 19
│   └── TypeScript 5.0+
├── Styling & UI
│   ├── Tailwind CSS 4.0
│   ├── shadcn/ui (component library)
│   └── Lucide React (icons)
├── State Management
│   ├── Zustand (global state)
│   └── React Context (provider pattern)
├── Forms & Validation
│   ├── React Hook Form 7.5+
│   └── Zod 3.2+ (schema validation)
├── Data Fetching
│   ├── React Query / SWR
│   └── Axios / Fetch API
├── Charts & Visualization
│   ├── Recharts 2.1+
│   └── Embla Carousel
├── AI Integration
│   ├── Vercel AI SDK 6.0
│   └── Groq API
└── Development Tools
    ├── ESLint
    ├── TypeScript Compiler
    └── Tailwind CSS
```

### Backend Architecture

```
Technology Stack:
├── Framework
│   ├── FastAPI 0.115+
│   ├── Uvicorn (ASGI server)
│   └── Python 3.11+
├── Database
│   ├── MySQL 5.7+
│   ├── SQLAlchemy 2.0 (async ORM)
│   ├── aiomysql (async driver)
│   └── Alembic (migrations)
├── Authentication
│   ├── JWT (python-jose)
│   ├── bcrypt (password hashing)
│   └── OAuth2 support
├── Data Validation
│   ├── Pydantic 2.9+
│   └── Pydantic-settings
├── AI Services
│   ├── Groq API
│   └── Custom ML models
└── Infrastructure
    ├── Python-dotenv (config)
    ├── CORS middleware
    └── Request logging
```

### Infrastructure

- **Frontend Hosting:** Vercel (Serverless)
- **Backend Hosting:** Vercel (or self-hosted)
- **Database:** MySQL 5.7+ / MariaDB 10.3+ (via aiomysql)
- **File Storage:** Vercel Blob / AWS S3
- **AI Gateway:** Vercel AI Gateway

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         Client Layer                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Browser / Mobile Client                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────────────────┐
│                    Vercel Edge Layer                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Next.js 16 Frontend Application                      │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Pages & Components (React Server Components)         │  │  │
│  │  │  - Auth (Login, Register, Reset)                      │  │  │
│  │  │  - Onboarding (7-step wizard)                         │  │  │
│  │  │  - Dashboard (Main application)                       │  │  │
│  │  │  - Admin Panel                                        │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  API Routes (/api/*)                                  │  │  │
│  │  │  - /api/ai/* - AI-powered endpoints                   │  │  │
│  │  │  - Streaming responses                                │  │  │
│  │  │  - Server actions for mutations                       │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  Middleware                                            │  │  │
│  │  │  - Authentication checks                              │  │  │
│  │  │  - Rate limiting                                      │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                     │                                               │
└─────────────────────┼───────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
┌────────▼───────────┐  ┌──────────▼─────────────┐
│   Vercel AI SDK    │  │   FastAPI Backend      │
│  - Model routing   │  │  (Self-hosted/Vercel) │
│  - Streaming       │  │                        │
│  - Caching         │  │ ┌────────────────────┐ │
└────────┬───────────┘  │ │ API Routes (v1)    │ │
         │              │ │ ├─ /auth           │ │
         │              │ │ ├─ /profile        │ │
         ▼              │ │ ├─ /skills         │ │
    ┌──────────────┐    │ │ ├─ /resumes       │ │
    │ AI Providers │    │ │ ├─ /jobs          │ │
    ├──────────────┤    │ │ ├─ /interviews    │ │
    │ Groq         │    │ │ ├─ /ai            │ │
    │ Local Fallback│   │ │ └─ /admin         │ │
    │ Google       │    │ └────────────────────┘ │
    └──────────────┘    │ ┌────────────────────┐ │
                        │ │ Services Layer     │ │
                        │ │ ├─ ai_service      │ │
                        │ │ ├─ auth_service    │ │
                        │ │ └─ profile_service │ │
                        │ └────────────────────┘ │
                        │ ┌────────────────────┐ │
                        │ │ SQLAlchemy ORM     │ │
                        │ │ ├─ Models          │ │
                        │ │ ├─ Relationships   │ │
                        │ │ └─ Async Support   │ │
                        │ └────────────────────┘ │
                        └────────┬────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                      │
    ┌─────────▼──────────┐              ┌──────────▼──────┐
    │   PostgreSQL DB    │              │ Vercel Blob     │
    │ ┌────────────────┐ │              │ (File Storage)  │
    │ │ Users          │ │              │                 │
    │ │ Profiles       │ │              │ ├─ Resume PDFs │
    │ │ Skills         │ │              │ ├─ Cover       │
    │ │ Experiences    │ │              │ │   Letters     │
    │ │ Resumes        │ │              │ └─ Avatars     │
    │ │ Jobs           │ │              │                 │
    │ │ Interviews     │ │              └─────────────────┘
    │ │ Notifications  │ │
    │ │ Audit Logs     │ │
    │ └────────────────┘ │
    └────────────────────┘
```

## 📂 Project Structure

```
ai-career-hub/
│
├── 📄 Configuration Files
│   ├── package.json              # NPM dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   ├── next.config.mjs            # Next.js configuration
│   ├── components.json            # shadcn/ui components config
│   └── vercel.json                # Vercel deployment config
│
├── 📁 Frontend Application (/app)
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles
│   │
│   ├── 🔐 Auth Routes (/auth)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── 🎓 Onboarding (/onboarding)
│   │   ├── layout.tsx
│   │   └── page.tsx               # Multi-step wizard
│   │
│   ├── 📊 Main Dashboard (/dashboard)
│   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   ├── page.tsx               # Dashboard home
│   │   ├── jobs/                  # Job matching & tracking
│   │   ├── resumes/               # Resume management
│   │   │   ├── page.tsx
│   │   │   └── builder/           # Resume builder
│   │   ├── interviews/            # Interview preparation
│   │   │   ├── page.tsx
│   │   │   └── practice/          # Mock interviews
│   │   ├── learning/              # Learning paths
│   │   ├── goals/                 # Career goals
│   │   ├── ai-coach/              # AI career coach
│   │   ├── profile/               # User profile management
│   │   └── settings/              # User settings
│   │
│   ├── 👨‍💼 Admin Panel (/admin)
│   │   ├── layout.tsx             # Admin layout
│   │   ├── page.tsx               # Admin dashboard
│   │   ├── users/                 # User management
│   │   ├── analytics/             # Platform analytics
│   │   └── settings/              # System settings
│   │
│   └── 🔌 API Routes (/api)
│       └── ai/                    # AI-powered endpoints
│           ├── chat/              # Conversational AI
│           ├── analyze-resume/    # Resume analysis
│           ├── skills-gap/        # Skills assessment
│           ├── interview-prep/    # Interview preparation
│           ├── cover-letter/      # Cover letter generation
│           └── job-match/         # Job matching
│
├── 📁 Components (/components)
│   ├── 🎨 UI Components (/ui)
│   │   ├── button.tsx             # Button component
│   │   ├── dialog.tsx             # Dialog/Modal
│   │   ├── input.tsx              # Input field
│   │   ├── select.tsx             # Select dropdown
│   │   ├── form.tsx               # Form wrapper
│   │   ├── card.tsx               # Card container
│   │   ├── badge.tsx              # Badge
│   │   ├── avatar.tsx             # User avatar
│   │   ├── tabs.tsx               # Tabs
│   │   ├── accordion.tsx           # Accordion
│   │   ├── alert.tsx              # Alert messages
│   │   ├── toast.tsx              # Toast notifications
│   │   └── ... (30+ more components)
│   │
│   ├── 🎓 Onboarding Components (/onboarding)
│   │   ├── personal-info-step.tsx
│   │   ├── experience-step.tsx
│   │   ├── education-step.tsx
│   │   ├── skills-step.tsx
│   │   ├── career-goals-step.tsx
│   │   ├── resume-upload-step.tsx
│   │   ├── review-step.tsx
│   │   └── index.ts
│   │
│   ├── 🤖 AI Coach (/ai-coach)
│   │   └── chat-interface.tsx     # Chat UI component
│   │
│   ├── Common Components
│   │   ├── logo.tsx               # Logo component
│   │   ├── theme-toggle.tsx       # Dark/Light mode toggle
│   │   ├── theme-provider.tsx     # Theme context provider
│   │   ├── page-header.tsx        # Page header
│   │   ├── loading-skeleton.tsx   # Skeleton loader
│   │   ├── score-ring.tsx         # Score visualization
│   │   └── stat-card.tsx          # Statistics card
│   │
│   └── index.ts                   # Component exports
│
├── 🪝 Hooks (/hooks)
│   ├── use-auth.ts                # Authentication hook
│   ├── use-dashboard.ts           # Dashboard state hook
│   ├── use-mobile.ts              # Mobile detection hook
│   ├── use-toast.ts               # Toast notifications hook
│   └── index.ts                   # Hook exports
│
├── 🏪 State Management (/store)
│   ├── auth-store.ts              # Auth state (Zustand)
│   ├── onboarding-store.ts        # Onboarding state
│   ├── ui-store.ts                # UI state (theme, sidebar)
│   └── index.ts                   # Store exports
│
├── 🔧 Services (/services)
│   ├── api-client.ts              # HTTP client configuration
│   ├── auth-service.ts            # Auth API calls
│   ├── profile-service.ts         # Profile API calls
│   ├── ai-service.ts              # AI features API calls
│   ├── jobs-service.ts            # Jobs API calls
│   ├── interview-service.ts       # Interview API calls
│   ├── resume-service.ts          # Resume API calls
│   ├── notification-service.ts    # Notifications API calls
│   ├── admin-service.ts           # Admin API calls
│   └── index.ts                   # Service exports
│
├── 📚 Utilities (/lib)
│   ├── utils.ts                   # Helper functions
│   └── api-client.ts              # API client setup
│
├── 🏷️ Types (/types)
│   └── index.ts                   # TypeScript type definitions
│
├── 👨‍👩‍👧‍👦 Providers (/providers)
│   └── index.tsx                  # Root providers (Auth, Theme)
│
├── 🎨 Styles (/styles)
│   └── globals.css                # Global CSS
│
├── 🖼️ Public Assets (/public)
│   └── ...                        # Static assets
│
└── 🐍 Backend (/backend)
    │
    ├── 📄 Configuration
    │   ├── main.py                # FastAPI application entry point
    │   ├── pyproject.toml         # Python dependencies & build config
    │   └── requirements.txt       # Alternative dependency file
    │
    ├── 🔧 Core Utilities (/core)
    │   ├── __init__.py
    │   ├── config.py              # Settings management (Pydantic)
    │   ├── database.py            # Database connection & initialization
    │   └── security.py            # Authentication utilities
    │
    ├── 📊 Database Models (/models)
    │   ├── __init__.py
    │   ├── user.py                # User model
    │   ├── profile.py             # User profile
    │   ├── skill.py               # Skills
    │   ├── experience.py          # Work experience
    │   ├── education.py           # Education
    │   ├── resume.py              # Resumes
    │   ├── cover_letter.py        # Cover letters
    │   ├── job.py                 # Jobs
    │   ├── job_match.py           # Job matches
    │   ├── interview.py           # Interview sessions
    │   ├── learning_path.py       # Learning paths
    │   ├── certification.py       # Certifications
    │   ├── language.py            # Languages
    │   ├── project.py             # Projects
    │   ├── target_career.py       # Career targets
    │   ├── subscription.py        # Subscriptions
    │   ├── notification.py        # Notifications
    │   └── audit_log.py           # Audit logging
    │
    ├── 🛣️ API Routes (/routers)
    │   ├── __init__.py
    │   ├── auth.py                # Authentication endpoints
    │   ├── profile.py             # Profile endpoints
    │   ├── skills.py              # Skills endpoints
    │   ├── experiences.py         # Experience endpoints
    │   ├── education.py           # Education endpoints
    │   ├── resumes.py             # Resume endpoints
    │   ├── cover_letters.py       # Cover letter endpoints
    │   ├── jobs.py                # Job endpoints
    │   ├── interviews.py          # Interview endpoints
    │   ├── ai_analysis.py         # AI analysis endpoints
    │   ├── learning_paths.py      # Learning path endpoints
    │   ├── notifications.py       # Notification endpoints
    │   ├── onboarding.py          # Onboarding endpoints
    │   └── admin.py               # Admin endpoints
    │
    └── 🧠 Services (/services)
        ├── __init__.py
        └── ai_service.py          # AI service integration
```

## ⚙️ Prerequisites

Before getting started, ensure you have:

- **Node.js** 20.0 or higher
- **npm** 10.0 or higher (or pnpm/yarn)
- **Python** 3.11 or higher
- **MySQL** 5.7+ or **MariaDB** 10.3+ database (see [MYSQL_SETUP.md](MYSQL_SETUP.md))
- **Git** version control
- **Groq API Key** (for AI features)

### Optional but Recommended

- **Vercel CLI** for local development
- **Docker** for containerized development
- **Postman** or **Insomnia** for API testing

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ai-career-hub.git
cd ai-career-hub
```

### 2. Frontend Setup

```bash
# Install dependencies using npm (converted from pnpm)
npm install

# Or if you prefer to continue using pnpm
pnpm install
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -e .

# Create .env file
cp .env.example .env

# Initialize database
python -m alembic upgrade head

cd ..
```

### 4. Configure Environment Variables

```bash
# Create .env.local file
cp .env.example .env.local
```

### 5. Start Development Servers

**Option A: Using Vercel CLI (Recommended)**

```bash
vercel dev
```

This starts both frontend and backend with automatic reload.

**Option B: Manual Start**

Terminal 1 - Frontend:
```bash
npm run dev
# Application runs on http://localhost:3000
```

Terminal 2 - Backend:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API runs on http://localhost:8000
# Docs available at http://localhost:8000/docs
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Swagger Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🔧 Frontend Setup in Detail

### Install Dependencies

```bash
npm install
```

This will install all dependencies from `package.json`:
- React & Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Form handling libraries
- Data fetching tools

### Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types

# Other utilities
npm run format           # Format code with Prettier
npm run storybook        # Start Storybook
```

### Project Configuration

Key files:
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Tailwind CSS theme
- `components.json` - shadcn/ui setup
- `.env.local` - Environment variables

## 🐍 Backend Setup in Detail

### Install Dependencies

```bash
cd backend
pip install -e .
```

Core dependencies:
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **python-jose** - JWT authentication
- **passlib** - Password hashing
- **asyncpg** - PostgreSQL async driver

### Database Setup

```bash
# Create database
createdb ai_career_hub

# Run migrations
alembic upgrade head

# Create admin user (optional)
python scripts/create_admin.py
```

### Available Commands

```bash
# Development server
uvicorn core.main:app --reload

# Run migrations
alembic upgrade head
alembic downgrade -1

# Create new migration
alembic revision --autogenerate -m "Add new table"

# Database shell
python -m asyncpg interactive

# Run tests
pytest

# Generate API docs
python scripts/generate_openapi.py
```

## 🌍 Environment Variables

### Frontend Configuration (.env.local)

```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREMIUM=true

# Third-party Services
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA_...

# AI Features
GROQ_API_KEY=gsk_...
```

### Backend Configuration (.env)

```env
# Environment
ENVIRONMENT=development
DEBUG=true

# Application
APP_NAME=AI Career Hub
SECRET_KEY=your-super-secret-key-minimum-32-chars
ALGORITHM=HS256

# Tokens
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database (MySQL/MariaDB)
DATABASE_URL=mysql+aiomysql://root:root@localhost:3306/ai_career_hub

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# AI Services
GROQ_API_KEY=gsk_...
DEFAULT_AI_PROVIDER=groq

# File Storage
VERCEL_BLOB_URL=https://...
VERCEL_BLOB_TOKEN=...

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

All authenticated endpoints require Bearer token:
```
Authorization: Bearer {access_token}
```

### Core Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| GET | `/auth/me` | Get current user | ✅ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |
| POST | `/auth/verify-email` | Verify email | ❌ |

#### Profile Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get user profile | ✅ |
| PUT | `/profile` | Update profile | ✅ |
| POST | `/profile/avatar` | Upload avatar | ✅ |
| GET | `/profile/summary` | Get profile summary | ✅ |

#### Skills Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/skills` | List all skills | ✅ |
| POST | `/skills` | Add skill | ✅ |
| GET | `/skills/{id}` | Get skill | ✅ |
| PUT | `/skills/{id}` | Update skill | ✅ |
| DELETE | `/skills/{id}` | Delete skill | ✅ |
| GET | `/skills/suggestions` | Get skill suggestions | ✅ |
| POST | `/skills/assess` | AI skill assessment | ✅ |

#### Resume Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/resumes` | List all resumes | ✅ |
| POST | `/resumes` | Create resume | ✅ |
| GET | `/resumes/{id}` | Get resume | ✅ |
| PUT | `/resumes/{id}` | Update resume | ✅ |
| DELETE | `/resumes/{id}` | Delete resume | ✅ |
| POST | `/resumes/{id}/optimize` | AI optimize resume | ✅ |
| GET | `/resumes/{id}/export` | Export (PDF/DOCX) | ✅ |
| POST | `/resumes/{id}/duplicate` | Duplicate resume | ✅ |

#### Job Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/jobs` | List jobs | ✅ |
| GET | `/jobs/{id}` | Get job details | ✅ |
| GET | `/jobs/matches` | AI job matches | ✅ |
| POST | `/jobs/{id}/apply` | Apply to job | ✅ |
| POST | `/jobs/{id}/save` | Save job | ✅ |
| GET | `/jobs/saved` | Get saved jobs | ✅ |
| DELETE | `/jobs/{id}/save` | Unsave job | ✅ |

#### Interview Preparation

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/interviews` | List interviews | ✅ |
| POST | `/interviews` | Create interview session | ✅ |
| GET | `/interviews/{id}` | Get interview | ✅ |
| POST | `/interviews/{id}/answer` | Submit answer | ✅ |
| GET | `/interviews/{id}/feedback` | Get AI feedback | ✅ |
| POST | `/interviews/{id}/complete` | Complete interview | ✅ |

#### AI Analysis

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/analyze-profile` | Analyze career profile | ✅ |
| POST | `/ai/skills-gap` | Skills gap analysis | ✅ |
| POST | `/ai/career-path` | Career recommendations | ✅ |
| POST | `/ai/salary-insights` | Salary analysis | ✅ |
| POST | `/ai/interview-prep` | Interview preparation | ✅ |

#### Admin Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/users` | List all users | ✅ Admin |
| GET | `/admin/users/{id}` | Get user details | ✅ Admin |
| PUT | `/admin/users/{id}` | Update user | ✅ Admin |
| DELETE | `/admin/users/{id}` | Delete user | ✅ Admin |
| GET | `/admin/analytics` | Platform analytics | ✅ Admin |
| GET | `/admin/settings` | Get settings | ✅ Admin |
| PUT | `/admin/settings` | Update settings | ✅ Admin |

### Example Requests

**Login**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get Profile**
```bash
curl http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer {access_token}"
```

**AI Job Match**
```bash
curl -X POST http://localhost:8000/api/v1/jobs/matches \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "top_n": 5,
    "min_match_score": 70
  }'
```

## 🗄️ Database Models

### Core Data Model Relationships

```
users (1) ──────────── (1) profiles
  │
  ├──── (1:N) ──────────── skills
  ├──── (1:N) ──────────── experiences
  ├──── (1:N) ──────────── education
  ├──── (1:N) ──────────── resumes
  ├──── (1:N) ──────────── cover_letters
  ├──── (1:N) ──────────── interviews
  ├──── (1:N) ──────────── learning_paths
  ├──── (1:N) ──────────── notifications
  ├──── (1:N) ──────────── job_matches
  ├──── (1:N) ──────────── projects
  ├──── (1:N) ──────────── certifications
  ├──── (1:N) ──────────── languages
  ├──── (1:N) ──────────── audit_logs
  └──── (1:1) ──────────── subscription
```

### Key Models

**User Model**
```python
- id: UUID
- email: String (unique)
- hashed_password: String
- full_name: String
- role: Enum (user, admin)
- is_active: Boolean
- is_verified: Boolean
- onboarding_completed: Boolean
- created_at: DateTime
- updated_at: DateTime
```

**Profile Model**
```python
- id: UUID
- user_id: UUID (FK)
- headline: String
- bio: Text
- location: String
- phone: String
- avatar_url: String
- years_of_experience: Integer
- current_salary: Decimal
- expected_salary: Decimal
```

**Resume Model**
```python
- id: UUID
- user_id: UUID (FK)
- title: String
- content: Text
- ats_score: Float
- is_default: Boolean
- file_url: String
- created_at: DateTime
- updated_at: DateTime
```

## 🤖 AI Integration

### Features Using AI

1. **Resume Optimization**
   - ATS scoring and recommendations
   - Content improvements
   - Keyword suggestions

2. **Job Matching**
   - Skills-based matching
   - Career level alignment
   - Company culture fit

3. **Interview Preparation**
   - Realistic interview questions
   - Answer evaluation
   - Real-time feedback

4. **Career Coaching**
   - Personalized advice
   - Career path planning
   - Goal setting

5. **Skill Assessment**
   - Gap analysis
   - Learning recommendations
   - Skill validation

### AI Service Integration

The backend uses Groq as the default provider for AI responses:

```python
from services.ai_service import ai_service

# Example: Resume analysis
response = await ai_service.analyze_resume(
    resume_content=resume_content,
    messages=[
        {
            "role": "system",
            "content": "You are an expert career coach analyzing resumes."
        },
        {
            "role": "user",
            "content": f"Analyze this resume: {resume_content}"
        }
    job_description=job_description,
)
```

## 🔐 Authentication & Security

### JWT Authentication Flow

```
1. User registers/logs in
2. Backend validates credentials
3. Server issues access & refresh tokens
4. Client stores tokens
5. Client includes token in Authorization header
6. Backend validates token on each request
7. Token refresh handled automatically
```

### Password Security

- Passwords hashed with bcrypt
- Minimum 8 characters
- Requires uppercase, lowercase, number, special character
- Reset via email verification

### Data Protection

- HTTPS enforced in production
- CORS properly configured
- SQL injection protection via ORM
- XSS protection via React
- CSRF tokens for state-changing operations

## 👨‍💼 Admin Dashboard

### Admin Features

1. **User Management**
   - View all users
   - Edit user details
   - Suspend/activate accounts
   - Reset passwords

2. **Analytics**
   - Active users
   - Feature usage
   - Success metrics
   - Revenue tracking

3. **System Configuration**
   - Feature flags
   - Email settings
   - Payment configuration
   - API keys management

4. **Audit Logging**
   - Track all user activities
   - Compliance reporting
   - Security monitoring

## 💻 Development Workflow

### Branching Strategy

```
main                    # Production branch
  └─ develop           # Staging branch
      └─ feature/*     # Feature branches
      └─ bugfix/*      # Bug fix branches
      └─ hotfix/*      # Production hotfixes
```

### Code Standards

**TypeScript/JavaScript**
- ESLint configured
- Prettier formatting
- TypeScript strict mode
- Component composition best practices

**Python**
- Black code formatter
- isort for imports
- Type hints required
- Docstrings for functions

### Git Workflow

1. Create feature branch
2. Commit changes with clear messages
3. Create pull request
4. Code review
5. Merge to main

### Testing

```bash
# Frontend
npm run test              # Run Jest tests
npm run test:watch       # Watch mode

# Backend
pytest                    # Run tests
pytest --cov            # With coverage
```

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)

```bash
# Connect repository
vercel link

# Deploy
vercel deploy

# Production
vercel deploy --prod
```

### Backend Deployment

**Option 1: Vercel Functions**
```bash
vercel deploy
```

**Option 2: Self-hosted (Docker)**
```bash
# Build image
docker build -t ai-career-hub-api .

# Run container
docker run -p 8000:8000 ai-career-hub-api
```

**Option 3: Platform.sh / Railway / Render**
```bash
# Follow platform-specific deployment guides
```

### Database Migration

```bash
# Before deployment
alembic upgrade head

# Backup production database
pg_dump ai_career_hub > backup.sql

# Run migrations on production
alembic upgrade head
```

### Environment Setup for Production

```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql+asyncpg://user:pass@prod-db:5432/ai_career_hub
CORS_ORIGINS=["https://yourdomain.com"]
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**
```bash
# Solution: Reinstall dependencies
npm install
cd backend && pip install -e .
```

**Issue: Database connection failed**
```bash
# Solution: Check DATABASE_URL
echo $DATABASE_URL
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

**Issue: CORS errors in browser**
```bash
# Solution: Update CORS_ORIGINS in backend .env
CORS_ORIGINS=["http://localhost:3000"]
```

**Issue: TypeScript compilation errors**
```bash
# Solution: Check types
npm run type-check
```

**Issue: AI features not working**
```bash
# Solution: Verify API keys
echo $GROQ_API_KEY
# Check token limits and quota
```

### Debugging Tips

1. **Frontend**: Browser DevTools Console
2. **Backend**: Check logs: `vercel logs`
3. **Database**: SQL queries in FastAPI logs
4. **API**: Use Swagger docs: `http://localhost:8000/docs`

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

### Code Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Process

1. Update README if needed
2. Add/update tests
3. Ensure tests pass
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Report a bug](https://github.com/your-org/ai-career-hub/issues)
- **Email**: support@example.com
- **Documentation**: [Full docs](https://docs.example.com)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- API with [FastAPI](https://fastapi.tiangolo.com/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [Groq](https://groq.com/)

---

**Last Updated:** May 2026  
**Version:** 1.0.0
