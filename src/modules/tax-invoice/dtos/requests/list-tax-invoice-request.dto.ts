import { BaseQueryFilterRequest } from 'src/modules/base/dtos/requests/base-query-filter-request.dto';

export class ListTaxInvoiceRequestDto extends BaseQueryFilterRequest {
  company_id?: string;
}
