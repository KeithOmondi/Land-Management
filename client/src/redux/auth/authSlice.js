import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_BASE = "http://localhost:8000/api/v1/user";

const initialState = {
  user: null,
  users: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/auth/me");
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load user");
  }
});

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_BASE}/update-user/${id}`, data, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/get-user${id}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    request(state) {
      state.loading = true;
      state.error = null;
    },
    success(state, action) {
      state.loading = false;
      Object.assign(state, action.payload);
    },
    failed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthState: (state) => Object.assign(state, initialState),
  },
  extraReducers: (builder) => {
    builder
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

      // Added updateUser and fetchUserById extra reducers
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
      });
  },
});

export const {
  request,
  success,
  failed,
  resetAuthState,
} = authSlice.actions;

export const register = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/register", data);
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Registration failed"));
  }
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/verify-otp", { email, otp });
    dispatch(success({ user: res.data.user, isAuthenticated: true, message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "OTP verification failed"));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/login", data);
    dispatch(success({ user: res.data.user, isAuthenticated: true, message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Login failed"));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/logout", {});
    dispatch(success({ message: res.data.message }));
    dispatch(resetAuthState());
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Logout failed"));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.get("http://localhost:8000/api/v1/auth/me");
    dispatch(success({ user: res.data.user, isAuthenticated: true }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Failed to fetch user"));
  }
};

export const getAllUsers = () => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.get("http://localhost:8000/api/v1/user/all");
    dispatch(success({ users: res.data.users, message: "Users fetched successfully" }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Failed to fetch users"));
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.post("http://localhost:8000/api/v1/auth/password/forgot", { email });
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Forgot password failed"));
  }
};

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.put(`http://localhost:8000/api/v1/auth/password/reset/${token}`, data);
    dispatch(success({ user: res.data.user, isAuthenticated: true, message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Reset password failed"));
  }
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(request());
  try {
    const res = await axios.put("http://localhost:8000/api/v1/auth/password/update", data);
    dispatch(success({ message: res.data.message }));
  } catch (err) {
    dispatch(failed(err.response?.data?.message || "Update password failed"));
  }
};

export const resetAuthStateThunk = () => (dispatch) => {
  dispatch(resetAuthState());
};

export default authSlice.reducer;
