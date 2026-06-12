import { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Pastikan Navbar di-import
import './App.css';

function News() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  const fetchAspirasi = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Aspirasi`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      if (result.status === 'sukses') {
        setAspirasi(result.data);
      } else {
        throw new Error(result.pesan || 'Gagal mengambil data');
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
        <Navbar />
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
            const statusLokal = item.status_progress ? item.status_progress.toLowerCase() : 'menunggu';
            
            // Gambar placeholder berulang agar desain tidak kosong (opsional)
            const placeholderImages = [
              "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
            ];
            const imgSrc = placeholderImages[index % 3];

            return (
              <div key={item.id_ide || index} className="ide-card">
                {/* Gambar Thumbnail */}
                <img src={imgSrc} alt="Ilustrasi Ide" />
                
                <div className="ide-card-body">
                  {/* Bagian Meta Atas (Tanggal & Badge) */}
                  <div className="card-meta-top">
                    <span className="ide-date">
                      <i className="fa-regular fa-calendar"></i> 
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal tidak tersedia'}
                    </span>
                    <span className={`status-badge ${statusLokal}`}>
                      {item.status_progress || 'Menunggu'}
                    </span>
                  </div>

                  {/* Konten Utama */}
                  <h4>{item.judul_ide}</h4>
                  <p>{item.deskripsi}</p>
                  
                  {/* Bagian Meta Bawah (Author & Votes) */}
                  <div className="card-meta-bottom">
                    <span className="author">
                      <i className="fa-regular fa-user"></i> {item.nama || `Warga (ID: ${item.id_user})`}
                    </span>
                    <div className="votes">
                      <span className="vote-item like">
                        <i className="fa-regular fa-thumbs-up"></i> {item.jumlah_like || 0}
                      </span>
                      <span className="vote-item dislike">
                        <i className="fa-regular fa-thumbs-down"></i> {item.jumlah_dislike || 0}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
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
  );
}

export default News;