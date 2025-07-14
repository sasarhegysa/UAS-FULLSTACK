import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import TabelDestinasi from "../../components/TabelDestinasi";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const TIPE_DESTINASI = [
  "Pantai", "Gunung", "Perkotaan", "Sejarah", "Alam", "Taman Hiburan", "Lainnya"
];

const Destinasi = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [formData, setFormData] = useState({
    nama: "", lokasi: "", deskripsi: "", tipe: "", hargaTiket: "", foto: null
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchDestinasi = async () => {
    try {
      const res = await axios.get(`${API}/admin/destinasi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinasi(res.data);
    } catch {
      console.error("Gagal fetch destinasi");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      nama: "", lokasi: "", deskripsi: "", tipe: "", hargaTiket: "", foto: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nama, lokasi, deskripsi, tipe, hargaTiket, foto } = formData;
    if (!nama || !lokasi || !deskripsi || !tipe || !hargaTiket) return alert("Semua field wajib diisi!");

    try {
      if (editId) {
        await axios.put(`${API}/admin/destinasi/${editId}`, {
          nama, lokasi, deskripsi, tipe, hargaTiket
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const fd = new FormData();
        fd.append("nama", nama);
        fd.append("lokasi", lokasi);
        fd.append("deskripsi", deskripsi);
        fd.append("tipe", tipe);
        fd.append("hargaTiket", hargaTiket);
        if (foto) fd.append("foto", foto);

        await axios.post(`${API}/admin/destinasi`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      resetForm();
      fetchDestinasi();
    } catch {
      alert("Gagal menyimpan data");
    }
  };

  const handleEdit = (d) => {
    if (editId === d._id) return;
    setEditId(d._id);
    setFormData({ ...d, foto: null });
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin hapus destinasi ini?")) {
      try {
        await axios.delete(`${API}/admin/destinasi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDestinasi();
      } catch {
        alert("Gagal menghapus destinasi");
      }
    }
  };

  useEffect(() => {
    fetchDestinasi();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Destinasi</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nama" className="border px-3 py-2 rounded"
                value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
              <input type="text" placeholder="Lokasi" className="border px-3 py-2 rounded"
                value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} />

              <select className="border px-3 py-2 rounded"
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}>
                <option value="">Pilih Tipe Destinasi</option>
                {TIPE_DESTINASI.map((tipe, i) => (
                  <option key={i} value={tipe}>{tipe}</option>
                ))}
              </select>

              <input type="number" placeholder="Harga Tiket" className="border px-3 py-2 rounded"
                value={formData.hargaTiket} onChange={(e) => setFormData({ ...formData, hargaTiket: e.target.value })} />

              <input type="text" placeholder="Deskripsi" className="border px-3 py-2 rounded col-span-2"
                value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />

              {!editId && (
                <input type="file" accept="image/*"
                  onChange={(e) => setFormData({ ...formData, foto: e.target.files[0] })}
                  className="col-span-2"
                />
              )}
            </div>
            <div>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                {editId ? "Update" : "Tambah"}
              </button>
              {editId && (
                <button type="button" onClick={resetForm}
                  className="ml-2 text-sm underline text-gray-600">Batal Edit</button>
              )}
            </div>
          </form>

          {/* Tabel */}
          <TabelDestinasi
            data={destinasi}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </main>
      </div>
    </div>
  );
};

export default Destinasi;
