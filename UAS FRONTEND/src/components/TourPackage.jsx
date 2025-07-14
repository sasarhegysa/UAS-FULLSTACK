import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const TourPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API}/package`);
      setPackages(res.data);
    } catch (err) {
      console.error("Gagal mengambil data paket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading paket wisata...</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Pembatas tengah */}
      <div className="relative my-10">
        <hr className="border-gray-300" />
        <h2 className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-xl font-bold text-red-600">
          Paket Wisata
        </h2>
      </div>

      {packages.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada paket tersedia.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Gambar dari destinasi */}
              {item.destinasi?.foto ? (
                <img
                  src={`http://193.111.124.238:5000${item.destinasi.foto}`}
                  alt={item.destinasi.nama}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-red-600">{item.nama}</h3>
                <p className="text-gray-500 text-sm italic">{item.durasi || "Durasi tidak tersedia"}</p>
                <p className="text-sm text-gray-600">{item.deskripsi?.slice(0, 100)}...</p>

                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p><strong>Destinasi:</strong> {item.destinasi?.nama || "-"}</p>
                  <p><strong>Akomodasi:</strong> {item.akomodasi?.nama || "-"}</p>
                  <p><strong>Transportasi:</strong> {item.transportasi?.namaOperator || item.transportasi?.operator || "-"}</p>
                </div>

                <p className="mt-2 font-bold text-lg text-green-700">
                  Rp{parseInt(item.harga).toLocaleString("id-ID")}
                </p>

                <Link
                  to={`/package/${item._id}`}
                  className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TourPackage;
