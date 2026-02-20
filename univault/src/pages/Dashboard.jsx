import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, BookOpen, AlertCircle } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import { supabase } from '../config/supabase'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgCGPA: 0,
    lowAttendance: 0,
    pendingFees: 0,
  })
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch total students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      // Fetch average CGPA
      const { data: cgpaData } = await supabase
        .from('marks')
        .select('total_marks')

      const avgCGPA = cgpaData?.length > 0
        ? (cgpaData.reduce((sum, m) => sum + (m.total_marks || 0), 0) / cgpaData.length / 10).toFixed(2)
        : 0

      // Sample chart data
      const sampleData = [
        { month: 'Jan', enrollment: 120, grades: 85 },
        { month: 'Feb', enrollment: 135, grades: 88 },
        { month: 'Mar', enrollment: 150, grades: 90 },
        { month: 'Apr', enrollment: 165, grades: 92 },
        { month: 'May', enrollment: 180, grades: 91 },
        { month: 'Jun', enrollment: 195, grades: 93 },
      ]

      setStats({
        totalStudents: studentCount || 0,
        avgCGPA: avgCGPA,
        lowAttendance: 24,
        pendingFees: 15,
      })
      setChartData(sampleData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const pieData = [
    { name: 'Present', value: 85 },
    { name: 'Absent', value: 10 },
    { name: 'Leave', value: 5 },
  ]
  const COLORS = ['#28a745', '#dc3545', '#ffc107']

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard-container">
      <Navbar title="Dashboard" />

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Students</h3>
              <p className="stat-value">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>Average CGPA</h3>
              <p className="stat-value">{stats.avgCGPA}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>Low Attendance</h3>
              <p className="stat-value">{stats.lowAttendance} students</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <h3>Pending Fees</h3>
              <p className="stat-value">{stats.pendingFees} students</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="enrollment" stroke="#4A90E2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Average Grades</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="grades" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
