import { PartialType } from '@nestjs/swagger';
import { Allow, IsDefined, IsOptional, IsString } from 'class-validator';

export class FeedbackCreateInput {
  @Allow()
  @IsString()
  @IsDefined()
  name: string;

  @Allow()
  @IsOptional()
  @IsString()
  description?: string;
}

export class FeedbackUpdateInput extends PartialType(FeedbackCreateInput) {}

export class FeedbackFilterInput extends PartialType(FeedbackCreateInput) {
  id?: string;
}
