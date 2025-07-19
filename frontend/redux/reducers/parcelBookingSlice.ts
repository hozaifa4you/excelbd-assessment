import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

export interface Person {
   name?: string;
   phone?: string;
   email?: string;
}

export interface Address {
   street?: string;
   city?: string;
   state?: string;
   country?: string;
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
   sender?: Person;
   recipient?: Person;
   pickupAddress?: Address;
   deliveryAddress?: Address;
   fees?: Fees;
   paymentStatus?: PaymentStatus;
   paymentMethod?: PaymentMethod;
   deliveryType?: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'OVERNIGHT';
   notes?: string;
   step: number;
   estimateDelivery?: string;
}

interface ParcelBookingState {
   type: keyof ParcelBookingSliceType;
   data: ParcelBookingSliceType[keyof ParcelBookingSliceType];
}

const initialState: ParcelBookingSliceType = {
   step: 0,
   sender: { name: '', phone: '', email: '' },
   recipient: { name: '', phone: '', email: '' },
   pickupAddress: {
      street: '',
      city: '',
      state: '',
      country: 'Bangladesh',
      zip: '',
   },
   deliveryAddress: {
      street: '',
      city: '',
      state: '',
      country: 'Bangladesh',
      zip: '',
   },
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
