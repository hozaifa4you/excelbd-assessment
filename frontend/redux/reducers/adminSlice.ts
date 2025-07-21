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
   statusParcel: StoreStatus;
}

const initialState: ParcelBookingSliceType = {
   assignableParcels: [],
   assignableAgents: [],
   selectedAgentFroAssignParcel: null,
   selectedParcelsFroAssign: [],
   status: 'loading',
   statusParcel: 'loading',
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
      setStatusParcel: create.reducer<StoreStatus>((state, action) => {
         state.statusParcel = action.payload;
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
      selectStatusParcel: (state) => state.statusParcel,
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
      dispatch(adminSlice.actions.setStatusParcel('loading'));

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
         dispatch(adminSlice.actions.setStatusParcel('error'));
         return;
      }
      dispatch(adminSlice.actions.setAssignableParcels(data));
      dispatch(adminSlice.actions.setStatusParcel('success'));
   };

export const setAssignParcel =
   (token: string, agentId: string, parcelIds: string[]): AppThunk =>
   async (dispatch) => {
      dispatch(adminSlice.actions.setStatusParcel('loading'));

      try {
         const response = await fetch(
            `${appEnv.NEXT_PUBLIC_API_URL}/api/admin/assign-agent`,
            {
               method: 'PUT',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ agentId, parcelIds }),
            },
         );

         const data = await response.json();

         if (!response.ok) {
            throw new Error(
               data.message || `HTTP error! status: ${response.status}`,
            );
         }

         if (!data.success) {
            throw new Error(data.message || 'Failed to assign parcels');
         }

         dispatch(adminSlice.actions.setStatusParcel('success'));
         // Refresh the assignable parcels list to reflect the changes
         await dispatch(fetchAssignableParcels(token));

         return data;
      } catch (error) {
         const errorMessage =
            error instanceof Error
               ? error.message
               : 'An unexpected error occurred';
         dispatch(adminSlice.actions.setError(errorMessage));
         dispatch(adminSlice.actions.setStatusParcel('error'));
         throw error; // Re-throw to allow component-level error handling
      }
   };

export const {
   selectAssignableAgents,
   selectAssignableParcels,
   selectSelectedAgentFroAssignParcel,
   selectSelectedParcelsFroAssign,
   selectStatus,
   selectError,
   selectStatusParcel,
} = adminSlice.selectors;
export const {
   resetAdminState,
   setAssignableAgents,
   setAssignableParcels,
   setSelectedAgentFroAssignParcel,
   setSelectedParcelsFroAssign,
} = adminSlice.actions;
