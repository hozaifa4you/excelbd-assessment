import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
   @IsString()
   @Length(3, 16)
   firstName: string;

   @IsString()
   @Length(1, 16)
   lastName: string;

   @IsString()
   @IsEmail()
   email: string;

   @IsString()
   @Length(10, 15)
   phone: string;

   @IsString()
   @Length(6, 32)
   password: string;

   @IsString()
   @Length(6, 32)
   confirmPassword: string;
}
