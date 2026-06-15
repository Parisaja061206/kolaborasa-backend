import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import footer from './components/Footer';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (result.status === 'sukses') {
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/home'); // Sesuaikan dengan rute beranda Anda (bisa '/' atau '/home')
      } else {
        setError(result.pesan || 'Login gagal!');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page-container">
      {/* --- BACKGROUND HERO (Sama dengan Landing Page) --- */}
      <section className="landing-hero-bg">
        
        {/* --- PANEL KACA UNTUK LOGIN --- */}
        <div className="glass-panel login-panel">
          <h1 className="glass-title login-title">SELAMAT DATANG DI<br/>KOLABORASA</h1>
          <hr className="glass-divider" />
          
          {error && <div className="glass-error-message">{error}</div>}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group-glass">
              <label>EMAIL</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group-glass">
              <label>PASSWORD</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">REMEMBER ME</label>
            </div>

            <button type="submit" disabled={loading} className="btn-mulai btn-full">
              {loading ? 'PROSES...' : 'MASUK'}
            </button>
            
            {/* Tombol Login Google (Visual/UI Saja) */}
            <button type="button" className="btn-google">
              SIGN WITH GOOGLE 
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" />
            </button>
          </form>

          <p className="auth-link-text">
            Belum memiliki Akun? <Link to="/register">Buat Akun</Link>
          </p>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="footer-section">
        <div className="footer-grid">
          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety information</a></li>
              <li><a href="#">Cancellation options</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Community Blog</a></li>
              <li><a href="#">Terms of service</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Get in touch</a></li>
              <li><a href="#">Partnerships</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Social</h5>
            <div className="footer-socials">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-tiktok"></i></a>
              <a href="#"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Kolaborasa. All rights reserved.</p>
          <div className="footer-payments">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png" alt="PayPal" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;