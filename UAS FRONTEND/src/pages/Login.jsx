import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://193.111.124.238:5000/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) navigate("/user/dashboard");
  // }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      const role = res.data.role;
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div>
          <img src="/logo.svg" alt="Traveloop" className="mb-6 w-32" />
          <p className="text-2xl text-orange-500 font-semibold mb-2">“</p>
          <p className="text-gray-800 text-lg mb-2">
            Login dan lanjutkan petualanganmu.
          </p>
          <p className="text-gray-500 text-sm">
            Kelola perjalanan dengan mudah, kapan saja.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-10">
        <form onSubmit={handleLogin} className="bg-white w-full max-w-md p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-1">Login Akun</h2>
          <p className="text-sm text-gray-500 mb-4">Masuk untuk mengelola perjalananmu</p>

          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

          <input type="email" placeholder="Isi Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4" required />

          <div className="relative mb-4">
            <input
              type={show ? "text" : "password"} placeholder="Isi Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded" required />
            <button type="button" className="absolute right-3 top-3 text-sm text-gray-500"
              onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
          </div>

          <button type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90">
            Login
          </button>

          <div className="text-center text-sm text-gray-400 my-3">Atau</div>

          <button type="button"
            onClick={() => navigate("/register")}
            className="w-full border py-2 rounded text-sm text-gray-700 hover:bg-gray-100">
            Belum punya akun? Daftar di sini
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
