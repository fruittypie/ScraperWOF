import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.API_URL;

const initialState = {
  latestNumber: null,
  loading: false,
  error: null,
};

export const fetchLatestNumber = createAsyncThunk(
  'number/fetchLatestNumber',
  async () => {
    try {
      const response = await axios.get(`${apiUrl}/number`);
      const number = response.data.value;
      const numberInt= parseInt(number);
      return numberInt;
    } catch (error) {
      throw error;
    }
  }
);

const numberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    setLatestNumber: (state, action) => {
      state.latestNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.latestNumber = action.payload;
      })
      .addCase(fetchLatestNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLatestNumber } = numberSlice.actions;
export default numberSlice.reducer;
