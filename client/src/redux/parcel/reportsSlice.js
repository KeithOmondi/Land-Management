// disputeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

export const getAllDisputes = createAsyncThunk("disputes/getAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_BASE}/disputes`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const disputeSlice = createSlice({
  name: "disputes",
  initialState: {
    allDisputes: [],
    loading: false,
    success: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDisputes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Disputes fetched successfully";
        state.allDisputes = Array.isArray(action.payload)
          ? action.payload.map((d) => ({
              _id: d._id,
              disputeId: d.disputeId,
              parcelLR: d.parcelLR,
              complainant: d.complainant,
              defendant: d.defendant,
              reason: d.reason,
              status: d.status,
              dateFiled: d.dateFiled,
            }))
          : [];
      })
      .addCase(getAllDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch disputes";
      });
  },
});

export default disputeSlice.reducer;