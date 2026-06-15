import { Link } from 'react-router-dom';
import Footer from './components/Footer';
import './App.css';

function Landing() {
  return (
    <div className="landing-page-container">
      {/* --- HERO SECTION DENGAN EFEK KACA --- */}
      <section className="landing-hero-bg">
        <div className="glass-panel">
          <h1 className="glass-title">KOLABORASA</h1>
          <hr className="glass-divider" />
          <p className="glass-subtitle">
            Aplikasi Kolaborasi Ide dan Inovasi Untuk<br />
            Mewujudkan Smart People dan Smart Environment
          </p>
          {/* Tombol Mulai mengarah ke Login atau Home */}
          <Link to="/login" className="btn-mulai">Mulai</Link>
        </div>
      </section>

      {/* --- FOOTER COMPONENT --- */}
      <Footer />
    </div>
  );
}

export default Landing;