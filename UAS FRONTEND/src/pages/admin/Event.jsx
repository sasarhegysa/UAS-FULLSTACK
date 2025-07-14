import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [akomodasi, setAkomodasi] = useState([]);
  const [transportasi, setTransportasi] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    lokasi: "",
    tanggal: "",
    deskripsi: "",
    harga: "",
    akomodasi: "",
    transportasi: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/admin/event`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Gagal mengambil data event", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const [resAkom, resTrans] = await Promise.all([
        axios.get(`${API}/akomodasi`),
        axios.get(`${API}/transportasi`),
      ]);
      setAkomodasi(resAkom.data);
      setTransportasi(resTrans.data);
    } catch (err) {
      console.error("Gagal mengambil data opsi", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (let key in formData) {
      if (formData[key]) form.append(key, formData[key]);
    }

    try {
      if (editId) {
        await axios.put(`${API}/admin/event/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${API}/admin/event`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      alert("Gagal menyimpan event");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      nama: "",
      lokasi: "",
      tanggal: "",
      deskripsi: "",
      harga: "",
      akomodasi: "",
      transportasi: "",
      image: null,
    });
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setFormData({
      nama: event.nama,
      lokasi: event.lokasi,
      tanggal: event.tanggal?.split("T")[0] || "",
      deskripsi: event.deskripsi,
      harga: event.harga || "",
      akomodasi: event.akomodasi?._id || "",
      transportasi: event.transportasi?._id || "",
      image: null, // Upload baru jika ingin ganti
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin hapus event ini?")) {
      await axios.delete(`${API}/admin/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="p-6">
          <h2 className="text-xl font-semibold mb-4">Kelola Event</h2>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow mb-6 space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Event"
                className="border p-2 rounded"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
              <input
                type="text"
                placeholder="Lokasi"
                className="border p-2 rounded"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
              <input
                type="number"
                placeholder="Harga"
                className="border p-2 rounded"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              />
              <textarea
                placeholder="Deskripsi"
                className="border p-2 rounded col-span-2"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              />
              <select
                className="border p-2 rounded"
                value={formData.akomodasi}
                onChange={(e) => setFormData({ ...formData, akomodasi: e.target.value })}
              >
                <option value="">Pilih Akomodasi</option>
                {akomodasi.map((a) => (
                  <option key={a._id} value={a._id}>{a.nama}</option>
                ))}
              </select>
              <select
                className="border p-2 rounded"
                value={formData.transportasi}
                onChange={(e) => setFormData({ ...formData, transportasi: e.target.value })}
              >
                <option value="">Pilih Transportasi</option>
                {transportasi.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.namaOperator} - {t.jenis} ({t.rute})
                  </option>
                ))}
              </select>
              {!editId && (
                <input
                  type="file"
                  accept="image/*"
                  className="col-span-2"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              )}
            </div>
            <button type="submit" className="mt-2 bg-black text-white px-4 py-2 rounded">
              {editId ? "Update" : "Tambah"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
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
                  <th>Lokasi</th>
                  <th>Tanggal</th>
                  <th>Akomodasi</th>
                  <th>Transportasi</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e._id} className="border-b">
                    <td className="py-2">{e.nama}</td>
                    <td>{e.lokasi}</td>
                    <td>{new Date(e.tanggal).toLocaleDateString("id-ID")}</td>
                    <td>{e.akomodasi?.nama || "-"}</td>
                    <td>
                      {e.transportasi
                        ? `${e.transportasi.namaOperator} - ${e.transportasi.jenis}`
                        : "-"}
                    </td>
                    <td>
                      {e.image ? (
                        <img
                          src={`http://localhost:5000${e.image}`}
                          alt="event"
                          className="w-16 h-12 object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(e)} className="text-blue-600 mr-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(e._id)} className="text-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-400">
                      Belum ada event.
                    </td>
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

export default Event;
