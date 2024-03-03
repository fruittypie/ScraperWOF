import { configureStore } from '@reduxjs/toolkit';
import numberReducer from './number/numberSlice';

const store = configureStore({
  reducer: {
    number: numberReducer,
  },
});

export default store;