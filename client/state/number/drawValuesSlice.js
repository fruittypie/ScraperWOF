import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = process.env.API_URL;

const initialState = {
  drawValues: null,
  loading: false,
  error: null,
};

export const fetchDrawValues = createAsyncThunk(
  'number/fetchDrawValues',
  async (count) => {
    try {
      const response = await axios.get(`${apiUrl}/draws?count=${count}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const drawValuesSlice = createSlice({
  name: 'drawValues',
  initialState,
  reducers: {
    setDrawValues: (state, action) => {
      state.drawValues = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrawValues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrawValues.fulfilled, (state, action) => {
        state.loading = false;
        state.drawValues = action.payload;
      })
      .addCase(fetchDrawValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setDrawValues } = drawValuesSlice.actions;
export default drawValuesSlice.reducer;
