import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RegisterCompanyRequestDto } from './dtos/requests/register-company-request.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CompanyService } from './company.service';
import { BaseQueryFilterRequest } from '../base/dtos/requests/base-query-filter-request.dto';
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async listCompanies(
    @Query()
    baseQueryFilterRequest: BaseQueryFilterRequest,
  ) {
    const companies = await this.companyService.listCompanies(
      baseQueryFilterRequest,
    );
    return companies;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public async registerCompany(
    @Body() registerCompanyRequestDto: RegisterCompanyRequestDto,
  ) {
    const company = await this.companyService.registerCompany(
      registerCompanyRequestDto,
    );
    return company;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  public async editCompany(
    @Param() params,
    @Body() registerCompanyRequestDto: RegisterCompanyRequestDto,
  ) {
    const company = await this.companyService.editCompany(
      params.id,
      registerCompanyRequestDto,
    );

    return company;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async removeCompany(@Param() params) {
    await this.companyService.removeCompany(params.id);
  }
}
