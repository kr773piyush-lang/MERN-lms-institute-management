import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { progressApi } from "../../services/lmsApi";
import { fetchBatches } from "../batches/batchesSlice";

export const fetchStudentProgress = createAsyncThunk(
  "dashboard/fetchStudentProgress",
  async (userId, thunkAPI) => {
    try {
      if (!userId) return [];
      const { data } = await progressApi.studentProgress(userId);
      return data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch progress");
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    teacherAssignedBatches: [],
    studentProgress: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.teacherAssignedBatches = (action.payload || []).map((batch) => batch.batchName);
      })
      .addCase(fetchStudentProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.studentProgress = action.payload;
      })
      .addCase(fetchStudentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
