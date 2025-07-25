import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8000/api/v1/disputes";

// 🔄 Create a new dispute
export const createDispute = createAsyncThunk(
  "disputes/create",
  async ({ parcelId, reason, defendant }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API}/create`,
        { parcelId, reason, defendant },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 📦 Get all disputes for logged-in user
export const getMyDisputes = createAsyncThunk(
  "disputes/getMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/mine`, {
        withCredentials: true,
      });
      return data.disputes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ❌ Withdraw a dispute
export const withdrawDispute = createAsyncThunk(
  "disputes/withdraw",
  async (disputeId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API}/${disputeId}`, {
        withCredentials: true,
      });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🔍 Admin: Get all disputes
export const getAllDisputes = createAsyncThunk(
  "disputes/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/admin/all`, {
        withCredentials: true,
      });
      return data.disputes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 🛠️ Admin: Update dispute status
export const updateDisputeStatus = createAsyncThunk(
  "disputes/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API}/admin/${id}/status`,
        { status },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const disputeSlice = createSlice({
  name: "disputes",
  initialState: {
    myDisputes: [],
    allDisputes: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDispute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.myDisputes.push(action.payload.dispute);
        state.successMessage = action.payload.message;
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyDisputes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.myDisputes = action.payload;
      })
      .addCase(getMyDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(withdrawDispute.pending, (state) => {
        state.loading = true;
      })
      .addCase(withdrawDispute.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.myDisputes = state.myDisputes.filter(
          (dispute) => dispute._id !== action.meta.arg
        );
      })
      .addCase(withdrawDispute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllDisputes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.allDisputes = action.payload;
      })
      .addCase(getAllDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDisputeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDisputeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDispute = action.payload.updatedDispute;
        state.allDisputes = state.allDisputes.map((dispute) =>
          dispute._id === updatedDispute._id ? updatedDispute : dispute
        );
        state.successMessage = action.payload.message;
      })
      .addCase(updateDisputeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = disputeSlice.actions;
export default disputeSlice.reducer;
