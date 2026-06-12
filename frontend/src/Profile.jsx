import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Tambahkan import ini
import Navbar from './Navbar';
import './App.css';

function Profile() {
  const navigate = useNavigate(); // Deklarasi navigasi
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [activeTab, setActiveTab] = useState('Inovasi Saya');
  
  const [aspirasiKu, setAspirasiKu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';

  // FUNGSI LOGOUT DIPINDAHKAN KE SINI
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchAspirasiKu = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/Aspirasi`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (result.status === 'sukses') {
          const myIdeas = result.data.filter(item => String(item.id_user) === String(user.id_user));
          myIdeas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setAspirasiKu(myIdeas);
        } else {
          throw new Error(result.pesan || 'Gagal mengambil data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAspirasiKu();
  }, [user, API_URL]);

  if (!user) {
    return (
      <div className="status-container" style={{ height: '100vh' }}>
        <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-blue)' }}></i>
        <p>Memuat profil... Pastikan Anda sudah login.</p>
      </div>
    );
  }

  const placeholderImages = [
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
  ];

  return (
    <>
      <section className="compact-header profile-header-bg">
        <Navbar />
      </section>

      <main className="profile-layout-container">
        
        <aside className="profile-sidebar">
          <button className="sidebar-icon active"><i className="fa-solid fa-square-plus"></i></button>
          <button className="sidebar-icon"><i className="fa-regular fa-message"></i></button>
          <button className="sidebar-icon"><i className="fa-solid fa-gear"></i></button>
          <button className="sidebar-icon user-icon"><i className="fa-solid fa-circle-user"></i></button>
        </aside>

        <section className="profile-card-wrapper">
          <div className="profile-main-card">
            
            <div className="profile-avatar-container">
              <img 
                src={user.foto || `https://ui-avatars.com/api/?name=${user.nama}&background=random&size=150`} 
                alt="Avatar" 
                className="profile-avatar-img"
              />
            </div>

            <h3 className="profile-name">{user.nama}</h3>
            <p className="profile-role">Mahasiswa</p>
            <p className="profile-location">
              <i className="fa-solid fa-location-dot"></i> Bandung, Indonesia
            </p>

            <div className="profile-stats">
              <div className="stat-box">
                <h4>{loading ? '...' : aspirasiKu.length}</h4>
                <span>Ide</span>
              </div>
              <div className="stat-box">
                <h4>37K</h4>
                <span>likes</span>
              </div>
              <div className="stat-box">
                <h4>67</h4>
                <span>following</span>
              </div>
            </div>

            {/* TOMBOL LOGOUT BARU */}
            <button onClick={handleLogout} className="btn-logout-profile">
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>

            <div className="profile-card-decoration">
              <div className="decor-yellow"></div>
              <div className="decor-blue"></div>
            </div>

          </div>
        </section>

        <section className="profile-content-area">
          <div className="profile-tabs">
            <button 
              className={activeTab === 'Inovasi Saya' ? 'active' : ''} 
              onClick={() => setActiveTab('Inovasi Saya')}
            >
              Inovasi Saya
            </button>
            <button 
              className={activeTab === 'Likes' ? 'active' : ''} 
              onClick={() => setActiveTab('Likes')}
            >
              Likes
            </button>
          </div>

          <div className="profile-post-grid">
            {activeTab === 'Inovasi Saya' ? (
              loading ? (
                <div className="status-container" style={{ gridColumn: 'span 2' }}>
                  <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                  <p>Memuat inovasi Anda...</p>
                </div>
              ) : error ? (
                <div className="status-container error" style={{ gridColumn: 'span 2' }}>
                  <p>Error: {error}</p>
                </div>
              ) : aspirasiKu.length > 0 ? (
                aspirasiKu.map((item, index) => (
                  <div key={item.id_ide || index} className="profile-post-card">
                    <img src={placeholderImages[index % 3]} alt={item.judul_ide} />
                    <div className="profile-post-body">
                      <span className="post-date">
                        <i className="fa-regular fa-calendar"></i> 
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </span>
                      <h4>{item.judul_ide}</h4>
                      <p>{item.deskripsi.length > 100 ? `${item.deskripsi.substring(0, 100)}...` : item.deskripsi}</p>
                      <span className={`status-badge ${item.status_progress ? item.status_progress.toLowerCase() : 'menunggu'}`} style={{ display: 'inline-block', marginTop: '15px' }}>
                        {item.status_progress || 'Menunggu'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="status-container empty" style={{ gridColumn: 'span 2' }}>
                  <i className="fa-regular fa-lightbulb fa-2x"></i>
                  <p>Anda belum mengirimkan inovasi. Yuk bagikan ide cerdas Anda!</p>
                </div>
              )
            ) : (
              <div className="status-container empty" style={{ gridColumn: 'span 2' }}>
                <i className="fa-regular fa-heart fa-2x"></i>
                <p>Belum ada postingan yang disukai.</p>
              </div>
            )}
          </div>
          
        </section>
      </main>

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

export default Profile;