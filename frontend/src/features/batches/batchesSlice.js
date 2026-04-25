import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { batchesApi } from "../../services/lmsApi";

export const fetchBatches = createAsyncThunk("batches/fetchBatches", async (_, thunkAPI) => {
  try {
    const { data } = await batchesApi.list({ page: 1, limit: 100 });
    return data?.data || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch batches");
  }
});

export const createBatch = createAsyncThunk("batches/createBatch", async (payload, thunkAPI) => {
  try {
    const { data } = await batchesApi.create(payload);
    return data?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to create batch");
  }
});

const batchesSlice = createSlice({
  name: "batches",
  initialState: {
    list: [],
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearBatchesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBatch.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.list.unshift(action.payload);
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { clearBatchesError } = batchesSlice.actions;
export default batchesSlice.reducer;
