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
} from '@nestjs/common';
import { RegisterTaxInvoiceRequestDto } from './dtos/requests/register-tax-invoice-request.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TaxInvoiceService } from './tax-invoice.service';
import { ListTaxInvoiceRequestDto } from './dtos/requests/list-tax-invoice-request.dto';
import { TaxInvoiceTotalizersResponseDto } from './dtos/responses/tax-invoice-totalizers-response.dto';
import { BaseRoutesRequestDto } from '../base/dtos/requests/base-routes-request.dto';
import { TaxInvoiceTotalizersRequestDto } from './dtos/requests/tax-invoice-totalizers-request.dto';

@Controller('tax-invoice')
export class TaxInvoiceController {
  constructor(private readonly taxInvoiceService: TaxInvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async listCompanies(
    @Query() listTaxInvoiceRequestDto: ListTaxInvoiceRequestDto,
  ) {
    const companies = await this.taxInvoiceService.listTaxInvoice(
      listTaxInvoiceRequestDto,
    );
    return companies;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async registerCompany(
    @Body() registerTaxInvoiceRequestDto: RegisterTaxInvoiceRequestDto,
    @Request() baseRoutesRequestDto: BaseRoutesRequestDto,
  ) {
    const company = await this.taxInvoiceService.registerTaxInvoice(
      registerTaxInvoiceRequestDto,
      baseRoutesRequestDto,
    );
    return company;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  public async editCompany(
    @Param() params,
    @Body() registerTaxInvoiceRequestDto: RegisterTaxInvoiceRequestDto,
  ) {
    const company = await this.taxInvoiceService.editTaxInvoice(
      params.id,
      registerTaxInvoiceRequestDto,
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
  public async taxInvoiceTotatalizers(
    @Request() baseRoutesRequestDto: BaseRoutesRequestDto,
    @Query() taxInvoiceTotalizersRequestDto: TaxInvoiceTotalizersRequestDto,
  ): Promise<TaxInvoiceTotalizersResponseDto> {
    const totalizers = await this.taxInvoiceService.taxInvoiceTotatalizers(
      baseRoutesRequestDto,
      taxInvoiceTotalizersRequestDto,
    );
    return totalizers;
  }
}
