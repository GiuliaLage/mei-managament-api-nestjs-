import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class ListUserSettingsResponseDto {
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

  @IsString()
  @IsNotEmpty()
  public userId: Promise<string>;

  public user: Promise<User>;

  @IsDate()
  @IsNotEmpty()
  public createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  public updatedAt: Date;
}
