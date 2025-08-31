import { appEnv } from '@/config/env.config';

export const downloadParcelCsv = async (token: string): Promise<void> => {
   try {
      const response = await fetch(
         `${appEnv.NEXT_PUBLIC_API_URL}/api/analytics/booking-export`,
         {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         },
      );

      if (!response.ok) {
         throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'parcels.csv';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
   } catch (error) {
      console.error('Error downloading CSV:', error);
      throw error;
   }
};
