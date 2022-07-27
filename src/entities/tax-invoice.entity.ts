import { Entity, Column, ManyToOne, RelationId, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';

@Entity()
export class TaxInvoice extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.taxInvoices, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: Promise<Company>;

  @RelationId((taxInvoice: TaxInvoice) => taxInvoice.company)
  companyId: string;

  @Column('integer', { name: 'tax_invoice_value' })
  taxInvoiceValue: number;

  @Column('character varying', { name: 'tax_invoice_number' })
  taxInvoiceNumber: string;

  @Column('character varying', { name: 'description', nullable: true })
  description?: string;

  @Column('date', {
    name: 'competence_date',
  })
  competenceDate: Date;

  @Column('date', {
    name: 'payment_date',
  })
  paymentDate: Date;
}
