import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function News() {
  const navigate = useNavigate();
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  const fetchAspirasi = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ApiIde`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      if (result.status === true) {
        setAspirasi(result.data);
      } else {
        throw new Error(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirasi();
  }, []);

  return (
    <>
      {/* HEADER COMPACT UNTUK HALAMAN NEWS */}
      <section className="compact-header">
        <div className="compact-header-content">
          <h1>News Feed Aspirasi</h1>
          <p>Daftar ide dan inovasi terbaru dari warga untuk kemajuan kota</p>
        </div>
      </section>

      {/* SECTION DAFTAR ASPIRASI */}
      <section className="ide-section" style={{ paddingTop: '60px' }}>
        
        {/* Status Loading & Error */}
        {loading && (
          <div className="status-container">
            <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-blue)' }}></i>
            <p>Memuat data aspirasi...</p>
          </div>
        )}
        
        {error && (
          <div className="status-container error">
            <i className="fa-solid fa-triangle-exclamation fa-2x"></i>
            <p>Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && aspirasi.length === 0 && (
          <div className="status-container empty">
            <i className="fa-regular fa-folder-open fa-2x"></i>
            <p>Belum ada aspirasi yang dikirimkan. Jadilah yang pertama!</p>
          </div>
        )}

        {/* GRID CARD ASPIRASI (Meniru desain "Ide Terbaru") */}
        <div className="ide-grid">
          {!loading && !error && aspirasi.map((item, index) => {
            // Menentukan warna badge berdasarkan status
            const statusLokal = item.status ? item.status.toLowerCase() : 'publish';
            
            // Gambar placeholder berulang agar desain tidak kosong (opsional)
            const placeholderImages = [
              "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
            ];
            const imgSrc = item.gambar ? `${API_URL.replace('/backend/index.php', '')}/backend/uploads/ide/${item.gambar}` : placeholderImages[index % 3];

            return (
              <div key={item.id_ide || index} className="ide-card" onClick={() => navigate(`/ide/${item.id_ide}`)}>
                <div className="image-wrapper">
                  <img src={imgSrc} alt={item.judul || "Ilustrasi Ide"} />
                </div>
                
                <div className="ide-content">
                  <h3>{item.judul}</h3>
                  <p>{item.isi && item.isi.length > 120 ? `${item.isi.substring(0, 120)}...` : item.isi}</p>
                  
                  <div className="ide-footer">
                    <span>❤️ {item.jumlah_like || 0}</span>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/ide/${item.id_ide}`);
                    }}>Detail</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default News;