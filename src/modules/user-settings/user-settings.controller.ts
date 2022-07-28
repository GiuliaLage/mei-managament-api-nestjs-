import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { BaseRoutesRequestDto } from '../base/dtos/requests/base-routes-request.dto';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUserSettings(
    @Request() baseRoutesRequestDto: BaseRoutesRequestDto,
  ) {
    const userSettings = await this.userSettingsService.listUserSettings(
      baseRoutesRequestDto,
    );

    return userSettings;
  }
}
