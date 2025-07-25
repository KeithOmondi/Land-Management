import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSurveyor,
  resetSurveyorState,
  fetchSurveyors,
} from "../../redux/parcel/surveyorSlice";
import { toast } from "react-toastify";

const CreateSurveyorForm = () => {
  const dispatch = useDispatch();
  const { creating, success, error, message, surveyors } = useSelector(
    (state) => state.surveyor || {}
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Fetch surveyors and reset state
  useEffect(() => {
    dispatch(fetchSurveyors());
    return () => dispatch(resetSurveyorState());
  }, [dispatch]);

  // Show toast on success/error
  useEffect(() => {
    if (success && message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, message]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSurveyor(formData)).unwrap();
      setFormData({ name: "", email: "", phone: "", password: "" });
      dispatch(fetchSurveyors());
    } catch (_) {
      // Error is handled in slice and shown via toast
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Register a New Surveyor</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded w-full"
          required
        />

        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {creating ? "Creating Surveyor..." : "Create Surveyor"}
          </button>
        </div>
      </form>

      {/* Surveyor List Table */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">📋 Registered Surveyors</h3>

        {surveyors && surveyors.length > 0 ? (
          <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                </tr>
              </thead>
              <tbody>
                {surveyors.map((s) => (
                  <tr key={s._id} className="bg-white hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{s.name || "N/A"}</td>
                    <td className="px-4 py-2 border">{s.email}</td>
                    <td className="px-4 py-2 border">{s.phone?.trim() ? s.phone : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No surveyors registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateSurveyorForm;
