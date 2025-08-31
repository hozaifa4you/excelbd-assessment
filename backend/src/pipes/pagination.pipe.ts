import { Type, Transform } from 'class-transformer';
import {
   IsInt,
   Min,
   IsOptional,
   IsPositive,
   IsString,
   IsIn,
} from 'class-validator';

export enum TimeFilter {
   TODAY = 'today',
   WEEK = 'week',
   MONTH = 'month',
   QUARTER = 'quarter',
}

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

   @IsOptional()
   @Transform(({ value }: { value: any }) => {
      return Object.values(TimeFilter).includes(value as TimeFilter)
         ? (value as TimeFilter)
         : TimeFilter.TODAY;
   })
   @IsString()
   @IsIn(Object.values(TimeFilter))
   s: TimeFilter = TimeFilter.TODAY;
}
