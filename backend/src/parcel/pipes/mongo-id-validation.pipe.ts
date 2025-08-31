import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
   transform(value: string): string {
      if (!isMongoId(value)) {
         throw new BadRequestException(`Invalid MongoDB ObjectId: ${value}`);
      }
      return value;
   }
}
