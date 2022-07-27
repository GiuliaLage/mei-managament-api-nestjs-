import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUserSettings(@Request() request) {
    const userSettings = await this.userSettingsService.listUserSettings(
      request.user.id,
    );

    return userSettings;
  }
}
