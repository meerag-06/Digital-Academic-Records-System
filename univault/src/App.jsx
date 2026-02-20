import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './hooks/ProtectedRoute'
import Sidebar from './components/common/Sidebar'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'

import './App.css'

function AppLayout({ children }) {
  const { loading } = useAuth()

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes for other modules */}
      <Route path="/students" element={<ProtectedRoute><AppLayout><Students /></AppLayout></ProtectedRoute>} />
      <Route path="/my-profile" element={<ProtectedRoute><AppLayout><div className="page-placeholder">My Profile Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/academics" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Academics Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Attendance Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Timetable Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Fees Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Achievements Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Documents Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/verification" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Verification Module Coming Soon</div></AppLayout></ProtectedRoute>} />
      <Route path="/placement" element={<ProtectedRoute><AppLayout><div className="page-placeholder">Placement Module Coming Soon</div></AppLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}
