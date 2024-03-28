import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bet: '',
  total: '',
  mode: '',
  skipSteps: 0,
  step: '',
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
      setFormData(state, action) {
        const { bet, total, mode, skipSteps } = action.payload;
        state.bet = bet;
        state.total = total;
        state.mode = mode;
        state.skipSteps = skipSteps;
      }
    }
});
export const { setFormData } = formSlice.actions;

export default formSlice.reducer;
