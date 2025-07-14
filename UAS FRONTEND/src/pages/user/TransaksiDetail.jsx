import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const TransaksiDetail = () => {
  const { id } = useParams(); // id booking
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [bukti, setBukti] = useState(null);
  const [ktp, setKtp] = useState(null);
  const [paspor, setPaspor] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`${API}/booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data);
    } catch (err) {
      alert("Gagal memuat data booking");
    }
  };

  const uploadBukti = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bukti", bukti);

    try {
      await axios.patch(`${API}/booking/${id}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Bukti pembayaran berhasil diupload");
      fetchBooking();
    } catch (err) {
      alert("Gagal upload bukti pembayaran");
    }
  };

  const uploadDokumen = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ktp", ktp);
    formData.append("paspor", paspor);

    try {
      await axios.patch(`${API}/booking/${id}/traveler`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Dokumen berhasil diupload");
      fetchBooking();
    } catch (err) {
      alert("Gagal upload dokumen");
    }
  };

  const cancelBooking = async () => {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    try {
      await axios.patch(
        `${API}/booking/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking berhasil dibatalkan");
      fetchBooking();
    } catch (err) {
      alert("Gagal membatalkan booking");
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (!booking) return <p className="p-6">Memuat...</p>;

  const isUploadLengkap = booking.buktiPembayaran && booking.ktp && booking.paspor;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Detail Booking</h1>

      {/* Informasi Booking */}
      <div className="bg-white border p-6 rounded-xl shadow space-y-2 text-sm">
        <p><strong>Jenis:</strong>{" "}
          {booking.package ? "Paket" : booking.event ? "Event" : booking.rekomendasi ? "Rekomendasi" : "Manual"}
        </p>
        <p><strong>Destinasi:</strong>{" "}
          {booking.destinasi?.nama || booking.package?.destinasi?.nama ||
            (typeof booking.rekomendasi?.destinasi === "string"
              ? booking.rekomendasi.destinasi
              : booking.rekomendasi?.destinasi?.nama) || "-"}
        </p>
        <p><strong>Akomodasi:</strong> {booking.akomodasi?.nama || booking.rekomendasi?.akomodasi || "-"}</p>
        <p><strong>Transportasi:</strong> {booking.transportasi?.jenis || booking.rekomendasi?.transportasi || "-"}</p>
        <p><strong>Tanggal:</strong>{" "}
          {new Date(booking.tanggalBerangkat).toLocaleDateString("id-ID")} -{" "}
          {new Date(booking.tanggalPulang).toLocaleDateString("id-ID")}
        </p>
        <p><strong>Status:</strong> <span className="capitalize">{booking.status}</span></p>
        <p><strong>Total:</strong> Rp{booking.totalHarga?.toLocaleString("id-ID") || "0"}</p>
        <p><strong>Bukti Pembayaran:</strong>{" "}
          {booking.buktiPembayaran ? (
            <a
              href={`${API}/public/${booking.buktiPembayaran}`}
              target="_blank"
              className="text-blue-600 underline"
            >
              Lihat File
            </a>
          ) : (
            "Belum ada"
          )}
        </p>
      </div>

      {/* CTA jika dokumen sudah diupload tapi masih pending */}
      {booking.status === "pending" && booking.buktiPembayaran && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-gray-700">
          <p className="mb-2 font-semibold">Menunggu Konfirmasi</p>
          <p>
            Dokumen dan bukti pembayaran Anda telah berhasil diunggah.
            Mohon tunggu konfirmasi dari admin.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate("/user")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Ke Beranda
            </button>
            <button
              onClick={() => navigate("/user/transaksi")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Lihat Transaksi Lain
            </button>
          </div>
        </div>
      )}

      {/* Upload Dokumen dan Bukti jika belum */}
      {booking.status === "pending" && (
        <>
          {!booking.buktiPembayaran && (
            <form onSubmit={uploadBukti} className="space-y-4">
              <h2 className="text-lg font-semibold">Upload Bukti Pembayaran</h2>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setBukti(e.target.files[0])}
                required
                className="border p-2 w-full rounded"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Upload Bukti
              </button>
            </form>
          )}

          {(!booking.ktp || !booking.paspor) && (
            <form onSubmit={uploadDokumen} className="space-y-4 mt-8">
              <h2 className="text-lg font-semibold">Upload Dokumen Traveler</h2>
              <div>
                <label className="block mb-1 text-sm">Upload KTP</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setKtp(e.target.files[0])}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Upload Paspor</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setPaspor(e.target.files[0])}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Upload Dokumen
              </button>
            </form>
          )}

          <button
            onClick={cancelBooking}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mt-6"
          >
            Batalkan Booking
          </button>
        </>
      )}
    </div>
  );
};

export default TransaksiDetail;
