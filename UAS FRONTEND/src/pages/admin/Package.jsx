import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const Package = () => {
  const [paket, setPaket] = useState([]);
  const [form, setForm] = useState({
    nama: "", deskripsi: "", harga: "", destinasi: "", akomodasi: "", transportasi: ""
  });
  const [editId, setEditId] = useState(null);
  const [destinasi, setDestinasi] = useState([]);
  const [akomodasi, setAkomodasi] = useState([]);
  const [transportasi, setTransportasi] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAll = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [dRes, aRes, tRes, pRes] = await Promise.all([
      axios.get(`${API}/admin/destinasi`, config),
      axios.get(`${API}/admin/akomodasi`, config),
      axios.get(`${API}/admin/transportasi`, config),
      axios.get(`${API}/admin/package`, config),
    ]);
    setDestinasi(dRes.data);
    setAkomodasi(aRes.data);
    setTransportasi(tRes.data);
    setPaket(pRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (editId) {
        await axios.put(`${API}/admin/package/${editId}`, form, config);
      } else {
        await axios.post(`${API}/admin/package`, form, config);
      }
      setForm({ nama: "", deskripsi: "", harga: "", destinasi: "", akomodasi: "", transportasi: "" });
      setEditId(null);
      fetchAll();
    } catch (err) {
      alert("Gagal simpan data paket");
    }
  };

  const handleEdit = (item) => {
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi,
      harga: item.harga,
      destinasi: item.destinasi?._id || item.destinasi,
      akomodasi: item.akomodasi?._id || item.akomodasi,
      transportasi: item.transportasi?._id || item.transportasi
    });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin hapus paket ini?")) {
      await axios.delete(`${API}/admin/package/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Paket Tour</h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nama Paket" className="border p-2 rounded"
                value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              <input type="number" placeholder="Harga" className="border p-2 rounded"
                value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} />
              <textarea placeholder="Deskripsi" className="border p-2 rounded col-span-2"
                value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}></textarea>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <select className="border p-2 rounded"
                value={form.destinasi}
                onChange={(e) => setForm({ ...form, destinasi: e.target.value })}>
                <option value="">Pilih Destinasi</option>
                {destinasi.map((d) => (
                  <option key={d._id} value={d._id}>{d.nama}</option>
                ))}
              </select>

              <select className="border p-2 rounded"
                value={form.akomodasi}
                onChange={(e) => setForm({ ...form, akomodasi: e.target.value })}>
                <option value="">Pilih Akomodasi</option>
                {akomodasi.map((a) => (
                  <option key={a._id} value={a._id}>{a.nama}</option>
                ))}
              </select>

              <select className="border p-2 rounded"
                value={form.transportasi}
                onChange={(e) => setForm({ ...form, transportasi: e.target.value })}>
                <option value="">Pilih Transportasi</option>
                {transportasi.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.namaOperator} - {t.jenis} - {t.rute}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="mt-4 bg-black text-white px-4 py-2 rounded">
              {editId ? "Update" : "Tambah"}
            </button>
            {editId && (
              <button type="button" onClick={() => {
                setEditId(null);
                setForm({ nama: "", deskripsi: "", harga: "", destinasi: "", akomodasi: "", transportasi: "" });
              }} className="ml-2 text-sm underline text-gray-600">Batal Edit</button>
            )}
          </form>

          {/* TABEL */}
          <div className="bg-white p-4 rounded shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Nama</th>
                  <th>Destinasi</th>
                  <th>Akomodasi</th>
                  <th>Transportasi</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paket.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="py-2">{p.nama}</td>
                    <td>{p.destinasi?.nama || "-"}</td>
                    <td>{p.akomodasi?.nama || "-"}</td>
                    <td>
                      {p.transportasi
                        ? `${p.transportasi.namaOperator || "-"} - ${p.transportasi.jenis || "-"} (${p.transportasi.rute || "-"})`
                        : "-"}
                    </td>
                    <td>Rp{parseInt(p.harga).toLocaleString("id-ID")}</td>
                    <td>
                      <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-600">Hapus</button>
                    </td>
                  </tr>
                ))}
                {paket.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4 text-gray-400">Belum ada data paket.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Package;
