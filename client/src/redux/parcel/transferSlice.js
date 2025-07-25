import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL
const BASE_URL = "http://localhost:8000/api/v1/transfer";

// ========== ASYNC THUNKS ==========

// ✅ Create Transfer Request
export const createTransferRequest = createAsyncThunk(
  "transfer/create",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/request`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✅ Get User's Transfer Requests
export const getMyTransferRequests = createAsyncThunk(
  "transfer/mine",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/mine`, {
        withCredentials: true,
      });
      return res.data.transfers;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✅ Get All Transfers (Admin)
export const getAllTransferRequests = createAsyncThunk(
  "transfer/all",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, {
        withCredentials: true,
      });
      return res.data.transfers;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✅ Cancel Transfer Request
export const cancelTransferRequest = createAsyncThunk(
  "transfer/cancel",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`${BASE_URL}/cancel/${id}`, {
        withCredentials: true,
      });
      return { id, message: res.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✅ Approve Transfer Request
export const approveTransferRequest = createAsyncThunk(
  'transfer/approve',
  async (id, thunkAPI) => {
    try {
      const response = await axios.patch(`${BASE_URL}/approve/${id}`, {}, {
        withCredentials: true,
      });
      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




// ✅ Reject Transfer Request
export const rejectTransferRequest = createAsyncThunk(
  "transfer/reject",
  async (id, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/reject/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      return { id, message: res.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ========== INITIAL STATE ==========
const initialState = {
  transfers: [],
  loading: false,
  error: null,
  message: null,
};

// ========== SLICE ==========
const transferSlice = createSlice({
  name: "transfer",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createTransferRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransferRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers.push(action.payload.transfer);
        state.message = action.payload.message;
      })
      .addCase(createTransferRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My Transfers
      .addCase(getMyTransferRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyTransferRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload;
      })
      .addCase(getMyTransferRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Transfers
      .addCase(getAllTransferRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTransferRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload;
      })
      .addCase(getAllTransferRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel
      .addCase(cancelTransferRequest.fulfilled, (state, action) => {
        state.transfers = state.transfers.filter(
          (tr) => tr._id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(cancelTransferRequest.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Approve
      .addCase(approveTransferRequest.fulfilled, (state, action) => {
        const request = state.transfers.find(
          (t) => t._id === action.payload.id
        );
        if (request) request.status = "Approved";
        state.message = action.payload.message;
      })
      .addCase(approveTransferRequest.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Reject
      .addCase(rejectTransferRequest.fulfilled, (state, action) => {
        const request = state.transfers.find(
          (t) => t._id === action.payload.id
        );
        if (request) request.status = "Rejected";
        state.message = action.payload.message;
      })
      .addCase(rejectTransferRequest.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ========== EXPORT ==========
export const { clearMessages } = transferSlice.actions;
export default transferSlice.reducer;
