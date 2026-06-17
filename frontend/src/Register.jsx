import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import footer from './components/Footer';
import './App.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    tanggalLahir: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';
      
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          tanggalLahir: formData.tanggalLahir
        })
      });

      const result = await response.json();

      if (result.status === 'sukses') {
        alert("Akun berhasil dibuat! Silakan login.");
        navigate('/login');
      } else {
        alert(result.pesan || "Registrasi gagal!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Terjadi kesalahan sistem. Pastikan backend berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page-container">
      
      {/* AREA BACKGROUND & FORM */}
      <section className="register-hero-bg">
        <div className="glass-panel register-panel">
          
          <h1 className="glass-title-register">
            SELAMAT DATANG DI<br/>KOLABORASA
          </h1>
          <hr className="glass-divider-register" />
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group-glass">
              <label>NAMA</label>
              <input 
                type="text" 
                name="nama" 
                value={formData.nama}
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group-glass">
              <label>EMAIL</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group-glass">
              <label>PASSWORD</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group-glass">
              <label>HARI/TANGGAL LAHIR</label>
              <input 
                type="date" 
                name="tanggalLahir" 
                value={formData.tanggalLahir}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="register-btn-wrapper">
              <button type="submit" className="btn-mulai btn-buat-akun" disabled={isLoading}>
                {isLoading ? 'MEMPROSES...' : 'BUAT AKUN'}
              </button>
            </div>
          </form>

          <div className="auth-link-text">
            Sudah memiliki Akun? <Link to="/login">Masuk</Link>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Register;