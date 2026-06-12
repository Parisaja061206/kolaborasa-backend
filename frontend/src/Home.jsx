import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function Home() {
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!judul || !deskripsi) {
      alert('Judul dan deskripsi harus diisi!')
      return
    }

    setSubmitting(true)
    try {
      if (!user) {
        alert('Anda harus login terlebih dahulu!');
        setSubmitting(false);
        return;
      }

      const payload = {
        id_user: user.id_user, 
        judul_ide: judul,
        deskripsi: deskripsi
      }

      const response = await fetch(`${API_URL}/Aspirasi/tambah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.status === 'sukses') {
        alert('Aspirasi berhasil dikirim!')
        setJudul('')
        setDeskripsi('')
        navigate('/news')
      } else {
        alert(result.pesan || 'Gagal mengirim aspirasi')
      }
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* --- 1. HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-floating-card">
          <div className="card-header">
            {/* Dinamis menyapa user jika ada namanya */}
            <h1>Selamat Datang di <span>Kolaborasa</span>{user?.nama ? `, ${user.nama}` : ''}</h1>
            <p>Bagikan ide mu untuk memajukan kota mu</p>
          </div>

          <form onSubmit={handleSubmit} className="hero-form">
            <div className="form-item">
              <i className="fa-solid fa-location-dot form-icon"></i>
              <div className="form-text">
                <label htmlFor="judul">Judul Ide</label>
                <input 
                  type="text" 
                  id="judul"
                  value={judul} 
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Ketik judul inovasi..."
                  required
                />
              </div>
            </div>

            <div className="form-item">
              <i className="fa-regular fa-lightbulb form-icon"></i>
              <div className="form-text">
                <label htmlFor="deskripsi">Deskripsi Ide</label>
                <input 
                  type="text" 
                  id="deskripsi"
                  value={deskripsi} 
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Detail singkat ide..."
                  required
                />
              </div>
            </div>

            <div className="form-item no-border">
              <i className="fa-regular fa-file-lines form-icon"></i>
              <div className="form-text">
                <label>Status</label>
                <span className="placeholder-text">Aspirasi Baru</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-search">
              {submitting ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-magnifying-glass"></i>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* --- 2. INOVASI TERBARU SECTION --- */}
      <section className="inovasi-section">
        <h2 className="section-title-white">INOVASI TERBARU</h2>
        <div className="inovasi-container">
          <div className="inovasi-content">
            <h3>Berbagai Ide Inovatif untuk Mewujudkan Smart City</h3>
            <p>
              <strong>Banjar, 9 Juni 2025</strong> – Sejumlah mahasiswa dari berbagai program studi menggelar diskusi dan sesi brainstorming untuk menuangkan ide-ide inovatif yang dapat mendorong pengembangan konsep Smart City di Indonesia. Kegiatan ini bertujuan menghasilkan solusi kreatif yang mampu menjawab berbagai tantangan perkotaan, mulai dari kemacetan, pengelolaan sampah, hingga pelayanan publik.
            </p>
          </div>
          <div className="inovasi-image-wrapper">
            <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000&auto=format&fit=crop" alt="Smart City" />
          </div>
        </div>
        <button className="btn-yellow">Lihat Semua <i className="fa-solid fa-arrow-right"></i></button>
      </section>

      {/* --- 3. IDE TERBARU SECTION --- */}
      <section className="ide-section">
        <div className="ide-header">
          <h2>Ide Terbaru</h2>
          <div className="ide-nav">
            <button><i className="fa-solid fa-chevron-left"></i></button>
            <button><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>

        <div className="ide-grid">
          <div className="ide-card">
            <img src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop" alt="Drone Pintar" />
            <div className="ide-card-body">
              <span className="ide-date"><i className="fa-regular fa-calendar"></i> February 20, 2024</span>
              <h4>Drone Pintar untuk Pemantauan Kota dalam Konsep Smart City</h4>
              <p>Dalam kegiatan pengembangan ide Smart City, masyarakat mengusulkan pemanfaatan drone pintar sebagai solusi untuk meningkatkan efisiensi pemantauan kondisi perkotaan.</p>
              <a href="#" className="ide-link"><i className="fa-solid fa-chevron-right"></i> See more</a>
            </div>
          </div>

          <div className="ide-card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" alt="Smart Parking" />
            <div className="ide-card-body">
              <span className="ide-date"><i className="fa-regular fa-calendar"></i> February 20, 2024</span>
              <h4>Ide Smart Parking untuk Mengurangi Kemacetan</h4>
              <p>Dalam upaya mendukung pengembangan Smart City, masyarakat mencetuskan ide Smart Parking System.</p>
              <a href="#" className="ide-link"><i className="fa-solid fa-chevron-right"></i> See more</a>
            </div>
          </div>

          <div className="ide-card">
            <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop" alt="Robot Inovatif" />
            <div className="ide-card-body">
              <span className="ide-date"><i className="fa-regular fa-calendar"></i> February 20, 2024</span>
              <h4>Robot Jadi Ide Inovatif untuk Mendukung Smart City</h4>
              <p>Memperkenalkan gagasan penggunaan robot kebersihan otomatis sebagai bagian dari konsep Smart City.</p>
              <a href="#" className="ide-link"><i className="fa-solid fa-chevron-right"></i> See more</a>
            </div>
          </div>
        </div>

        <div className="ide-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* --- 4. FOOTER --- */}
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
          <p>© Copyright Asanda 2024</p>
          <div className="footer-payments">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png" alt="PayPal" />
          </div>
        </div>
      </footer>
    </>
  )
}

export default Home;