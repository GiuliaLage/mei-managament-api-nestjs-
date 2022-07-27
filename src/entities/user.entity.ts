import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import * as Bcrypt from 'bcryptjs';
import { UserSettings } from './user-settings';

@Entity('user')
export class User extends BaseEntity {
  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'email' })
  email: string;

  @Column('character varying', { length: 500, name: 'password' })
  password: string;

  @OneToMany(() => UserSettings, (userSettings) => userSettings.user)
  settings: Promise<UserSettings[]>;

  @BeforeInsert()
  async encryptPassword() {
    this.password = await Bcrypt.hashSync(this.password, Bcrypt.genSaltSync());
  }
}
