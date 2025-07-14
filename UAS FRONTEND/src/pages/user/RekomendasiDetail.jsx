import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Hotel,
  BusFront,
  Wallet,
  LoaderCircle,
  ArrowLeft,
  Settings
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const RekomendasiDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRekomendasi = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/rekomendasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRekomendasi();
  }, [id]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          ✈️ Rekomendasi Perjalananmu
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:underline text-sm"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>

      {/* Detail Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 space-y-6 border">
        {/* Destinasi */}
        <div className="flex items-start gap-4">
          <MapPin className="text-red-500 mt-1" size={28} />
          <div>
            <p className="text-sm text-gray-500">Destinasi</p>
            <p className="text-xl font-semibold text-gray-800">{data.destinasi}</p>
          </div>
        </div>

        {/* Akomodasi */}
        <div className="flex items-start gap-4">
          <Hotel className="text-blue-500 mt-1" size={28} />
          <div>
            <p className="text-sm text-gray-500">Akomodasi</p>
            <p className="text-xl font-semibold text-gray-800">{data.akomodasi}</p>
          </div>
        </div>

        {/* Transportasi */}
        <div className="flex items-start gap-4">
          <BusFront className="text-green-500 mt-1" size={28} />
          <div>
            <p className="text-sm text-gray-500">Transportasi</p>
            <p className="text-xl font-semibold text-gray-800">{data.transportasi}</p>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-start gap-4">
          <Wallet className="text-indigo-500 mt-1" size={28} />
          <div>
            <p className="text-sm text-gray-500">Total Estimasi Biaya</p>
            <p className="text-xl font-bold text-gray-900">
              Rp{data.totalEstimasi.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <button
          onClick={() => navigate(`/booking-dari-rekomendasi/${id}`)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md text-base font-semibold shadow transition duration-200"
        >
          🚀 Booking Sekarang
        </button>
        <div>
          <p className="text-sm text-gray-500">Butuh perjalanan yang lebih fleksibel?</p>
          <button
            onClick={() => navigate("/custom-itinerary")}
            className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:underline font-medium"
          >
            <Settings size={18} />
            Atur Perjalanan Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default RekomendasiDetail;
