import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.API_URL;

const initialState = {
totalNumber: null,
  loading: false,
  error: null,
};

export const fetchTotalNumber = createAsyncThunk(
  'number/fetchTotalNumber',
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/total`);
      const totalNumber = response.data;
      return totalNumber;
    } catch (error) {
      throw error;
    }
  }
);

const totalNumSlice = createSlice({
  name: 'totalNumber',
  initialState,
  reducers: {
    setTotalNumber: (state, action) => {
      state.totalNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.totalNumber = action.payload;
      })
      .addCase(fetchTotalNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setTotalNumber } = totalNumSlice.actions;
export default totalNumSlice.reducer;
