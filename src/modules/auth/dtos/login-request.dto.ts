import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
