import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ide-detail.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function IdeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost/kolaborasa-backend/backend/index.php";

  const [ide, setIde] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ApiIde/detail/${id}`
      );

      const result = await response.json();

      if (result.status) {
        setIde(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await fetch(
        `${API_URL}/ApiIde/like/${id}`,
        {
          method: "POST",
        }
      );

      fetchDetail();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        Memuat data...
      </div>
    );
  }

  if (!ide) {
    return (
      <div className="detail-loading">
        Data tidak ditemukan.
      </div>
    );
  }

  const imageUrl = ide.gambar
    ? `${API_URL.replace(
        "/index.php",
        ""
      )}/uploads/ide/${ide.gambar}`
    : "https://via.placeholder.com/1000x500";

  return (
    <div className="detail-page">
        <Navbar/>

      {/* HEADER */}

      <section className="detail-header">

        <h1>{ide.judul}</h1>

        <p>
          Lokasi:
          <span>{ide.lokasi}</span>
        </p>

      </section>

      {/* IMAGE */}

      <section className="detail-image-section">

        <img
          src={imageUrl}
          alt={ide.judul}
          className="detail-image"
        />

      </section>

      {/* CONTENT */}

      <section className="detail-content">

        <h2>Deskripsi Ide</h2>

        <div className="detail-text">
          {ide.isi}
        </div>

      </section>

      {/* ACTION */}

      <section className="detail-actions">

        <button
          className="like-btn"
          onClick={handleLike}
        >
          ❤️ {ide.jumlah_like}
        </button>

        <button
          className="diskusi-btn"
          onClick={() =>
            navigate(`/ide/${id}/komentar`)
          }
        >
          Forum Diskusi
        </button>

      </section>
      <Footer/>

    </div>
  );
}

export default IdeDetail;