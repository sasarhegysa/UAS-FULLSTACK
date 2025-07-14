import { NavLink } from "react-router-dom";
import {
  Home, CalendarCheck, MapPinned, Building2, Bus, Briefcase, Users2, PackageSearch
} from "lucide-react";

const navItem = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <Home className="w-5 h-5" /> },
  { name: "Booking", path: "/admin/booking", icon: <CalendarCheck className="w-5 h-5" /> },
  { name: "Destinasi", path: "/admin/destinasi", icon: <MapPinned className="w-5 h-5" /> },
  { name: "Akomodasi", path: "/admin/akomodasi", icon: <Building2 className="w-5 h-5" /> },
  { name: "Transportasi", path: "/admin/transportasi", icon: <Bus className="w-5 h-5" /> },
  { name: "Paket Tour", path: "/admin/package", icon: <PackageSearch className="w-5 h-5" /> },
  { name: "Event", path: "/admin/event", icon: <Briefcase className="w-5 h-5" /> },
  { name: "User", path: "/admin/users", icon: <Users2 className="w-5 h-5" /> }
];

const AdminSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow border-r z-50 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-bold text-red-600 tracking-wide">Traveloop Admin</h1>
        <p className="text-sm text-gray-400 mt-1">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-4 py-6 space-y-1">
        {navItem.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition 
              ${isActive
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
