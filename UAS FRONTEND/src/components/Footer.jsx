// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-24 bg-gray-50 border-t text-sm text-gray-600 px-6 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="col-span-2 space-y-3">
          <h3 className="text-lg font-bold text-red-500">Traveloop</h3>
          <p className="text-xs">Solusi perjalanan terbaik untuk liburan impianmu.</p>
          <div className="flex space-x-4 mt-2">
            {["LinkedIn", "Twitter", "Instagram"].map((social, i) => (
              <a key={i} href="#" className="hover:text-red-500 transition">
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3">Perusahaan</h4>
          <ul className="space-y-1 text-xs">
            <li><a href="#" className="hover:text-red-500 transition">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Karier</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Blog</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <input
            type="email"
            placeholder="Email kamu"
            className="border px-3 py-2 rounded w-full text-xs mb-2"
          />
          <button className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-500 text-xs">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
