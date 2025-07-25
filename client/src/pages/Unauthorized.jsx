import React from "react";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <FaLock className="text-red-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;
