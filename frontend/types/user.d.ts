export type DeliveryAgent = {
   firstName: string;
   lastName: string;
   phone: string;
};

export interface AssignableAgent {
   id: string;
   Address: Address;
   firstName: string;
   lastName: string;
   avatar: string | null;
   username: string;
   email: string;
   phone: string;
   role: 'DELIVERY_AGENT';
   createdAt: Date;
}
