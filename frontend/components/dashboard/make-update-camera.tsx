'use client';

import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BarcodeScannerProps {
   onScanComplete?: (value: string) => void;
   onSubmit?: (value: string) => void;
   onCancel?: () => void;
}

export default function BarcodeScanner({
   onScanComplete,
   onSubmit,
   onCancel,
}: BarcodeScannerProps) {
   const videoRef = useRef<HTMLVideoElement>(null);
   const [scannedValue, setScannedValue] = useState('');
   const [isScanning, setIsScanning] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
   const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

   useEffect(() => {
      initializeScanner();
      return () => {
         stopScanning();
      };
   }, []);

   const initializeScanner = async () => {
      try {
         // Check if camera is available
         const devices = await navigator.mediaDevices.enumerateDevices();
         const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput',
         );

         if (videoDevices.length === 0) {
            setError('No camera found on this device');
            setHasPermission(false);
            return;
         }

         // Request camera permission
         const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
         });
         stream.getTracks().forEach((track) => track.stop()); // Stop the test stream

         setHasPermission(true);
         setError(null);
      } catch (err) {
         console.error('Camera initialization error:', err);
         setError(
            'Camera access denied. Please allow camera permissions and refresh the page.',
         );
         setHasPermission(false);
      }
   };

   const startScanning = async () => {
      if (!hasPermission) {
         await initializeScanner();
         return;
      }

      try {
         setIsScanning(true);
         setError(null);

         codeReaderRef.current = new BrowserMultiFormatReader();

         if (videoRef.current) {
            const result = await codeReaderRef.current.decodeFromVideoDevice(
               undefined,
               videoRef.current,
               (result, err) => {
                  if (result) {
                     const barcodeValue = result.getText();
                     setScannedValue(barcodeValue);
                     onScanComplete?.(barcodeValue);
                     alert(`Barcode scanned: ${barcodeValue}`);

                     // Auto-stop scanning after successful scan
                     stopScanning();
                  }
                  if (err && !(err instanceof NotFoundException)) {
                     console.error('Scanning error:', err);
                  }
               },
            );
         }
      } catch (err) {
         console.error('Start scanning error:', err);
         setError(
            'Failed to start camera. Please check permissions and try again.',
         );
         setIsScanning(false);
      }
   };

   const stopScanning = () => {
      if (codeReaderRef.current) {
         codeReaderRef.current = null;
      }

      // Stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach((track) => track.stop());
         videoRef.current.srcObject = null;
      }

      setIsScanning(false);
   };

   const handleSubmit = () => {
      if (scannedValue.trim()) {
         onSubmit?.(scannedValue.trim());
      }
   };

   const handleCancel = () => {
      setScannedValue('');
      stopScanning();
      onCancel?.();
   };

   const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setScannedValue(e.target.value);
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
         <div className="mx-auto max-w-md space-y-6">
            {/* Header */}
            <div className="py-4 text-center">
               <div className="mb-2 flex items-center justify-center">
                  <Scan className="mr-2 h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                     Barcode Scanner
                  </h1>
               </div>
               <p className="text-sm text-gray-600">
                  Position barcode within the camera view to scan
               </p>
            </div>

            {/* Camera Section */}
            <Card className="p-4">
               <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black">
                  <video
                     ref={videoRef}
                     className="h-full w-full object-cover"
                     playsInline
                     muted
                  />

                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-transparent">
                     <div className="absolute inset-4 rounded-lg border-2 border-dashed border-white opacity-60" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                        <div className="h-1 w-48 animate-pulse bg-red-500 shadow-lg" />
                     </div>
                  </div>

                  {/* Camera status indicator */}
                  <div className="absolute top-4 right-4">
                     {isScanning ? (
                        <div className="flex items-center rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                           <Camera className="mr-1 h-3 w-3" />
                           Scanning...
                        </div>
                     ) : (
                        <div className="flex items-center rounded-full bg-gray-500 px-2 py-1 text-xs text-white">
                           <CameraOff className="mr-1 h-3 w-3" />
                           Camera Off
                        </div>
                     )}
                  </div>
               </div>

               {/* Camera Controls */}
               <div className="flex justify-center">
                  {!isScanning ? (
                     <Button
                        onClick={startScanning}
                        disabled={hasPermission === false}
                        className="bg-blue-600 px-8 py-2 text-white hover:bg-blue-700"
                     >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Scanning
                     </Button>
                  ) : (
                     <Button
                        onClick={stopScanning}
                        variant="outline"
                        className="border-red-500 px-8 py-2 text-red-500 hover:bg-red-50"
                     >
                        <CameraOff className="mr-2 h-4 w-4" />
                        Stop Scanning
                     </Button>
                  )}
               </div>
            </Card>

            {/* Error Display */}
            {error && (
               <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                     {error}
                  </AlertDescription>
               </Alert>
            )}

            {/* Input Section */}
            <Card className="p-4">
               <div className="space-y-2">
                  <label
                     htmlFor="barcode-input"
                     className="text-sm font-medium text-gray-700"
                  >
                     Scanned Barcode Value
                  </label>
                  <Input
                     id="barcode-input"
                     type="text"
                     value={scannedValue}
                     onChange={handleManualInputChange}
                     placeholder="Barcode value will appear here..."
                     className="w-full text-center font-mono text-lg"
                  />
                  <p className="text-center text-xs text-gray-500">
                     You can also manually type or edit the barcode value
                  </p>
               </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
               <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
               >
                  Cancel
               </Button>
               <Button
                  onClick={handleSubmit}
                  disabled={!scannedValue.trim()}
                  className="w-full bg-green-600 py-3 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
               >
                  Submit
               </Button>
            </div>
         </div>
      </div>
   );
}
