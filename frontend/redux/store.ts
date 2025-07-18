import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { parcelBookingSlice } from './reducers/parcelBookingSlice';

const rootReducer = combineSlices(parcelBookingSlice);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
   return configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production',
   });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
   ThunkReturnType,
   RootState,
   unknown,
   Action
>;
