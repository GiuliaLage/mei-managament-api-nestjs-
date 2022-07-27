import { IsString, IsNotEmpty } from 'class-validator';

export class UserSettingsRequestDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public settingValue: string;

  @IsString()
  @IsNotEmpty()
  public description: string;
}
