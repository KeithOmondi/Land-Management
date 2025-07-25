// admin/Layout/AdminLayout.jsx
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
