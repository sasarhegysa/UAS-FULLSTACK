import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const DetailDestinasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destinasi, setDestinasi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const res = await axios.get(`${API}/destinasi/${id}`);
        setDestinasi(res.data);
      } catch (err) {
        alert("Gagal memuat detail destinasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinasi();
  }, [id]);

  if (loading) return <p className="text-center py-10 animate-pulse text-gray-500">Loading...</p>;
  if (!destinasi) return <p className="text-center py-10 text-red-600">Destinasi tidak ditemukan.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-red-600 mb-2">{destinasi.nama}</h1>
      <p className="text-sm text-gray-500 mb-4">📍 {destinasi.lokasi}</p>

      {/* Image */}
      <div className="w-full h-72 bg-gray-200 rounded-xl overflow-hidden mb-6 shadow-md">
        {destinasi.foto ? (
          <img
            src={`http://localhost:5000${destinasi.foto}`}
            alt={destinasi.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-3 mb-8 text-[15px] text-gray-700">
        <p><span className="font-semibold text-gray-800">Tipe:</span> {destinasi.tipe}</p>
        <p>
          <span className="font-semibold text-gray-800">Harga Tiket:</span> Rp
          {parseInt(destinasi.hargaTiket).toLocaleString("id-ID")}
        </p>
        <div>
          <p className="font-semibold text-gray-800 mb-1">Deskripsi:</p>
          <p className="text-justify leading-relaxed">{destinasi.deskripsi}</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(`/paket?destinasi=${destinasi._id}`)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          🎒 Lihat Paket Terkait
        </button>
        <button
          onClick={() => navigate("/booking/custom")}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          ✈️ Rencanakan Perjalanan
        </button>
      </div>
    </div>
  );
};

export default DetailDestinasi;
