# UniVault Quick Start Guide

Get UniVault up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 16+)
node --version

# Check npm version
npm --version
```

## 1️⃣ Project Setup (2 minutes)

```bash
# Navigate to project
cd univault

# Install all dependencies
npm install

# Create environment file
# Copy .env variables from parent directory
```

## 2️⃣ Configure Supabase (1 minute)

1. Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

2. Setup database:
   - Go to Supabase SQL Editor
   - Copy-paste `SUPABASE_SCHEMA.sql`
   - Click "Run"

## 3️⃣ Start Development (1 minute)

```bash
# Start dev server
npm run dev

# Open in browser
# http://localhost:5173
```

## 4️⃣ First Login (1 minute)

1. Click "Sign Up"
2. Create test account:
   - Email: `test@univault.com`
   - Password: `Test@1234`
3. Login and explore!

---

## 🚀 Next Steps

### Initialize with Sample Data

```sql
-- Run in Supabase SQL Editor

-- Add sample student
INSERT INTO students (
  student_id, first_name, last_name, email, 
  department, batch_year, is_active
) VALUES (
  'CS202401', 'John', 'Doe', 'john@example.com',
  'Computer Science', 2024, true
);

-- Add sample marks
INSERT INTO marks (
  student_id, subject, semester, 
  internal_marks, external_marks, total_marks, credit_hours
) VALUES (
  (SELECT id FROM students WHERE student_id = 'CS202401'),
  'Data Structures', 1, 15, 70, 85, 3
);
```

### Build for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm run preview
```

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm install` | Install dependencies |

---

## Troubleshooting

### ❌ "Cannot find module" error
```bash
npm install
```

### ❌ "VITE_SUPABASE_URL is undefined"
- Create `.env.local` in project root
- Add Supabase credentials
- Restart dev server

### ❌ "Cannot connect to database"
- Check Supabase project status
- Verify credentials in `.env.local`
- Check internet connection

### ❌ Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

---

## Project Structure

```
univault/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── context/        # React context
│   ├── config/         # Configuration
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main component
├── SUPABASE_SCHEMA.sql # Database setup
├── DEPLOYMENT.md       # Production guide
├── ARCHITECTURE.md     # Technical architecture
└── README.md           # Full documentation
```

---

## Key Modules

- 🎓 **Student Management** - Add/edit students
- 📊 **Academic** - Marks, CGPA, certificates
- 📅 **Attendance** - Track attendance
- 💰 **Fees** - Fee management and receipts
- 📄 **Documents** - Store documents
- ✅ **Verification** - QR code verification
- 💼 **Placement** - Job applications

---

## Useful Links

- 📖 [Full Documentation](./README.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🪓 [Supabase Docs](https://supabase.com/docs)
- ⚛️ [React Docs](https://react.dev)

---

## Need Help?

1. **Check logs**: Browser console (F12) and terminal
2. **Review documentation**: See README.md
3. **Check GitHub issues**: Look for similar problems
4. **Contact support**: Create GitHub issue

---

## Features Checklist

- ✅ User authentication (email/password)
- ✅ Role-based access control
- ✅ Student management
- ✅ Dashboard with charts
- ✅ Responsive design
- ✅ Database security (RLS)
- ✅ PDF generation
- ✅ QR code support
- 🔄 Real-time updates (coming soon)
- 🔄 Email notifications (coming soon)
- 🔄 Mobile app (coming soon)

---

**Ready to build? Start with:** `npm install && npm run dev`

Happy coding! 🚀
