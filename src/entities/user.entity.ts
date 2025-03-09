import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('char', { length: 36 })
  id: string = uuidv7();

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  password!: string;

  @Column({ type: 'boolean', default: false })
  is_system!: boolean;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamp' })
  last_login_at!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
