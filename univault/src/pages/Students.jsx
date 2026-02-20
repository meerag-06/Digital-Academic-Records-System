import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import { supabase } from '../config/supabase'
import { generateStudentId } from '../utils/calculations'
import { DEPARTMENTS } from '../config/constants'
import './Students.css'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    batch_year: new Date().getFullYear(),
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      setError('Error fetching students: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.first_name || !formData.email || !formData.department) {
      setError('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('students')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        setSuccess('Student updated successfully')
      } else {
        // Create new student
        const student_id = generateStudentId(formData.department, formData.batch_year)
        const { error } = await supabase
          .from('students')
          .insert([{ ...formData, student_id }])

        if (error) throw error
        setSuccess('Student added successfully')
      }

      resetForm()
      fetchStudents()
    } catch (error) {
      setError('Error saving student: ' + error.message)
    }
  }

  const handleEdit = (student) => {
    setEditingId(student.id)
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      batch_year: student.batch_year,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccess('Student deleted successfully')
      fetchStudents()
    } catch (error) {
      setError('Error deleting student: ' + error.message)
    }
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: '',
      batch_year: new Date().getFullYear(),
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="page-loading">Loading students...</div>
  }

  return (
    <div className="students-container">
      <Navbar title="Students Management" />

      <div className="students-content">
        <div className="students-header">
          <h2>Student Records ({students.length})</h2>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            <Plus size={18} /> Add Student
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="form-section">
            <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Batch Year</label>
                  <input
                    type="number"
                    name="batch_year"
                    value={formData.batch_year}
                    onChange={handleChange}
                    min="2000"
                    max={new Date().getFullYear() + 4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Add'} Student
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.student_id}</strong></td>
                  <td>{student.first_name} {student.last_name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.batch_year}</td>
                  <td>
                    <span className={`badge ${student.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(student)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(student.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="btn-icon info"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && !showForm && (
          <div className="empty-state">
            <p>No students found. Add your first student to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
