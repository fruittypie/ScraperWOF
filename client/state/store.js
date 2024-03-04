import { configureStore } from '@reduxjs/toolkit';
import numberReducer from './number/numberSlice';
import totalNumberReducer from './number/totalNumSlice';


const store = configureStore({
  reducer: {
    number: numberReducer,
    totalNum: totalNumberReducer,
  },
});

export default store;