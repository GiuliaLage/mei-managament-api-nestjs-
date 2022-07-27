import { IsDateString, IsNotEmpty } from 'class-validator';

export class TotalTaxInvoiceRequestDto {
  @IsNotEmpty()
  @IsDateString()
  year?: string;
}
