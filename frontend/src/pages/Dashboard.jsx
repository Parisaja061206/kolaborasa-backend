import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost/kolaborasa-backend/backend/index.php";
  
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [myIde, setMyIde] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyIde();
  }, []);

  const fetchMyIde = async () => {
    try {
      const response = await fetch(`${API_URL}/ApiIde/user/${user.id_user}`);
      const result = await response.json();
      if (result.status) {
        setMyIde(result.data);
      }
    } catch (error) {
      console.error("Error fetching user ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ide ini?")) {
      try {
        const response = await fetch(`${API_URL}/ApiIde/hapus/${id}`, {
          method: "POST",
        });
        const result = await response.json();
        if (result.status) {
          alert("Ide berhasil dihapus");
          fetchMyIde();
        }
      } catch (error) {
        console.error("Error deleting idea:", error);
        alert("Gagal menghapus ide");
      }
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case "publish": return 25;
      case "review": return 50;
      case "process": return 75;
      case "done": return 100;
      default: return 10;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "publish": return "Diterima";
      case "review": return "Ditinjau";
      case "process": return "Dalam Pengerjaan";
      case "done": return "Selesai";
      default: return "Pending";
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Dashboard Tracking Ide</h1>
          <p>Pantau perkembangan ide-ide yang telah Anda kontribusikan untuk kota.</p>
        </div>
      </div>

      <div className="dashboard-container">
        <section className="stats-overview">
          <div className="stat-card">
            <span className="stat-value">{myIde.length}</span>
            <span className="stat-label">Total Ide</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{myIde.filter(i => i.status === 'process').length}</span>
            <span className="stat-label">Ide Dalam Proses</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{myIde.filter(i => i.status === 'done').length}</span>
            <span className="stat-label">Ide Selesai</span>
          </div>
        </section>

        <section className="tracking-section">
          <h2>Tracking Progress Ide</h2>
          {loading ? (
            <p>Memuat data...</p>
          ) : myIde.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada ide yang Anda unggah dari halaman Ide Publik.</p>
            </div>
          ) : (
            <div className="tracking-list">
              {myIde.map((item) => (
                <div key={item.id_ide} className="tracking-card">
                  <div className="tracking-main">
                    <div className="tracking-image">
                      <img 
                        src={item.gambar ? `${API_URL.replace("/index.php", "")}/uploads/ide/${item.gambar}` : "https://via.placeholder.com/150"} 
                        alt={item.judul} 
                      />
                    </div>
                    <div className="tracking-info">
                      <div className="tracking-header">
                        <h3>{item.judul}</h3>
                        <span className={`status-badge ${item.status}`}>{getStatusLabel(item.status)}</span>
                      </div>
                      
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${getStatusProgress(item.status)}%` }}
                          ></div>
                        </div>
                        <div className="progress-steps">
                          <span className={getStatusProgress(item.status) >= 25 ? "active" : ""}>Diterima</span>
                          <span className={getStatusProgress(item.status) >= 50 ? "active" : ""}>Ditinjau</span>
                          <span className={getStatusProgress(item.status) >= 75 ? "active" : ""}>Proses</span>
                          <span className={getStatusProgress(item.status) >= 100 ? "active" : ""}>Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tracking-footer">
                    <p>{item.isi.substring(0, 150)}...</p>
                    <div className="action-buttons">
                      <button className="btn-detail" onClick={() => navigate(`/ide/${item.id_ide}`)}>Detail</button>
                      <button className="btn-edit" onClick={() => navigate(`/ide/${item.id_ide}/edit`)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id_ide)}>Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
