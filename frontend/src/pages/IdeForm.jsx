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

      const response = await fetch(
        `${API_URL}/ApiIde/tambah`,
        {
          method: "POST",
          body: formData,
        }
      );

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
        <Navbar/>

      <div className="form-container">

        <h1>Bagikan Ide Anda</h1>

        <p>
          Sampaikan gagasan terbaik Anda untuk
          kemajuan lingkungan dan masyarakat.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Judul Ide</label>

            <input
              type="text"
              value={judul}
              onChange={(e) =>
                setJudul(e.target.value)
              }
              placeholder="Masukkan judul ide"
            />
          </div>

          <div className="form-group">
            <label>Upload Gambar</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setGambar(e.target.files[0])
              }
            />
          </div>

          <div className="form-group">
            <label>Isi Ide</label>

            <textarea
              rows="8"
              value={isi}
              onChange={(e) =>
                setIsi(e.target.value)
              }
              placeholder="Tuliskan ide Anda..."
            />
          </div>

          <div className="form-group">
            <label>Lokasi</label>

            <input
              type="text"
              value={lokasi}
              onChange={(e) =>
                setLokasi(e.target.value)
              }
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

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading
                ? "Mengunggah..."
                : "Unggah Ide"}
            </button>

          </div>

        </form>

      </div>
      <Footer/>

    </div>
  );
}

export default IdeForm;