import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/auth/authSlice";

// Layouts
import DashboardLayout from "./components/Layout/DashboardLayout";
import AdminLayout from "./components/admin/Layout/AdminLayout";

// Auth & Home Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Home from "./pages/HomePage/Home";
import Unauthorized from "./pages/Unauthorized";

// User Pages
import Dashboard from "./pages/Dashboard";
import Parcels from "./pages/Parcels";
import TransferRequests from "./pages/TransferRequests";
import Disputes from "./pages/Disputes";
import SearchLand from "./pages/SearchLand";
import Documents from "./pages/Documents";
import Support from "./pages/Support";
import Settings from "./pages/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParcelView from "./pages/admin/AdminParcelView";
import UserManagement from "./pages/admin/UserManagement";
import Transfer from "./pages/admin/Transfer";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminSettings from "./pages/admin/AdminSettings";
import Reports from "./pages/admin/Reports";

import RequireAuth from "./components/Routes/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SurveyDashboardLayout from "./components/surveyor/SurveyDashboardLayout";
import SurveyorDashboard from "./pages/surveyor/SurveyorDashboard";
import AdminSurveys from "./pages/admin/AdminSurveys";
import AssignedParcels from "./pages/surveyor/AssignedParcels";
import SubmitFeedback from "./pages/surveyor/SubmitFeedback ";
import ViewFeedback from "./pages/surveyor/ViewFeedback";
import SurveyorProfile from "./pages/surveyor/SurveyorProfile";
import SurveyAllocationForm from "./pages/admin/SurveyAllocationForm";
import AdminSurveyorProfile from "./pages/admin/AdminSurveyorProfile";
import CreateSurveyorForm from "./pages/admin/CreateSurveyorForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Optional Redirect from /dashboard to /user/dashboard */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" />} />

        {/* Protected: User (and Admin) */}
        <Route
          path="/user"
          element={
            <RequireAuth allowedRoles={["User", "Admin"]}>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="parcels" element={<Parcels />} />
          <Route path="transfers" element={<TransferRequests />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="search" element={<SearchLand />} />
          <Route path="documents" element={<Documents />} />
          <Route path="help" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Protected: Admin only */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["Admin"]}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="parcels" element={<AdminParcelView />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="transfers" element={<Transfer />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="reports" element={<Reports />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="surveys" element={<AdminSurveys />} />
          <Route
            path="/admin/surveys/allocate"
            element={<SurveyAllocationForm />}
          />

          <Route path="/admin/surveyors" element={<AdminSurveyorProfile />} />
          <Route
            path="/admin/surveyor/create"
            element={<CreateSurveyorForm />}
          />
        </Route>

        {/* Surveyor Routes */}
        <Route
          path="/surveyor"
          element={
            <RequireAuth allowedRoles={["Surveyor"]}>
              <SurveyDashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<SurveyorDashboard />} />
          <Route path="assigned-parcels" element={<AssignedParcels />} />
          <Route path="submit-feedback" element={<SubmitFeedback />} />
          <Route path="view-feedback" element={<ViewFeedback />} />
          <Route path="profile" element={<SurveyorProfile />} />
        </Route>
      </Routes>

      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
