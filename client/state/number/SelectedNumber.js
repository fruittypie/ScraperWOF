import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedNumber: null,
  isGapAnalyzerVisible: false,
};

const selectedNum = createSlice({
  name: 'selectedNum',
  initialState,
  reducers: {
    setSelectedNumber(state, action) {
      state.selectedNumber = action.payload;
      state.isGapAnalyzerVisible = true;
    },
    hideGapAnalyzer(state) { 
        state.isGapAnalyzerVisible = false;
      },
  },
});

export const { setSelectedNumber, hideGapAnalyzer  } = selectedNum.actions;

export default selectedNum.reducer;
