import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

export interface Recipient {
   id?: string;
}

export interface Address {
   street: string;
   city: string;
   state: string;
   country: string;
   zip?: string;
}

interface Fees {
   codPrice?: number;
   deliveryFee?: number;
   handlingFee?: number;
   insuranceFee?: number;
   signatureFee?: number;
}

type PaymentStatus = 'COD' | 'PAID';
type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface ParcelBookingSliceType {
   parcelType?: string;
   weight?: number;
   dimensions?: string;
   recipient?: Recipient;
   pickupAddress?: Address;
   deliveryAddress?: Address;
   fees?: Fees;
   paymentStatus?: PaymentStatus;
   paymentMethod?: PaymentMethod;
   deliveryType?: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'OVERNIGHT';
   notes?: string;
   step: number;
}

interface ParcelBookingState {
   type: keyof ParcelBookingSliceType;
   data: ParcelBookingSliceType[keyof ParcelBookingSliceType];
}

const initialState: ParcelBookingSliceType = {
   step: 0,
};

export const parcelBookingSlice = createAppSlice({
   name: 'parcelBooking',
   initialState,
   reducers: (create) => ({
      setParcelBooking: create.reducer(
         (state, action: PayloadAction<ParcelBookingState>) => {
            return { ...state, [action.payload.type]: action.payload.data };
         },
      ),
      nextStep: create.reducer((state) => {
         state.step += 1;
      }),
      prevStep: create.reducer((state) => {
         if (state.step > 0) {
            state.step -= 1;
         }
      }),
   }),

   selectors: {
      selectParcelBooking: (state) => state,
      selectStep: (state) => state.step,
   },
});

export const { setParcelBooking, nextStep, prevStep } =
   parcelBookingSlice.actions;

export const { selectParcelBooking, selectStep } = parcelBookingSlice.selectors;
