import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';

import { RegisterCompanyRequestDto } from './dtos/requests/register-company-request.dto';
import { BaseQueryFilterRequest } from '../base/dtos/requests/base-query-filter-request.dto';
@Injectable()
export class CompanyService {
  @InjectRepository(Company)
  private readonly respository: Repository<Company>;

  async findCompanyByCnpj(cnpj: string) {
    const company = await this.respository.findOneBy({ cnpj });
    return company;
  }

  async findCompanyById(id: string) {
    const company = await this.respository.findOneBy({ id: id });
    return company;
  }

  async registerCompany(registerCompanyRequestDto: RegisterCompanyRequestDto) {
    const { cnpj, name, socialname } = registerCompanyRequestDto;

    const findCompany = await this.findCompanyByCnpj(cnpj);

    if (!findCompany) {
      const company = new Company();
      company.cnpj = cnpj;
      company.name = name;
      company.socialname = socialname;

      const resgisteredCompany = await this.respository.save(company);
      return resgisteredCompany;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'company already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async listCompanies(baseQueryFilterRequest: BaseQueryFilterRequest) {
    const { take, page, order, order_direction } = baseQueryFilterRequest;

    const queryParams: any = {
      take,
      skip: page,
      order: { name: 'ASC' },
    };

    if (order && order_direction) {
      const orderFilter = {};
      orderFilter[order] = order_direction;
      queryParams.order = orderFilter;
    }

    const [result, total] = await this.respository.findAndCount(queryParams);

    return { data: result, total, take, page };
  }

  async editCompany(
    id: string,
    registerCompanyRequestDto: RegisterCompanyRequestDto,
  ) {
    const { cnpj, name, socialname } = registerCompanyRequestDto;

    const company = await this.findCompanyById(id);

    if (company) {
      company.cnpj = cnpj;
      company.name = name;
      company.socialname = socialname;

      const resgisteredCompany = await this.respository.save(company);
      return resgisteredCompany;
    }
  }

  async removeCompany(id: string) {
    await this.respository.delete(id);
  }
}
