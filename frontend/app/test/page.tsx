'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/dashboard/make-update-camera';
import { toast } from 'sonner';

export default function Home() {
   const [lastScannedValue, setLastScannedValue] = useState<string>('');

   const handleScanComplete = (value: string) => {
      console.log('Barcode scanned:', value);
      setLastScannedValue(value);
      toast.success(`Barcode scanned: ${value}`);
   };

   const handleSubmit = (value: string) => {
      console.log('Submitting barcode:', value);
      toast.success(`Barcode submitted: ${value}`);

      // Here you can add your logic to process the barcode
      // For example: API call, navigation, etc.
   };

   const handleCancel = () => {
      console.log('Scanner cancelled');
      setLastScannedValue('');
      toast.info('Scanner cancelled');
   };

   return (
      <BarcodeScanner
         onScanComplete={handleScanComplete}
         onSubmit={handleSubmit}
         onCancel={handleCancel}
      />
   );
}
