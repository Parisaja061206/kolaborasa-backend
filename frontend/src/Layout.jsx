import { Outlet, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import './App.css'

function Layout() {
  const userStr = localStorage.getItem('user')
  
  // Jika belum login, arahkan ke halaman login
  if (!userStr) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content-area">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout