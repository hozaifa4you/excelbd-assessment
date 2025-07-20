import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsPositive } from 'class-validator';

export class PaginationPipe {
   @IsOptional()
   @Type(() => Number)
   @IsInt()
   @IsPositive()
   @Min(1)
   page: number = 1;

   @IsOptional()
   @Type(() => Number)
   @IsInt()
   @IsPositive()
   @Min(1)
   limit: number = 10;
}
