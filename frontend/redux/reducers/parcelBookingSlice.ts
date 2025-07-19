import type { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import { AppThunk } from '../store';
import { toast } from 'sonner';

export interface Person {
   name?: string;
   phone?: string;
   email?: string;
}

interface SuccessResponse {
   trackingNumber: string;
   parcelId: string;
   cost: number;
   qrCode: string;
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
   successResponse?: SuccessResponse;
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
      setSuccessResponse: create.reducer(
         (state, action: PayloadAction<SuccessResponse>) => {
            state.successResponse = action.payload;
         },
      ),
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
      selectSuccessResponse: (state) => state.successResponse,
      selectStatus: (state) => state.status,
   },
});

export const bookParcel =
   (token: string): AppThunk =>
   async (
      dispatch: Dispatch,
      getState: () => { parcelBooking: ParcelBookingSliceType },
   ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, step, error, successResponse, ...parcel } =
         getState().parcelBooking;

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

      if (!response.ok) {
         dispatch(setStatus('error'));
         dispatch(setError(result.message || 'Booking failed'));
         toast.error(result.message || 'Booking failed');
         return;
      }

      dispatch(setSuccessResponse(result));
      dispatch(setStatus('success'));
   };

export const {
   setParcelBooking,
   nextStep,
   prevStep,
   setError,
   setStatus,
   setSuccessResponse,
} = parcelBookingSlice.actions;

export const {
   selectParcelBooking,
   selectStep,
   selectSuccessResponse,
   selectStatus,
} = parcelBookingSlice.selectors;
