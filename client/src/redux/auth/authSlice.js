import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_BASE = "http://localhost:8000/api/v1";

const initialState = {
  user: null,
  users: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

// ============ ASYNC THUNKS ============

export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_BASE}/auth/me`);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load user");
  }
});

export const updateUser = createAsyncThunk("auth/updateUser", async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`${API_BASE}/user/update-user/${id}`, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

export const fetchUserById = createAsyncThunk("user/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`${API_BASE}/user/get-user${id}`);
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch user");
  }
});

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE}/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      return res.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  }
);

// ============ SLICE ============

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = null;
    },
    success: (state, action) => {
      state.loading = false;
      Object.assign(state, action.payload);
    },
    failed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single user
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [action.payload];
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ============ EXPORTS ============

export const { request, success, failed, resetAuthState } = authSlice.actions;

export const register = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, data);
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Registration failed"));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
    dispatch(success({ user: res.data.user, isAuthenticated: true, message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "OTP verification failed"));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, data);
    dispatch(success({ user: res.data.user, isAuthenticated: true, message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Login failed"));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post(`${API_BASE}/auth/logout`);
    dispatch(success({ message: res.data.message }));
    dispatch(resetAuthState());
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Logout failed"));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.get(`${API_BASE}/auth/me`);
    dispatch(success({ user: res.data.user, isAuthenticated: true }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Failed to fetch user"));
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.get(`${API_BASE}/user/all`);
    dispatch(success({ users: res.data.users, message: "Users fetched successfully" }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Failed to fetch users"));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post(`${API_BASE}/auth/password/forgot`, { email });
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Forgot password failed"));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.put(`${API_BASE}/auth/password/update`, data);
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Update password failed"));
  }
};

export const resetAuthStateThunk = () => (dispatch) => {
  dispatch(resetAuthState());
};

export default authSlice.reducer;
