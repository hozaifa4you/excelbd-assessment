import ParcelBookingDetails, {
   ParcelData,
} from '@/components/scanner/scan-details-show';
import BarcodeScanner from '@/components/scanner/scanner';
import { authFetch } from '@/lib/authFetch';

const Options = async ({
   searchParams,
}: {
   searchParams: Promise<{ barcode?: string }>;
}) => {
   const { barcode } = await searchParams;

   const hasBarcode = Boolean(barcode);
   let data: ParcelData | null = null;
   if (hasBarcode) {
      const res = await authFetch(`/parcels/options?barcode=${barcode}`);
      const result = await res.json();
      if (!res.ok) {
         throw new Error(result.message ?? 'Fetch failed');
      }
      data = result;
   }

   if (barcode && data) return <ParcelBookingDetails data={data} />;

   return (
      <>
         <BarcodeScanner />
      </>
   );
};

export default Options;
