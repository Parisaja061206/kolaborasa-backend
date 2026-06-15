import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">KOLABORASA</div>
      <ul className="nav-links">
        <li><Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/news" className={location.pathname === '/news' ? 'active' : ''}>News Feed</Link></li>
        <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;