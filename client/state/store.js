import { configureStore } from '@reduxjs/toolkit';
import numberReducer from './number/numberSlice';
import totalNumberReducer from './number/totalNumSlice';
import drawValuesReducer from './number/drawValuesSlice';

const store = configureStore({
  reducer: {
    number: numberReducer,
    totalNum: totalNumberReducer,
    drawValues: drawValuesReducer,
  },
});

export default store;