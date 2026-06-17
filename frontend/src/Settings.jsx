import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Pastikan path ini benar sesuai struktur folder Anda
import './App.css';

function EditProfile() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // State untuk form
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    password: '', // Biasanya password tidak ditampilkan
    tanggal_lahir: user?.tanggal_lahir || ''
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/kolaborasa-backend/backend/index.php';
  const BASE_URL = API_URL.replace('/backend/index.php', '');

  // Menentukan URL foto profil yang aktif
  const getProfileImageUrl = () => {
    if (previewURL) return previewURL;
    if (user?.foto) {
      // Jika string URL penuh
      if (user.foto.startsWith('http')) return user.foto;
      return `${BASE_URL}/backend/uploads/profil/${user.foto}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.nama || 'User'}&background=random&size=200`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append('id_user', user.id_user);
      dataToSend.append('nama', formData.nama);
      dataToSend.append('email', formData.email);
      dataToSend.append('tanggal_lahir', formData.tanggal_lahir);
      if (formData.password) {
        dataToSend.append('password', formData.password);
      }
      if (fotoFile) {
        dataToSend.append('foto', fotoFile);
      }

      const response = await fetch(`${API_URL}/Auth/updateProfile`, {
        method: 'POST',
        body: dataToSend,
        // Jangan set Content-Type header jika pakai FormData, biarkan browser yang atur boundary-nya.
      });

      const result = await response.json();
      if (response.ok && result.status === 'sukses') {
        alert('Profil berhasil diperbarui!');
        // Update user in local storage
        localStorage.setItem('user', JSON.stringify({ ...user, ...result.user }));
        // Pindah kembali ke halaman profil setelah update sukses
        navigate('/profile');
      } else {
        alert(result.pesan || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat menghubungi server');
    }
  };

  // Navigasi Sidebar
  const handleToHome = () => navigate('/home');
  const handleToMessages = () => navigate('/messages');
  const handleToProfile = () => navigate('/profile');

  return (
    <div className="edit-profile-page">
      
      {/* HEADER BACKGROUND (Menyesuaikan dengan gambar header kota) */}
      <section className="compact-header profile-header-bg" style={{ height: '35vh' }}>
        <Navbar />
      </section>

      {/* LAYOUT UTAMA */}
      <main className="profile-layout-container">
        
        {/* SIDEBAR NAVIGASI KIRI */}
        <aside className="profile-sidebar" style={{ marginTop: '30px' }}>
          <button className="sidebar-icon" onClick={handleToHome} title="Tambah Ide Baru">
            <i className="fa-solid fa-square-plus"></i>
          </button>
          <button className="sidebar-icon" onClick={handleToMessages} title="Pesan / Chat">
            <i className="fa-regular fa-message"></i>
          </button>
          {/* Class 'active' diletakkan di ikon gear */}
          <button className="sidebar-icon active" title="Pengaturan Biodata">
            <i className="fa-solid fa-gear"></i>
          </button>
          <button className="sidebar-icon user-icon" onClick={handleToProfile} title="Profil Saya">
            <i className="fa-solid fa-circle-user"></i>
          </button>
        </aside>

        {/* AREA FORM TENGAH (CARD BESAR) */}
        <section className="edit-profile-card-wrapper">
          <div className="edit-profile-main-card">
            
            {/* AVATAR DENGAN TOMBOL PLUS */}
            <div className="edit-profile-avatar-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src={getProfileImageUrl()} 
                  alt="Avatar" 
                  className="edit-profile-avatar-img"
                />
                <label 
                  htmlFor="upload-photo" 
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '10px',
                    backgroundColor: '#0A2640',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '3px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  title="Ganti Foto Profil"
                >
                  <i className="fa-solid fa-plus"></i>
                </label>
                <input 
                  id="upload-photo"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* FORM INPUT */}
            <form className="edit-profile-form" onSubmit={handleSave}>
              
              <div className="form-group-edit">
                <label>NAMA</label>
                <input 
                  type="text" 
                  name="nama" 
                  value={formData.nama} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group-edit">
                <label>EMAIL</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group-edit">
                <label>PASSWORD</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>

              <div className="form-group-edit">
                <label>HARI/TANGGAL LAHIR</label>
                <input 
                  type="date" 
                  name="tanggal_lahir" 
                  value={formData.tanggal_lahir} 
                  onChange={handleChange} 
                />
              </div>

              {/* ACTION BUTTONS (SIMPAN & BATAL) */}
              <div className="edit-profile-actions">
                <button 
                  type="button" 
                  className="btn-batal" 
                  onClick={() => navigate('/profile')}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-simpan"
                >
                  Simpan
                </button>
              </div>

            </form>

          </div>
        </section>
        
        {/* Kolom kosong di kanan untuk menyeimbangkan layout grid */}
        <div style={{ flex: 1 }}></div>
      </main>

      {/* Menambahkan Komponen Footer yang di-import */}
      <Footer />

    </div>
  );
}

export default EditProfile;