import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { TaxInvoiceModule } from './modules/tax-invoice/tax-invoice.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserSettingsModule } from './modules/user-settings/user-settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mei_management_db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    CompanyModule,
    TaxInvoiceModule,
    AuthModule,
    UserSettingsModule,
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
