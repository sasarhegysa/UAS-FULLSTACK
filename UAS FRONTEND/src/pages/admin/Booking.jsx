import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";
const BASE = API.replace("/api", ""); // Untuk akses file static

const Booking = () => {
  const [data, setData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    const res = await axios.get(`${API}/admin/booking`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${API}/admin/booking/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      alert("Gagal ubah status");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Booking User</h2>

          <div className="bg-white p-4 rounded shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">User</th>
                  <th>Jenis</th>
                  <th>Destinasi</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Bukti</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((b) => (
                  <tr key={b._id} className="border-b">
                    <td className="py-2">{b.user?.nama || "-"}</td>
                    <td>
                      {b.package
                        ? "Paket"
                        : b.event
                        ? "Event"
                        : b.rekomendasi
                        ? "Rekomendasi"
                        : "Manual"}
                    </td>
                    <td>
                      {b.destinasi?.nama ||
                        b.package?.destinasi?.nama ||
                        (typeof b.rekomendasi?.destinasi === "string"
                          ? b.rekomendasi.destinasi
                          : b.rekomendasi?.destinasi?.nama) ||
                        "-"}
                    </td>
                    <td>
                      {new Date(b.tanggalBerangkat).toLocaleDateString("id-ID")} -{" "}
                      {new Date(b.tanggalPulang).toLocaleDateString("id-ID")}
                    </td>
                    <td className="capitalize">{b.status}</td>
                    <td>
                      {b.buktiPembayaran ? (
                        <a
                          href={`${BASE}/public/bukti_transfer/${b.buktiPembayaran}`}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="flex flex-col gap-2">
                      <select
                        className="text-sm border px-2 py-1 rounded"
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                        <option value="selesai">Selesai</option>
                      </select>
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setShowModal(true);
                        }}
                        className="text-blue-600 text-xs underline"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-400">
                      Tidak ada data booking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL DETAIL */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>

                <h3 className="text-lg font-bold mb-3">Detail Booking</h3>
                <div className="space-y-2 text-sm text-gray-800">
                  <p><strong>Nama User:</strong> {selectedBooking.user?.nama || "-"}</p>
                  <p><strong>Email:</strong> {selectedBooking.user?.email || "-"}</p>
                  <p><strong>Jenis Booking:</strong> {selectedBooking.package ? "Paket" : selectedBooking.event ? "Event" : selectedBooking.rekomendasi ? "Rekomendasi" : "Manual"}</p>
                  <p><strong>Destinasi:</strong> {selectedBooking.destinasi?.nama || selectedBooking.package?.destinasi?.nama || (typeof selectedBooking.rekomendasi?.destinasi === "string" ? selectedBooking.rekomendasi.destinasi : selectedBooking.rekomendasi?.destinasi?.nama) || "-"}</p>
                  <p><strong>Tanggal:</strong> {new Date(selectedBooking.tanggalBerangkat).toLocaleDateString("id-ID")} - {new Date(selectedBooking.tanggalPulang).toLocaleDateString("id-ID")}</p>
                  <p><strong>Total Harga:</strong> Rp{selectedBooking.totalHarga?.toLocaleString("id-ID") || "0"}</p>
                  <p><strong>Status:</strong> {selectedBooking.status}</p>

                  <p>
                    <strong>Bukti Pembayaran:</strong>{" "}
                    {selectedBooking.buktiPembayaran ? (
                      <a
                        href={`${BASE}/public/${selectedBooking.buktiPembayaran}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat File
                      </a>
                    ) : (
                      "Belum ada"
                    )}
                  </p>

                  <p>
                    <strong>KTP:</strong>{" "}
                    {selectedBooking.ktp ? (
                      <a
                        href={`${BASE}/public/dokumen/${selectedBooking.ktp}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat KTP
                      </a>
                    ) : (
                      "Belum ada"
                    )}
                  </p>

                  <p>
                    <strong>Paspor:</strong>{" "}
                    {selectedBooking.paspor ? (
                      <a
                        href={`${BASE}/public/dokumen/${selectedBooking.paspor}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat Paspor
                      </a>
                    ) : (
                      "Belum ada"
                    )}
                  </p>

                  {/* Tombol Konfirmasi Booking */}
                  {selectedBooking.status === "pending" &&
                    selectedBooking.buktiPembayaran &&
                    selectedBooking.ktp &&
                    selectedBooking.paspor && (
                      <button
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `${API}/admin/booking/${selectedBooking._id}/confirm`,
                              {},
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            alert("Booking dikonfirmasi");
                            setShowModal(false);
                            fetchBookings();
                          } catch (err) {
                            alert("Gagal konfirmasi");
                          }
                        }}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Konfirmasi Booking
                      </button>
                    )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Booking;
