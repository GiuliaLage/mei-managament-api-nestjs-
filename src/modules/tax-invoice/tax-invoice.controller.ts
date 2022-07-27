import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Request,
  Query,
  HttpCode,
} from '@nestjs/common';
import { RegisterTaxInvoiceDto } from './dtos/register-tax-invoice.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TaxInvoiceService } from './tax-invoice.service';

@Controller('tax-invoice')
export class TaxInvoiceController {
  constructor(private readonly taxInvoiceService: TaxInvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async listCompanies(@Query() query) {
    const companies = await this.taxInvoiceService.listTaxInvoice(query);
    return companies;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async registerCompany(
    @Body() RegisterCompanyRequestDto: RegisterTaxInvoiceDto,
    @Request() request,
  ) {
    const company = await this.taxInvoiceService.registerTaxInvoice(
      RegisterCompanyRequestDto,
      request,
    );
    return company;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  public async editCompany(
    @Param() params,
    @Body() RegisterCompanyRequestDto: RegisterTaxInvoiceDto,
  ) {
    const company = await this.taxInvoiceService.editTaxInvoice(
      params.id,
      RegisterCompanyRequestDto,
    );

    return company;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async removeCompany(@Param() params) {
    await this.taxInvoiceService.removeTaxInvoice(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/totalizers')
  public async getTaxInvoiceTotatalizers(@Request() request, @Query() query) {
    const totalizers = await this.taxInvoiceService.getTaxInvoiceTotatalizers(
      request,
      query,
    );
    return totalizers;
  }
}
