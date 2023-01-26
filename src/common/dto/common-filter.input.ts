import { Allow, IsOptional, Max, Min } from 'class-validator';
import { Order } from 'common/constants/order';
import { Type } from 'class-transformer';

export class CommonFilterOptionInput {
  @Allow()
  @IsOptional()
  q?: string;

  @Allow()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @Allow()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  size?: number = 25;

  @Allow()
  @IsOptional()
  sortKey?: string;

  @Allow()
  @IsOptional()
  sortOrder?: Order;
}
