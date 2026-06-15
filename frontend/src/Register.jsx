import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirm_password) {
      setError('Password dan Konfirmasi Password tidak cocok!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      if (result.status === 'sukses') {
        alert('Registrasi berhasil! Silakan login.')
        navigate('/login')
      } else {
        setError(result.pesan || 'Registrasi gagal!')
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Daftar Akun Baru</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="Masukkan Email Anda"
              required 
            />
          </div>
          <div className="form-group">
            <label>Nama Lengkap:</label>
            <input 
              type="text" 
              name="nama"
              value={formData.nama} 
              onChange={handleChange}
              placeholder="Nama Anda"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password:</label>
            <input 
              type="password" 
              name="confirm_password"
              value={formData.confirm_password} 
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn auth-btn">
            {loading ? 'Proses...' : 'Daftar'}
          </button>
        </form>
        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  )
}

export default Register