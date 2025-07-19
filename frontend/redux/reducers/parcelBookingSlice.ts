import type { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { AppThunk } from '../store';
import { toast } from 'sonner';

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

export interface Fees {
   price?: number;
   deliveryFee?: number;
   handlingFee?: number;
   insuranceFee?: number;
   signatureFee?: number;
}

type PaymentStatus = 'COD' | 'PAID';
type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export interface ParcelBookingSliceType {
   status: 'idle' | 'loading' | 'success' | 'error';
   error?: string;
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
   status: 'idle',
   error: '',
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
      setError: create.reducer((state, action: PayloadAction<string>) => {
         state.error = action.payload;
      }),
      setStatus: create.reducer(
         (
            state,
            action: PayloadAction<'idle' | 'loading' | 'success' | 'error'>,
         ) => {
            state.status = action.payload;
         },
      ),
   }),

   selectors: {
      selectParcelBooking: (state) => state,
      selectStep: (state) => state.step,
   },
});

export const bookParcel =
   (token: string): AppThunk =>
   async (
      dispatch: Dispatch,
      getState: () => { parcelBooking: ParcelBookingSliceType },
   ) => {
      const { status, step, error, ...parcel } = getState().parcelBooking;

      console.log(token);

      dispatch(setStatus('loading'));
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/api/parcels/booking`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(parcel),
         },
      );
      const result = await response.json();
      console.log(response);
      console.log(result);

      // if (!response.ok) {
      //    throw new Error(result.message || 'Failed to book parcel');
      // }

      // toast.success('Parcel booked successfully', {
      //    description: `Booking ID: ${result.bookingId}`,
      // });

      dispatch(setStatus('success'));
   };

export const { setParcelBooking, nextStep, prevStep, setError, setStatus } =
   parcelBookingSlice.actions;

export const { selectParcelBooking, selectStep } = parcelBookingSlice.selectors;
