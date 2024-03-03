import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latestNumber: 0,
};

const numberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    setLatestNumber: (state, action) => {
      state.latestNumber = action.payload;
    },
  },
});

export const { setLatestNumber } = numberSlice.actions;
export default numberSlice.reducer;
