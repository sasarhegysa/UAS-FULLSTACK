// src/components/EventCard.jsx
import React from "react";

const EventCard = ({ image, title, tanggal, lokasi, harga }) => {
  return (
    <div className="w-64 bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="h-36 bg-gray-200">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-red-600">{title}</h3>
        <p className="text-xs text-gray-500 mb-1">📍 {lokasi}</p>
        <p className="text-xs text-gray-500 mb-1">📅 {tanggal}</p>
        <p className="text-sm font-medium text-gray-800 mt-2">Rp{parseInt(harga).toLocaleString()}</p>
        <button className="mt-4 w-full bg-red-500 text-white py-1.5 text-sm rounded hover:bg-red-600 transition">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default EventCard;
