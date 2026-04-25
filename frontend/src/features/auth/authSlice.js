import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tokenStorage } from "../../utils/storage";
import { authApi } from "../../services/lmsApi";

export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const { data } = await authApi.login(credentials);
    const token = data?.data?.accessToken;
    const user = data?.data?.user;
    const roles = data?.data?.roles || [];

    if (!token || !user) {
      throw new Error("Invalid login response from server");
    }

    return { token, user: { ...user, roles } };
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || error.message || "Login failed");
  }
});

export const bootstrapAuth = createAsyncThunk("auth/bootstrapAuth", async () => {
  const token = tokenStorage.getToken();
  const user = tokenStorage.getUser();
  if (!token || !user) {
    return { token: null, user: null };
  }

  try {
    const { data } = await authApi.me();
    const serverUser = data?.data;
    return {
      token,
      user: {
        ...serverUser,
        roles: serverUser?.roles || user?.roles || [],
      },
    };
  } catch {
    tokenStorage.clearAuth();
    return { token: null, user: null };
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    isBootstrapping: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      tokenStorage.clearAuth();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        tokenStorage.setToken(action.payload.token);
        tokenStorage.setUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to login";
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isBootstrapping = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isBootstrapping = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
