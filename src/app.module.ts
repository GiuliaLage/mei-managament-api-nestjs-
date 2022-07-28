import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigService } from './shared/services/api-config.service';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { TaxInvoiceModule } from './modules/tax-invoice/tax-invoice.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';
import { SharedModule } from './shared/shared.module';

//TODO: implement migrations and remove synchronize from typeorm

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    UserModule,
    CompanyModule,
    TaxInvoiceModule,
    AuthModule,
    UserSettingsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
