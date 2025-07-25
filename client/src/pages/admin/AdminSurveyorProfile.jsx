import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUser } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";

const AdminSurveyorProfile = () => {
  const dispatch = useDispatch();
  const { users = [], loading = false, error = null } = useSelector((state) => state.auth);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (users.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users.length]);

  const surveyors = Array.isArray(users)
    ? users.filter((u) => u?.role?.toLowerCase() === "surveyor")
    : [];

  const handleEditClick = (surveyor) => {
    setEditingId(surveyor._id);
    setEditForm({
      name: surveyor.name,
      email: surveyor.email,
      phone: surveyor.phone || "",
      address: surveyor.address || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await dispatch(updateUser({ id, data: editForm })).unwrap();
      toast.success("✅ User updated successfully!");
      setEditingId(null);
      dispatch(getAllUsers());
    } catch (err) {
      toast.error(`❌ Update failed: ${err}`);
      console.error("Update failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading surveyor profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">
          ❌ Error fetching users: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Surveyor Profiles</h1>

      {surveyors.length === 0 ? (
        <p className="text-yellow-600">⚠️ No surveyors found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Address</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveyors.map((s) => (
              <tr key={s._id}>
                {editingId === s._id ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-500">
                      {s.active ? "✅ Active" : "❌ Inactive"}
                    </td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleSave(s._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.email}</td>
                    <td className="border px-4 py-2">{s.phone || "-"}</td>
                    <td className="border px-4 py-2">{s.address || "-"}</td>
                    <td className="border px-4 py-2">
                      {s.active ? "✅ Active" : "❌ Inactive"}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSurveyorProfile;
