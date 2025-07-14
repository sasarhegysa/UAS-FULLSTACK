// src/pages/EventInfo.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";
const PUBLIC = API.replace("/api", "") + "/public"; // base path ke folder public

const EventInfo = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/event`);
        setEvents(res.data);
      } catch (err) {
        console.error("Gagal mengambil data event", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-12 border-b pb-4">
        Informasi Event Terkini
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <img
                src={event.image ? `${API.replace("/api", "")}${event.image}` : "https://source.unsplash.com/400x250/?travel,event"}
                alt={event.nama}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {new Date(event.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {event.nama}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{event.lokasi}</p>

              <p className="text-sm text-gray-700 line-clamp-3">{event.deskripsi}</p>

              {event.harga > 0 && (
                <div className="mt-3">
                  <span className="inline-block bg-gray-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    Rp{event.harga.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            Belum ada event yang tersedia.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
