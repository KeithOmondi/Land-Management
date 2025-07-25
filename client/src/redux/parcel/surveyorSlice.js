import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 API Endpoints
const API_BASE = "http://localhost:8000/api/v1/surveys";

// 🧠 Async Thunks

// 🔐 Login Surveyor
export const loginSurveyor = createAsyncThunk(
  "surveyor/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, credentials, {
        withCredentials: true,
      });
      return response.data.surveyor;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// 🚪 Logout Surveyor
export const logoutSurveyor = createAsyncThunk(
  "surveyor/logout",
  async (_, thunkAPI) => {
    try {
      await axios.get(`${API_BASE}/logout`, { withCredentials: true });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// 📦 Fetch Assigned Parcels
export const fetchAssignedParcels = createAsyncThunk(
  "surveyor/fetchAssignedParcels",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/my-surveys`, {
        withCredentials: true,
      });

      return data.surveys.map((s) => ({
        surveyId: s._id,
        parcelId: s.parcel?._id,
        lrNumber: s.parcel?.lrNumber,
        owner: s.parcel?.owner,
        location: s.parcel?.location,
        status: s.status,
        feedback: s.feedback,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch assigned parcels");
    }
  }
);

// 📝 Submit Feedback
export const submitFeedback = createAsyncThunk(
  "surveyor/submitFeedback",
  async ({ surveyId, feedback }, thunkAPI) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/${surveyId}/feedback`,
        { feedback },
        { withCredentials: true }
      );
      return data.survey;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);

// 📌 Assign Surveyor (Admin)
export const assignSurveyor = createAsyncThunk(
  "surveyor/assignSurveyor",
  async ({ parcelId, surveyorId }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/assign/${parcelId}`,
        { surveyorId },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to assign surveyor");
    }
  }
);

// ➕ Create Surveyor (Admin)
export const createSurveyor = createAsyncThunk(
  "surveyor/createSurveyor",
  async ({ name, email, password, phone }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/create-surveyor`,
        { name, email, password, phone },
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create surveyor");
    }
  }
);

// 👀 Fetch Feedback by Parcel ID
export const fetchFeedbackByParcelId = createAsyncThunk(
  "surveyor/fetchFeedbackByParcelId",
  async (parcelId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/parcel/${parcelId}/feedback`, {
        withCredentials: true,
      });
      return data.feedback;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch feedback");
    }
  }
);

// 📋 Fetch All Surveys (Admin)
export const fetchAllSurveys = createAsyncThunk(
  "surveyor/fetchAllSurveys",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/all`, {
        withCredentials: true,
      });
      return data.surveys;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch all surveys");
    }
  }
);

// 📦 Fetch Unassigned Parcels
export const fetchUnassignedParcels = createAsyncThunk(
  "surveyor/fetchUnassignedParcels",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/unassigned-parcels`, {
        withCredentials: true,
      });
      return data.parcels;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch unassigned parcels");
    }
  }
);

// 👤 Fetch All Surveyors
export const fetchSurveyors = createAsyncThunk(
  "surveyor/fetchSurveyors",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API_BASE}/surveyors`, {
        withCredentials: true,
      });

      // ✅ Extract surveyors from expected response structure
      return data.surveyors;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch surveyors"
      );
    }
  }
);




// 🔧 Initial State
const initialState = {
  surveyor: null,
  assignedParcels: [],
  unassignedParcels: [],
  allSurveys: [],
  surveyors: [],
  feedbackDetails: null,
  isLoading: false,
  error: null,

  feedbackSubmitStatus: {
    loading: false,
    success: false,
    error: null,
  },

  assignStatus: {
    loading: false,
    success: false,
    error: null,
  },

  feedbackDetailsStatus: {
    loading: false,
    error: null,
  },

  allSurveysStatus: {
    loading: false,
    error: null,
  },

  unassignedParcelsStatus: {
    loading: false,
    error: null,
  },

  createSurveyorStatus: {
    loading: false,
    success: false,
    error: null,
    message: "",
  },
};

// 🧩 Slice
const surveyorSlice = createSlice({
  name: "surveyor",
  initialState,
  reducers: {
    resetSurveyorState: (state) => {
      state.surveyor = null;
      state.assignedParcels = [];
      state.allSurveys = [];
      state.feedbackDetails = null;
      state.isLoading = false;
      state.error = null;
      state.feedbackSubmitStatus = { loading: false, success: false, error: null };
      state.assignStatus = { loading: false, success: false, error: null };
      state.feedbackDetailsStatus = { loading: false, error: null };
      state.allSurveysStatus = { loading: false, error: null };
    },
    resetFeedbackStatus: (state) => {
      state.feedbackSubmitStatus = { loading: false, success: false, error: null };
    },
    resetAssignStatus: (state) => {
      state.assignStatus = { loading: false, success: false, error: null };
    },
    resetCreateSurveyorStatus: (state) => {
      state.createSurveyorStatus = {
        loading: false,
        success: false,
        error: null,
        message: "",
      };
    },
    clearFeedbackDetails: (state) => {
      state.feedbackDetails = null;
      state.feedbackDetailsStatus = { loading: false, error: null };
    },
    clearSurveyorMessages: (state) => {
  state.assignStatus = { loading: false, success: false, error: null };
  state.createSurveyorStatus = {
    loading: false,
    success: false,
    error: null,
    message: "",
  };
},

  },

  extraReducers: (builder) => {
    builder
      .addCase(loginSurveyor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginSurveyor.fulfilled, (state, action) => {
        state.surveyor = action.payload;
        state.isLoading = false;
      })
      .addCase(loginSurveyor.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(logoutSurveyor.fulfilled, (state) => {
        state.surveyor = null;
        state.assignedParcels = [];
        state.feedbackDetails = null;
        state.error = null;
      })

      .addCase(fetchAssignedParcels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedParcels.fulfilled, (state, action) => {
        state.assignedParcels = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAssignedParcels.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(submitFeedback.pending, (state) => {
        state.feedbackSubmitStatus = { loading: true, success: false, error: null };
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.feedbackSubmitStatus = { loading: false, success: true, error: null };

        const updated = action.payload;
        const index = state.assignedParcels.findIndex(p => p.surveyId === updated._id);
        if (index !== -1) {
          state.assignedParcels[index].status = updated.status;
          state.assignedParcels[index].feedback = updated.feedback;
        }
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.feedbackSubmitStatus = { loading: false, success: false, error: action.payload };
      })

      .addCase(fetchFeedbackByParcelId.pending, (state) => {
        state.feedbackDetailsStatus = { loading: true, error: null };
      })
      .addCase(fetchFeedbackByParcelId.fulfilled, (state, action) => {
        state.feedbackDetails = action.payload;
        state.feedbackDetailsStatus.loading = false;
      })
      .addCase(fetchFeedbackByParcelId.rejected, (state, action) => {
        state.feedbackDetailsStatus.loading = false;
        state.feedbackDetailsStatus.error = action.payload;
      })

      .addCase(fetchAllSurveys.pending, (state) => {
        state.allSurveysStatus.loading = true;
        state.allSurveysStatus.error = null;
      })
      .addCase(fetchAllSurveys.fulfilled, (state, action) => {
        state.allSurveys = action.payload;
        state.allSurveysStatus.loading = false;
      })
      .addCase(fetchAllSurveys.rejected, (state, action) => {
        state.allSurveysStatus.loading = false;
        state.allSurveysStatus.error = action.payload;
      })

      .addCase(fetchUnassignedParcels.pending, (state) => {
        state.unassignedParcelsStatus.loading = true;
        state.unassignedParcelsStatus.error = null;
      })
      .addCase(fetchUnassignedParcels.fulfilled, (state, action) => {
        state.unassignedParcels = action.payload;
        state.unassignedParcelsStatus.loading = false;
      })
      .addCase(fetchUnassignedParcels.rejected, (state, action) => {
        state.unassignedParcelsStatus.loading = false;
        state.unassignedParcelsStatus.error = action.payload;
      })

      .addCase(fetchSurveyors.fulfilled, (state, action) => {
        state.surveyors = action.payload;
      })

      .addCase(assignSurveyor.pending, (state) => {
        state.assignStatus = { loading: true, success: false, error: null };
      })
      .addCase(assignSurveyor.fulfilled, (state) => {
        state.assignStatus = { loading: false, success: true, error: null };
      })
      .addCase(assignSurveyor.rejected, (state, action) => {
        state.assignStatus = { loading: false, success: false, error: action.payload };
      })

      .addCase(createSurveyor.pending, (state) => {
        state.createSurveyorStatus = {
          loading: true,
          success: false,
          error: null,
          message: "",
        };
      })
      .addCase(createSurveyor.fulfilled, (state, action) => {
        state.createSurveyorStatus = {
          loading: false,
          success: true,
          error: null,
          message: action.payload.message,
        };
      })
      .addCase(createSurveyor.rejected, (state, action) => {
        state.createSurveyorStatus = {
          loading: false,
          success: false,
          error: action.payload,
          message: "",
        };
      });
  },
});

// 🔄 Export Actions and Reducer
export const {
  resetSurveyorState,
  resetFeedbackStatus,
  resetAssignStatus,
  resetCreateSurveyorStatus,
  clearFeedbackDetails,
  clearSurveyorMessages,
} = surveyorSlice.actions;

export default surveyorSlice.reducer;
