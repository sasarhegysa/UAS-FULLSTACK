import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [count, setCount] = useState({
    users: 0,
    bookings: 0,
    destinasi: 0,
    packages: 0,
    events: 0,
  });

  const [grafik, setGrafik] = useState([]);
  const [bookingTerakhir, setBookingTerakhir] = useState([]);
  const [omzetHariIni, setOmzetHariIni] = useState(0);

  const fetchDashboard = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [users, bookings, destinasi, packages, events] = await Promise.all([
      axios.get(`${API}/admin/users?role=user`, config),
      axios.get(`${API}/admin/booking`, config),
      axios.get(`${API}/admin/destinasi`, config),
      axios.get(`${API}/admin/package`, config),
      axios.get(`${API}/admin/event`, config),
    ]);

    // hitung total omzet hari ini
    const today = new Date().toISOString().split("T")[0];
    const omzetToday = bookings.data
      .filter((b) => b.status === "disetujui" && b.createdAt.startsWith(today))
      .reduce((sum, b) => {
        const harga =
          b.packageId?.harga ||
          b.rekomendasi?.totalHarga ||
          b.harga ||
          0;
        return sum + harga;
      }, 0);

    // grafik booking per bulan
    const countByMonth = {};
    bookings.data.forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("id-ID", {
        month: "short",
      });
      countByMonth[month] = (countByMonth[month] || 0) + 1;
    });

    const chartData = Object.entries(countByMonth).map(([bulan, total]) => ({
      bulan,
      total,
    }));

    // sort by bulan
    const orderedMonth = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const sortedData = orderedMonth
      .map((bulan) => chartData.find((c) => c.bulan === bulan) || { bulan, total: 0 });

    // booking terbaru
    const recentBooking = bookings.data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setGrafik(sortedData);
    setBookingTerakhir(recentBooking);
    setOmzetHariIni(omzetToday);
    setCount({
      users: users.data.length,
      bookings: bookings.data.length,
      destinasi: destinasi.data.length,
      packages: packages.data.length,
      events: events.data.length,
    });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    { label: "User", value: count.users, color: "bg-blue-100 text-blue-800" },
    { label: "Booking", value: count.bookings, color: "bg-green-100 text-green-800" },
    { label: "Destinasi", value: count.destinasi, color: "bg-orange-100 text-orange-800" },
    { label: "Paket", value: count.packages, color: "bg-purple-100 text-purple-800" },
    { label: "Event", value: count.events, color: "bg-pink-100 text-pink-800" },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Dashboard Admin</h2>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {statCards.map((card) => (
              <div key={card.label} className={`rounded p-4 shadow ${card.color}`}>
                <h4 className="text-sm font-semibold mb-1">{card.label}</h4>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
            <div className="rounded p-4 shadow bg-yellow-100 text-yellow-800">
              <h4 className="text-sm font-semibold mb-1">Omzet Hari Ini</h4>
              <p className="text-2xl font-bold">Rp{omzetHariIni.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* Grafik */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-md font-semibold mb-3">Grafik Booking per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={grafik}>
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel Booking Terbaru */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-semibold mb-3">5 Booking Terbaru</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">User</th>
                  <th>Jenis</th>
                  <th>Destinasi</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {bookingTerakhir.map((b) => (
                  <tr key={b._id} className="border-b">
                    <td className="py-2">{b.userId?.nama || "-"}</td>
                    <td>
                      {b.packageId ? "Paket" : b.eventId ? "Event" : b.rekomendasi ? "Rekomendasi" : "Manual"}
                    </td>
                    <td>
                      {b.destinationId?.nama ||
                        b.packageId?.destinasi?.nama ||
                        b.rekomendasi?.destinasi?.nama ||
                        "-"}
                    </td>
                    <td className="capitalize">{b.status}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
