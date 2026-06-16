import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ide-form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function IdeForm() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost/kolaborasa-backend/backend/index.php";

  const user = JSON.parse(localStorage.getItem("user"));

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [gambar, setGambar] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !isi || !lokasi) {
      alert("Harap lengkapi semua data.");
      return;
    }

    const formData = new FormData();

    formData.append("id_user", user.id_user);
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("lokasi", lokasi);

    if (gambar) {
      formData.append("gambar", gambar);
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/ApiIde/tambah`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        alert("Ide berhasil ditambahkan!");
        navigate("/ide");
      } else {
        alert("Gagal menambahkan ide.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="hero-banner">
        {/* ganti src dengan path gambar kota Anda sendiri */}
        <img src="/images/hero-banner.jpg" alt="" />
        <Navbar />
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="judul">Judul Ide</label>
            <input
              id="judul"
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul ide"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gambar">Upload Gambar</label>

            <input
              id="gambar"
              type="file"
              accept="image/*"
              className="upload-input"
              onChange={(e) => setGambar(e.target.files[0])}
            />

            <label htmlFor="gambar" className="upload-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 16V4M12 4l-4 4M12 4l4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="file-name">
                {gambar ? gambar.name : "Tekan Untuk Upload"}
              </span>
            </label>

            {gambar && (
              <img
                src={URL.createObjectURL(gambar)}
                alt="Preview"
                className="upload-preview"
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="isi">Isi Ide</label>
            <textarea
              id="isi"
              rows="8"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tuliskan ide Anda..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="lokasi">Lokasi</label>
            <input
              id="lokasi"
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Bandung"
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/ide")}
            >
              Batal
            </button>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Mengunggah..." : "Unggah"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default IdeForm;
