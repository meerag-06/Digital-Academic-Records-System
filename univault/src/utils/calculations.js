// CGPA Calculation Logic
export function calculateCGPA(marks) {
  if (!marks || marks.length === 0) return 0

  const validMarks = marks.filter(m => m.total_marks && m.credit_hours)
  if (validMarks.length === 0) return 0

  const totalWeightedPoints = validMarks.reduce((sum, mark) => {
    const gradePoint = (mark.total_marks / 10) // Convert to 10-point scale
    return sum + (gradePoint * mark.credit_hours)
  }, 0)

  const totalCredits = validMarks.reduce((sum, mark) => sum + mark.credit_hours, 0)

  return (totalWeightedPoints / totalCredits).toFixed(2)
}

// Grade conversion (Standard grading scale)
export function getGradeFromMarks(marks) {
  if (marks >= 90) return 'A+'
  if (marks >= 80) return 'A'
  if (marks >= 70) return 'B+'
  if (marks >= 60) return 'B'
  if (marks >= 50) return 'C'
  return 'F'
}

// Attendance percentage calculation
export function calculateAttendancePercentage(presentDays, totalDays) {
  if (totalDays === 0) return 0
  return ((presentDays / totalDays) * 100).toFixed(2)
}

// Check attendance eligibility
export function isAttendanceAboveThreshold(percentage, threshold = 75) {
  return parseFloat(percentage) >= threshold
}

// Fee calculation
export function calculateTotalFee(feeStructure) {
  if (!feeStructure) return 0
  return (
    (feeStructure.tuition_fee || 0) +
    (feeStructure.hostel_fee || 0) +
    (feeStructure.transport_fee || 0) +
    (feeStructure.exam_fee || 0) +
    (feeStructure.other_fee || 0)
  )
}

// Scholarship eligibility
export function checkScholarshipEligibility(cgpa, minCGPA = 7.0) {
  return parseFloat(cgpa) >= minCGPA
}

// Date formatting
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Generate unique student ID
export function generateStudentId(department, batchYear) {
  const deptCode = department.substring(0, 3).toUpperCase()
  const yearCode = batchYear.toString().slice(-2)
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `${deptCode}${yearCode}${randomNum}`
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone
export function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// Parse error messages
export function getErrorMessage(error) {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error_description) return error.error_description
  return 'An error occurred'
}
