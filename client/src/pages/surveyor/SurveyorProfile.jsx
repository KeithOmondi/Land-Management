import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, updateUser } from "../../redux/auth/authSlice";

const SurveyorProfile = () => {
  const dispatch = useDispatch();
  const { user: loggedInUser, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!loggedInUser) {
      dispatch(loadUser());
    } else {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        address: loggedInUser.address || "",
      });
    }
  }, [dispatch, loggedInUser]);

  const isAdmin = loggedInUser?.role === "Admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser?._id) return;

    try {
      await dispatch(updateUser({ id: loggedInUser._id, data: formData })).unwrap();
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading || !formData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Surveyor Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl uppercase">
            {formData.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">{formData.name}</h2>
            <p className="text-gray-500">{formData.email}</p>
            <p className="text-sm text-gray-400 capitalize">Role: {loggedInUser.role}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p>{formData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p>{formData.address}</p>
            </div>
          </div>
        )}

        {isAdmin && !editing && (
          <div className="mt-6">
            <button
              onClick={() => setEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyorProfile;
