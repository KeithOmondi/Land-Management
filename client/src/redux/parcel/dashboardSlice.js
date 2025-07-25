// features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user dashboard data
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user-dashboard/user-dashboard", {
        headers: {
          Authorization: `Bearer ${thunkAPI.getState().auth.user.token}`,
        },
        withCredentials: true, // just in case cookies are involved
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    parcelsOwned: 0,
    pendingTransfers: 0,
    pendingTransferDetails: [], // ✅ New state
    activeDisputes: 0,
    lastLogin: null,
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ Explicitly assign fields to ensure clarity and safety
        state.parcelsOwned = action.payload.parcelsOwned;
        state.pendingTransfers = action.payload.pendingTransfers;
        state.pendingTransferDetails = action.payload.pendingTransferDetails || [];
        state.activeDisputes = action.payload.activeDisputes;
        state.lastLogin = action.payload.lastLogin;
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
