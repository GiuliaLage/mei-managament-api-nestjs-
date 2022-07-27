import { IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ListCompanyRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  take: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  page: number;
}
