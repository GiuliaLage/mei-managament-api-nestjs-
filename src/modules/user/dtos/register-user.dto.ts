import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
