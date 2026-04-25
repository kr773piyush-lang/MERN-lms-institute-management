import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { approvalsApi, usersApi } from "../../services/lmsApi";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, thunkAPI) => {
  try {
    const { data } = await usersApi.list({ page: 1, limit: 100 });
    return data?.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch users");
  }
});

export const fetchPendingApprovals = createAsyncThunk(
  "users/fetchPendingApprovals",
  async (_, thunkAPI) => {
    try {
      const { data } = await approvalsApi.pending({ page: 1, limit: 100 });
      return data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch pending approvals",
      );
    }
  },
);

export const approveUserRequest = createAsyncThunk(
  "users/approveUserRequest",
  async (approvalId, thunkAPI) => {
    try {
      await approvalsApi.approve(approvalId);
      return approvalId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to approve user");
    }
  },
);

export const rejectUserRequest = createAsyncThunk(
  "users/rejectUserRequest",
  async (approvalId, thunkAPI) => {
    try {
      await approvalsApi.reject(approvalId);
      return approvalId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to reject user");
    }
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    pendingApprovals: [],
    loading: false,
    approvalLoading: false,
    error: null,
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingApprovals = action.payload;
      })
      .addCase(approveUserRequest.pending, (state) => {
        state.approvalLoading = true;
      })
      .addCase(approveUserRequest.fulfilled, (state, action) => {
        state.approvalLoading = false;
        state.pendingApprovals = state.pendingApprovals.filter((item) => item._id !== action.payload);
      })
      .addCase(approveUserRequest.rejected, (state, action) => {
        state.approvalLoading = false;
        state.error = action.payload;
      })
      .addCase(rejectUserRequest.pending, (state) => {
        state.approvalLoading = true;
      })
      .addCase(rejectUserRequest.fulfilled, (state, action) => {
        state.approvalLoading = false;
        state.pendingApprovals = state.pendingApprovals.filter((item) => item._id !== action.payload);
      })
      .addCase(rejectUserRequest.rejected, (state, action) => {
        state.approvalLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
