import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterCompanyRequestDto {
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  socialname: string;
}
