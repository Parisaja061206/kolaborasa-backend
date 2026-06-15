import { Outlet, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
      <Footer />
    </div>
  )
}

export default Layout