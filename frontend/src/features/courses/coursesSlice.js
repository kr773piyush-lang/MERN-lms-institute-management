import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { coursesApi } from "../../services/lmsApi";

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async (_, thunkAPI) => {
  try {
    const { data } = await coursesApi.list({ page: 1, limit: 100 });
    return data?.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch courses");
  }
});

export const createCourse = createAsyncThunk("courses/createCourse", async (payload, thunkAPI) => {
  try {
    const { data } = await coursesApi.create(payload);
    return data?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to create course");
  }
});

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    list: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearCoursesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoursesError } = coursesSlice.actions;
export default coursesSlice.reducer;
