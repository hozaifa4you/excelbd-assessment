'use client';
import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
   Camera,
   CameraOff,
   Image as ImageIcon,
   RotateCcw,
   ScanBarcode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BarcodeScanner() {
   const [scannedValue, setScannedValue] = useState('');
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [isScanning, setIsScanning] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const startCamera = async () => {
      try {
         setError(null);

         await new Promise((resolve) => setTimeout(resolve, 200));

         if (!videoRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 300));
         }

         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError('Camera not supported on this device or browser.');
            return;
         }

         let stream;
         try {
            stream = await navigator.mediaDevices.getUserMedia({
               video: {
                  facingMode: 'environment',
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
               },
            });
         } catch {
            try {
               stream = await navigator.mediaDevices.getUserMedia({
                  video: {
                     facingMode: 'user',
                     width: { ideal: 1280 },
                     height: { ideal: 720 },
                  },
               });
            } catch {
               stream = await navigator.mediaDevices.getUserMedia({
                  video: true,
               });
            }
         }

         if (!stream) {
            setError('Failed to get camera stream.');
            return;
         }

         if (!videoRef.current) {
            setError('Video element not ready. Please try again.');
            return;
         }

         try {
            videoRef.current.srcObject = stream;

            videoRef.current.autoplay = true;
            videoRef.current.playsInline = true;
            videoRef.current.muted = true;

            setIsScanning(true);

            videoRef.current.onloadedmetadata = () => {
               if (videoRef.current) {
                  videoRef.current.play().catch(() => {
                     setError('Failed to start video playback.');
                     setIsScanning(false);
                  });
               }
            };

            setTimeout(() => {
               if (videoRef.current && videoRef.current.readyState >= 1) {
                  videoRef.current.play().catch(() => {});
               }
            }, 100);
         } catch {
            setError('Failed to setup video element.');
            setIsScanning(false);
         }
      } catch (err) {
         if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
               setError(
                  'Camera permission denied. Please allow camera access and try again.',
               );
            } else if (err.name === 'NotFoundError') {
               setError('No camera found on this device.');
            } else if (err.name === 'NotSupportedError') {
               setError('Camera not supported on this browser.');
            } else {
               setError(`Camera error: ${err.message}`);
            }
         } else {
            setError(
               'Cannot access camera. Please check permissions and try again.',
            );
         }
      }
   };

   const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach((track) => track.stop());
         videoRef.current.srcObject = null;
      }
      setIsScanning(false);
   };

   const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
         const canvas = canvasRef.current;
         const video = videoRef.current;
         const context = canvas.getContext('2d');

         if (context) {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            const cropWidth = Math.min(videoWidth * 0.8, 640);
            const cropHeight = Math.min(cropWidth * 0.5, 200);
            const cropX = (videoWidth - cropWidth) / 2;
            const cropY = (videoHeight - cropHeight) / 2;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            context.drawImage(
               video,
               cropX,
               cropY,
               cropWidth,
               cropHeight,
               0,
               0,
               cropWidth,
               cropHeight,
            );

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setCapturedImage(imageDataUrl);
            stopCamera();
            scanBarcodeFromImage(context, canvas);
         }
      }
   };

   const scanBarcodeFromImage = async (
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
   ) => {
      try {
         const codeReader = new BrowserMultiFormatReader();
         const imageUrl = canvas.toDataURL();

         try {
            const result = await codeReader.decodeFromImageUrl(imageUrl);
            if (result) {
               const barcodeValue = result.getText();
               setScannedValue(barcodeValue);
               return;
            }
         } catch {
            const imageData = context.getImageData(
               0,
               0,
               canvas.width,
               canvas.height,
            );
            const qrCode = jsQR(
               imageData.data,
               imageData.width,
               imageData.height,
            );

            if (qrCode) {
               const result = qrCode.data;
               setScannedValue(result);
               return;
            }
         }

         setError(
            'No barcode found in the image. Please try again with a clearer photo.',
         );
      } catch {
         setError('Scanning failed. Please try again with a clearer photo.');
      }
   };

   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string;
            setCapturedImage(imageDataUrl);

            const img = new window.Image();
            img.onload = () => {
               if (canvasRef.current) {
                  const canvas = canvasRef.current;
                  const context = canvas.getContext('2d');
                  if (context) {
                     const imgWidth = img.width;
                     const imgHeight = img.height;

                     const cropWidth = Math.min(imgWidth * 0.8, 640);
                     const cropHeight = Math.min(
                        cropWidth * 0.5,
                        Math.min(imgHeight * 0.6, 200),
                     );
                     const cropX = (imgWidth - cropWidth) / 2;
                     const cropY = (imgHeight - cropHeight) / 2;

                     canvas.width = cropWidth;
                     canvas.height = cropHeight;

                     context.drawImage(
                        img,
                        cropX,
                        cropY,
                        cropWidth,
                        cropHeight,
                        0,
                        0,
                        cropWidth,
                        cropHeight,
                     );

                     scanBarcodeFromImage(context, canvas);
                  }
               }
            };
            img.src = imageDataUrl;
         };
         reader.readAsDataURL(file);
      }
   };

   const retakePhoto = () => {
      setCapturedImage(null);
      setError(null);
      startCamera();
   };

   const handleSubmit = () => {
      if (scannedValue.trim()) {
         //
      }
   };

   const handleCancel = () => {
      setScannedValue('');
      stopCamera();
      setCapturedImage(null);
   };

   const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setScannedValue(e.target.value);
   };

   return (
      <div className="from-primary/10 min-h-screen bg-gradient-to-br to-indigo-100 p-4">
         <div className="mx-auto max-w-md space-y-6">
            <div className="py-4 text-center">
               <div className="mb-2 flex items-center justify-center">
                  <ScanBarcode className="text-primary mr-2 h-8 w-8" />
                  <h1 className="text-2xl font-bold text-gray-900">
                     Barcode Scanner
                  </h1>
               </div>
               <p className="text-sm text-gray-600">
                  Scan parcel barcode for take next steps
               </p>
            </div>

            <Card className="p-4">
               <div className="relative mb-4 min-h-[250px] overflow-hidden rounded-lg bg-black">
                  {capturedImage ? (
                     <div className="relative h-[250px] w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                           src={capturedImage}
                           alt="Captured"
                           className="h-full w-full object-contain"
                        />
                        <div className="absolute top-4 right-4">
                           <div className="flex items-center rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                              <ImageIcon className="mr-1 h-3 w-3" />
                              Photo Captured
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="relative h-[250px] w-full">
                        <video
                           ref={videoRef}
                           className={`h-full w-full object-cover ${
                              isScanning ? 'block' : 'hidden'
                           }`}
                           autoPlay
                           playsInline
                           muted
                           controls={false}
                        />

                        {isScanning ? (
                           <>
                              <div className="absolute top-4 right-4">
                                 <div className="flex items-center rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                                    <Camera className="mr-1 h-3 w-3" />
                                    Camera Active
                                 </div>
                              </div>

                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="relative">
                                    <div className="h-32 w-64 rounded-lg border-2 border-dashed border-green-400 bg-transparent">
                                       <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-green-400" />
                                       <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-green-400" />
                                       <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-green-400" />
                                       <div className="absolute -right-1 -bottom-1 h-4 w-4 border-r-2 border-b-2 border-green-400" />
                                    </div>

                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
                                       <p className="text-xs font-medium text-white drop-shadow-lg">
                                          Only this area will be captured
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </>
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-black">
                              <div className="text-center text-white">
                                 <Camera className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                 <p className="text-sm opacity-75">
                                    Camera is off
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <canvas ref={canvasRef} className="hidden" />

               <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
               />

               <div className="flex flex-col gap-4">
                  {capturedImage ? (
                     <div className="flex justify-center gap-4">
                        <Button
                           onClick={retakePhoto}
                           variant="outline"
                           className="border-primary/80 text-primary/80 px-6 py-2 hover:bg-blue-50"
                        >
                           <RotateCcw className="mr-2 h-4 w-4" />
                           Retake Photo
                        </Button>
                     </div>
                  ) : isScanning ? (
                     <div className="flex justify-center gap-4">
                        <Button
                           onClick={capturePhoto}
                           className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
                        >
                           <Camera className="mr-2 h-4 w-4" />
                           Capture Photo
                        </Button>
                        <Button
                           onClick={stopCamera}
                           variant="outline"
                           className="border-red-500 px-6 py-2 text-red-500 hover:bg-red-50"
                        >
                           <CameraOff className="mr-2 h-4 w-4" />
                           Stop Camera
                        </Button>
                     </div>
                  ) : (
                     <div className="flex justify-center gap-4">
                        <Button
                           onClick={startCamera}
                           className="bg-primary hover:bg-primary/80 px-8 py-2 text-white"
                        >
                           <Camera className="mr-2 h-4 w-4" />
                           Start Camera
                        </Button>
                        <Button
                           onClick={() => fileInputRef.current?.click()}
                           variant="outline"
                           className="border-green-500 px-6 py-2 text-green-500 hover:bg-green-50"
                        >
                           <ImageIcon className="mr-2 h-4 w-4" />
                           Upload Image
                        </Button>
                     </div>
                  )}
               </div>
            </Card>

            {error && (
               <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                     {error}
                  </AlertDescription>
               </Alert>
            )}

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
