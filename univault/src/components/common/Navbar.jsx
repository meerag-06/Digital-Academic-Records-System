import React from 'react'
import { Bell, Settings, HelpCircle } from 'lucide-react'
import './Navbar.css'

export default function Navbar({ title }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">{title}</h2>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <button className="navbar-icon-btn" title="Help">
          <HelpCircle size={20} />
        </button>
        <button className="navbar-icon-btn" title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  )
}
