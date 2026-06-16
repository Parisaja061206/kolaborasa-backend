import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function Profile() {
  const navigate = useNavigate(); 
  
  // 1. MENGAMBIL DATA SESI USER
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // 2. STATE MANAJEMEN
  const [activeTab, setActiveTab] = useState('Draft'); // Default tab
  const [aspirasiKu, setAspirasiKu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';
  const BASE_URL = API_URL.replace('/backend/index.php', '');

  // Fungsi untuk mendapatkan URL avatar yang benar
  const getProfileImageUrl = () => {
    if (user?.foto) {
      if (user.foto.startsWith('http')) return user.foto;
      return `${BASE_URL}/backend/uploads/profil/${user.foto}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.nama || 'User'}&background=random&size=150`;
  };

  // 3. FUNGSI NAVIGASI INTERAKTIF
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleToMessages = () => navigate('/messages'); // Arahkan ke Room Chat
  const handleToSettings = () => navigate('/settings'); // Arahkan ke Edit Profil
  const handleToHome = () => navigate('/home'); // Tambahan navigasi ke Beranda/Form

  // 4. FETCHING DATA DARI BACKEND
  useEffect(() => {
    const fetchAspirasiKu = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // PERBAIKAN 1: Sesuaikan endpoint routing CodeIgniter (biasanya tanpa .php di akhir controller)
        // Pastikan apakah URL-nya /ApiIde, /apiide, atau /index.php/ApiIde tergantung setup .htaccess kamu
        const response = await fetch(`${API_URL}/ApiIde`); 
        
        if (!response.ok) throw new Error('Gagal terhubung ke server');
        
        const result = await response.json();
        
        // PERBAIKAN 2: Backend mengirimkan boolean `true`, bukan string 'sukses'
        if (result.status === true) { 
          
          const myIdeas = result.data.filter(item => String(item.id_user) === String(user.id_user));
          
          // PERBAIKAN 3: Pastikan field tanggal dari database sesuai (asumsi 'created_at')
          myIdeas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setAspirasiKu(myIdeas);
          
        } else {
          throw new Error(result.message || 'Gagal mengambil data dari server');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAspirasiKu();
  }, [user?.id_user, API_URL]);

  // Jika user belum login, tampilkan layar loading
  if (!user) {
    return (
      <div className="status-container" style={{ height: '100vh', backgroundColor: 'var(--bg-light)' }}>
        <i className="fa-solid fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-blue)' }}></i>
        <p>Memuat profil... Pastikan Anda sudah login.</p>
      </div>
    );
  }

  // 5. LOGIKA FILTER & KALKULASI DATA
  // Ide yang masih draf (belum dipublikasi)
  const draftIdeas = aspirasiKu.filter(item => 
    item.status && item.status.toLowerCase() === 'draft'
  );
  
  // Ide yang sudah dipublikasi ke publik
  const publishedIdeas = aspirasiKu.filter(item => 
    !item.status || item.status.toLowerCase() !== 'draft'
  );

  // Kalkulasi Total Likes HANYA dari ide yang sudah dipublikasi
  const totalLikes = publishedIdeas.reduce((sum, item) => {
    return sum + (parseInt(item.jumlah_like) || 0);
  }, 0);

  // Format angka agar lebih rapi (misal: 1200 -> 1.2K)
  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  // Gambar Placeholder untuk Draft
  const placeholderImages = [
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
  ];

  // Data Dummy untuk Tab Likes (Menunggu API 'Like' dari Backend)
  const likedPosts = [
    
  ];

  return (
    <div className="profile-page-wrapper" style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh' }}>
      
      {/* HEADER ATAS */}
      <section className="compact-header profile-header-bg">
        <Navbar />
      </section>

      {/* LAYOUT UTAMA PROFIL */}
      <main className="profile-layout-container">
        
        {/* SIDEBAR NAVIGASI KIRI */}
        <aside className="profile-sidebar">
          <button className="sidebar-icon" onClick={handleToHome} title="Tambah Ide Baru">
            <i className="fa-solid fa-square-plus"></i>
          </button>
          <button className="sidebar-icon" onClick={handleToMessages} title="Pesan / Chat">
            <i className="fa-regular fa-message"></i>
          </button>
          <button className="sidebar-icon" onClick={handleToSettings} title="Pengaturan Biodata">
            <i className="fa-solid fa-gear"></i>
          </button>
          {/* Class 'active' dipindahkan ke ikon profil */}
          <button className="sidebar-icon user-icon active" title="Profil Saya">
            <i className="fa-solid fa-circle-user"></i>
          </button>
        </aside>

        {/* PROFIL CARD TENGAH (BIODATA & STATISTIK) */}
        <section className="profile-card-wrapper">
          <div className="profile-main-card">
            
            {/* Avatar */}
            <div className="profile-avatar-container">
              <img 
                src={getProfileImageUrl()} 
                alt="Avatar" 
                className="profile-avatar-img"
              />
            </div>

            {/* Identitas */}
            <h3 className="profile-name">{user.nama}</h3>
            <p className="profile-location">
              <i className="fa-solid fa-location-dot"></i> Bandung, Indonesia
            </p>

            {/* Statistik Dinamis */}
            <div className="profile-stats">
              <div className="stat-box">
                <h4>{loading ? '...' : formatNumber(publishedIdeas.length)}</h4>
                <span>Ide Publik</span>
              </div>
              <div className="stat-box">
                <h4>{loading ? '...' : formatNumber(totalLikes)}</h4>
                <span>likes</span>
              </div>
              <div className="stat-box">
                <h4>67</h4>
                <span>following</span>
              </div>
            </div>

            {/* Tombol Logout */}
            <button onClick={handleLogout} className="btn-logout-profile">
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>

            {/* Dekorasi Visual */}
            <div className="profile-card-decoration">
              <div className="decor-yellow"></div>
              <div className="decor-blue"></div>
            </div>

          </div>
        </section>

        {/* KONTEN AREA KANAN (TABS & POSTINGAN) */}
        <section className="profile-content-area">
          
          {/* Navigasi Tab */}
          <div className="profile-tabs">
            <button 
              className={activeTab === 'Draft' ? 'active' : ''} 
              onClick={() => setActiveTab('Draft')}
            >
              Draft <span style={{fontSize: '12px', color: '#888'}}>({loading ? 0 : draftIdeas.length})</span>
            </button>
            <button 
              className={activeTab === 'Likes' ? 'active' : ''} 
              onClick={() => setActiveTab('Likes')}
            >
              Likes
            </button>
          </div>

          {/* Grid Postingan Dinamis */}
          <div className="profile-post-grid">
            
            {activeTab === 'Draft' ? (
              
              // ================= TAB DRAFT =================
              loading ? (
                <div className="status-container" style={{ gridColumn: 'span 2' }}>
                  <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                  <p>Memuat draft Anda...</p>
                </div>
              ) : error ? (
                <div className="status-container error" style={{ gridColumn: 'span 2' }}>
                  <p>Error: {error}</p>
                </div>
              ) : draftIdeas.length > 0 ? (
                draftIdeas.map((item, index) => (
                  <div key={item.id_ide || index} className="profile-post-card">
                    <img src={item.gambar ? `${API_URL.replace('/backend/index.php', '')}/backend/uploads/ide/${item.gambar}` : placeholderImages[index % 3]} alt={item.judul} />
                    <div className="profile-post-body">
                      <span className="post-date">
                        <i className="fa-regular fa-calendar"></i> 
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </span>
                      <h4>{item.judul}</h4>
                      <p>{item.isi && item.isi.length > 100 ? `${item.isi.substring(0, 100)}...` : item.isi}</p>
                      
                      {/* Badge DRAFT di pojok bawah */}
                      <span className="status-badge" style={{ backgroundColor: '#e2e3e5', color: '#383d41' }}>
                        DRAFT
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="status-container empty" style={{ gridColumn: 'span 2' }}>
                  <i className="fa-regular fa-file-lines fa-2x"></i>
                  <p>Anda belum memiliki ide yang tersimpan sebagai draft.</p>
                </div>
              )
              
            ) : (
              
              // ================= TAB LIKES =================
              likedPosts.length > 0 ? (
                likedPosts.map((item, index) => (
                  <div key={item.id_ide || index} className="profile-post-card">
                    <img src={item.gambar ? `${API_URL.replace('/backend/index.php', '')}/backend/uploads/ide/${item.gambar}` : item.image || placeholderImages[index % 3]} alt={item.judul} />
                    <div className="profile-post-body">
                      <span className="post-date">
                        <i className="fa-regular fa-calendar"></i> 
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                      </span>
                      <h4>{item.judul}</h4>
                      <p>{item.isi && item.isi.length > 100 ? `${item.isi.substring(0, 100)}...` : item.isi}</p>
                      
                      <div className="card-meta-bottom" style={{ borderTop: 'none', paddingTop: '0' }}>
                        <span className={`status-badge ${item.status ? item.status.toLowerCase() : ''}`}>
                          {item.status}
                        </span>
                        <i className="fa-solid fa-heart" style={{ color: '#EA4335', fontSize: '18px' }}></i>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="status-container empty" style={{ gridColumn: 'span 2' }}>
                  <i className="fa-regular fa-heart fa-2x"></i>
                  <p>Belum ada postingan yang disukai.</p>
                </div>
              )
              
            )}
          </div>
          
        </section>
      </main>
    </div>
  );
}

export default Profile;