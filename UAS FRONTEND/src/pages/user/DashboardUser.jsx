import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  LogOut,
  MapPinned,
  CalendarCheck,
  Plane,
  Home,
  FileText,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/booking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Gagal fetch bookings:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ✅ USER CARD */}
        <div className="bg-white rounded-xl shadow-md p-6 flex gap-6 items-center">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold capitalize">
              Halo, {user?.nama}
              <span className="ml-1 animate-waving-hand">👋</span>
            </h2>
            <p className="text-gray-500 text-sm">Selamat datang di TRAVELOOP</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* ✅ INFO DETAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <Mail className="text-blue-500" />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <User className="text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* ✅ CTA SECTION */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Akses Cepat</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer border p-4 rounded-lg hover:bg-gray-50 transition flex flex-col items-center"
            >
              <Home size={28} className="mb-2 text-indigo-600" />
              <p className="font-medium text-sm">Beranda</p>
            </div>
            <div className="cursor-not-allowed border p-4 rounded-lg flex flex-col items-center bg-gray-100">
              <MapPinned size={28} className="mb-2 text-gray-400" />
              <p className="font-medium text-sm text-gray-400">Eksplorasi</p>
            </div>
            <div className="cursor-not-allowed border p-4 rounded-lg flex flex-col items-center bg-gray-100">
              <Plane size={28} className="mb-2 text-gray-400" />
              <p className="font-medium text-sm text-gray-400">Paket Wisata</p>
            </div>
          </div>
        </div>

        {/* ✅ RIWAYAT BOOKING */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarCheck size={20} /> Riwayat Bookingmu
          </h3>

          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500">Kamu belum memiliki booking.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-lg p-4 flex justify-between items-center bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{item.tujuan}</p>
                    <p className="text-sm text-gray-500">{new Date(item.tanggal).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500 capitalize">Status: <span className="text-blue-600">{item.status}</span></p>
                  </div>
                  <Link
                    to={`/transaksi/${item._id}`}
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <FileText size={16} />
                    Lihat Detail
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
