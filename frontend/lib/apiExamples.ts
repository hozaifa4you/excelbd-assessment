import { authFetch } from '@/lib/authFetch';

/**
 * Example usage of authFetch for different HTTP methods
 * This file demonstrates how to use the authFetch function with automatic token refresh
 */

// GET request example
export const getUser = async (userId: string) => {
   try {
      const response = await authFetch(`/user/${userId}`, {
         method: 'GET',
      });

      if (!response.ok) {
         throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return await response.json();
   } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
   }
};

// POST request example
export const createParcel = async (parcelData: Record<string, unknown>) => {
   try {
      const response = await authFetch('/parcel', {
         method: 'POST',
         body: JSON.stringify(parcelData),
      });

      if (!response.ok) {
         throw new Error(`Failed to create parcel: ${response.statusText}`);
      }

      return await response.json();
   } catch (error) {
      console.error('Error creating parcel:', error);
      throw error;
   }
};

// PUT request example
export const updateParcel = async (
   parcelId: string,
   updateData: Record<string, unknown>,
) => {
   try {
      const response = await authFetch(`/parcel/${parcelId}`, {
         method: 'PUT',
         body: JSON.stringify(updateData),
      });

      if (!response.ok) {
         throw new Error(`Failed to update parcel: ${response.statusText}`);
      }

      return await response.json();
   } catch (error) {
      console.error('Error updating parcel:', error);
      throw error;
   }
};

// DELETE request example
export const deleteParcel = async (parcelId: string) => {
   try {
      const response = await authFetch(`/parcel/${parcelId}`, {
         method: 'DELETE',
      });

      if (!response.ok) {
         throw new Error(`Failed to delete parcel: ${response.statusText}`);
      }

      return response.status === 204 ? null : await response.json();
   } catch (error) {
      console.error('Error deleting parcel:', error);
      throw error;
   }
};

// Example with custom headers
export const uploadFile = async (
   file: File,
   additionalHeaders?: Record<string, string>,
) => {
   const formData = new FormData();
   formData.append('file', file);

   try {
      const response = await authFetch('/upload', {
         method: 'POST',
         headers: {
            // Don't set Content-Type for FormData, let the browser set it
            ...additionalHeaders,
         },
         body: formData,
      });

      if (!response.ok) {
         throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      return await response.json();
   } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
   }
};

// Example with query parameters
export const searchParcels = async (
   query: string,
   page: number = 1,
   limit: number = 10,
) => {
   const searchParams = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
   });

   try {
      const response = await authFetch(
         `/parcel/search?${searchParams.toString()}`,
         {
            method: 'GET',
         },
      );

      if (!response.ok) {
         throw new Error(`Failed to search parcels: ${response.statusText}`);
      }

      return await response.json();
   } catch (error) {
      console.error('Error searching parcels:', error);
      throw error;
   }
};
