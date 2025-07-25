import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaMapMarkedAlt,
  FaUsers,
  FaExchangeAlt,
  FaBalanceScale,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux"; // ✅ import useSelector
import { toast } from "react-hot-toast";
import { logout } from "../../../redux/auth/authSlice";

const adminNavItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaChartBar className="text-xl" />,
  },
  {
    name: "Parcels",
    path: "/admin/parcels",
    icon: <FaMapMarkedAlt className="text-xl" />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <FaUsers className="text-xl" />,
  },
  {
    name: "Surveys",
    path: "/admin/surveys",
    icon: <FaFileAlt className="text-xl" />,
  },
  {
    name: "Allocate Surveys", // ✅ NEW
    path: "/admin/surveys/allocate",
    icon: <FaExchangeAlt className="text-xl" />,
  },
  {
    name: "Surveyor Profiles", // ✅ NEW
    path: "/admin/surveyors",
    icon: <FaUsers className="text-xl" />,
  },
  {
    name: "Add Surveyor",
    path: "/admin/surveyor/create",
    icon: <IoAnalyticsOutline className="text-xl" />,
  },
  {
    name: "Transfers",
    path: "/admin/transfers",
    icon: <FaExchangeAlt className="text-xl" />,
  },
  {
    name: "Disputes",
    path: "/admin/disputes",
    icon: <FaBalanceScale className="text-xl" />,
  },
  {
    name: "Documents",
    path: "/admin/documents",
    icon: <FaFileAlt className="text-xl" />,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: <IoAnalyticsOutline className="text-xl" />,
  },
];




export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get the logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen sticky top-0 flex flex-col shadow-lg">
      <div className="p-5 text-2xl font-extrabold text-center border-b border-gray-700 bg-gray-900">
        <span className="text-indigo-400">
          {user?.name?.split(" ")[0] || "Admin"}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {adminNavItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md transform scale-100"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
            end={item.path === "/admin/dashboard"}
          >
            {item.icon}
            <span className="text-lg font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700 bg-gray-900 space-y-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
            ${
              isActive
                ? "bg-gray-700 text-white shadow-md transform scale-100"
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
