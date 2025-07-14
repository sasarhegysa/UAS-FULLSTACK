import { LogOut } from "lucide-react";

const AdminHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between">
      {/* Kiri: Judul Panel */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Traveloop" className="w-20 h-20" />
        <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      </div>

      {/* Kanan: Avatar + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=random"
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-700 font-medium hidden sm:inline">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
