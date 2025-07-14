import { useEffect, useState } from "react";
import axios from "axios";
import CardDestinasi from "./CardDestinasi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);

  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        const res = await axios.get(`${API}/destinasi`);
        setDestinasi(res.data);
      } catch (err) {
        console.error("Gagal mengambil data destinasi", err);
      }
    };
    fetchDestinasi();
  }, []);

  return (
    <section className="mt-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-6 h-0.5 bg-red-400" />
        <p className="text-sm text-red-500 uppercase font-medium">Destinasi</p>
      </div>
      <h2 className="text-2xl font-bold mb-10">Saran Perjalanan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(destinasi) && destinasi.length > 0 ? (
          destinasi
            .slice(0, 6)
            .map((item) => <CardDestinasi key={item._id} destinasi={item} />)
        ) : (
          <p className="text-gray-400 col-span-full">Belum ada data destinasi.</p>
        )}
      </div>
    </section>
  );
};

export default DestinasiList;
