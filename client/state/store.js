import { configureStore } from '@reduxjs/toolkit';
import numberReducer from './number/numberSlice';
import totalNumberReducer from './number/totalNumSlice';
import drawValuesReducer from './number/drawValuesSlice';
import allNumbersReducer from './number/AllNumbersSlice';
import formReducer from './settings/settingsData';

const store = configureStore({
  reducer: {
    number: numberReducer,
    totalNum: totalNumberReducer,
    drawValues: drawValuesReducer,
    allNumbers: allNumbersReducer,
    form: formReducer,
  },
});

export default store;