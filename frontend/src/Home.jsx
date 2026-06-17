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
  const [stats, setStats] = useState({ totalIde: 0 });
  const [ideTerbaruData, setIdeTerbaruData] = useState([]);

  // --- FUNGSI MENGAMBIL STATISTIK DARI BACKEND ---
  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/ApiIde`);
      const result = await response.json();
      if (result.status === true) {
        const myIdeas = result.data.filter(item => String(item.id_user) === String(user.id_user));
        const totalIde = myIdeas.length;
        setStats({ totalIde });
      }
    } catch (err) {
      console.error("Gagal mengambil statistik pengguna:", err);
    }
  };

  const fetchIdeTerbaru = async () => {
    try {
      const response = await fetch(`${API_URL}/ApiIde`);
      const result = await response.json();
      if (result.status === true) {
        const latestIdeas = result.data
          .filter(item => item.status && item.status.toLowerCase() === 'publish')
          .sort((a, b) => b.id_ide - a.id_ide)
          .slice(0, 3);
        
        setIdeTerbaruData(latestIdeas);
      }
    } catch (err) {
      console.error("Gagal mengambil ide terbaru:", err);
    }
  };

  useEffect(() => {
    fetchUserStats();
    fetchIdeTerbaru();
  }, [user, API_URL]);

  const handleAddIdea = () => {
    if (!user) {
      alert("Anda harus login terlebih dahulu!");
      navigate('/login');
      return;
    }
    navigate('/ide/tambah');
  };

  const heroStyle = {
    position: 'relative',
    height: '85vh',
    background: `linear-gradient(rgba(26, 32, 73, 0.7), rgba(26, 32, 73, 0.4)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop')`,
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
          
          <div className="hero-search-bar">
            <div className="search-item">
              <i className="fa-solid fa-location-dot search-icon"></i>
              <div className="search-text">
                <label>Location</label>
                <span>{user?.lokasi || 'Bandung, Indonesia'}</span>
              </div>
            </div>
            
            <div className="search-item no-border">
              <i className="fa-regular fa-lightbulb search-icon"></i>
              <div className="search-text">
                <label>Total Ide</label>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{stats.totalIde} Ide</span>
              </div>
            </div>
            
            <button className="btn-search-circle" onClick={handleAddIdea} title="Buat Ide Baru">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ================= IDE TERBARU SECTION ================= */}
      <section className="ide-section">
        <div className="ide-header">
          <h2 className="ide-title-dark">Ide Terbaru</h2>
        </div>

        <div className="ide-slider-container">
          <div className="ide-track">
            {ideTerbaruData.length > 0 ? (
              ideTerbaruData.map((item) => (
                <div className="ide-card" key={item.id_ide} onClick={() => navigate(`/ide/${item.id_ide}`)}>
                  <div className="image-wrapper">
                    <img 
                      src={item.gambar ? `${API_URL.replace('/index.php', '')}/uploads/ide/${item.gambar}` : "https://via.placeholder.com/400x250"} 
                      alt={item.judul} 
                    />
                  </div>
                  <div className="ide-content">
                    <h3>{item.judul}</h3>
                    <p>{item.isi?.substring(0, 120)}...</p>
                    <div className="ide-footer">
                      <span>❤️ {item.jumlah_like || 0}</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ide/${item.id_ide}`);
                      }}>Detail</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px', color: 'gray' }}>Belum ada ide terbaru.</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= FOOTER SECTION ================= */}
      <Footer />
    </>
  );
}

export default Home;