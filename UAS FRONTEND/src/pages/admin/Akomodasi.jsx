import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

// Daftar pilihan fasilitas yang bisa dipilih
const fasilitasOptions = ['AC', 'WiFi', 'TV', 'Kulkas', 'Kolam Renang', 'Dapur'];

const Akomodasi = () => {
  const [akomodasi, setAkomodasi] = useState([]);
  const [form, setForm] = useState({ nama: "", tipe: "", lokasi: "", deskripsi: "", kamar: [] });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const tipeOptions = ['Hotel', 'Villa', 'Homestay', 'Guesthouse'];

  const fetchAkomodasi = async () => {
    const res = await axios.get(`${API}/admin/akomodasi`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAkomodasi(res.data);
  };

  const addKamar = () => {
    setForm({ ...form, kamar: [...form.kamar, { nama: "", kapasitas: "", hargaPerMalam: "", fasilitas: [] }] });
  };

  const updateKamar = (i, key, value) => {
    const kamar = [...form.kamar];
    kamar[i][key] = value;
    setForm({ ...form, kamar });
  };

  const removeKamar = (i) => {
    const kamar = [...form.kamar];
    kamar.splice(i, 1);
    setForm({ ...form, kamar });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/admin/akomodasi/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/admin/akomodasi`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ nama: "", tipe: "", lokasi: "", deskripsi: "", kamar: [] });
      setEditId(null);
      fetchAkomodasi();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus akomodasi ini?")) {
      await axios.delete(`${API}/admin/akomodasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAkomodasi();
    }
  };

  useEffect(() => {
    fetchAkomodasi();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Akomodasi</h2>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Akomodasi"
                className="border p-2 rounded"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
              />

              <select
                className="border p-2 rounded"
                value={form.tipe}
                onChange={(e) => setForm({ ...form, tipe: e.target.value })}
              >
                <option value="">Pilih Tipe</option>
                {tipeOptions.map((tipe) => (
                  <option key={tipe} value={tipe}>{tipe}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Lokasi"
                className="border p-2 rounded"
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
              />

              <input
                type="text"
                placeholder="Deskripsi"
                className="border p-2 rounded col-span-2"
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              />
            </div>

            {/* FORM KAMAR */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Daftar Kamar</h3>
              {form.kamar.map((k, i) => (
                <div key={i} className="border p-3 rounded mb-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nama Kamar"
                      className="border p-2 rounded"
                      value={k.nama}
                      onChange={(e) => updateKamar(i, "nama", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Kapasitas"
                      className="border p-2 rounded"
                      value={k.kapasitas}
                      onChange={(e) => updateKamar(i, "kapasitas", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Harga per malam"
                      className="border p-2 rounded"
                      value={k.hargaPerMalam}
                      onChange={(e) => updateKamar(i, "hargaPerMalam", e.target.value)}
                    />
                  </div>

                  {/* Checkbox Fasilitas */}
                  <div className="mb-2">
                    <span className="text-sm font-medium">Fasilitas:</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {fasilitasOptions.map((item) => (
                        <label key={item} className="inline-flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={k.fasilitas?.includes(item) || false}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const fasilitas = [...(k.fasilitas || [])];
                              if (isChecked) {
                                if (!fasilitas.includes(item)) fasilitas.push(item);
                              } else {
                                const index = fasilitas.indexOf(item);
                                if (index > -1) fasilitas.splice(index, 1);
                              }
                              updateKamar(i, "fasilitas", fasilitas);
                            }}
                          />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="button" onClick={() => removeKamar(i)} className="text-sm text-red-600 mt-1">
                    Hapus Kamar
                  </button>
                </div>
              ))}

              <button type="button" onClick={addKamar} className="text-sm text-blue-600 mt-2">
                + Tambah Kamar
              </button>
            </div>

            <button type="submit" className="mt-4 bg-black text-white px-4 py-2 rounded">
              {editId ? "Update" : "Tambah"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ nama: "", tipe: "", lokasi: "", deskripsi: "", kamar: [] });
                }}
                className="ml-2 text-sm underline text-gray-600"
              >
                Batal Edit
              </button>
            )}
          </form>

          {/* TABEL */}
          <div className="bg-white p-4 rounded shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Nama</th>
                  <th>Tipe</th>
                  <th>Lokasi</th>
                  <th>Kamar</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {akomodasi.map((a) => (
                  <tr key={a._id} className="border-b">
                    <td className="py-2">{a.nama}</td>
                    <td>{a.tipe}</td>
                    <td>{a.lokasi}</td>
                    <td>{a.kamar.length} kamar</td>
                    <td>{a.deskripsi}</td>
                    <td>
                      <button onClick={() => handleEdit(a)} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => handleDelete(a._id)} className="text-red-600">Hapus</button>
                    </td>
                  </tr>
                ))}
                {akomodasi.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">Belum ada data akomodasi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Akomodasi;
