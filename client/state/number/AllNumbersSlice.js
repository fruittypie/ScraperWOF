import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

const apiUrl = process.env.API_URL;

const initialState = {
  allNumbers: null,
  loading: false,
  error: null,
};

export const fetchAllNumbers = createAsyncThunk(
  'numbers/fetchAllNumbers',
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/numbers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const allNumbersSlice = createSlice({
  name: 'allNumbers',
  initialState,
  reducers: {
    setAllNumbers: (state, action) => {
      state.allNumbers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNumbers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNumbers.fulfilled, (state, action) => {
        state.loading = false;
        state.allNumbers = action.payload;
      })
      .addCase(fetchAllNumbers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setAllNumbers } = allNumbersSlice.actions;
export default allNumbersSlice.reducer;
