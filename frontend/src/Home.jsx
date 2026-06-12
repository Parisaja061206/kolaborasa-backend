import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './App.css';

function Home() {
  // 1. STATE UNTUK SLIDER
  const [currentIndex, setCurrentIndex] = useState(0);

  // Data Dummy untuk Ide Terbaru (Dibuat lebih dari 3 agar bisa digeser)
  const ideTerbaruData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop",
      date: "February 20, 2024",
      title: "Drone Pintar untuk Pemantauan Kota dalam Konsep Smart City",
      desc: "Dalam kegiatan pengembangan ide Smart City, masyarakat mengusulkan pemanfaatan drone pintar sebagai solusi..."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
      date: "February 21, 2024",
      title: "Ide Smart Parking untuk Mengurangi Kemacetan",
      desc: "Dalam upaya mendukung pengembangan Smart City, masyarakat mencetuskan ide Smart Parking System yang terintegrasi."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
      date: "February 22, 2024",
      title: "Robot Jadi Ide Inovatif untuk Mendukung Smart City",
      desc: "Memperkenalkan gagasan penggunaan robot kebersihan otomatis sebagai bagian dari konsep Smart City ramah lingkungan."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
      date: "February 25, 2024",
      title: "Aplikasi Pelaporan Fasilitas Umum Berbasis AI",
      desc: "Inovasi untuk memudahkan warga melaporkan jalan berlubang atau lampu mati hanya dengan memotret menggunakan AI."
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop",
      date: "March 01, 2024",
      title: "Manajemen Sampah Terpadu dengan Sensor IoT",
      desc: "Penggunaan sensor pada tempat sampah umum untuk mendeteksi kapasitas dan mengoptimalkan rute truk sampah."
    }
  ];

  // 2. FUNGSI GESER SLIDER
  const maxIndex = ideTerbaruData.length - 3; // Menampilkan 3 card sekaligus

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Gaya Inline untuk Hero Background
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
                <span>Add destination</span>
              </div>
            </div>
            <div className="search-item">
              <i className="fa-regular fa-lightbulb search-icon"></i>
              <div className="search-text">
                <label>Total Ide</label>
                <span>Add dates</span>
              </div>
            </div>
            <div className="search-item no-border">
              <i className="fa-regular fa-file-lines search-icon"></i>
              <div className="search-text">
                <label>Draft Ide</label>
                <span>Add dates</span>
              </div>
            </div>
            <button className="btn-search-circle">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </section>

      {/* INOVASI SECTION */}
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

      {/* ================= IDE TERBARU SECTION (INTERAKTIF) ================= */}
      <section className="ide-section">
        <div className="ide-header">
          {/* Judul dipastikan warnanya gelap */}
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

        {/* Pembungkus Slider (Menyembunyikan card yang keluar batas) */}
        <div className="ide-slider-container">
          {/* Track yang akan bergeser */}
          <div 
            className="ide-track" 
            style={{ transform: `translateX(calc(-${currentIndex} * (100% / 3 + 10px)))` }}
          >
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
          {/* Titik indikator dibuat dinamis */}
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

      {/* ================= FOOTER ================= */}
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

export default Home;