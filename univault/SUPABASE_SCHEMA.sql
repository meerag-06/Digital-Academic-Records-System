-- UniVault Database Schema (Supabase PostgreSQL)
-- Run this SQL in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'faculty', 'student', 'placement_officer')),
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  department TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  specialization TEXT,
  admission_number TEXT UNIQUE,
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent/Guardian details
CREATE TABLE guardian_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT,
  email TEXT,
  occupation TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic marks
CREATE TABLE marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  internal_marks DECIMAL(5,2),
  external_marks DECIMAL(5,2),
  total_marks DECIMAL(5,2),
  credit_hours DECIMAL(3,2),
  grade TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  date_of_class DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'leave')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject TEXT NOT NULL,
  classroom TEXT,
  faculty_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee structure
CREATE TABLE fee_structure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  tuition_fee DECIMAL(10,2),
  hostel_fee DECIMAL(10,2),
  transport_fee DECIMAL(10,2),
  exam_fee DECIMAL(10,2),
  other_fee DECIMAL(10,2),
  total_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee payments
CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2),
  payment_date DATE NOT NULL,
  payment_method TEXT,
  receipt_number TEXT UNIQUE,
  semester INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements & Activities
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('sports', 'cultural', 'internship', 'certification', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  date_achieved DATE,
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents storage metadata
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('bonafide', 'tc', 'community', 'internship_letter', 'other')),
  file_name TEXT,
  file_url TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Digital Verification records
CREATE TABLE verification_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  verification_id TEXT UNIQUE NOT NULL,
  qr_code_url TEXT,
  certificate_type TEXT,
  issue_date DATE,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies for placement
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  industry TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  placement_officer_id UUID REFERENCES profiles(id),
  min_cgpa DECIMAL(3,2),
  eligible_departments TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student placement applications
CREATE TABLE placement_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected')),
  interview_date TIMESTAMP,
  interview_round INTEGER,
  result TEXT,
  feedback TEXT,
  applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student skills for placement
CREATE TABLE student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  changes_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scholarships
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  scholarship_name TEXT,
  amount DECIMAL(10,2),
  academic_year TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_department ON students(department);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_semester ON marks(semester);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date_of_class);
CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_achievements_student_id ON achievements(student_id);
CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_placement_apps_student_id ON placement_applications(student_id);
CREATE INDEX idx_placement_apps_status ON placement_applications(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policies for Students
CREATE POLICY "Students can view their own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Faculty can view students for academic records"
  ON students FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('faculty', 'admin', 'placement_officer')
  );

-- RLS Policies for Marks
CREATE POLICY "Students can view their own marks"
  ON marks FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can view marks for their department"
  ON marks FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('faculty', 'admin')
  );

-- RLS Policies for Attendance
CREATE POLICY "Students can view their own attendance"
  ON attendance FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for Placement Applications
CREATE POLICY "Students can view their own applications"
  ON placement_applications FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Placement officers can view all applications"
  ON placement_applications FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('placement_officer', 'admin')
  );

-- Views for common queries
CREATE OR REPLACE VIEW student_cgpa_view AS
SELECT 
  s.id,
  s.student_id,
  s.first_name,
  s.last_name,
  ROUND(COALESCE(AVG((m.internal_marks + m.external_marks) / 10), 0), 2) as cgpa,
  COUNT(DISTINCT m.semester) as semesters_completed
FROM students s
LEFT JOIN marks m ON s.id = m.student_id
GROUP BY s.id, s.student_id, s.first_name, s.last_name;

CREATE OR REPLACE VIEW student_attendance_view AS
SELECT 
  s.id,
  s.student_id,
  s.first_name,
  s.last_name,
  ROUND(100.0 * SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / 
    NULLIF(COUNT(*), 0), 2) as attendance_percentage
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.student_id, s.first_name, s.last_name;
