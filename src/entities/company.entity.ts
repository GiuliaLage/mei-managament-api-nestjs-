import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaxInvoice } from './tax-invoice.entity';

@Entity()
export class Company extends BaseEntity {
  @Column('character varying', { name: 'cnpj' })
  cnpj: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'social_name' })
  socialname: string;

  @OneToMany(() => TaxInvoice, (taxInvoice) => taxInvoice.company)
  taxInvoices: Promise<TaxInvoice[]>;
}
