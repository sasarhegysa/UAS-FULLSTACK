import { useState } from "react";
import { transportasiData } from "../../data/transportasiData";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const Transportasi = () => {
  const [jenis, setJenis] = useState("");
  const [form, setForm] = useState({
    tipe: "",
    operator: "",
    rute: "",
    harga: "",
    keberangkatan: "Pagi",
    deskripsi: "",
  });
  const [list, setList] = useState([]);

  const handleJenisChange = (e) => {
    const selected = e.target.value;
    setJenis(selected);
    setForm({ ...form, tipe: "", operator: "", rute: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const newData = {
      jenis,
      namaOperator: form.operator,
      tipe: form.tipe,
      rute: form.rute,
      harga: Number(form.harga),
      keberangkatan: form.keberangkatan,
      deskripsi: form.deskripsi,
    };

    try {
      const res = await axios.post("http://193.111.124.238:5000/api/admin/transportasi", newData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Transportasi berhasil ditambahkan!");
      setList([...list, res.data]);

      // Reset form
      setForm({
        tipe: "",
        operator: "",
        rute: "",
        harga: "",
        keberangkatan: "Pagi",
        deskripsi: "",
      });
      setJenis("");
    } catch (err) {
      console.error("❌ Gagal menambahkan transportasi", err);
      alert("Gagal menambahkan transportasi. Pastikan semua field wajib terisi.");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Transportasi</h2>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow grid grid-cols-2 gap-4"
          >
            {/* Jenis */}
            <select
              className="border p-2 rounded"
              value={jenis}
              onChange={handleJenisChange}
              required
            >
              <option value="">Jenis (Pesawat, Bus, dll)</option>
              {Object.keys(transportasiData).map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>

            {/* Operator */}
            <select
              className="border p-2 rounded"
              value={form.operator}
              onChange={(e) => setForm({ ...form, operator: e.target.value })}
              required
              disabled={!jenis}
            >
              <option value="">Operator</option>
              {jenis &&
                transportasiData[jenis].operator.map((o) => (
                  <option key={o}>{o}</option>
                ))}
            </select>

            {/* Tipe */}
            <select
              className="border p-2 rounded"
              value={form.tipe}
              onChange={(e) => setForm({ ...form, tipe: e.target.value })}
              required
              disabled={!jenis}
            >
              <option value="">Tipe/Kategori</option>
              {jenis &&
                transportasiData[jenis].tipe.map((t) => (
                  <option key={t}>{t}</option>
                ))}
            </select>

            {/* Rute */}
            <select
              className="border p-2 rounded"
              value={form.rute}
              onChange={(e) => setForm({ ...form, rute: e.target.value })}
              required
              disabled={!jenis}
            >
              <option value="">Rute</option>
              {jenis &&
                transportasiData[jenis].rute.map((r) => (
                  <option key={r}>{r}</option>
                ))}
            </select>

            {/* Keberangkatan */}
            <select
              className="border p-2 rounded"
              value={form.keberangkatan}
              onChange={(e) =>
                setForm({ ...form, keberangkatan: e.target.value })
              }
            >
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Sore">Sore</option>
              <option value="Malam">Malam</option>
            </select>

            {/* Harga */}
            <input
              type="number"
              placeholder="Harga"
              className="border p-2 rounded"
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
              required
            />

            {/* Deskripsi */}
            <textarea
              placeholder="Deskripsi tambahan"
              className="border p-2 rounded col-span-2"
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded w-fit"
            >
              Tambah
            </button>
          </form>

          {/* TABEL */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Jenis</th>
                  <th>Operator</th>
                  <th>Rute</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      Belum ada data transportasi.
                    </td>
                  </tr>
                ) : (
                  list.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.jenis}</td>
                      <td>{item.namaOperator}</td>
                      <td>{item.rute}</td>
                      <td>Rp{Number(item.harga).toLocaleString("id-ID")}</td>
                      <td>
                        <button
                          className="text-red-600 text-xs underline"
                          onClick={() =>
                            setList(list.filter((_, index) => index !== i))
                          }
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Transportasi;
