// controllers/eventController.js
const Event = require("../models/Event");
const Booking = require("../models/Booking");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bookEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

    const { tanggalBerangkat, tanggalPulang, metodePembayaran } = req.body;
    if (!tanggalBerangkat || !tanggalPulang || !metodePembayaran) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      tanggalBerangkat,
      tanggalPulang,
      metodePembayaran,
      status: "pending"
    });

    res.status(201).json({ message: "Booking event berhasil", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
