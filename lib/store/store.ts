// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { stockReducer } from './slice/stockSlice';

export const makeStore = () => {
  return configureStore({
  reducer: {
    stockReducer
  },
})
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
