import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaClipboardList,
  FaFileSignature,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaCheckCircle,
} from "react-icons/fa";
import { logout } from "../../redux/auth/authSlice"; // adjust path if different

const navLinks = [
  { label: "Dashboard", path: "/surveyor/dashboard", icon: <FaHome /> },
  {
    label: "Assigned Parcels",
    path: "/surveyor/assigned-parcels",
    icon: <FaClipboardList />,
  },
  {
    label: "Submit Feedback",
    path: "/surveyor/submit-feedback",
    icon: <FaFileSignature />,
  },
  { label: "Profile", path: "/surveyor/profile", icon: <FaUser /> },
];

const SurveyorSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout()); // logout thunk
    navigate("/login"); // redirect after logout
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0 shadow-md">
      {/* Header */}
      <div className="p-6 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">Surveyor Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-3">
        {navLinks.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SurveyorSidebar;
