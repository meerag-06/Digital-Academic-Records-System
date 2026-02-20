# UniVault - Digital College Management & Placement System

A production-ready, full-stack digital college management system built with React (Vite), Supabase, Bootstrap, Tailwind CSS, and Three.js.

## 🎯 Project Overview

UniVault is a comprehensive solution designed for higher education institutions to manage student records, academics, attendance, fees, placement drives, and digital verification of credentials—all in one secure, role-based platform.

### Key Features

- **Authentication** - Email/password authentication with Supabase
- **Role-Based Access** - Admin, Faculty, Student, Placement Officer roles
- **Student Management** - Complete student profile with auto-generated IDs
- **Academic Management** - Marks entry, CGPA calculation, mark sheets (PDF)
- **Attendance Tracking** - Daily attendance with alerts for low attendance
- **Timetable Management** - Faculty and department-wise timetables
- **Fee Management** - Fee structure, payment tracking, receipts (PDF)
- **Achievements & Documents** - Store certifications and official documents
- **Digital Verification** - QR code generation and verification
- **Placement Module** - Company management and student applications
- **Real-time Dashboard** - Live statistics and analytics
- **Row Level Security** - Database-level security policies

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Bootstrap** - Component library
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library
- **qrcode.react** - QR code generation
- **jsPDF** - PDF generation

### Backend
- **Supabase** - PostgreSQL database, Auth, Storage
- **Row Level Security** - Data access control

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Supabase**
   - Create project at https://supabase.com
   - Run SQL from `SUPABASE_SCHEMA.sql` in Supabase SQL Editor
   - Copy your keys to `.env.local`

3. **Environment Variables**
```bash
# .env.local
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. **Start Development**
```bash
npm run dev
```

## 🚀 Deployment Guide

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy at vercel.com - add VITE_* environment variables
```

### Build for Production
```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── context/        # Auth context
├── config/         # Configuration
├── utils/          # Helper functions
├── hooks/          # Custom hooks
└── services/       # API services
```

## 🔐 Security Features

- Email/Password authentication
- Row Level Security policies
- Protected routes
- Role-based access control
- Audit logging
- Secure file uploads

## 📊 CGPA Calculation Formula

```
CGPA = Σ(Grade Point × Credit Hours) / Σ(Credit Hours)
Where Grade Point = Marks / 10
```

## 🎨 Color Scheme

- Primary Blue: #4A90E2
- Dark Blue: #1F3A60
- Light Background: #EAF4FF

## 📱 Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-optimized interface

## 🤝 Support & Documentation

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md) and [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
