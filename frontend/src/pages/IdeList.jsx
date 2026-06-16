import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ide-list.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function IdeList() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost/Kolaborasa_Webpro/kolaborasa-backend/backend/index.php";

  const [ideList, setIdeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIde, setTotalIde] = useState(0);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchIde();
    fetchStatistik();
  }, []);

  const fetchIde = async () => {
    try {
      const response = await fetch(`${API_URL}/ApiIde`);
      const result = await response.json();

      if (result.status) {
        setIdeList(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistik = async () => {
    try {
      const response = await fetch(`${API_URL}/ApiIde/statistik`);
      const result = await response.json();

      if (result.status) {
        setTotalIde(result.data.total_ide);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetail = (id) => {
    navigate(`/ide/${id}`);
  };

  const handleTambah = () => {
    navigate("/ide/tambah");
  };

  return (
    <div className="ide-page">
        <Navbar/>

      {/* HERO */}
      <section className="ide-hero">
        <div className="hero-overlay">
          <h1>Forum Ide Masyarakat</h1>
          <p>
            Bagikan ide terbaikmu untuk membangun kota yang lebih baik.
          </p>
        </div>
      </section>

      {/* INFO CARD */}
      <section className="info-section">

        <div className="info-card">
          <span className="info-title">Lokasi</span>
          <h3>{user?.lokasi || "Indonesia"}</h3>
        </div>

        <div className="info-card">
          <span className="info-title">Total Ide</span>
          <h3>{totalIde}</h3>
        </div>

        <button
          className="add-button"
          onClick={handleTambah}
        >
          +
        </button>

      </section>

      {/* TITLE */}
      <section className="section-header">
        <h2>Daftar Ide Publik</h2>
      </section>

      {/* CONTENT */}
      <section className="ide-grid">

        {loading ? (
          <p>Memuat data...</p>
        ) : ideList.length === 0 ? (
          <p>Belum ada ide yang dipublikasikan.</p>
        ) : (
          ideList.map((item) => (
            <div
              className="ide-card"
              key={item.id_ide}
              onClick={() => handleDetail(item.id_ide)}
            >
              <div className="image-wrapper">
                <img
                  src={
                    item.gambar
                      ? `${API_URL.replace(
                          "/index.php",
                          ""
                        )}/uploads/ide/${item.gambar}`
                      : "https://via.placeholder.com/400x250"
                  }
                  alt={item.judul}
                />
              </div>

              <div className="ide-content">

                <h3>{item.judul}</h3>

                <p>
                  {item.isi?.substring(0, 120)}
                  ...
                </p>

                <div className="ide-footer">

                  <span>
                    ❤️ {item.jumlah_like}
                  </span>

                  <button
                    onClick={() =>
                      handleDetail(item.id_ide)
                    }
                  >
                    Detail
                  </button>

                </div>

              </div>
            </div>
          ))
        )}
      </section>
        <Footer/>
    </div>
  );
}

export default IdeList;