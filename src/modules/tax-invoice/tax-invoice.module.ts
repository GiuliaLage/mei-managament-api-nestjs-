import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxInvoice } from 'src/entities/tax-invoice.entity';
import { TaxInvoiceController } from './tax-invoice.controller';
import { TaxInvoiceService } from './tax-invoice.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { UserSettingsModule } from '../user-settings/user-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaxInvoice]),
    CompanyModule,
    UserModule,
    UserSettingsModule,
  ],
  controllers: [TaxInvoiceController],
  providers: [TaxInvoiceService],
})
export class TaxInvoiceModule {}
