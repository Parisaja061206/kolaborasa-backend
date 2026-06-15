import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function Home() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  // --- STATE DASHBOARD & SLIDER ---
  const [stats, setStats] = useState({ totalIde: 0, draftIde: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- STATE UNTUK MODAL PENAMBAHAN IDE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ judul: '', teks: '' });
  const [submitting, setSubmitting] = useState(false);

  // --- FUNGSI MENGAMBIL STATISTIK DARI BACKEND ---
  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/Aspirasi/user_stats/${user.id_user}`);
      const result = await response.json();
      if (result.status === 'sukses') {
        setStats({
          totalIde: result.data.total_ide,
          draftIde: result.data.draft_ide
        });
      }
    } catch (err) {
      console.error("Gagal mengambil statistik pengguna:", err);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [user, API_URL]);

  // --- FUNGSI MENGIRIM IDE (DRAFT / PUBLISH) ---
  const handleSubmit = async (status) => {
    if (!formData.judul || !formData.teks) {
      alert("Harap isi Judul dan Teks ide Anda!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/Aspirasi/tambah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: user.id_user,
          judul_ide: formData.judul,
          deskripsi: formData.teks,
          status_progress: status // Akan berisi 'Draft' atau 'Menunggu'
        })
      });

      const result = await response.json();
      if (result.status === 'sukses') {
        alert(status === 'Draft' ? "Ide berhasil disimpan ke Draft!" : "Ide Berhasil diunggah!");
        setIsModalOpen(false); // Tutup modal
        setFormData({ judul: '', teks: '' }); // Kosongkan form
        fetchUserStats(); // Refresh angka statistik di dashboard tanpa perlu reload halaman
      } else {
        alert(result.pesan || "Terjadi kesalahan saat menyimpan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Fungsi saat tombol tambah (+) ditekan
  const handleAddIdea = () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      navigate('/login');
      return;
    }
    setIsModalOpen(true); 
  };

  // Data Slider 
  const ideTerbaruData = [
    
  ];

  const maxIndex = ideTerbaruData.length - 3;
  const nextSlide = () => { if (currentIndex < maxIndex) setCurrentIndex(currentIndex + 1); };
  const prevSlide = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const heroStyle = {
    position: 'relative',
    height: '85vh',
    background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#32397C'
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section style={heroStyle}>
        <Navbar />
        <div className="hero-floating-card">
          <div className="card-header">
            <h1>Selamat Datang di <span>Kolaborasa</span></h1>
            <p>Bagikan ide mu untuk memajukan kota mu</p>
          </div>
          
          {/* AREA SUMMARY DASHBOARD */}
          <div className="hero-search-bar">
            
            {/* 1. Menampilkan Lokasi Pengguna */}
            <div className="search-item">
              <i className="fa-solid fa-location-dot search-icon"></i>
              <div className="search-text">
                <label>Location</label>
                <span>{user?.lokasi || 'Bandung, Indonesia'}</span>
              </div>
            </div>
            
            {/* 2. Menampilkan Total Ide */}
            <div className="search-item">
              <i className="fa-regular fa-lightbulb search-icon"></i>
              <div className="search-text">
                <label>Total Ide</label>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{stats.totalIde} Ide</span>
              </div>
            </div>
            
            {/* 3. Menampilkan Total Draft */}
            <div className="search-item no-border">
              <i className="fa-regular fa-file-lines search-icon"></i>
              <div className="search-text">
                <label>Draft Ide</label>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{stats.draftIde} Draft</span>
              </div>
            </div>
            
            {/* 4. Tombol Ikon Tambah (+) */}
            <button className="btn-search-circle" onClick={handleAddIdea} title="Buat Ide Baru">
              <i className="fa-solid fa-plus"></i>
            </button>
            
          </div>
        </div>
      </section>

      {/* ================= INOVASI SECTION ================= */}
      <section className="inovasi-section">
        <h2 className="section-title-white">INOVASI TERBARU</h2>
        <div className="inovasi-container">
          <div className="inovasi-content">
            <h3>Berbagai Ide Inovatif untuk Mewujudkan Smart City</h3>
            <p><strong>Banjar, 9 Juni 2025</strong> – Sejumlah mahasiswa dari berbagai program studi menggelar diskusi dan sesi brainstorming untuk menuangkan ide-ide inovatif yang dapat mendorong pengembangan konsep Smart City di Indonesia. Kegiatan ini bertujuan menghasilkan solusi kreatif yang mampu menjawab berbagai tantangan perkotaan, mulai dari kemacetan, pengelolaan sampah, hingga pelayanan publik.</p>
          </div>
          <div className="inovasi-image-wrapper">
            <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000&auto=format&fit=crop" alt="Smart City" />
          </div>
        </div>
        <button className="btn-yellow">Lihat Semua <i className="fa-solid fa-arrow-right"></i></button>
      </section>

      {/* ================= IDE TERBARU SECTION ================= */}
      <section className="ide-section">
        <div className="ide-header">
          <h2 className="ide-title-dark">Ide Terbaru</h2>
          <div className="ide-nav-buttons">
            <button onClick={prevSlide} disabled={currentIndex === 0} className={currentIndex === 0 ? 'disabled' : ''}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button onClick={nextSlide} disabled={currentIndex >= maxIndex} className={currentIndex >= maxIndex ? 'disabled' : ''}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="ide-slider-container">
          <div className="ide-track" style={{ transform: `translateX(calc(-${currentIndex} * (100% / 3 + 10px)))` }}>
            {ideTerbaruData.map((item) => (
              <div className="ide-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="ide-card-body">
                  <span className="ide-date"><i className="fa-regular fa-calendar"></i> {item.date}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  <a href="#" className="ide-link"><i className="fa-solid fa-angle-right"></i> See more</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ide-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <span 
              key={idx} 
              className={`dot ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              style={{cursor: 'pointer'}}
            ></span>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;