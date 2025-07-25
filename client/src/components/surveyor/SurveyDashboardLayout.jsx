// components/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import SurveyorSidebar from "./SurveyorSidebar";


export default function SurveyDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SurveyorSidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
