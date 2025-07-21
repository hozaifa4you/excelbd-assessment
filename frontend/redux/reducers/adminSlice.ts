import { AssignableParcel } from '@/types/parcel';
import { createAppSlice } from '../createAppSlice';
import { AssignableAgent } from '@/types/user';
import { AppThunk } from '../store';
import { StoreStatus } from '@/types/redux';
import { appEnv } from '@/config/env.config';

interface ParcelBookingSliceType {
   assignableParcels: AssignableParcel[];
   assignableAgents: AssignableAgent[];
   selectedAgentFroAssignParcel: string | null;
   selectedParcelsFroAssign: string[];
   status: StoreStatus;
   error?: string;
}

const initialState: ParcelBookingSliceType = {
   assignableParcels: [],
   assignableAgents: [],
   selectedAgentFroAssignParcel: null,
   selectedParcelsFroAssign: [],
   status: 'loading',
   error: undefined,
};

export const adminSlice = createAppSlice({
   name: 'admin',
   initialState,
   reducers: (create) => ({
      setAssignableParcels: create.reducer<AssignableParcel[]>(
         (state, action) => {
            state.assignableParcels = action.payload;
         },
      ),
      setAssignableAgents: create.reducer<AssignableAgent[]>(
         (state, action) => {
            state.assignableAgents = action.payload;
         },
      ),
      setSelectedAgentFroAssignParcel: create.reducer<string | null>(
         (state, action) => {
            state.selectedAgentFroAssignParcel = action.payload;
         },
      ),
      setSelectedParcelsFroAssign: create.reducer<string>((state, action) => {
         state.selectedParcelsFroAssign = [
            ...state.selectedParcelsFroAssign,
            action.payload,
         ];
      }),
      resetAdminState: create.reducer(() => initialState),
      setError: create.reducer<string>((state, action) => {
         state.error = action.payload;
      }),
      setStatus: create.reducer<StoreStatus>((state, action) => {
         state.status = action.payload;
      }),
   }),
   selectors: {
      selectAssignableParcels: (state) => state.assignableParcels,
      selectAssignableAgents: (state) => state.assignableAgents,
      selectSelectedAgentFroAssignParcel: (state) =>
         state.selectedAgentFroAssignParcel,
      selectSelectedParcelsFroAssign: (state) => state.selectedParcelsFroAssign,
      selectStatus: (state) => state.status,
      selectError: (state) => state.error,
   },
});

export const fetchAssignableAgents =
   (token: string): AppThunk =>
   async (dispatch) => {
      dispatch(adminSlice.actions.setStatus('loading'));

      const response = await fetch(
         `${appEnv.NEXT_PUBLIC_API_URL}/api/admin/available-agents`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         },
      );
      const data = await response.json();
      if (!response.ok) {
         dispatch(
            adminSlice.actions.setError(
               data.message || 'Failed to fetch agents',
            ),
         );
         dispatch(adminSlice.actions.setStatus('error'));
         return;
      }
      dispatch(adminSlice.actions.setAssignableAgents(data));
      dispatch(adminSlice.actions.setStatus('success'));
   };

export const fetchAssignableParcels =
   (token: string): AppThunk =>
   async (dispatch) => {
      dispatch(adminSlice.actions.setStatus('loading'));

      const response = await fetch(
         `${appEnv.NEXT_PUBLIC_API_URL}/api/admin/assignable-parcels`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         },
      );
      const data = await response.json();
      if (!response.ok) {
         dispatch(
            adminSlice.actions.setError(
               data.message || 'Failed to fetch agents',
            ),
         );
         dispatch(adminSlice.actions.setStatus('error'));
         return;
      }
      dispatch(adminSlice.actions.setAssignableParcels(data));
      dispatch(adminSlice.actions.setStatus('success'));
   };

export const {
   selectAssignableAgents,
   selectAssignableParcels,
   selectSelectedAgentFroAssignParcel,
   selectSelectedParcelsFroAssign,
   selectStatus,
   selectError,
} = adminSlice.selectors;
export const {
   resetAdminState,
   setAssignableAgents,
   setAssignableParcels,
   setSelectedAgentFroAssignParcel,
   setSelectedParcelsFroAssign,
} = adminSlice.actions;
