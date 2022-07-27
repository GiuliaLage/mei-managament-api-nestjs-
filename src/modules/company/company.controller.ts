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
  ParseIntPipe,
} from '@nestjs/common';
import { RegisterCompanyRequestDto } from './dtos/register-company-request.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CompanyService } from './company.service';
import { ListCompanyRequestDto } from './dtos/list-company-request.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async listCompanies(
    @Query()
    listCompanyRequestDto: ListCompanyRequestDto,
  ) {
    const companies = await this.companyService.listCompanies(
      listCompanyRequestDto,
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
