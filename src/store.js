
// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Tạo reducers sau này

const store = configureStore({
  reducer: rootReducer
});

export default store;