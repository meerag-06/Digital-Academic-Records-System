# UniVault Deployment Guide

Complete guide to deploy UniVault to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Optimization](#database-optimization)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Node.js 16+ (LTS recommended)
- npm or yarn package manager
- Git version control
- PostgreSQL client (psql) - optional, for direct DB access

### Required Accounts
- Supabase account (https://supabase.com)
- Deployment platform (Vercel, Netlify, or similar)
- GitHub account (for version control)

---

## Supabase Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New project"
3. Enter project name: `univault`
4. Create a strong password
5. Select region closest to your target users
6. Click "Create new project" and wait for initialization

### Step 2: Setup Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Click "New query"
3. Copy all content from `SUPABASE_SCHEMA.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

**Important**: Verify all tables were created successfully

### Step 3: Enable Row Level Security

Verify RLS is enabled on all tables:

```sql
-- Check RLS status (should show enabled)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Step 4: Create Initial Admin User

```sql
-- Insert admin user in profiles table
INSERT INTO profiles (id, email, full_name, role, department)
VALUES (
  'admin-uuid-here', 
  'admin@univault.com', 
  'Administrator',
  'admin',
  'Administration'
);
```

### Step 5: Get API Keys

Go to Settings → API and copy:
- Project URL → `VITE_SUPABASE_URL`
- Anon Key → `VITE_SUPABASE_ANON_KEY`
- Project ID → `VITE_SUPABASE_PROJECT_ID`

---

## Local Development

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd univault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 4. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

### 5. Test Authentication

1. Go to http://localhost:5173/register
2. Create test account
3. Verify login works
4. Check Supabase Auth dashboard for new user

---

## Production Deployment

### Option 1: Vercel (Recommended)

#### 1. Push to GitHub

```bash
git add .
git commit -m "UniVault production ready"
git push -u origin main
```

#### 2. Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure project settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
6. Click "Deploy"

#### 3. Add Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Option 2: Netlify

#### 1. Build Locally

```bash
npm run build
```

#### 2. Deploy to Netlify

**Method A: Drag & Drop**
1. Go to https://app.netlify.com
2. Drag `dist` folder to "Deploy site"

**Method B: GitHub Integration**
1. Connect your GitHub repo
2. Set Build command: `npm run build`
3. Set Publish directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Click "Deploy site"

### Option 3: Self-Hosted (Ubuntu/VPS)

#### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Deploy Application

```bash
# Clone repo
git clone <your-repo-url> /var/www/univault
cd /var/www/univault

# Install dependencies
npm install

# Build
npm run build

# Use PM2 to run
pm2 start "npm run preview" --name univault
pm2 startup
pm2 save
```

#### 3. Configure Nginx

Create `/etc/nginx/sites-available/univault`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/univault /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup SSL (Free)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Environment Configuration

### Production Environment Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id

# Optional: API endpoints
VITE_API_BASE_URL=https://your-api.com
VITE_ENVIRONMENT=production

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Vercel Specific

Add to `.vercelignore`:
```
node_modules
.env.local
.git
.gitignore
README.md
```

---

## Database Optimization

### 1. Enable Query Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_students_department_batch 
ON students(department, batch_year);

CREATE INDEX idx_marks_semester_student 
ON marks(semester, student_id);

CREATE INDEX idx_attendance_student_date 
ON attendance(student_id, date_of_class);

-- Analyze tables
ANALYZE students;
ANALYZE marks;
ANALYZE attendance;
```

### 2. Setup Backups

In Supabase dashboard:
1. Go to Database → Backups
2. Set automatic backups to daily
3. Retain backups for 30 days

### 3. Monitor Performance

```sql
-- Check slow queries
SELECT query, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

---

## Security Checklist

### Before Going Live

- [ ] Change all admin passwords
- [ ] Enable 2FA for Supabase account
- [ ] Review and test all RLS policies
- [ ] Setup email service for password resets
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS properly in Supabase
- [ ] Setup rate limiting
- [ ] Test file upload restrictions
- [ ] Verify sensitive data encryption
- [ ] Setup monitoring and alerts
- [ ] Backup database before launch
- [ ] Test disaster recovery plan

### Ongoing Security

```bash
# Keep dependencies updated
npm audit
npm update

# Enable Supabase security features
# - Email confirmation required
# - Password reset emails
# - Rate limiting on auth
```

### Supabase Security Settings

1. Go to Settings → Security
2. Set:
   - JWT expiry: 3600 seconds
   - Refresh token rotation: enabled
   - Verify email: enabled
   - Double confirm changes: enabled

---

## Monitoring & Logs

### Vercel Monitoring
- Dashboard → Deployments → Logs
- Dashboard → Analytics
- Setup error tracking with Sentry (optional)

### Supabase Monitoring
- Database → Indexes
- Database → Disk Usage
- Auth → Logs
- Storage → Logs

### Setup Error Tracking

```bash
npm install @sentry/react
```

---

## Troubleshooting

### Issue: 404 on Routes

**Solution:** Ensure Vercel/Netlify is configured for SPA:

**Vercel:** Add `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify:** Add `_redirects`:
```
/*    /index.html   200
```

### Issue: Environment Variables Not Loading

```bash
# Rebuild without cache
npm run build --no-cache

# Clear Vercel cache
vercel env pull  # Pull latest env vars
```

### Issue: Database Connection Timeout

1. Check Supabase status: https://status.supabase.com
2. Verify connection string in `.env.local`
3. Check project status in Supabase dashboard
4. Increase query timeout if needed

### Issue: CORS Errors

In Supabase dashboard → Settings → API:
- Add your domain to allowed origins
- Format: `https://yourdomain.com`

### Common Errors

| Error | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| "SUPABASE_URL is undefined" | Check `.env.local` |
| "Row Level Security denied" | Verify RLS policy |
| "503 Service Unavailable" | Check deployment status |

---

## Performance Optimization

### 1. Code Splitting

Automatically done by Vite. Monitor bundle:
```bash
npm install rollup-plugin-visualizer
```

### 2. Image Optimization

Use Next.js Image component or optimize manually:
```bash
npm install sharp
```

### 3. Caching Strategy

Update service worker in `public/sw.js` (if using PWA)

### 4. Database Query Optimization

```javascript
// ❌ Bad: Fetching all data
const { data } = await supabase.from('students').select()

// ✅ Good: Select only needed columns
const { data } = await supabase
  .from('students')
  .select('id, name, email')
  .limit(10)
```

---

## Rollback Procedure

If deployment has critical issues:

### Vercel
1. Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Netlify
1. Deploys tab
2. Find previous build
3. Click "Restore"

---

## Support

For deployment issues:
- Check Supabase status: https://status.supabase.com
- Review deployment provider logs
- Check browser console for errors
- Contact support@univault.com

---

**Last Updated:** 2024
**UniVault v1.0**
