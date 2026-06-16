import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/komentar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Komentar() {

  const { id } = useParams();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost/kolaborasa-backend/backend/index.php";

  const user = JSON.parse(localStorage.getItem("user"));

  const [komentar, setKomentar] = useState([]);
  const [isiKomentar, setIsiKomentar] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchKomentar();
  }, []);

  const fetchKomentar = async () => {
    try {

      const response = await fetch(
        `${API_URL}/ApiKomentar/ide/${id}`
      );

      const result = await response.json();

      if (result.status) {
        setKomentar(result.data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isiKomentar.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }

    const formData = new FormData();

    formData.append("id_ide", id);
    formData.append("id_user", user.id_user);
    formData.append("isi_komentar", isiKomentar);
    formData.append("rating", rating);

    try {

      const response = await fetch(
        `${API_URL}/ApiKomentar/tambah`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status) {

        setIsiKomentar("");
        setRating(5);

        fetchKomentar();

      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (idKomentar) => {

    try {

      await fetch(
        `${API_URL}/ApiKomentar/like/${idKomentar}`,
        {
          method: "POST",
        }
      );

      fetchKomentar();

    } catch (error) {
      console.error(error);
    }
  };

  const renderStars = (nilai) => {

    return "★".repeat(nilai);

  };

  return (
    <div className="komentar-page">
        <Navbar/>

      {/* HEADER */}

      <div className="komentar-header">

        <h1>Forum Diskusi</h1>

        <p>
          Berikan tanggapan dan masukan
          terhadap ide yang dipublikasikan.
        </p>

      </div>

      {/* FORM */}

      <div className="komentar-form-container">

        <h2>Tulis Komentar</h2>

        <form onSubmit={handleSubmit}>

          <textarea
            value={isiKomentar}
            onChange={(e) =>
              setIsiKomentar(e.target.value)
            }
            placeholder="Tulis komentar Anda..."
          />

          <div className="rating-group">

            <label>Rating :</label>

            <select
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
            >
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>

          </div>

          <button
            type="submit"
            className="btn-kirim"
          >
            Kirim Komentar
          </button>

        </form>

      </div>

      {/* LIST KOMENTAR */}

      <div className="komentar-list">

        {komentar.length === 0 ? (

          <div className="empty-state">
            Belum ada komentar.
          </div>

        ) : (

          komentar.map((item) => (

            <div
              className="komentar-card"
              key={item.id_komentar}
            >

              <div className="komentar-top">

                <h3>{item.nama}</h3>

                <span className="rating-star">
                  {renderStars(item.rating)}
                </span>

              </div>

              <p className="isi-komentar">
                {item.isi_komentar}
              </p>

              <button
                className="btn-like"
                onClick={() =>
                  handleLike(item.id_komentar)
                }
              >
                ❤️ {item.jumlah_like}
              </button>

            </div>

          ))

        )}

      </div>
      <Footer/>

    </div>
  );
}

export default Komentar;