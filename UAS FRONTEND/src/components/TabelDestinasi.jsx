import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5;

const TabelDestinasi = ({ data, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let filteredData = [...data];

    if (filter.trim()) {
      filteredData = filteredData.filter((d) =>
        d.nama.toLowerCase().includes(filter.toLowerCase()) ||
        d.lokasi.toLowerCase().includes(filter.toLowerCase())
      );
    }

    filteredData.sort((a, b) => {
      if (sortBy === "harga") return a.hargaTiket - b.hargaTiket;
      return a.nama.localeCompare(b.nama);
    });

    setFiltered(filteredData);
    setCurrentPage(1);
  }, [data, filter, sortBy]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Filter & Sort */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Cari destinasi..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded w-1/2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="nama">Sort by Nama</option>
          <option value="harga">Sort by Harga</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left">Foto</th>
              <th className="py-2 px-3 text-left">Nama</th>
              <th className="py-2 px-3 text-left">Lokasi</th>
              <th className="py-2 px-3 text-left">Tipe</th>
              <th className="py-2 px-3 text-left">Harga</th>
              <th className="py-2 px-3 text-left">Deskripsi</th>
              <th className="py-2 px-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((d, i) => (
              <tr key={d._id} className={`border-b ${i % 2 ? "bg-gray-50" : "bg-white"}`}>
                <td className="py-2 px-3">
                  <img
                    src={`http://localhost:5000${d.foto}`}
                    alt={d.nama}
                    className="w-20 h-14 object-cover rounded border"
                  />
                </td>
                <td className="py-2 px-3 font-medium">{d.nama}</td>
                <td className="py-2 px-3">{d.lokasi}</td>
                <td className="py-2 px-3">{d.tipe}</td>
                <td className="py-2 px-3">Rp{parseInt(d.hargaTiket).toLocaleString()}</td>
                <td className="py-2 px-3" title={d.deskripsi}>
                  {d.deskripsi}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <button className="text-blue-600 mr-3 text-xs" onClick={() => onEdit(d)}>Edit</button>
                  <button className="text-red-600 text-xs" onClick={() => onDelete(d._id)}>Hapus</button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`text-sm px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-red-500 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabelDestinasi;
