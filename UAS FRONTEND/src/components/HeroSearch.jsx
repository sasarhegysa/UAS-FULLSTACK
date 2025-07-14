import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const HeroSearch = () => {
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [lokasiList, setLokasiList] = useState([]);
  const [tipeList, setTipeList] = useState([]);
  const [durasiList] = useState(["1 Hari", "2 Hari", "3+ Hari"]);

  const [lokasi, setLokasi] = useState("");
  const [tipe, setTipe] = useState("");
  const [durasi, setDurasi] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(`${API}/destinasi`);
        const semuaDestinasi = res.data;

        const lokasiUnik = [...new Set(semuaDestinasi.map((d) => d.lokasi))];
        const tipeUnik = [...new Set(semuaDestinasi.map((d) => d.tipe))];

        setLokasiList(lokasiUnik);
        setTipeList(tipeUnik);
      } catch (err) {
        console.error("Gagal memuat data destinasi:", err.message);
      }
    };
    fetchFilters();
  }, []);

  const handleCari = async (e) => {
    e.preventDefault();

    if (!budget) return alert("Masukkan budget terlebih dahulu!");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/rekomendasi`,
        { budget, lokasi, tipe, durasi },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/rekomendasi/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal mendapatkan rekomendasi. Pastikan kamu sudah login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-10 mt-12 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Jelajahi Dunia, Sesuai Gaya dan Biaya!
        </h1>
        <p className="mt-2 text-gray-600">Temukan destinasi terbaik hanya dengan sekali klik</p>
      </div>

      <form
        onSubmit={handleCari}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-6 rounded-xl shadow-md"
      >
        <select
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Pilih Lokasi</option>
          {lokasiList.map((loc, i) => (
            <option key={i} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Tipe Perjalanan</option>
          {tipeList.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={durasi}
          onChange={(e) => setDurasi(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Durasi</option>
          {durasiList.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget (Rp)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition flex items-center justify-center gap-2 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading && <LoaderCircle className="animate-spin" size={16} />}
          Cari
        </button>
      </form>

      {/* Booking Custom */}
      <div className="mt-8">
        <div className="bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-red-700">Punya Rencana Sendiri?</h2>
          <p className="text-sm text-gray-700 mt-1 mb-3">
            Rancang perjalanan impianmu dengan fitur Booking Custom.
          </p>
          <Link
            to="/booking/custom"
            className="inline-block bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
          >
            ✨ Booking Custom Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSearch;
