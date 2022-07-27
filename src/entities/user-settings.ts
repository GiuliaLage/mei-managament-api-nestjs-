import { Entity, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class UserSettings extends BaseEntity {
  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'description' })
  description: string;

  @Column('character varying', { name: 'setting_value' })
  settingValue: string;

  @ManyToOne(() => User, (user) => user.settings, {})
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @RelationId((userSettings: UserSettings) => userSettings.user)
  userId: Promise<string>;
}
