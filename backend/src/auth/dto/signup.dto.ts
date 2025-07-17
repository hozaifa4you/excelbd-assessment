import { IsEmail, IsString, Length } from 'class-validator';

export class SignupDto {
   @IsString()
   @Length(3, 32)
   name: string;

   @IsString()
   @IsEmail()
   email: string;

   @IsString()
   @Length(6, 32)
   password: string;
}
