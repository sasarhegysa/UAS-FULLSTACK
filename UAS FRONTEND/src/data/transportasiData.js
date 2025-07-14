// utils/transportasiData.js

// Helper: Buat rute bolak-balik (misal: "Jakarta - Bandung" jadi juga "Bandung - Jakarta")
const addReverseRoutes = (ruteList) => {
  const reverse = ruteList.map((rute) => {
    const [from, to] = rute.split(" - ").map((s) => s.trim());
    return `${to} - ${from}`;
  });
  return [...new Set([...ruteList, ...reverse])]; // Hapus duplikat otomatis
};

export const transportasiData = {
  "Pesawat": {
    tipe: ["Ekonomi", "Bisnis", "First Class"],
    operator: ["Garuda Indonesia", "Lion Air", "Citilink", "AirAsia", "Super Air Jet", "Sriwijaya Air"],
    rute: addReverseRoutes([
      "Soekarno-Hatta (CGK) - Juanda (SUB)",
      "Soekarno-Hatta (CGK) - Ngurah Rai (DPS)",
      "Halim (HLP) - Adisucipto (JOG)",
      "Juanda (SUB) - Kualanamu (KNO)",
      "Ngurah Rai (DPS) - Lombok (LOP)",
      "Kualanamu (KNO) - Minangkabau (PDG)",
    ]),
  },

  "Kereta Api": {
    tipe: ["Eksekutif", "Bisnis", "Ekonomi"],
    operator: ["Argo Bromo", "Gajayana", "Taksaka", "Lodaya", "Majapahit", "Turangga"],
    rute: addReverseRoutes([
      "Pasar Senen - Tugu Yogyakarta",
      "Gambir - Surabaya Gubeng",
      "Bandung - Semarang Tawang",
      "Tugu Yogyakarta - Malang",
      "Gambir - Solo Balapan",
      "Pasar Senen - Madiun",
    ]),
  },

  "Bus": {
    tipe: ["Eksekutif", "AC Patas", "Ekonomi"],
    operator: ["PO Haryanto", "Rosalia Indah", "Sinar Jaya", "Sugeng Rahayu", "ALS", "Lorena"],
    rute: addReverseRoutes([
      "Terminal Bungurasih - Terminal Tegal",
      "Terminal Giwangan - Terminal Kampung Rambutan",
      "Terminal Leuwipanjang - Terminal Semarang",
      "Terminal Arjosari - Terminal Pulogebang",
      "Terminal Tirtonadi - Terminal Kalideres",
      "Terminal Tegal - Terminal Cilacap",
    ]),
  },

  "Kapal Laut": {
    tipe: ["Ekonomi", "VIP", "Kargo"],
    operator: ["PELNI", "ASDP Indonesia", "Dharma Lautan", "Sabuk Nusantara"],
    rute: addReverseRoutes([
      "Tanjung Priok - Tanjung Perak",
      "Bakauheni - Merak",
      "Makassar - Balikpapan",
      "Batam - Tanjung Pinang",
      "Bitung - Ternate",
      "Ambon - Sorong",
    ]),
  },

  "Travel": {
    tipe: ["Hiace", "Elf", "Avanza", "Xenia", "Innova"],
    operator: ["Cititrans", "Daytrans", "Joglosemar", "Jackal Holiday", "Baraya Travel"],
    rute: addReverseRoutes([
      "Jakarta - Bandung",
      "Jogja - Semarang",
      "Surabaya - Malang",
      "Bandung - Garut",
      "Bekasi - Cirebon",
      "Depok - Purwokerto",
    ]),
  }
};
