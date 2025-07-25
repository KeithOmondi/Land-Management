import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaMapMarkedAlt,
  FaExchangeAlt,
  FaBalanceScale,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { logout } from "../redux/auth/authSlice"; // adjust if needed

const userNavItems = [
  { name: "Dashboard", path: "/user/dashboard", icon: <FaChartBar className="text-xl" /> },
  { name: "Parcels", path: "/user/parcels", icon: <FaMapMarkedAlt className="text-xl" /> },
  { name: "Transfers", path: "/user/transfers", icon: <FaExchangeAlt className="text-xl" /> },
  { name: "Disputes", path: "/user/disputes", icon: <FaBalanceScale className="text-xl" /> },
  { name: "Search", path: "/user/search", icon: <IoAnalyticsOutline className="text-xl" /> },
  { name: "Documents", path: "/user/documents", icon: <FaFileAlt className="text-xl" /> },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen sticky top-0 flex flex-col shadow-lg">
      <div className="p-5 text-2xl font-extrabold text-center border-b border-gray-700 bg-gray-900">
        <span className="text-indigo-400">{user?.name?.split(" ")[0] || "User"}</span>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {userNavItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="text-lg font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700 bg-gray-900 space-y-2">
        <NavLink
          to="/user/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
              isActive
                ? "bg-gray-700 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <FaCog className="text-xl" />
          <span className="text-lg font-medium">Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-all duration-200 ease-in-out"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
