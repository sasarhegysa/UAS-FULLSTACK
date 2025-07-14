// controllers/admin/eventController.js
const Event = require('../../models/Event');

// 🔹 [GET] Semua event
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('akomodasi')
      .populate('transportasi');

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data event', error: err.message });
  }
};

// 🔹 [GET] Detail event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('akomodasi')
      .populate('transportasi');

    if (!event) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil detail event', error: err.message });
  }
};

// 🔹 [POST] Buat event baru
exports.createEvent = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      // Jangan pakai "/public"
      data.image = `/public/folder_event/${req.file.filename}`;
    }

    const newEvent = await Event.create(data);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: 'Gagal membuat event', error: err.message });
  }
};

// 🔹 [PUT] Update event
exports.updateEvent = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      // Jangan pakai "/public"
      data.image = `/public/folder_event/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui event', error: err.message });
  }
};


// 🔹 [DELETE] Hapus event
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Event tidak ditemukan' });
    }

    res.status(200).json({ message: 'Event berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus event', error: err.message });
  }
};
