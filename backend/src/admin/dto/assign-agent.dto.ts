import { IsMongoId, IsString } from 'class-validator';

export class AssignAgentDto {
   @IsString()
   @IsMongoId()
   agentId: string;

   @IsString({ each: true })
   @IsMongoId({ each: true })
   parcelIds: string[];
}
