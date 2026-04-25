import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { institutesApi } from "../../services/lmsApi";

export const fetchInstitutes = createAsyncThunk(
  "institutes/fetchInstitutes",
  async (_, thunkAPI) => {
    try {
      const { data } = await institutesApi.list({ page: 1, limit: 100 });
      return data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch institutes");
    }
  },
);

const institutesSlice = createSlice({
  name: "institutes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearInstitutesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstitutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstitutes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInstitutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInstitutesError } = institutesSlice.actions;
export default institutesSlice.reducer;
