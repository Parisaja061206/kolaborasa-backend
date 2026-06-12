import { Link, useNavigate, useLocation } from 'react-router-dom'
import './App.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">Kolaborasa</div>
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/news" className={location.pathname === '/news' ? 'active' : ''}>News Feed</Link></li>
        <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profil</Link></li>
      </ul>
      <button onClick={handleLogout} className="nav-logout">Logout</button>
    </nav>
  )
}

export default Navbar
