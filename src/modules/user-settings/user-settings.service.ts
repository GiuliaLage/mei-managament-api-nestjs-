import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from 'src/entities/user-settings';

import { UserSettingsRequestDto } from './dtos/requests/edit-user-settings-request.dto';
import { ListUserSettingsResponseDto } from './dtos/responses/list-user-settings-response-dto';
import { UserSettingsConstants } from './constants/user-settings.constants';
import { BaseRoutesRequestDto } from '../base/dtos/requests/base-routes-request.dto';

@Injectable()
export class UserSettingsService {
  @InjectRepository(UserSettings)
  private readonly respository: Repository<UserSettings>;

  async listUserSettingByName(
    id: string,
    settingName: string,
  ): Promise<ListUserSettingsResponseDto> {
    const settings = await this.respository.findBy({
      name: settingName,
    });

    const userSetting = settings.find(
      async (setting) => (await setting.userId) === id,
    );

    if (userSetting) return userSetting;

    let defaultSetting = settings.find(
      async (setting) => (await setting.userId) === null,
    );

    if (defaultSetting) return defaultSetting;

    const registeredDefaultSettings = await this.registerDefaultSettings();

    defaultSetting = registeredDefaultSettings.find(
      (setting) => setting.name === settingName,
    );

    return defaultSetting;
  }

  async listUserSettings(baseRoutesRequestDto: BaseRoutesRequestDto) {
    const { user } = baseRoutesRequestDto;

    const settings = await this.respository.find();

    const userSetting = settings.filter(
      async (setting) => (await setting.userId) === user.id,
    );

    if (userSetting.length !== 0) return userSetting;

    return await this.registerDefaultSettings();
  }

  async editUserSettings(
    id: string,
    userSettingsRequestDto: UserSettingsRequestDto[],
  ) {
    userSettingsRequestDto.forEach(
      async (userSettingsRequestDto: UserSettingsRequestDto) => {
        let userSettings = await this.respository.findOneBy({
          userId: id,
          name: userSettingsRequestDto.name,
        });
        if (!userSettings) {
          userSettings = new UserSettings();
        }

        userSettings.name = userSettingsRequestDto.name;
        userSettings.description = userSettingsRequestDto.description;
        userSettings.settingValue = userSettingsRequestDto.settingValue;
        userSettings.userId = Promise.resolve(id);

        await this.respository.save(userSettings);
      },
    );
  }

  async registerDefaultSettings(): Promise<ListUserSettingsResponseDto[]> {
    await this.respository
      .createQueryBuilder()
      .insert()
      .values(UserSettingsConstants)
      .execute();

    const defaultSetting = await this.respository.find();

    return defaultSetting;
  }
}
