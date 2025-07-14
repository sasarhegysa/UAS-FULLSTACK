import { useNavigate } from "react-router-dom";

const CardDestinasi = ({ destinasi }) => {
  const navigate = useNavigate();

  if (!destinasi) return null;

  const {
    _id,
    nama,
    lokasi,
    deskripsi,
    tipe,
    hargaTiket,
    foto
  } = destinasi;

  const handleDetailClick = () => {
    navigate(`/destinasi/${_id}`);
  };

  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="h-40 bg-gray-200">
        {foto ? (
          <img
            src={`http://193.111.124.238:5000${foto}`}
            alt={nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-red-600 mb-1">{nama}</h3>
        <p className="text-xs text-gray-500 mb-1">📍 {lokasi}</p>
        <p className="text-sm text-gray-700 font-medium">Rp{parseInt(hargaTiket).toLocaleString()}</p>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{deskripsi}</p>
        <button
          onClick={handleDetailClick}
          className="mt-3 w-full bg-red-500 text-white py-1.5 text-sm rounded hover:bg-red-600 transition"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default CardDestinasi;
