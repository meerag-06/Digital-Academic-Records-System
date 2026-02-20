# UniVault Architecture & Design Documentation

## System Overview

UniVault is a three-tier web application with the following architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Tier (React/Vite)                    │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Login  │  │Dashboard│  │ Students │  │  Other Modules   │   │
│  └────┬────┘  └────┬────┘  └────┬─────┘  └────────┬─────────┘   │
│       │            │            │                 │              │
│       └────────────┼────────────┴─────────────────┘              │
│                    │                                              │
│            React Router & Context API                             │
└────────────────────┼──────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────┴──────────────────────────────────────────────┐
│                  Backend Tier (Supabase)                          │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │    Auth Service  │  │   Functions  │  │  Realtime Engine │    │
│  └──────────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │         Row Level Security Policies                       │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────┬──────────────────────────────────────────────┘
                     │
┌────────────────────┴──────────────────────────────────────────────┐
│                   Data Tier (PostgreSQL)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐    │
│  │Profiles │  │Students │  │  Marks  │  │  Other Tables   │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Indexes │ RLS Policies │ Constraints │ Triggers        │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
│   ├── Login (Public)
│   ├── Register (Public)
│   └── AppLayout (Protected)
│       ├── Sidebar
│       ├── Navbar
│       └── Pages
│           ├── Dashboard
│           ├── Students
│           ├── Academics
│           ├── Attendance
│           └── ... (other modules)
```

### State Management

**AuthContext** - Global authentication state
```javascript
{
  user: { id, email, ... },
  role: 'admin' | 'faculty' | 'student' | 'placement_officer',
  loading: boolean
}
```

**Component State** - Local state with `useState`
```javascript
const [students, setStudents] = useState([])
const [loading, setLoading] = useState(false)
const [formData, setFormData] = useState({...})
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Supabase Query
    ↓
Response
    ↓
setState Update
    ↓
Re-render
    ↓
UI Update
```

---

## Backend Architecture

### Authentication Flow

```
1. User fills login form
   ↓
2. Calls supabase.auth.signInWithPassword()
   ↓
3. Supabase validates credentials
   ↓
4. Returns JWT token & user session
   ↓
5. Token stored in browser (secure)
   ↓
6. Subsequent requests include token
   ↓
7. RLS policies use token to enforce access
```

### Example RLS Policy

```sql
-- Students can only view their own records
CREATE POLICY "Students can view own records"
  ON students FOR SELECT
  USING (user_id = auth.uid());

-- Faculty can view all students in their department
CREATE POLICY "Faculty view department"
  ON students FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'faculty'
    AND department = (
      SELECT department FROM profiles WHERE id = auth.uid()
    )
  );
```

---

## Database Design

### Table Relationships

```
auth.users (Supabase Auth)
    ↓
    └── profiles (1-to-1)
          ├── students (user_id FK)
          │   ├── marks (student_id FK)
          │   ├── attendance (student_id FK)
          │   ├── achievements (student_id FK)
          │   ├── documents (student_id FK)
          │   ├── fee_payments (student_id FK)
          │   └── placement_applications (student_id FK)
          │
          ├── guardian_details (student_id FK)
          ├── timetable (faculty_id FK)
          └── companies (placement_officer_id FK)
```

### Key Design Decisions

1. **Separate profiles table**: Links auth users to roles and metadata
2. **Soft deletes**: Use `is_active` boolean instead of hard deletes
3. **Audit logging**: `audit_logs` table tracks all changes
4. **Calculated fields**: CGPA, attendance % calculated on read
5. **Normalized schema**: No data duplication across tables

---

## CGPA Calculation Engine

### Algorithm

```javascript
function calculateCGPA(marks) {
  // marks = [
  //   { total_marks: 85, credit_hours: 3 },
  //   { total_marks: 75, credit_hours: 4 }
  // ]
  
  // Step 1: Convert to grade points (0-10 scale)
  const gradePoints = marks.map(m => m.total_marks / 10)
  
  // Step 2: Weight by credit hours
  const weightedPoints = marks.map((m, i) => 
    gradePoints[i] * m.credit_hours
  )
  
  // Step 3: Divide by total credits
  const totalCredits = marks.reduce((sum, m) => sum + m.credit_hours, 0)
  const cgpa = weightedPoints.reduce((sum, gp) => sum + gp, 0) / totalCredits
  
  return cgpa.toFixed(2) // e.g., "8.25"
}
```

### Example

```
Subject 1: 80 marks, 3 credits
  Grade Point = 80/10 = 8.0
  Weighted = 8.0 × 3 = 24.0

Subject 2: 90 marks, 4 credits
  Grade Point = 90/10 = 9.0
  Weighted = 9.0 × 4 = 36.0

CGPA = (24.0 + 36.0) / (3 + 4) = 60/7 = 8.57
```

---

## Security Architecture

### Authentication Layers

```
Layer 1: Frontend
  └─ Protected Routes (ProtectedRoute component)
  └─ Redirects to login if not authenticated

Layer 2: Transport
  └─ HTTPS encryption in transit
  └─ JWT token in secure cookies

Layer 3: Database
  └─ Row Level Security: who can access what
  └─ Column-level encryption: sensitive data
```

### Authorization Strategy

**Role-based Access Control (RBAC)**

```javascript
const PERMISSIONS = {
  'admin': ['read', 'create', 'update', 'delete', 'manage_users'],
  'faculty': ['read', 'create', 'update'],
  'student': ['read'],
  'placement_officer': ['read', 'create', 'update']
}

function checkPermission(role, action) {
  return PERMISSIONS[role]?.includes(action)
}
```

### Data Protection

1. **Passwords**: Hashed by Supabase Auth with bcrypt
2. **Tokens**: JWT with 1-hour expiry
3. **Files**: Stored in Supabase Storage with token-based access
4. **Sensitive fields**: Can be encrypted using `pgcrypto`:

```sql
-- Encrypt phone numbers
UPDATE students 
SET phone = pgp_sym_encrypt(phone, 'encryption_key')
WHERE phone IS NOT NULL;
```

---

## API Design Patterns

### Supabase Query Pattern

```javascript
// Pattern: [operation]query, handle error, use data
async function fetchStudents() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, email') // SELECT specific columns
      .eq('department', 'Engineering') // WHERE clause
      .order('created_at', { ascending: false }) // ORDER BY
      .limit(10) // LIMIT

    if (error) throw error
    return data
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}
```

### Real-time Subscriptions (Future)

```javascript
// Subscribe to real-time changes
const subscription = supabase
  .from('attendance')
  .on('INSERT', payload => {
    console.log('New attendance:', payload.new)
  })
  .subscribe()

// Cleanup
unsubscribe()
```

---

## Performance Optimization

### Frontend

1. **Code Splitting**: Lazy load route components
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

2. **Memoization**: Prevent unnecessary re-renders
```javascript
const MemoComponent = React.memo(MyComponent)
```

3. **State Management**: Lift state only when necessary
4. **Bundle Size**: Monitor with `rollup-plugin-visualizer`

### Backend

1. **Database Indexes**: Speed up queries
```sql
CREATE INDEX idx_students_department ON students(department);
```

2. **Query Optimization**: Select only needed columns
```javascript
// ❌ Slow: Select all
.select('*')

// ✅ Fast: Select specific columns
.select('id, name, email')
```

3. **Connection Pooling**: Supabase handles automatically
4. **Caching**: Use browser cache headers

---

## Error Handling Strategy

### Error Types

```javascript
class AppError extends Error {
  constructor(message, statusCode, action) {
    super(message)
    this.statusCode = statusCode // HTTP status
    this.action = action          // User-facing label
    this.timestamp = new Date()
  }
}
```

### Error Handling Pattern

```javascript
try {
  const { data, error } = await supabase.from('students').select()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // RLS violation - user not authorized
      throw new AppError('Access denied', 403, 'AUTH_ERROR')
    } else {
      throw new AppError(error.message, 500, 'DB_ERROR')
    }
  }
  
  return data
} catch (error) {
  // Log to monitoring service
  logError(error)
  // Show user-friendly message
  showUserMessage(error.message)
}
```

---

## Testing Strategy

### Unit Tests
```bash
npm install --save-dev vitest
```

### Integration Tests
```bash
npm install --save-dev cypress
```

### Example Test
```javascript
describe('Students Module', () => {
  test('should fetch students', async () => {
    const students = await fetchStudents()
    expect(students).toBeDefined()
    expect(students.length).toBeGreaterThan(0)
  })
})
```

---

## Deployment Pipeline

```
Code Push
    ↓
GitHub Webhook
    ↓
Vercel Build
    │ - npm install
    │ - npm run build
    │ - Run tests
    ↓
Build Success?
    ├─ No → Send notification
    └─ Yes → Deploy to preview
             ↓
             Run E2E tests
             ↓
             Approve → Deploy to production
```

---

## Monitoring & Observability

### Metrics to Track

1. **Performance**
   - Time to First Byte (TTFB)
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)

2. **Errors**
   - JavaScript errors
   - Network errors
   - Database query failures

3. **Business**
   - User sign-ups
   - Login attempts
   - Data modifications

### Implementation

```javascript
// Sentry for error tracking
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT,
})

// Google Analytics for metrics
import { initializeApp } from 'firebase/app'
```

---

## Best Practices

### Code Organization
- ✅ One component per file
- ✅ Separate concerns (logic vs presentation)
- ✅ Use custom hooks for shared logic
- ✅ Keep components under 300 lines

### Security
- ✅ Never expose secrets in client code
- ✅ Always use HTTPS
- ✅ Validate input on both frontend & backend
- ✅ Use CSRF tokens for state-changing requests

### Performance
- ✅ Lazy load images and components
- ✅ Minimize external dependencies
- ✅ Use CSS Grid/Flexbox instead of floats
- ✅ Compress images before upload

### Maintainability
- ✅ Write self-documenting code
- ✅ Add JSDoc comments for functions
- ✅ Use TypeScript for type safety
- ✅ Keep database migrations in version control

---

## Future Enhancements

1. **Progressive Web App (PWA)**: Offline support
2. **Real-time Collaboration**: Live editing of documents
3. **Mobile App**: React Native version
4. **Advanced Analytics**: Predictive insights
5. **AI Integration**: Student performance prediction
6. **Blockchain**: Certificate verification

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Maintainer:** UniVault Development Team
