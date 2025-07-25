import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

// ============================
// 🔄 Async Thunks
// ============================

// ✅ Fetch user's documents
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/documents/my-documents");
      return data.documents;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Upload a new document
export const uploadDocument = createAsyncThunk(
  "documents/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data.document; // Assuming backend returns { document }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

// ✅ Admin: Fetch all documents
export const getAllDocuments = createAsyncThunk(
  "documents/getAllDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/documents/all");
      return data.documents;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Delete a document
export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/documents/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ============================
// 🧠 Slice
// ============================

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    documents: [],
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
      // 🔁 Fetch user's documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📤 Upload
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
        state.successMessage = "Document uploaded successfully";
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🧾 Admin fetch all
      .addCase(getAllDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(getAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
        state.successMessage = "Document deleted successfully";
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = documentSlice.actions;
export default documentSlice.reducer;
