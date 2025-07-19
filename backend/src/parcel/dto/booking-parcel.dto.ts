import { Type } from 'class-transformer';
import {
   IsNumber,
   IsOptional,
   IsString,
   ValidateNested,
   IsEnum,
} from 'class-validator';
import { DeliveryType, PaymentMethod, PaymentStatus } from 'generated/prisma';

class Person {
   @IsString()
   name: string;

   @IsString()
   phone: string;

   @IsOptional()
   @IsString()
   email?: string;
}

class Address {
   @IsString()
   street: string;

   @IsString()
   city: string;

   @IsString()
   state: string;

   @IsString()
   country: string;

   @IsOptional()
   @IsString()
   zip?: string;
}

class Fees {
   @IsOptional()
   @IsNumber()
   price?: number;

   @IsNumber()
   deliveryFee: number;

   @IsOptional()
   @IsNumber()
   handlingFee?: number;

   @IsOptional()
   @IsNumber()
   insuranceFee?: number;

   @IsOptional()
   @IsNumber()
   signatureFee?: number;
}

export class BookingParcelDto {
   @IsString()
   parcelType: string;

   @IsNumber()
   weight: number;

   @IsString()
   dimensions?: string;

   @ValidateNested()
   @Type(() => Person)
   sender: Person;

   @ValidateNested()
   @Type(() => Person)
   recipient: Person;

   @ValidateNested()
   @Type(() => Address)
   pickupAddress: Address;

   @ValidateNested()
   @Type(() => Address)
   deliveryAddress: Address;

   @ValidateNested()
   @Type(() => Fees)
   fees: Fees;

   @IsEnum(PaymentStatus as object)
   paymentStatus: PaymentStatus;

   @IsOptional()
   @IsEnum(PaymentMethod as object)
   paymentMethod: PaymentMethod;

   @IsEnum(DeliveryType as object)
   deliveryType: DeliveryType;

   @IsString()
   @IsOptional()
   notes?: string;
}
