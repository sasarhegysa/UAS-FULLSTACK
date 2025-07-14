// controllers/generateRekomendasi.js
const Akomodasi = require("../models/Akomodasi");
const Destinasi = require("../models/Destinasi");
const Transportasi = require("../models/Transportasi");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRekomendasi = async ({ budget, lokasi, tipe }) => {
  const akomodasiList = await Akomodasi.find({});
  const destinasiList = await Destinasi.find({
    lokasi: new RegExp(lokasi, "i"),
    tipe: new RegExp(tipe, "i"),
  });
  const transportasiList = await Transportasi.find({});

  if (!akomodasiList.length || !destinasiList.length || !transportasiList.length) {
    throw new Error("Data tidak lengkap atau tidak ada yang cocok dengan filter.");
  }

const prompt = `
Kamu adalah travel planner digital. Buat SATU rekomendasi perjalanan dengan syarat:

- Lokasi harus mengandung kata "${lokasi}" (tidak boleh kota lain).
- Tipe wisata harus mengandung "${tipe}".
- Total biaya (akomodasi + transportasi + tiket masuk) tidak boleh melebihi Rp${budget}.
- HANYA pilih SATU destinasi yang sesuai (jangan lebih dari satu).
- Gunakan HANYA data yang tersedia (jangan mengarang).

== Destinasi ==
${destinasiList.map((d, i) =>
  `${i + 1}. ${d.nama} (${d.lokasi}) - Rp${d.hargaTiket} | ${d.deskripsi}`
).join('\n')}

== Akomodasi ==
${akomodasiList.map((a, i) => {
  const kamarList = a.kamar.map(k =>
    `- ${k.nama}: Rp${k.hargaPerMalam}/malam untuk ${k.kapasitas} orang (${k.fasilitas.join(', ')})`
  ).join('\n  ');
  return `${i + 1}. ${a.nama} (${a.tipe}) di ${a.lokasi}\n  ${kamarList}`;
}).join('\n\n')}

== Transportasi ==
${transportasiList.map((t, i) =>
  `${i + 1}. ${t.jenis} - ${t.namaOperator} (${t.tipe || 'N/A'})\n  Rute: ${t.rute}, Rp${t.harga}`
).join('\n\n')}

Berikan hasil akhir dalam format JSON VALID berikut:

{
  "destinasi": "Nama destinasi",
  "akomodasi": "Nama hotel - tipe kamar, lokasi, harga",
  "transportasi": "Jenis - operator (rute), harga",
  "totalEstimasi": 123456
}
`;


  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonString = text.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Gagal parse hasil Gemini. Jawaban mentah:\n" + text);
  }
};

module.exports = generateRekomendasi;
