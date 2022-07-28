import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxInvoice } from 'src/entities/tax-invoice.entity';
import { RegisterTaxInvoiceRequestDto } from './dtos/requests/register-tax-invoice-request.dto';
import { CompanyService } from '../company/company.service';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { ListTaxInvoiceRequestDto } from './dtos/requests/list-tax-invoice-request.dto';
import { TaxInvoiceTotalizersResponseDto } from './dtos/responses/tax-invoice-totalizers-response.dto';
import { BaseRoutesRequestDto } from '../base/dtos/requests/base-routes-request.dto';
import { TaxInvoiceTotalizersRequestDto } from './dtos/requests/tax-invoice-totalizers-request.dto';
import { format } from 'date-fns';

const MEI_MAX_VALUE = 'mei-max-value';

@Injectable()
export class TaxInvoiceService {
  @InjectRepository(TaxInvoice)
  private readonly respository: Repository<TaxInvoice>;

  constructor(
    private companyService: CompanyService,
    private userSettingsService: UserSettingsService,
  ) {}

  async findTaxInvoiceById(id: string) {
    const taxInvoice = await this.respository.findOneBy({ id: id });
    return taxInvoice;
  }

  async registerTaxInvoice(
    registerTaxInvoiceRequestDto: RegisterTaxInvoiceRequestDto,
    baseRoutesRequestDto: BaseRoutesRequestDto,
  ) {
    const {
      companyId,
      taxInvoiceValue,
      taxInvoiceNumber,
      description,
      competenceDate,
      paymentDate,
    } = registerTaxInvoiceRequestDto;

    const { user } = baseRoutesRequestDto;

    const company = await this.companyService.findCompanyById(companyId);
    if (!company) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'company not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { balance } = await this.totalTaxInvoiceBalance(user.id);

    if (taxInvoiceValue <= balance) {
      const taxInvoice = new TaxInvoice();

      taxInvoice.company = Promise.resolve(company);
      taxInvoice.taxInvoiceValue = taxInvoiceValue;
      taxInvoice.taxInvoiceNumber = taxInvoiceNumber;
      taxInvoice.description = description;
      taxInvoice.competenceDate = competenceDate;
      taxInvoice.paymentDate = paymentDate;

      const resgisteredCompany = await this.respository.save(taxInvoice);
      return resgisteredCompany;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'tax invoice limit was reached',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async listTaxInvoice(listTaxInvoiceRequestDto: ListTaxInvoiceRequestDto) {
    const { take, page, company_id } = listTaxInvoiceRequestDto;

    const repositoryQuery = this.respository.createQueryBuilder();

    if (company_id) {
      repositoryQuery.where('company_id = :company_id', { company_id });
    }

    const count = await repositoryQuery.getCount();

    const result = await repositoryQuery
      .take(take)
      .skip(page)
      .orderBy('created_at', 'DESC')
      .getMany();

    return { data: result, total: count, take, page };
  }

  async editTaxInvoice(
    id: string,
    registerTaxInvoiceRequestDto: RegisterTaxInvoiceRequestDto,
  ) {
    const {
      companyId,
      taxInvoiceValue,
      taxInvoiceNumber,
      description,
      competenceDate,
      paymentDate,
    } = registerTaxInvoiceRequestDto;

    const company = await this.companyService.findCompanyById(companyId);
    if (!company) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'company not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const findTaxInvoice = await this.findTaxInvoiceById(id);

    if (findTaxInvoice) {
      findTaxInvoice.company = Promise.resolve(company);
      findTaxInvoice.taxInvoiceValue = taxInvoiceValue;
      findTaxInvoice.taxInvoiceNumber = taxInvoiceNumber;
      findTaxInvoice.description = description;
      findTaxInvoice.competenceDate = competenceDate;
      findTaxInvoice.paymentDate = paymentDate;

      const resgisteredTaxInvoice = await this.respository.save(findTaxInvoice);
      return resgisteredTaxInvoice;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'tax invoice not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async removeTaxInvoice(id: string) {
    await this.respository.delete(id);
  }

  async taxInvoiceTotatalizers(
    baseRoutesRequestDto: BaseRoutesRequestDto,
    taxInvoiceTotalizersRequestDto: TaxInvoiceTotalizersRequestDto,
  ): Promise<TaxInvoiceTotalizersResponseDto> {
    const { user } = baseRoutesRequestDto;
    const { year } = taxInvoiceTotalizersRequestDto;

    const balance = await this.totalTaxInvoiceBalance(user.id, year);
    const taxInvoiceByMonth = await this.sumTotalTaxInvoicesByMonth(
      taxInvoiceTotalizersRequestDto,
    );

    return {
      ...balance,
      taxInvoiceByMonth,
    };
  }

  async sumTotalTaxInvoices(
    taxInvoiceTotalizersRequestDto: TaxInvoiceTotalizersRequestDto,
  ) {
    const { year, company_id } = taxInvoiceTotalizersRequestDto;

    const repositoryQuery = this.respository
      .createQueryBuilder()
      .select('sum(tax_invoice_value) as "totalValue"')
      .where('company_id is NOT NULL');

    if (year) {
      repositoryQuery.andWhere('EXTRACT("year" from competence_date)= :year', {
        year,
      });
    }

    if (company_id) {
      repositoryQuery.andWhere('company_id = :company_id', { company_id });
    }

    const taxInvoiceTotalValue = await repositoryQuery.getRawOne();

    return taxInvoiceTotalValue.totalValue;
  }

  async sumTotalTaxInvoicesByMonth(
    taxInvoiceTotalizersRequestDto: TaxInvoiceTotalizersRequestDto,
  ) {
    const { year, company_id } = taxInvoiceTotalizersRequestDto;

    const repositoryQuery = this.respository
      .createQueryBuilder()
      .select([
        `sum(tax_invoice_value) as "total"`,
        `CASE
        WHEN extract('month' from DATE_TRUNC('month', competence_date)) < 10 THEN CONCAT('0', extract('month' from DATE_TRUNC('month', competence_date))) 
        WHEN extract('month' from DATE_TRUNC('month', competence_date)) >= 10 THEN extract('month' from DATE_TRUNC('month', competence_date))::text
        end as "month"`,
      ])
      .where(`EXTRACT('year' from competence_date)= :year`, {
        year,
      });

    if (company_id) {
      repositoryQuery.andWhere('company_id = :company_id', { company_id });
    }

    const totalTaxInvoicesByMonth = await repositoryQuery
      .groupBy(`DATE_TRUNC('month',competence_date)`)
      .orderBy('month', 'ASC')
      .getRawMany();

    return totalTaxInvoicesByMonth;
  }

  async totalTaxInvoiceBalance(userId: string, year?: string) {
    const userSettings = await this.userSettingsService.listUserSettingByName(
      userId,
      MEI_MAX_VALUE,
    );

    const currentYear = year ? year : format(new Date(), 'yyyy');

    const taxInvoiceTotalValue = await this.sumTotalTaxInvoices({
      year: currentYear,
    });

    return {
      tax_invoice_limit: Number(userSettings.settingValue),
      total_tax_invoice: Number(taxInvoiceTotalValue),
      balance: Number(userSettings.settingValue) - Number(taxInvoiceTotalValue),
    };
  }
}
