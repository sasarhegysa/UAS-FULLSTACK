// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'; // ⛔️ Hapus BrowserRouter

// ✅ Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Booking from './pages/admin/Booking';
import Destinasi from './pages/admin/Destinasi';
import Akomodasi from './pages/admin/Akomodasi';
import Transportasi from './pages/admin/Transportasi';
import Package from './pages/admin/Package';
import Event from './pages/admin/Event';
import Users from './pages/admin/Users';

// ✅ User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from './pages/user/DashboardUser';
import TransaksiDetail from './pages/user/TransaksiDetail';
import RekomendasiDetail from "./pages/user/RekomendasiDetail";
import BookingDariRekomendasi from './pages/user/BookingDariRekomendasi';
import BookingCustom from './pages/user/BookingCustom';
import DetailDestinasi from './pages/user/DetailDestinasi';
import EventInfo from "./pages/user/EventInfo";


function App() {
  return (
    <Routes>
      {/* 🔓 USER ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/dashboard" element={<DashboardUser />} />
      <Route path="/transaksi/:id" element={<TransaksiDetail />} />
      <Route path="/rekomendasi/:id" element={<RekomendasiDetail />} />
      <Route path="/booking-dari-rekomendasi/:id" element={<BookingDariRekomendasi />} />
      <Route path="/booking/custom" element={<BookingCustom />} />
      <Route path="/destinasi/:id" element={<DetailDestinasi />} />
      <Route path="/events" element={<EventInfo />} />




      

      {/* 🔐 ADMIN ROUTES */}
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/booking" element={<Booking />} />
      <Route path="/admin/destinasi" element={<Destinasi />} />
      <Route path="/admin/akomodasi" element={<Akomodasi />} />
      <Route path="/admin/transportasi" element={<Transportasi />} />
      <Route path="/admin/package" element={<Package />} />
      <Route path="/admin/event" element={<Event />} />
      <Route path="/admin/users" element={<Users />} />

      {/* 🌐 Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
