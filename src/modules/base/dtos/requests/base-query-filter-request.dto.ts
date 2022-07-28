import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseQueryFilterRequest {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  take: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  page: number;

  order?: string;

  order_direction?: string;
}
