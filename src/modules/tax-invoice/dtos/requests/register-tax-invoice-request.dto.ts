import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class RegisterTaxInvoiceRequestDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsNumber()
  @IsNotEmpty()
  taxInvoiceValue: number;

  @IsString()
  @IsNotEmpty()
  taxInvoiceNumber: string;

  description?: string;

  @IsDateString()
  @IsNotEmpty()
  competenceDate: Date;

  @IsDateString()
  @IsNotEmpty()
  paymentDate: Date;
}
