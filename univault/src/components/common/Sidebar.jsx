import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LogOut, Home, Users, BookOpen, Calendar, DollarSign, Award, FileText, CheckCircle, Briefcase, User } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { AuthContext } from '../../context/AuthContext'
import './Sidebar.css'

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(true)
  const { user, role } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, access: ['admin', 'faculty', 'student', 'placement_officer'] },
    { path: '/students', label: 'Students', icon: Users, access: ['admin', 'faculty'] },
    { path: '/my-profile', label: 'My Profile', icon: User, access: ['student'] },
    { path: '/academics', label: 'Academics', icon: BookOpen, access: ['admin', 'faculty', 'student'] },
    { path: '/attendance', label: 'Attendance', icon: Calendar, access: ['admin', 'faculty', 'student'] },
    { path: '/timetable', label: 'Timetable', icon: Calendar, access: ['admin', 'faculty', 'student'] },
    { path: '/fees', label: 'Fees', icon: DollarSign, access: ['admin', 'student'] },
    { path: '/achievements', label: 'Achievements', icon: Award, access: ['student'] },
    { path: '/documents', label: 'Documents', icon: FileText, access: ['admin', 'student'] },
    { path: '/verification', label: 'Verification', icon: CheckCircle, access: ['admin', 'student'] },
    { path: '/placement', label: 'Placement', icon: Briefcase, access: ['admin', 'student', 'placement_officer'] },
  ]

  const filteredMenu = menuItems.filter(item => item.access.includes(role))

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">UniVault</h1>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {filteredMenu.map(item => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
          {isOpen && (
            <div>
              <div className="user-email">{user?.email}</div>
              <div className="user-role">{role?.toUpperCase()}</div>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  )
}
