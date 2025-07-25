import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1/parcel";

// Create a new parcel
export const createParcel = createAsyncThunk(
  "parcels/create",
  async (parcelData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/create-parcel`, parcelData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch all parcels (Admin)
export const fetchAllParcels = createAsyncThunk(
  "parcels/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/get-all-parcel`, {
        withCredentials: true,
      });
      return response.data.parcels;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch user's parcels
export const fetchMyParcels = createAsyncThunk(
  "parcels/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/mine`, {
        withCredentials: true,
      });
      return response.data.parcels;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a parcel
export const deleteParcel = createAsyncThunk(
  "parcels/delete",
  async (parcelId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/delete-parcel/${parcelId}`, {
        withCredentials: true,
      });
      return parcelId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update parcel status (Admin)
export const updateParcelStatus = createAsyncThunk(
  "parcels/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE}/update-parcel/${id}`, { status },
        { status },
        {
          withCredentials: true,
        }
      );
      return response.data.parcel;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const parcelSlice = createSlice({
  name: "parcel",
  initialState: {
    myParcels: [],
    adminParcels: [],
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
      // Create
      .addCase(createParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.myParcels.push(action.payload);
        state.successMessage = "Parcel created successfully.";
      })
      .addCase(createParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch mine
      .addCase(fetchMyParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.myParcels = action.payload;
      })
      .addCase(fetchMyParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all (admin)
      .addCase(fetchAllParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.adminParcels = action.payload;
      })
      .addCase(fetchAllParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteParcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.adminParcels = state.adminParcels.filter(
          (parcel) => parcel._id !== action.payload
        );
        state.successMessage = "Parcel deleted successfully.";
      })
      .addCase(deleteParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateParcelStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateParcelStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.adminParcels = state.adminParcels.map((parcel) =>
          parcel._id === action.payload._id ? action.payload : parcel
        );
        state.successMessage = "Parcel status updated.";
      })
      .addCase(updateParcelStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = parcelSlice.actions;
export default parcelSlice.reducer;