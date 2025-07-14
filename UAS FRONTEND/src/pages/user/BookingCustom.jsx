import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const BookingCustom = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [akomodasi, setAkomodasi] = useState([]);
  const [transportasi, setTransportasi] = useState([]);

  const [selectedAkomodasi, setSelectedAkomodasi] = useState(null);
  const [selectedTransportasi, setSelectedTransportasi] = useState(null);

  const [form, setForm] = useState({
    destinasiId: "",
    akomodasiId: "",
    kamarTipe: "",
    transportasiId: "",
    tanggalBerangkat: "",
    tanggalPulang: "",
    metodePembayaran: "transfer",
  });

  const navigate = useNavigate();

  const fetchOptions = async () => {
    try {
      const [dRes, aRes, tRes] = await Promise.all([
        axios.get(`${API}/destinasi`),
        axios.get(`${API}/akomodasi`),
        axios.get(`${API}/transportasi`)
      ]);

      setDestinasi(dRes.data);
      setAkomodasi(aRes.data);
      setTransportasi(tRes.data);
    } catch (err) {
      alert("Gagal memuat data pilihan");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "akomodasiId") {
      const selected = akomodasi.find((a) => a._id === value);
      setSelectedAkomodasi(selected || null);
      setForm((prev) => ({ ...prev, kamarTipe: "" }));
    }

    if (name === "transportasiId") {
      const selected = transportasi.find((t) => t._id === value);
      setSelectedTransportasi(selected || null);
    }
  };

  const getJumlahMalam = () => {
    const { tanggalBerangkat, tanggalPulang } = form;
    if (!tanggalBerangkat || !tanggalPulang) return 0;

    const berangkat = new Date(tanggalBerangkat);
    const pulang = new Date(tanggalPulang);
    const selisih = (pulang - berangkat) / (1000 * 60 * 60 * 24);

    return isNaN(selisih) || selisih <= 0 ? 1 : Math.ceil(selisih);
  };

  const totalHarga = (() => {
    const malam = getJumlahMalam();
    let hargaKamar = 0;

    if (selectedAkomodasi && form.kamarTipe) {
      const kamar = selectedAkomodasi.kamar.find((k) => k.nama === form.kamarTipe);
      if (kamar) hargaKamar = kamar.hargaPerMalam * malam;
    }

    const hargaTransport = selectedTransportasi?.harga || 0;
    const total = hargaKamar + hargaTransport;

    return isNaN(total) ? 0 : total;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (isNaN(totalHarga) || totalHarga <= 0) {
      alert("Total harga tidak valid. Pastikan semua pilihan sudah dipilih.");
      return;
    }

    const dataToSend = { ...form, totalHarga };

    console.log("Data dikirim ke backend:", dataToSend);

    try {
      await axios.post(`${API}/booking/custom`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking custom berhasil! Silakan upload bukti pembayaran di halaman booking.");
      navigate("/booking");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan booking custom.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Booking Custom Perjalananmu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {/* Destinasi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Pilih Destinasi</label>
          <select
            name="destinasiId"
            value={form.destinasiId}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">-- Pilih --</option>
            {destinasi.map((d) => (
              <option key={d._id} value={d._id}>
                {d.nama} ({d.lokasi})
              </option>
            ))}
          </select>
        </div>

        {/* Akomodasi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Pilih Akomodasi</label>
          <select
            name="akomodasiId"
            value={form.akomodasiId}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">-- Pilih --</option>
            {akomodasi.map((a) => (
              <option key={a._id} value={a._id}>
                {a.nama} - {a.tipe}
              </option>
            ))}
          </select>
        </div>

        {/* Kamar */}
        {selectedAkomodasi && (
          <div>
            <label className="block text-sm font-semibold mb-1">Tipe Kamar</label>
            <select
              name="kamarTipe"
              value={form.kamarTipe}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">-- Pilih --</option>
              {selectedAkomodasi.kamar.map((k, i) => (
                <option key={i} value={k.nama}>
                  {k.nama} - Kapasitas {k.kapasitas} - Rp{k.hargaPerMalam.toLocaleString("id-ID")} / malam
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Transportasi */}
        <div>
          <label className="block text-sm font-semibold mb-1">Pilih Transportasi</label>
          <select
            name="transportasiId"
            value={form.transportasiId}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">-- Pilih --</option>
            {transportasi.map((t) => (
              <option key={t._id} value={t._id}>
                {t.namaOperator} - {t.jenis} ({t.rute}) - Rp{t.harga.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        {/* Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Tanggal Berangkat</label>
            <input
              type="date"
              name="tanggalBerangkat"
              value={form.tanggalBerangkat}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tanggal Pulang</label>
            <input
              type="date"
              name="tanggalPulang"
              value={form.tanggalPulang}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* Pembayaran */}
        <div>
          <label className="block text-sm font-semibold mb-1">Metode Pembayaran</label>
          <select
            name="metodePembayaran"
            value={form.metodePembayaran}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="transfer">Transfer</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        {/* Total Harga */}
        <div className="mt-4 font-semibold text-lg text-right">
          Total Harga: <span className="text-red-600">Rp{totalHarga.toLocaleString("id-ID")}</span>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
        >
          Booking Sekarang
        </button>
      </form>
    </div>
  );
};

export default BookingCustom;
