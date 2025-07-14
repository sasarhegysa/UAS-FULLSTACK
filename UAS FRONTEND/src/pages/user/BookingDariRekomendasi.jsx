import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Wallet,
  LoaderCircle,
  Plane,
  Bed,
  MapPin,
  ArrowLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const BookingDariRekomendasi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rekomendasi, setRekomendasi] = useState(null);
  const [form, setForm] = useState({
    tanggalBerangkat: "",
    tanggalPulang: "",
    metodePembayaran: "transfer", // default sesuai backend
  });

  useEffect(() => {
    const fetchRekomendasi = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/rekomendasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRekomendasi(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRekomendasi();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/booking/rekomendasi/${id}`, // ✅ SESUAI BACKEND
        {
          tanggalBerangkat: form.tanggalBerangkat,
          tanggalPulang: form.tanggalPulang,
          metodePembayaran: form.metodePembayaran,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Booking berhasil!");
      navigate(`/user/transaksi/${res.data.booking._id}`);
    } catch (err) {
      console.error(err);
      alert("Gagal booking.");
    }
  };

  if (!rekomendasi) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-gray-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Konfirmasi Booking</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:underline"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-4 border border-gray-100">
        <div className="flex items-start gap-4">
          <MapPin className="text-red-500 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Destinasi</p>
            <p className="text-lg font-semibold">{rekomendasi.destinasi}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Bed className="text-blue-500 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Akomodasi</p>
            <p className="text-lg font-semibold">{rekomendasi.akomodasi}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Plane className="text-green-500 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Transportasi</p>
            <p className="text-lg font-semibold">{rekomendasi.transportasi}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Wallet className="text-indigo-500 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Total Estimasi</p>
            <p className="text-lg font-semibold">
              Rp{rekomendasi.totalEstimasi.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-5 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <Calendar size={16} className="inline-block mr-1" /> Tanggal
            Berangkat
          </label>
          <input
            type="date"
            required
            value={form.tanggalBerangkat}
            onChange={(e) =>
              setForm({ ...form, tanggalBerangkat: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            <Calendar size={16} className="inline-block mr-1" /> Tanggal Pulang
          </label>
          <input
            type="date"
            required
            value={form.tanggalPulang}
            onChange={(e) =>
              setForm({ ...form, tanggalPulang: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Metode Pembayaran
          </label>
          <select
            value={form.metodePembayaran}
            onChange={(e) =>
              setForm({ ...form, metodePembayaran: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-red-400 outline-none"
          >
            <option value="transfer">Transfer Bank</option>
            <option value="ewallet">E-Wallet / QRIS</option>
            <option value="cod">Bayar di Tempat</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold text-lg transition"
        >
          Konfirmasi Booking
        </button>
      </form>
    </div>
  );
};

export default BookingDariRekomendasi;
