import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";;

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      const res = await axios.post(`${API}/auth/register`, {
        nama,
        email,
        password,
      });

      setSuccess("Pendaftaran berhasil! Silakan login.");
      setNama("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Pendaftaran gagal");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Kiri */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div>
          <img src="/logo.svg" alt="Traveloop" className="mb-4 w-32" />
          <p className="text-2xl text-orange-500 font-semibold mb-2">“</p>
          <p className="text-gray-800 text-lg mb-2">
            Mulailah perjalananmu bersama kami.
          </p>
          <p className="text-gray-500 text-sm">
            Temukan destinasi impianmu dengan harga terbaik.
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-md p-8 rounded shadow"
        >
          <h2 className="text-2xl font-bold mb-1">Daftar Akun</h2>
          <p className="text-sm text-gray-500 mb-4">
            Bergabung dengan TRAVELOOP
          </p>

          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mb-3">{success}</div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />

          <input
            type="email"
            placeholder="Isi Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />

          <div className="relative mb-4">
            <input
              type={show ? "text" : "password"}
              placeholder="Isi Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-sm text-gray-500"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            Register Account
          </button>

          <p className="text-sm text-center mt-4">
            Sudah punya akun?{" "}
            <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => navigate("/login")}
            >
              Login di sini
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
