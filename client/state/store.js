import { configureStore } from '@reduxjs/toolkit';
import numberReducer from './number/numberSlice';
import totalNumberReducer from './number/totalNumSlice';
import drawValuesReducer from './number/drawValuesSlice';
import selectedNumReducer from './number/SelectedNumber';
import allNumbersReducer from './number/AllNumbersSlice';

const store = configureStore({
  reducer: {
    number: numberReducer,
    totalNum: totalNumberReducer,
    drawValues: drawValuesReducer,
    allNumbers: allNumbersReducer,
  },
});

export default store;