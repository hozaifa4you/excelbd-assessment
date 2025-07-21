export type Status =
   | 'PENDING'
   | 'PICKED_UP'
   | 'IN_TRANSIT'
   | 'DELIVERING'
   | 'DELIVERED'
   | 'CANCELLED';

export type PaymentStatus = 'PAID' | 'COD';
export type PaymentMethod = 'CARD' | 'CASH' | 'ONLINE';

export type Address = {
   street: string;
   city: string;
   state: string;
   country: string;
   zip: string | null;
};

export type Person = {
   name: string;
   phone: string;
   email: string | null;
};

export type Fees = {
   price: number;
   deliveryFee: number | null;
   handlingFee: number | null;
   insuranceFee: number | null;
   signatureFee: number | null;
};
